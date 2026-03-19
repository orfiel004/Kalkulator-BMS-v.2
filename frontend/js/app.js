/**
 * app.js — Główna logika UI kalkulatora BMS
 */

// ---- Lista plików urządzeń do wczytania ----
const DEVICE_FILES = [
  'drv_v', 'drv_m', 'drv_d',
  'drv_elis', 'drv_slim', 'drv_km',
  'drv_oxen', 'drv_el',
  'drv_robur_next', 'drv_robur_next_km',
  'drv_cool', 'drv_cube',
];

// ---- Stan aplikacji ----
let devices = {};        // { "DRV V": { ...json }, ... }
let deviceRowCount = 0;  // licznik wierszy urządzeń (do unikalnych ID)

// ============================================================
// Inicjalizacja — wczytanie JSON-ów przy starcie strony
// ============================================================
async function loadDevices() {
  const promises = DEVICE_FILES.map(async (file) => {
    try {
      const resp = await fetch(`../devices/${file}.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      devices[data.name] = data;
    } catch (e) {
      console.warn(`Nie można wczytać ${file}.json:`, e.message);
    }
  });

  await Promise.all(promises);

  const names = Object.keys(devices).sort();
  if (names.length === 0) {
    showError('Nie udało się wczytać żadnych urządzeń. Uruchom stronę przez serwer HTTP (python -m http.server 8080).');
    return;
  }

  // Dodaj dwa domyślne wiersze urządzeń
  addDeviceRow();
  addDeviceRow();
}

// ============================================================
// Dodawanie / usuwanie wierszy urządzeń w formularzu
// ============================================================
function addDeviceRow() {
  const id = ++deviceRowCount;
  const names = Object.keys(devices).sort();

  const row = document.createElement('div');
  row.className = 'device-row';
  row.dataset.rowId = id;

  const select = document.createElement('select');
  select.id = `device-${id}`;
  names.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  const addrLabel = document.createElement('label');
  addrLabel.textContent = 'Adres:';
  addrLabel.htmlFor = `addr-${id}`;

  const addrInput = document.createElement('input');
  addrInput.type = 'number';
  addrInput.id = `addr-${id}`;
  addrInput.min = 1;
  addrInput.max = 31;
  addrInput.value = id;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove';
  removeBtn.textContent = '×';
  removeBtn.title = 'Usuń urządzenie';
  removeBtn.onclick = () => row.remove();

  row.append(select, addrLabel, addrInput, removeBtn);
  document.getElementById('devices-container').appendChild(row);
}

// ============================================================
// Walidacja formularza
// ============================================================
function validateForm() {
  const rows = document.querySelectorAll('.device-row');
  if (rows.length === 0) return 'Dodaj co najmniej jedno urządzenie.';

  const addrs = [];
  for (const row of rows) {
    const id = row.dataset.rowId;
    const addr = parseInt(document.getElementById(`addr-${id}`).value);
    if (isNaN(addr) || addr < 1 || addr > 31) {
      return `Nieprawidłowy adres Modbus (musi być 1–31).`;
    }
    if (addrs.includes(addr)) {
      return `Adres Modbus ${addr} jest użyty więcej niż raz. Każde urządzenie musi mieć unikalny adres.`;
    }
    addrs.push(addr);
  }
  return null;
}

// ============================================================
// Główna funkcja obliczeniowa
// ============================================================
function calculate() {
  hideError();

  const err = validateForm();
  if (err) { showError(err); return; }

  const mode           = document.querySelector('input[name="mode"]:checked').value;
  const controllerType = document.getElementById('controllerType').value;

  // Zbierz wybrane urządzenia
  const selectedDevices = [];
  document.querySelectorAll('.device-row').forEach(row => {
    const id   = row.dataset.rowId;
    const name = document.getElementById(`device-${id}`).value;
    const addr = parseInt(document.getElementById(`addr-${id}`).value);
    selectedDevices.push({ name, addr });
  });

  // Przypisz numery grup (wg group_priority)
  const selectedNames = selectedDevices.map(d => d.name);
  const groupMap      = Calculator.assignGroupNumbers(selectedNames, devices);

  // Generuj wyniki
  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  // Info o trybie
  const modeInfo = document.createElement('div');
  modeInfo.style.cssText = 'margin-bottom:12px; font-size:12px; color:#667;';
  modeInfo.textContent = `Tryb: ${mode === 'single' ? 'Single (jedno urządzenie)' : 'Group (grupowy)'} — Sterownik: ${controllerType === 'tbox' ? 'T-box' : 'T-box Zone'}`;
  resultsEl.appendChild(modeInfo);

  // Blok dla każdego urządzenia
  selectedDevices.forEach(({ name, addr }) => {
    const device  = devices[name];
    if (!device) return;

    const groupNum = groupMap[name] ?? 1;
    const tables   = Calculator.buildRegisterTable(device, addr, mode, groupNum);

    const block = document.createElement('div');
    block.className = 'result-block';

    // Nagłówek bloku
    const header = document.createElement('div');
    header.className = 'result-block-header';
    header.innerHTML = `
      <h3>${name}</h3>
      <span class="badge">Adres Modbus: ${addr}${mode === 'group' ? ' &nbsp;|&nbsp; Grupa: ' + groupNum : ''}</span>
    `;
    block.appendChild(header);

    // Input Registers
    if (tables.ir.length > 0) {
      block.appendChild(buildRegSection(
        'Input Registers (IR) — tylko odczyt',
        tables.ir,
        false
      ));
    }

    // Holding Registers
    if (mode === 'single') {
      if (tables.hrSingle.length > 0) {
        block.appendChild(buildRegSection(
          'Holding Registers (HR) — Single mode',
          tables.hrSingle,
          true
        ));
      }
    } else {
      // W trybie group pokazujemy oba zestawy
      if (tables.hrSingle.length > 0) {
        block.appendChild(buildRegSection(
          'Holding Registers — Single (adresowanie indywidualne)',
          tables.hrSingle,
          true,
          'single'
        ));
      }
      if (tables.hrGroup.length > 0) {
        block.appendChild(buildRegSection(
          'Holding Registers — Group (adresowanie grupowe)',
          tables.hrGroup,
          true,
          'group'
        ));
      }
    }

    resultsEl.appendChild(block);
  });

  // Pokaż sekcję wyników
  document.getElementById('results').style.display = 'block';
  document.querySelector('.form-section').style.display = 'none';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// Budowanie sekcji tabeli rejestrów
// ============================================================
function buildRegSection(title, rows, showValues, modeTag) {
  const section = document.createElement('div');
  section.className = 'reg-section';

  const sectionTitle = document.createElement('div');
  sectionTitle.className = 'reg-section-title';
  sectionTitle.textContent = title;
  if (modeTag) {
    const badge = document.createElement('span');
    badge.className = `mode-tag mode-${modeTag}`;
    badge.textContent = modeTag.toUpperCase();
    sectionTitle.appendChild(badge);
  }

  const table = document.createElement('table');
  table.className = 'reg-table';

  // Nagłówek tabeli
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th>Adres HEX</th>
        <th>Adres DEC</th>
        <th>Nazwa rejestru</th>
        ${showValues ? '<th>Wartości / Zakres</th>' : ''}
      </tr>
    </thead>
  `;

  const tbody = document.createElement('tbody');
  rows.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:#aaa">${idx + 1}</td>
      <td><span class="addr-hex">${row.addrHex}</span></td>
      <td><span class="addr-dec">${row.addrDec}</span></td>
      <td><span class="reg-name">${row.name}</span></td>
      ${showValues ? `<td>${Calculator.renderValueInfo(row.reg)}</td>` : ''}
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  section.append(sectionTitle, table);
  return section;
}

// ============================================================
// Pomocnicze: błędy
// ============================================================
function showError(msg) {
  const el = document.getElementById('form-error');
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError() {
  document.getElementById('form-error').style.display = 'none';
}

// ============================================================
// Reset — powrót do formularza
// ============================================================
function resetForm() {
  document.getElementById('results').style.display = 'none';
  document.querySelector('.form-section').style.display = 'block';
}

// ============================================================
// Inicjalizacja zdarzeń
// ============================================================
document.getElementById('btn-add-device').addEventListener('click', addDeviceRow);
document.getElementById('btn-calculate').addEventListener('click', calculate);
document.getElementById('btn-reset').addEventListener('click', resetForm);

// Start
loadDevices();
