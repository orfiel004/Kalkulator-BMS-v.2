# TASK_030 — Excel: dynamiczne kolumny wg trybu + układ przycisków

## Zmiany

### A) Dynamiczne kolumny w eksporcie Excel

Kolumna Strefa/Grupa pojawia się tylko gdy ma sens:

| Tryb           | Kolumny                                                  |
|----------------|----------------------------------------------------------|
| T-box Single   | Sekcja, Adres, Typ, Adres HEX, Adres DEC, Nazwa, Opis   |
| T-box Group    | Sekcja, Adres, Typ, Adres HEX, Adres DEC, Nazwa, Opis   |
| T-box Zone     | Sekcja, Adres, Strefa, Typ, Adres HEX, Adres DEC, Nazwa, Opis |
| M-box          | Sekcja, Adres, Strefa, Typ, Adres HEX, Adres DEC, Nazwa, Opis |

---

### B) Układ przycisków w pasku wyników

Przycisk „Drukuj" zgrupowany wizualnie z „Eksportuj Excel" (po prawej stronie),
„Nowe obliczenie" pozostaje oddzielnie.

Przed:
```
[Wyniki h2]   [Nowe obliczenie]   [Drukuj]   [Eksportuj Excel]
```

Po:
```
[Wyniki h2]   [Nowe obliczenie]   [Drukuj] [Eksportuj Excel]
```

Drukuj i Eksportuj Excel owinięte w `<div class="results-actions-right">`,
który grupuje je razem z małym gap.

---

## Implementacja

### 1. `frontend/index.html` i `index.html` (root) — grupowanie przycisków

Znajdź (w obu plikach):
```html
      <button id="btn-reset" type="button" class="btn-secondary" data-i18n="btn.reset">Nowe obliczenie</button>
      <button id="btn-print" data-i18n="btn.print">Drukuj</button>
      <button id="btn-export-xlsx" data-i18n="btn.export_xlsx">Eksportuj Excel</button>
```

Zamień na:
```html
      <button id="btn-reset" type="button" class="btn-secondary" data-i18n="btn.reset">Nowe obliczenie</button>
      <div class="results-actions-right">
        <button id="btn-print" data-i18n="btn.print">Drukuj</button>
        <button id="btn-export-xlsx" data-i18n="btn.export_xlsx">Eksportuj Excel</button>
      </div>
```

### 2. `frontend/css/style.css` — styl grupowania

Za blokiem `.results-header h2 { ... }` dodaj:
```css
.results-actions-right {
  display: flex;
  gap: 6px;
}
```

Zaktualizuj też `@media print` — `#btn-export-xlsx` już jest ukryty, dodaj `.results-actions-right` jeśli potrzeba (nie jest konieczne, bo dzieci są już ukryte).

### 3. `frontend/js/app.js` — dynamiczne kolumny w `exportToExcel()`

Znajdź początek funkcji `exportToExcel()`:
```js
function exportToExcel() {
  const content = document.getElementById('results-content');
  if (!content) return;

  // Nagłówki kolumn (tłumaczone)
  const HDR = currentLang === 'en'
    ? ['Section', 'Address', 'Zone / Group', 'Type', 'Address HEX', 'Address DEC', 'Register name', 'Description']
    : ['Sekcja',  'Adres',   'Strefa / Grupa', 'Typ', 'Adres HEX', 'Adres DEC',   'Nazwa rejestru', 'Opis'];
```

Zamień na:
```js
function exportToExcel() {
  const content = document.getElementById('results-content');
  if (!content) return;

  // Czy tryb ma kolumnę Strefa (T-box Zone i M-box)
  const ctrl = document.getElementById('controllerType').value;
  const hasZone = (ctrl === 'tbox_zone' || ctrl === 'mbox');

  // Nagłówki kolumn (tłumaczone)
  const HDR = hasZone
    ? (currentLang === 'en'
        ? ['Section', 'Address', 'Zone', 'Type', 'Address HEX', 'Address DEC', 'Register name', 'Description']
        : ['Sekcja',  'Adres',   'Strefa', 'Typ', 'Adres HEX',  'Adres DEC',   'Nazwa rejestru', 'Opis'])
    : (currentLang === 'en'
        ? ['Section', 'Address', 'Type', 'Address HEX', 'Address DEC', 'Register name', 'Description']
        : ['Sekcja',  'Adres',   'Typ',  'Adres HEX',   'Adres DEC',   'Nazwa rejestru', 'Opis']);
```

Znajdź push wiersza danych:
```js
        rows.push([sectionName, deviceAddr, deviceZone, typeShort, addrHex, addrDec, name, description]);
```

Zamień na:
```js
        if (hasZone) {
          rows.push([sectionName, deviceAddr, deviceZone, typeShort, addrHex, addrDec, name, description]);
        } else {
          rows.push([sectionName, deviceAddr, typeShort, addrHex, addrDec, name, description]);
        }
```

Znajdź szerokości kolumn:
```js
  ws['!cols'] = [
    { wch: 22 }, // Sekcja
    { wch: 8  }, // Adres
    { wch: 8  }, // Strefa
    { wch: 5  }, // Typ
    { wch: 13 }, // Adres HEX
    { wch: 11 }, // Adres DEC
    { wch: 28 }, // Nazwa rejestru
    { wch: 55 }, // Opis
  ];
```

Zamień na:
```js
  ws['!cols'] = hasZone
    ? [
        { wch: 22 }, // Sekcja
        { wch: 8  }, // Adres
        { wch: 8  }, // Strefa
        { wch: 5  }, // Typ
        { wch: 13 }, // Adres HEX
        { wch: 11 }, // Adres DEC
        { wch: 28 }, // Nazwa rejestru
        { wch: 55 }, // Opis
      ]
    : [
        { wch: 22 }, // Sekcja
        { wch: 8  }, // Adres
        { wch: 5  }, // Typ
        { wch: 13 }, // Adres HEX
        { wch: 11 }, // Adres DEC
        { wch: 28 }, // Nazwa rejestru
        { wch: 55 }, // Opis
      ];
```

---

## Weryfikacja

1. T-box Single → Excel ma 7 kolumn (bez Strefa)
2. T-box Group → Excel ma 7 kolumn (bez Strefa)
3. T-box Zone → Excel ma 8 kolumn (z Strefa)
4. M-box → Excel ma 8 kolumn (z Strefa)
5. Przyciski Drukuj i Eksportuj Excel są obok siebie w pasku wyników

---

## Synchronizacja

Po zmianach w `frontend/index.html` zsynchronizuj `index.html` (root):
```bash
# Skopiuj sekcję results z frontend/index.html do index.html ręcznie
# (różnią się tylko ścieżkami do skryptów i CSS)
```

## Commit

```
feat(export): dynamic columns per controller type; group print+export buttons
```
