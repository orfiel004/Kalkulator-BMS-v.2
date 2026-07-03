/**
 * calculator.js — Silnik obliczania adresów rejestrów Modbus
 *
 * Wzory (T-box):
 *   IR  Single:  offset + 256 + (deviceAddr - 1) × 64
 *   HR  Single:  offset + 256 + (deviceAddr - 1) × 64
 *   HR  Group:   offset + 4096 + (groupNum - 1) × 256
 *
 * Wzory (T-box Zone):
 *   IR urządzenia:  offset + 320  + (pozycja_posortowana × 32)   // baza 0x0140
 *   HR urządzenia:  offset + 8990 + (groupId − 1) × 32           // baza 0x2320, group = (typ+strefa)
 *   IR/HR strefy:   base_addr + (indeks_strefy × 16)
 *
 * Rejestry sterownika mają stałe adresy (nie zależą od urządzenia).
 * Źródło: T-BOX Zone Modbus RTU V4.8 (Flowair, wewnętrzna)
 */

const Calculator = {

  // ---- T-box ----

  calcSingleAddress(offset, deviceAddr) {
    return offset + 256 + (deviceAddr - 1) * 64;
  },

  calcGroupAddress(offset, groupNum) {
    return offset + 4096 + (groupNum - 1) * 256;
  },

  // ---- T-box Zone ----

  // Adres IR urządzenia: baza 0x0140 = 320
  calcZoneDeviceAddress(offset, sortedIndex) {
    return offset + 320 + sortedIndex * 32;
  },

  // Adres HR urządzenia (statyczna przestrzeń T-box Zone): baza 0x2320 = 8990 + 2
  // groupId: numer grupy (typ+strefa), nadawany w kolejności napotkania po sort wg adresu
  calcZoneDeviceHRGroupAddress(offset, groupId) {
    return offset + 8990 + (groupId - 1) * 32;
  },

  // Adres rejestrów strefy
  calcZoneRegAddress(baseAddr, zoneIndex) {
    return baseAddr + zoneIndex * 16;
  },

  // ---- Helpers ----

  toHex(dec) {
    return '0x' + dec.toString(16).toUpperCase().padStart(4, '0');
  },

  assignGroupNumbers(selectedNames, allDevices) {
    const uniqueNames = [...new Set(selectedNames)].filter(n => allDevices[n]);
    uniqueNames.sort((a, b) => {
      const pa = allDevices[a]?.group_priority ?? 999;
      const pb = allDevices[b]?.group_priority ?? 999;
      return pa - pb;
    });
    const groupMap = {};
    uniqueNames.forEach((name, index) => {
      groupMap[name] = index + 1;
    });
    return groupMap;
  },

  renderValueInfo(reg) {
    const parts = [];
    const regValues = (currentLang === 'en' && reg.values_en) ? reg.values_en : reg.values;
    if (regValues && Object.keys(regValues).length > 0) {
      const items = Object.entries(regValues)
        .map(([k, v]) => `<span class="val-item"><b>${k}</b> ${v}</span>`)
        .join('');
      parts.push(`<div class="values-list">${items}</div>`);
    } else if (reg.min !== undefined || reg.max !== undefined) {
      const r = [];
      if (reg.min !== undefined) r.push(`min: <b>${reg.min}</b>`);
      if (reg.max !== undefined) r.push(`max: <b>${reg.max}</b>`);
      if (reg.unit)              r.push(`<i>${reg.unit}</i>`);
      parts.push(`<span class="range-info">${r.join(' &nbsp;|&nbsp; ')}</span>`);
    }
    const desc = (currentLang === 'en' && reg.description_en) ? reg.description_en : reg.description;
    if (desc) {
      parts.push(`<div class="val-desc">${desc}</div>`);
    }
    return parts.join('') || '<span style="color:#ccc">—</span>';
  },

  buildRegisterTable(device, deviceAddr, mode, groupNum) {
    const mapReg = (reg, addrFn) => ({
      offset:  reg.offset,
      addrDec: addrFn(reg.offset),
      addrHex: this.toHex(addrFn(reg.offset)),
      name:    reg.name,
      reg:     reg,
    });
    const singleFn = (offset) => this.calcSingleAddress(offset, deviceAddr);
    const groupFn  = (offset) => this.calcGroupAddress(offset, groupNum);
    return {
      ir:       (device.input_registers          || []).map(r => mapReg(r, singleFn)),
      hrSingle: (device.holding_registers_single || []).map(r => mapReg(r, singleFn)),
      hrGroup:  (device.holding_registers_group  || []).map(r => mapReg(r, groupFn)),
    };
  },

  // ---- Statyczne rejestry sterownika ----

  CONTROLLER: {
    tbox: {
      ir: [
        { addr: 0,  name: 'HardwareType',  description: 'Informacja o typie sprzętu i wersji PCB.',                                                                                    description_en: 'Hardware type and PCB version information.' },
        { addr: 1,  name: 'SoftType',      description: 'Typ i wersja oprogramowania sterownika.',                                                                                      description_en: 'Controller firmware type and version.',
          values: { '1': 'LEO D', '2': 'ELIS', '3': 'DRV-D', '4': 'BmsMode', '5': 'DRV-SLIM', '6': 'DRV-KM', '7': 'DRV-M', '8': 'DRV-V', '9': 'DRV-R', '10': 'DRV-R KM', '11': 'DRV-EL', '12': 'DRV-COOL', '13': 'DRV-CUBE', '14': 'DRV-OXEN' },
          values_en: { '1': 'LEO D', '2': 'ELIS', '3': 'DRV-D', '4': 'BmsMode', '5': 'DRV-SLIM', '6': 'DRV-KM', '7': 'DRV-M', '8': 'DRV-V', '9': 'DRV-R', '10': 'DRV-R KM', '11': 'DRV-EL', '12': 'DRV-COOL', '13': 'DRV-CUBE', '14': 'DRV-OXEN' },
        },
        { addr: 2,  name: 'ConnectionCnt', description: 'Licznik połączeń — rośnie przy każdym odczycie. Pierwsze zapytanie zawsze zwraca 0x01. Monitoring tego rejestru umożliwia diagnostykę połączenia.', description_en: 'Connection counter — increments on each read. First query always returns 0x01. Monitoring this register enables connection diagnostics.', min: 0, max: 65535 },
        { addr: 3,  name: 'SoftVer',       description: 'Wersja oprogramowania sterownika.',                                                                                            description_en: 'Controller firmware version.' },
        { addr: 5,  name: 'TempTBox',      description: 'Temperatura wewnętrzna sterownika T-box (x0.1 °C).',                                                                           description_en: 'T-box internal temperature (x0.1 °C).', min: -350, max: 350, unit: 'x0.1 °C' },
        { addr: 6,  name: 'TempT4Ave',     description: 'Średnia temperatura z czujników T4 wszystkich podłączonych urządzeń (x0.1 °C). Wartość 0x7000 = zwarcie, 0x7FFF = brak czujnika.',                                               description_en: 'Average T4 temperature from all connected devices (x0.1 °C). Value 0x7000 = short circuit, 0x7FFF = sensor not connected.', min: -350, max: 350, unit: 'x0.1 °C' },
        { addr: 16, name: 'DrvCount',      description: 'Liczba wykrytych urządzeń podłączonych do sterownika.',                                                                        description_en: 'Number of devices detected on the controller.', min: 0, max: 31 },
      ],
      hr_single: [
        { addr: 4, name: 'BmsMode', description: 'Tryb BMS — tryb pracy Modbus.',
          description_en: 'BMS mode — Modbus operation mode.',
          values: { '0': 'Nieaktywny (Read Only)', '1': 'Single mode — bezpośredni dostęp do urządzeń', '2': 'Group mode — dostęp przez grupy' },
          values_en: { '0': 'Inactive (Read Only)', '1': 'Single mode — direct device access', '2': 'Group mode — group access' },
        },
      ],
      hr_group: [
        { addr: 1,  name: 'SoftType',                    description: 'Typ i wersja oprogramowania sterownika.',                                                              description_en: 'Controller firmware type and version.' },
        { addr: 4,  name: 'BmsMode',                     description: 'Tryb BMS — tryb pracy Modbus.',
          description_en: 'BMS mode — Modbus operation mode.',
          values: { '0': 'Nieaktywny (Read Only)', '1': 'Single mode — bezpośredni dostęp do urządzeń', '2': 'Group mode — dostęp przez grupy' },
          values_en: { '0': 'Inactive (Read Only)', '1': 'Single mode — direct device access', '2': 'Group mode — group access' },
        },
        { addr: 5,  name: 'Enable',                      description: 'Włączenie/wyłączenie grupy urządzeń.',                                                                 description_en: 'Enable/disable device group.',
          values: { '0': 'Wyłączone', '1–65535': 'Włączone' },
          values_en: { '0': 'Disabled', '1–65535': 'Enabled' },
        },
        { addr: 6,  name: 'Tref',                        description: 'Temperatura zadana dla grupy urządzeń.',                                                               description_en: 'Target temperature for the device group.', min: 50, max: 450, unit: 'x0.1 °C (5.0–45.0 °C)' },
        { addr: 7,  name: 'AntifreezeWareHouseEnable',   description: 'Włączenie ochrony przed zamrożeniem pomieszczenia.',                                                   description_en: 'Enable warehouse antifreeze protection.',
          values: { '1': 'Aktywna', '2': 'Nieaktywna' },
          values_en: { '1': 'Active', '2': 'Inactive' },
        },
        { addr: 8,  name: 'AntifreezeWareHouseTempRef',  description: 'Temperatura progowa aktywacji ochrony przed zamrożeniem.',                                             description_en: 'Warehouse antifreeze protection threshold temperature.', min: 50, max: 150, unit: 'x0.1 °C (5.0–15.0 °C)' },
        { addr: 9,  name: 'TleadSensorSelect',           description: 'Wybór czujnika wiodącego temperatury.',                                                                description_en: 'Lead temperature sensor selection.',
          values: { '1': 'TSL_TLEAD — wartość Modbus', '3': 'TSL_T4 — czujnik T4 pomieszczenia' },
          values_en: { '1': 'TSL_TLEAD — Modbus value', '3': 'TSL_T4 — room T4 sensor' },
        },
        { addr: 10, name: 'Tsl_Tlead_Offset',            description: 'Offset czujnika wiodącego TLEAD względem wartości zadanej.',                                           description_en: 'TLEAD sensor offset relative to setpoint.', min: -100, max: 100, unit: 'x0.1 °C' },
        { addr: 11, name: 'Tsl_T4_Offset',               description: 'Offset czujnika T4 względem wartości zadanej.',                                                        description_en: 'T4 sensor offset relative to setpoint.', min: -100, max: 100, unit: 'x0.1 °C' },
        { addr: 12, name: 'GasSensorEnable',             description: 'Włączenie obsługi czujnika gazu.',                                                                     description_en: 'Gas sensor enable.',
          values: { '0': 'Nieaktywny', '1': 'Aktywny' },
          values_en: { '0': 'Inactive', '1': 'Active' },
        },
        { addr: 13, name: 'GasSensorConnectId',          description: 'Adres Modbus czujnika gazu w sieci sterownika.',                                                       description_en: 'Modbus address of the gas sensor on the controller network.', min: 1, max: 247 },
        { addr: 14, name: 'DateYear',                    description: 'Ustawienie daty — rok.',                                                                               description_en: 'Date setting — year.', min: 2021, max: 2035 },
        { addr: 15, name: 'DateMonth',                   description: 'Ustawienie daty — miesiąc (0=styczeń … 11=grudzień).',                                                 description_en: 'Date setting — month (0=January … 11=December).', min: 0, max: 11 },
        { addr: 16, name: 'DateDay',                     description: 'Ustawienie daty — dzień.',                                                                             description_en: 'Date setting — day.', min: 1, max: 31 },
        { addr: 17, name: 'DateHours',                   description: 'Ustawienie czasu — godzina.',                                                                          description_en: 'Time setting — hour.', min: 0, max: 23 },
        { addr: 18, name: 'DateMinutes',                 description: 'Ustawienie czasu — minuty.',                                                                           description_en: 'Time setting — minutes.', min: 0, max: 59 },
        { addr: 19, name: 'DateSeconds',                 description: 'Ustawienie czasu — sekundy.',                                                                          description_en: 'Time setting — seconds.', min: 0, max: 59 },
      ],
    },
    tbox_zone: {
      ir: [
        { addr: 0,  name: 'HardwareType',          description: 'Informacja o typie sprzętu i wersji PCB.',                                                          description_en: 'Hardware type and PCB version information.' },
        { addr: 1,  name: 'SoftType',              description: 'Typ oprogramowania sterownika.',                                                                     description_en: 'Controller firmware type.',
          values: { '257': 'OXEN', '513': 'CURTAIN (ELIS/SLIM)', '769': 'KM', '1025': 'HEATER_EC (LEO EC)', '1281': 'DESTRATIFICATOR_AC', '1283': 'DESTRATIFICATOR_EC', '1537': 'CURTAIN_HEATER', '1793': 'HEATER_AC (LEO AC)', '1794': 'HEATER_AC_EL (LEO EL)', '2305': 'KM_RAW', '2561': 'ROBUR_PN', '2817': 'COOL (LEO COOL)', '4097': 'ROBUR_KM', '4098': 'ROBUR_KM_NEXT', '4353': 'ROBUR', '4354': 'ROBUR_NEXT', '4865': 'DRV_V_RAW', '5377': 'CUBE', '5890': 'LUNA', '6146': 'ELIS AX' },
          values_en: { '257': 'OXEN', '513': 'CURTAIN (ELIS/SLIM)', '769': 'KM', '1025': 'HEATER_EC (LEO EC)', '1281': 'DESTRATIFICATOR_AC', '1283': 'DESTRATIFICATOR_EC', '1537': 'CURTAIN_HEATER', '1793': 'HEATER_AC (LEO AC)', '1794': 'HEATER_AC_EL (LEO EL)', '2305': 'KM_RAW', '2561': 'ROBUR_PN', '2817': 'COOL (LEO COOL)', '4097': 'ROBUR_KM', '4098': 'ROBUR_KM_NEXT', '4353': 'ROBUR', '4354': 'ROBUR_NEXT', '4865': 'DRV_V_RAW', '5377': 'CUBE', '5890': 'LUNA', '6146': 'ELIS AX' },
        },
        { addr: 2,  name: 'ConnectionCnt',         description: 'Licznik połączeń — rośnie przy każdym odczycie. Pierwsze zapytanie zawsze zwraca 0x01. Monitoring tego rejestru umożliwia diagnostykę połączenia.', description_en: 'Connection counter — increments on each read. First query always returns 0x01. Monitoring this register enables connection diagnostics.', min: 0, max: 65535 },
        { addr: 3,  name: 'SoftVer',               description: 'Wersja oprogramowania sterownika.',                                                                  description_en: 'Controller firmware version.' },
        { addr: 4,  name: 'MainSensorReading',     description: 'Temperatura zmierzona przez czujnik główny. Wartość 0x7000 = zwarcie, 0x7FFF = brak czujnika.',       description_en: 'Temperature measured by the main sensor. Value 0x7000 = short circuit, 0x7FFF = sensor not connected.', min: -1500, max: 2000, unit: 'x0.1 °C' },
        { addr: 5,  name: 'SecSensorReading',      description: 'Temperatura zmierzona przez czujnik pomocniczy. Wartość 0x7000 = zwarcie, 0x7FFF = brak czujnika.',  description_en: 'Temperature measured by the secondary sensor. Value 0x7000 = short circuit, 0x7FFF = sensor not connected.', min: -1500, max: 2000, unit: 'x0.1 °C' },
        { addr: 8,  name: 'DeviceCount',           description: 'Liczba wykrytych urządzeń podłączonych do sterownika.',                                              description_en: 'Number of devices detected on the controller.', min: 0, max: 31 },
        { addr: 9,  name: 'ZoneCount',             description: 'Liczba skonfigurowanych stref.',                                                                     description_en: 'Number of configured zones.', min: 0, max: 31 },
        { addr: 10, name: 'GroupCount',            description: 'Liczba grup urządzeń.',                                                                              description_en: 'Number of device groups.', min: 0, max: 31 },
        { addr: 11, name: 'DeviceStatus1-16',      description: 'Status wykrytych urządzeń 1–16. Każdy bit odpowiada jednemu urządzeniu (0=błąd, 1=OK).',             description_en: 'Status of detected devices 1–16. Each bit corresponds to one device (0=error, 1=OK).' },
        { addr: 12, name: 'DeviceStatus17-32',     description: 'Status wykrytych urządzeń 17–32. Każdy bit odpowiada jednemu urządzeniu (0=błąd, 1=OK).',            description_en: 'Status of detected devices 17–32. Each bit corresponds to one device (0=error, 1=OK).' },
        { addr: 13, name: 'ControlerStatus1-16',   description: 'Status sterownika — wartość 32-bitowa, bity 1–16.',                                                  description_en: 'Controller status — 32-bit value, bits 1–16.' },
        { addr: 14, name: 'ControlerStatus17-32',  description: 'Status sterownika — wartość 23-bitowa, bity 17–31.',                                                 description_en: 'Controller status — bits 17–31.' },
        { addr: 15, name: 'InfoStartPoint',        description: 'Punkt startowy dynamicznej informacji o urządzeniach. Stała wartość 12345.',                         description_en: 'Start point of dynamic device information. Constant value 12345.',
          values: { '12345': 'Startpoint (wartość stała)' },
          values_en: { '12345': 'Startpoint (constant value)' },
        },
      ],
      hr: [
        { addr: 0,  name: 'SetScreenLock',            description: 'Włącza blokadę ekranu sterownika.',                                    description_en: 'Enables controller screen lock.',
          values: { '0': 'Wyłączona', '1': 'Włączona' }, values_en: { '0': 'Disabled', '1': 'Enabled' },
        },
        { addr: 1,  name: 'EnableDisableController',  description: 'Włącza lub wyłącza sterownik i wszystkie podłączone urządzenia.',      description_en: 'Enables or disables the controller and all connected devices.',
          values: { '0': 'Wyłączony', '1': 'Włączony' }, values_en: { '0': 'Disabled', '1': 'Enabled' },
        },
        { addr: 2,  name: 'UnlockScreen',             description: 'Odblokowuje ekran — aktywne gdy blokada ekranu jest włączona.',        description_en: 'Unlocks the screen — active when screen lock is enabled.',
          values: { '0': 'Brak odblokowania', '1': 'Odblokuj' }, values_en: { '0': 'No unlock', '1': 'Unlock' },
        },
        { addr: 4,  name: 'SetYear',                  description: 'Ustawienie daty i czasu — rok.',                                       description_en: 'Date and time setting — year.', min: 2021, max: 2035 },
        { addr: 5,  name: 'SetMonth',                 description: 'Ustawienie daty i czasu — miesiąc (0=styczeń … 11=grudzień).',         description_en: 'Date and time setting — month (0=January … 11=December).', min: 0, max: 11 },
        { addr: 6,  name: 'SetDay',                   description: 'Ustawienie daty i czasu — dzień.',                                     description_en: 'Date and time setting — day.', min: 1, max: 31 },
        { addr: 7,  name: 'SetHours',                 description: 'Ustawienie daty i czasu — godzina.',                                   description_en: 'Date and time setting — hour.', min: 0, max: 23 },
        { addr: 8,  name: 'SetMinutes',               description: 'Ustawienie daty i czasu — minuty.',                                    description_en: 'Date and time setting — minutes.', min: 0, max: 59 },
        { addr: 9,  name: 'SetSeconds',               description: 'Ustawienie daty i czasu — sekundy.',                                   description_en: 'Date and time setting — seconds.', min: 0, max: 59 },
        { addr: 10, name: 'SetExternalSignalEnable',  description: 'Obsługa sygnału zewnętrznego — włącz/wyłącz.',                        description_en: 'External signal handling — enable/disable.',
          values: { '0': 'Wyłączona', '1': 'Włączona' }, values_en: { '0': 'Disabled', '1': 'Enabled' },
        },
        { addr: 11, name: 'SetExternalSignalMode',    description: 'Tryb i funkcjonalność sygnału zewnętrznego.',                         description_en: 'External signal mode and functionality.',
          values: { '0': 'Wyłączony', '1': 'Włączony' }, values_en: { '0': 'Disabled', '1': 'Enabled' },
        },
        { addr: 12, name: 'SetExternalSignalContact', description: 'Konfiguracja polaryzacji styku sygnału zewnętrznego.',                description_en: 'External signal contact polarity configuration.',
          values: { '0': 'NO — normalnie otwarty', '1': 'NC — normalnie zamknięty' }, values_en: { '0': 'NO — normally open', '1': 'NC — normally closed' },
        },
        { addr: 13, name: 'SetExternalSignalLevel',   description: 'Poziom działania sygnału zewnętrznego.',                              description_en: 'External signal action level.',
          values: { '0': 'Globalny — wszystkie urządzenia', '1': 'Strefy — wybrane strefy' }, values_en: { '0': 'Global — all DRVs', '1': 'Zones — selected zones' },
        },
      ],
    },
  },

  // ---- Rejestry stref (T-box Zone) ----

  ZONE_REGS: {
    ir: [
      { baseAddr: 2304, name: 'ZoneID',          description: 'Identyfikator strefy (1–31).', description_en: 'Zone identifier (1–31).', min: 1, max: 31 },
      { baseAddr: 2305, name: 'AverageZoneTemp', description: 'Średnia temperatura w strefie mierzona przez czujniki lokalne urządzeń. Wartość 0x7000 = zwarcie, 0x7FFF = brak czujnika.', description_en: 'Average zone temperature measured by local device sensors. Value 0x7000 = short circuit, 0x7FFF = sensor not connected.', min: -1500, max: 2000, unit: 'x0.1 °C' },
      { baseAddr: 2306, name: 'ZoneDeviceCount', description: 'Liczba urządzeń przypisanych do tej strefy.', description_en: 'Number of devices assigned to this zone.', min: 0, max: 31 },
    ],
    hr: [
      { baseAddr: 2320, name: 'SetZoneID',               description: 'Identyfikator strefy do zmiany (1–31). Należy ustawić przed zmianą pozostałych rejestrów strefy.',                  description_en: 'Zone ID to change (1–31). Must be set before changing other zone registers.', min: 1, max: 31 },
      { baseAddr: 2321, name: 'EnableDisableZone',       description: 'Włącza lub wyłącza wszystkie urządzenia w strefie.',                                                                  description_en: 'Enables or disables all devices in the zone.',
        values: { '0': 'Wyłączona', '1': 'Włączona' }, values_en: { '0': 'Disabled', '1': 'Enabled' },
      },
      { baseAddr: 2322, name: 'ZoneTRef',                description: 'Temperatura docelowa strefy.',                                                                                        description_en: 'Zone target temperature.', min: 50, max: 450, unit: 'x0.1 °C (5.0–45.0 °C)' },
      { baseAddr: 2323, name: 'ZoneAntifreeze',          description: 'Włącza ochronę przeciwzamrożeniową strefy.',                                                                           description_en: 'Enables zone antifreeze protection.',
        values: { '1': 'Aktywna', '2': 'Nieaktywna' }, values_en: { '1': 'Enabled', '2': 'Disabled' },
      },
      { baseAddr: 2324, name: 'ZoneTAntifreeze',         description: 'Temperatura progowa aktywacji ochrony przeciwzamrożeniowej strefy.',                                                   description_en: 'Zone antifreeze activation threshold temperature.', min: 50, max: 150, unit: 'x0.1 °C (5.0–15.0 °C)' },
      { baseAddr: 2325, name: 'ZoneTLeadSensorSelect',   description: 'Wybór czujnika wiodącego dla strefy.',                                                                                 description_en: 'Zone lead sensor selection.',
        values: { '1': 'TLEAD — wartość Modbus', '3': 'T4 — czujnik temperatury pomieszczenia', '4': 'Czujnik wewnętrzny sterownika' },
        values_en: { '1': 'TLEAD — Modbus value', '3': 'T4 — room temperature sensor', '4': 'Controller internal sensor' },
      },
      { baseAddr: 2326, name: 'ZoneSensorOffset',        description: 'Korekcja (offset) czujnika temperatury wiodącej strefy.',                                                              description_en: 'Zone lead temperature sensor offset.', min: -100, max: 100, unit: 'x0.1 °C' },
      { baseAddr: 2327, name: 'T4SensorOffset',          description: 'Korekcja (offset) uśrednionego czujnika T4.',                                                                          description_en: 'T4 average sensor offset.', min: -100, max: 100, unit: 'x0.1 °C' },
      { baseAddr: 2328, name: 'ZoneExternalSignalEnable',description: 'Obsługa sygnału zewnętrznego dla strefy.',                                                                             description_en: 'Zone external signal handling.',
        values: { '0': 'Wyłączona', '1': 'Włączona' }, values_en: { '0': 'Disabled', '1': 'Enabled' },
      },
      { baseAddr: 2329, name: 'ZoneExternalSignalDrvUid',description: 'Adres Modbus (UID) urządzenia powiązanego z sygnałem zewnętrznym strefy.',                                             description_en: 'Modbus address (UID) of the device associated with the zone external signal.', min: 1, max: 31 },
      { baseAddr: 2330, name: 'TLeadVal',                description: 'Wartość temperatury z wybranego czujnika wiodącego strefy (ustawiana zdalnie przez Modbus).',                          description_en: 'Lead temperature sensor value for the zone (set remotely via Modbus).', min: -600, max: 600, unit: 'x0.1 °C' },
    ],
  },

  // ========================================================
  // ---- M-box (Modbus TCP) ----
  // ========================================================

  // Adres rejestru systemowego (identyczny wzór dla HR i IR)
  calcMboxSystemAddress(n) {
    return n; // adres logiczny = N (1-based)
  },

  // Adres rejestru strefowego
  calcMboxZoneAddress(zoneNum, n) {
    return 50 + (zoneNum - 1) * 30 + n;
  },

  // Adres rejestru urządzenia
  calcMboxDeviceAddress(deviceId, n) {
    return 270 + (deviceId - 1) * 40 + n;
  },

  // Dane statyczne M-box
  MBOX: {

    systemHR: [
      { n: 1, name: 'BMS_enable',  description: 'Tryb pracy BMS (włączenie komunikacji)', description_en: 'BMS operating mode (enable communication)' },
      { n: 2, name: 'DeviceZone',  description: 'Wybór rodzaju sterowania: Individual Device lub Zone Control', description_en: 'Control type selection: Individual Device or Zone Control' },
      { n: 3, name: 'Heartbeat',   description: 'Heartbeat — jeśli wartość nie zmieni się w ciągu 5 min, aktywuje się alarm komunikacji', description_en: 'Heartbeat — if value does not change within 5 min, a communication alarm is triggered' },
    ],

    systemIR: [
      { n: 1, name: 'Status_BMS',    description: 'Status komunikacji BMS', description_en: 'BMS communication status' },
      { n: 2, name: 'GeneralAlarm',  description: 'Informacja o ostatnim aktywnym alarmie', description_en: 'Last active alarm information' },
    ],

    zoneHR: [
      { n: 1, name: 'Program',        description: 'Wybór programu pracy strefy (0=Manual, 1=Eco)', description_en: 'Zone operating program selection (0=Manual, 1=Eco)' },
      { n: 2, name: 'Tref',           description: 'Temperatura zadana strefy (x0.1 °C, zakres 50–450)', description_en: 'Zone target temperature (x0.1 \u00b0C, range 50\u201350)' },
      { n: 3, name: 'State',          description: 'Aktywacja strefy (0=wyłączona, 1=włączona)', description_en: 'Zone activation (0=disabled, 1=enabled)' },
      { n: 4, name: 'Antifreeze',     description: 'Tryb ochrony przed zamrożeniem (0=lokalne, 1=wł, 2=wył)', description_en: 'Antifreeze protection mode (0=local, 1=on, 2=off)' },
      { n: 5, name: 'AntifreezeRef',  description: 'Temperatura aktywacji ochrony przed zamrożeniem (x0.1 °C)', description_en: 'Antifreeze activation temperature (x0.1 \u00b0C)' },
      { n: 6, name: 'Hysteresis',     description: 'Histereza między trybem grzania i chłodzenia (x0.1 °C)', description_en: 'Hysteresis between heating and cooling mode (x0.1 \u00b0C)' },
      { n: 7, name: 'DestMode',       description: 'Tryb destratyfikacji (0=lokalne, 1=wył, 2=wł)', description_en: 'Destratification mode (0=local, 1=off, 2=on)' },
      { n: 8, name: 'DestTempRef',    description: 'Różnica temperatur aktywująca destratyfikację (x0.1 °C)', description_en: 'Temperature difference activating destratification (x0.1 \u00b0C)' },
    ],

    zoneIR: [
      { n: 1, name: 'ZoneStatus',     description: 'Status strefy (0=nie istnieje, 1=utworzona)', description_en: 'Zone status (0=does not exist, 1=created)' },
      { n: 2, name: 'AvrTemp',        description: 'Średnia temperatura strefy (x0.1 °C, zakres −200…400)', description_en: 'Average zone temperature (x0.1 \u00b0C, range \u2212200\u2026400)' },
      { n: 3, name: 'WorkMode',       description: 'Aktualny tryb pracy strefy (0=OFF, 1=Lokalne, 2=Chłodz, 3=Grzan, 4=Wentyl)', description_en: 'Current zone operating mode (0=OFF, 1=Local, 2=Cooling, 3=Heating, 4=Ventilation)' },
      { n: 4, name: 'AvrTempOffset',  description: 'Korekta (offset) średniej temperatury strefy (x0.1 °C)', description_en: 'Average zone temperature offset (x0.1 \u00b0C)' },
      { n: 5, name: 'CO2',            description: 'Tryb pracy CO2 w strefie (0=Lokalne, 1=OFF, 2=ON)', description_en: 'Zone CO2 operating mode (0=Local, 1=OFF, 2=ON)' },
      { n: 6, name: 'CO2_ID',         description: 'DeviceID urządzenia nadrzędnego CO2 w strefie (1–32)', description_en: 'DeviceID of the master CO2 device in the zone (1\u201332)' },
      { n: 7, name: 'TrefDelta',      description: 'Zakres korekty temperatury zadanej przez użytkownika (0–5 °C)', description_en: 'User target temperature correction range (0\u20135 \u00b0C)' },
    ],

    devices: {

      'LEO D (DRV D)': {
        ir: [
          { n:1,  name:'Type',              description:'Typ urządzenia (wartość: 3)', description_en:'Device type (value: 3)' },
          { n:2,  name:'Ver',               description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',              description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'T3_UnderCeiling',   description:'Temperatura przy suficie — czujnik T3 (x0.1 °C)', description_en:'Ceiling temperature — T3 sensor (x0.1 °C)' },
          { n:5,  name:'T3AlarmD',          description:'Alarm czujnika T3 (0=brak, 1=alarm)', description_en:'T3 sensor alarm (0=none, 1=alarm)' },
          { n:6,  name:'T4',                description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:7,  name:'FanEff',            description:'Prędkość wentylatora (0=wył, 1–33=bieg1, 34–66=bieg2, 67–99=bieg3)', description_en:'Fan speed (0=off, 1–33=speed1, 34–66=speed2, 67–99=speed3)' },
          { n:8,  name:'FuseState3V',       description:'Stan zabezpieczenia wentylatora (1=sprawny, 2=uszkodzony)', description_en:'Fan fuse state (1=OK, 2=blown)' },
          { n:9,  name:'DestStatus',        description:'Stan destratyfikacji (1=nieaktywna, 2=aktywna)', description_en:'Destratification state (1=inactive, 2=active)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',          description:'Tryb pracy (1=OFF, 3=auto, 4=manual)', description_en:'Operating mode (1=OFF, 3=auto, 4=manual)' },
          { n:2,  name:'FanEffRef',         description:'Zadana prędkość wentylatora', description_en:'Fan speed setpoint' },
          { n:3,  name:'Tref',              description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:4,  name:'TLeadVal',          description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:5,  name:'TLeadSensorSelect', description:'Wybór czujnika wiodącego (1=strefa, 3=T4)', description_en:'Lead sensor selection (1=zone, 3=T4)' },
          { n:6,  name:'DestTempRef',       description:'Prog. temp. destratyfikacji (x0.1 °C)', description_en:'Destratification temperature threshold (x0.1 °C)' },
          { n:7,  name:'WorkModeTempRef',   description:'Temperatura progu aktywacji T3 dla trybu ręcznego (x0.1 °C)', description_en:'T3 activation threshold for manual mode (x0.1 °C)' },
        ],
      },

      'ELIS (DRV ELIS)': {
        ir: [
          { n:1,  name:'Type',                    description:'Typ urządzenia (wartość: 1)', description_en:'Device type (value: 1)' },
          { n:2,  name:'Ver',                     description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',                    description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'T3',                      description:'Temperatura — czujnik T3 (x0.1 °C)', description_en:'Temperature — T3 sensor (x0.1 °C)' },
          { n:5,  name:'T4',                      description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:6,  name:'FanSpeed',                description:'Prędkość wentylatora', description_en:'Fan speed' },
          { n:7,  name:'ValveStatus',             description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)', description_en:'Valve state (0=standby, 1=open, 2=closed)' },
          { n:8,  name:'ContactDoor',             description:'Stan czujnika drzwi (1=otwarty, 2=zamknięty)', description_en:'Door contact state (1=open, 2=closed)' },
          { n:9,  name:'AFStateWerehouse',        description:'Ochrona przed zamrożeniem — pomieszczenie (1=nieaktywna, 2=aktywna)', description_en:'Warehouse antifreeze protection (1=inactive, 2=active)' },
          { n:10, name:'AFStateWaterExch',        description:'Ochrona przed zamrożeniem — wymiennik (1=nieaktywna, 2=aktywna)', description_en:'Heat exchanger antifreeze protection (1=inactive, 2=active)' },
          { n:11, name:'FuseState3V',             description:'Stan zabezpieczenia wentylatora (1=sprawny, 2=uszkodzony)', description_en:'Fan fuse state (1=OK, 2=blown)' },
          { n:12, name:'CurtainElectricPower',    description:'Stan nagrzewnicy elektrycznej (0=nieaktywna, 1=aktywna)', description_en:'Electric heater state (0=inactive, 1=active)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=grzanie, 3=wentylacja)', description_en:'Operating mode (1=OFF, 2=heating, 3=ventilation)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora', description_en:'Fan speed setpoint' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)', description_en:'Lead sensor selection (1=zone, 3=T4)' },
          { n:6,  name:'CurtainProgram',              description:'Program kurtyny (1=K1 drzwi/temp, 2=K2 drzwi)', description_en:'Curtain program (1=K1 door/temp, 2=K2 door)' },
          { n:7,  name:'CurtainFanIdleRef',           description:'Prędkość biegu jałowego wentylatora', description_en:'Fan idle speed setpoint' },
          { n:8,  name:'FanIdleDelay',                description:'Czas biegu jałowego wentylatora (0–600, 65535=ciągła praca)', description_en:'Fan idle delay (0–600 s, 65535=continuous)' },
          { n:9,  name:'ValveIdleDelay',              description:'Czas biegu jałowego grzania (0–600, 65535=ciągła praca)', description_en:'Heating idle delay (0–600 s, 65535=continuous)' },
          { n:10, name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)', description_en:'Warehouse antifreeze protection (1=active, 2=inactive)' },
          { n:11, name:'AntifreezeWareHouseTempRef',  description:'Temperatura aktywacji ochrony przed zamrożeniem (x0.1 °C)', description_en:'Antifreeze activation temperature (x0.1 °C)' },
        ],
      },

      'SLIM (DRV SLIM)': {
        ir: [
          { n:1,  name:'Type',                    description:'Typ urządzenia', description_en:'Device type' },
          { n:2,  name:'Ver',                     description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',                    description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'T3',                      description:'Temperatura — czujnik T3 (x0.1 °C)', description_en:'Temperature — T3 sensor (x0.1 °C)' },
          { n:5,  name:'T4',                      description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:6,  name:'FanSpeed',                description:'Prędkość wentylatora', description_en:'Fan speed' },
          { n:7,  name:'ValveStatus',             description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)', description_en:'Valve state (0=standby, 1=open, 2=closed)' },
          { n:8,  name:'ContactDoor',             description:'Stan czujnika drzwi (1=otwarty, 2=zamknięty)', description_en:'Door contact state (1=open, 2=closed)' },
          { n:9,  name:'AFStateWerehouse',        description:'Ochrona przed zamrożeniem — pomieszczenie', description_en:'Warehouse antifreeze protection' },
          { n:10, name:'AFStateWaterExch',        description:'Ochrona przed zamrożeniem — wymiennik', description_en:'Heat exchanger antifreeze protection' },
          { n:11, name:'FuseState3V',             description:'Stan zabezpieczenia wentylatora', description_en:'Fan fuse state' },
          { n:12, name:'CurtainElectricPower',    description:'Stan nagrzewnicy elektrycznej (0=nieaktywna, 1=aktywna)', description_en:'Electric heater state (0=inactive, 1=active)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=grzanie, 3=wentylacja)', description_en:'Operating mode (1=OFF, 2=heating, 3=ventilation)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora', description_en:'Fan speed setpoint' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)', description_en:'Lead sensor selection (1=zone, 3=T4)' },
          { n:6,  name:'CurtainProgram',              description:'Program kurtyny (1=K1 drzwi/temp, 2=K2 drzwi)', description_en:'Curtain program (1=K1 door/temp, 2=K2 door)' },
          { n:7,  name:'CurtainFanIdleRef',           description:'Prędkość biegu jałowego wentylatora', description_en:'Fan idle speed setpoint' },
          { n:8,  name:'FanIdleDelay',                description:'Czas biegu jałowego wentylatora', description_en:'Fan idle delay' },
          { n:9,  name:'ValveIdleDelay',              description:'Czas biegu jałowego grzania', description_en:'Heating idle delay' },
          { n:10, name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia', description_en:'Warehouse antifreeze protection' },
          { n:11, name:'AntifreezeWareHouseTempRef',  description:'Temperatura aktywacji ochrony przed zamrożeniem (x0.1 °C)', description_en:'Antifreeze activation temperature (x0.1 °C)' },
        ],
      },

      'LEO KM (DRV KM)': {
        ir: [
          { n:1,  name:'Type',                      description:'Typ urządzenia (wartość: 11)', description_en:'Device type (value: 11)' },
          { n:2,  name:'Ver',                       description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',                      description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'T1',                        description:'Temperatura świeżego powietrza — czujnik T1 (x0.1 °C)', description_en:'Fresh air temperature — T1 sensor (x0.1 °C)' },
          { n:5,  name:'T3',                        description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)', description_en:'Supply air temperature — T3 sensor (x0.1 °C)' },
          { n:6,  name:'T4',                        description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:7,  name:'T5',                        description:'Temperatura powrotu wody — czujnik T5 (x0.1 °C)', description_en:'Return water temperature — T5 sensor (x0.1 °C)' },
          { n:8,  name:'ExternalGasDetectTH1',      description:'Detektor gazu — próg 1 (0=poniżej, 1=powyżej)', description_en:'Gas detector — threshold 1 (0=below, 1=above)' },
          { n:9,  name:'ExternalGasDetectTH2',      description:'Detektor gazu — próg 2 (0=poniżej, 1=powyżej)', description_en:'Gas detector — threshold 2 (0=below, 1=above)' },
          { n:10, name:'FanRoodTK',                 description:'Zabezpieczenie termiczne wentylatora dachowego', description_en:'Roof fan thermal protection' },
          { n:11, name:'FanSpeed',                  description:'Prędkość wentylatora', description_en:'Fan speed' },
          { n:12, name:'FanRooFEff',                description:'Prędkość wentylatora dachowego (0–100)', description_en:'Roof fan speed (0–100)' },
          { n:13, name:'DamperLevel',               description:'Położenie przepustnicy (0–100)', description_en:'Damper position (0–100)' },
          { n:14, name:'DamperForceState',          description:'Status wymuszonej pracy przepustnicy (1=nieaktywny, 2=aktywny)', description_en:'Forced damper state (1=inactive, 2=active)' },
          { n:15, name:'AFStateWerehouse',          description:'Ochrona przed zamrożeniem — pomieszczenie', description_en:'Warehouse antifreeze protection' },
          { n:16, name:'AFStateWaterEchx',          description:'Ochrona przed zamrożeniem — wymiennik', description_en:'Heat exchanger antifreeze protection' },
          { n:17, name:'FilterWorkTime',            description:'Czas pracy filtrów (x5 min)', description_en:'Filter operating time (x5 min)' },
          { n:18, name:'FilterPreasureSwitchState', description:'Status presostatu filtra (0=brak, 1=czysty, 2=zabrudzony)', description_en:'Filter pressure switch state (0=none, 1=clean, 2=dirty)' },
          { n:19, name:'FanECConnectStat',          description:'Podłączenie wentylatora EC (0=nie, 1=tak)', description_en:'EC fan connection (0=no, 1=yes)' },
          { n:20, name:'FuseStateRoof',             description:'Zabezpieczenie wentylatora dachowego (1=sprawny, 2=uszkodzony)', description_en:'Roof fan fuse state (1=OK, 2=blown)' },
          { n:21, name:'FuseStateEC',               description:'Zabezpieczenie wentylatora EC (1=sprawny, 2=uszkodzony)', description_en:'EC fan fuse state (1=OK, 2=blown)' },
          { n:22, name:'FuseState3V',               description:'Zabezpieczenie wentylatora AC (1=sprawny, 2=uszkodzony)', description_en:'AC fan fuse state (1=OK, 2=blown)' },
          { n:23, name:'ValveStatus',               description:'Status zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)', description_en:'Valve state (0=standby, 1=open, 2=closed)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto, 3=manual, 4=wentylacja)', description_en:'Operating mode (1=OFF, 2=auto, 3=manual, 4=ventilation)' },
          { n:2,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)', description_en:'Warehouse antifreeze protection (1=active, 2=inactive)' },
          { n:3,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)', description_en:'Antifreeze threshold temperature (x0.1 °C)' },
          { n:4,  name:'DamperForceMode',             description:'Wymuszony tryb przepustnicy (1=wył, 2=wł)', description_en:'Forced damper mode (1=off, 2=on)' },
          { n:5,  name:'DamperForceTempRef',          description:'Temperatura progowa wymuszonego trybu przepustnicy (x0.1 °C)', description_en:'Forced damper temperature threshold (x0.1 °C)' },
          { n:6,  name:'DamperForcelevelRef',         description:'Położenie przepustnicy w trybie wymuszonym (0–100)', description_en:'Damper position in forced mode (0–100)' },
          { n:7,  name:'DamperLevelRef',              description:'Zadane położenie przepustnicy (0–100)', description_en:'Damper position setpoint (0–100)' },
          { n:8,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora', description_en:'Fan speed setpoint' },
          { n:9,  name:'FanroofForceEffRef',          description:'Offset wydajności wentylatora dachowego w trybie wymuszonym', description_en:'Roof fan speed offset in forced mode' },
          { n:10, name:'Tref',                        description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:11, name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:12, name:'TLeadSensorSelect',           description:'Wybór czujnika wiodącego (1=strefa, 3=T4)', description_en:'Lead sensor selection (1=zone, 3=T4)' },
          { n:13, name:'FanroofMode',                 description:'Tryb wentylatora dachowego (1=wentylator+przepustnica, 2=przepustnica)', description_en:'Roof fan mode (1=fan+damper, 2=damper only)' },
          { n:14, name:'FilterTimeCntRst',            description:'Reset licznika czasu pracy filtra (0=brak, 1=reset)', description_en:'Filter time counter reset (0=none, 1=reset)' },
          { n:15, name:'ThermostatmodeState',         description:'Tryb termostatyczny (1=wył, 2=wł)', description_en:'Thermostat mode (1=off, 2=on)' },
          { n:16, name:'ModeManual_FanEffRef',        description:'Zadana prędkość wentylatora w trybie termostatycznym', description_en:'Fan speed setpoint in thermostat mode' },
        ],
      },

      'LEO EC (DRV M)': {
        ir: [
          { n:1,  name:'Type',              description:'Typ urządzenia', description_en:'Device type' },
          { n:2,  name:'Ver',               description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',              description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'T3',                description:'Temperatura — czujnik T3 (x0.1 °C)', description_en:'Temperature — T3 sensor (x0.1 °C)' },
          { n:5,  name:'T4',                description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:6,  name:'FanSpeed',          description:'Prędkość wentylatora', description_en:'Fan speed' },
          { n:7,  name:'AFStateWarehouse',  description:'Ochrona przed zamrożeniem — pomieszczenie', description_en:'Warehouse antifreeze protection' },
          { n:8,  name:'AFStateWaterExch',  description:'Ochrona przed zamrożeniem — wymiennik', description_en:'Heat exchanger antifreeze protection' },
          { n:9,  name:'ValveStatus',       description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)', description_en:'Valve state (0=standby, 1=open, 2=closed)' },
          { n:10, name:'FuseStateRoof',     description:'Zabezpieczenie wentylatora dachowego', description_en:'Roof fan fuse state' },
          { n:11, name:'FuseStateEC',       description:'Zabezpieczenie wentylatora EC', description_en:'EC fan fuse state' },
          { n:12, name:'FuseState3V',       description:'Zabezpieczenie wentylatora AC', description_en:'AC fan fuse state' },
          { n:13, name:'DestStatus',        description:'Status destratyfikacji (0=aktywna, 1=nieaktywna)', description_en:'Destratification status (0=active, 1=inactive)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (0=OFF, 1=auto, 2=manual)', description_en:'Operating mode (0=OFF, 1=auto, 2=manual)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora (0–100)', description_en:'Fan speed setpoint (0–100)' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (0=strefa, 1=T4)', description_en:'Lead sensor selection (0=zone, 1=T4)' },
          { n:6,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)', description_en:'Warehouse antifreeze protection (1=active, 2=inactive)' },
          { n:7,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)', description_en:'Antifreeze threshold temperature (x0.1 °C)' },
          { n:8,  name:'DestTempRef',                 description:'Próg temperatury uruchomienia destratyfikacji (x0.1 °C)', description_en:'Destratification activation threshold (x0.1 °C)' },
          { n:9,  name:'DestModeForce',               description:'Wymuszenie destratyfikacji (1=brak, 2=wymuszona)', description_en:'Forced destratification (1=none, 2=forced)' },
          { n:10, name:'DestMode',                    description:'Tryb destratyfikacji (1=wył, 2=zależny, 3=niezależny)', description_en:'Destratification mode (1=off, 2=dependent, 3=independent)' },
          { n:11, name:'ModeAuto_FanEffRefMin',       description:'Min. wydajność wentylatora w trybie Auto (0–100)', description_en:'Min. fan speed in Auto mode (0–100)' },
          { n:12, name:'ModeAuto_FanEffRefMax',       description:'Max. wydajność wentylatora w trybie Auto (0–100)', description_en:'Max. fan speed in Auto mode (0–100)' },
          { n:13, name:'ModeManual_FanEffRef',        description:'Wydajność wentylatora w trybie Manual (0–100)', description_en:'Fan speed in Manual mode (0–100)' },
        ],
      },

      'CUBE (DRV CUBE)': {
        ir: [
          { n:1,  name:'Type',                        description:'Typ urządzenia (wartość: 13)', description_en:'Device type (value: 13)' },
          { n:2,  name:'T1',                          description:'Temperatura — czujnik T1 (x0.1 °C)', description_en:'Temperature — T1 sensor (x0.1 °C)' },
          { n:3,  name:'Zone',                        description:'Przypisana strefa', description_en:'Assigned zone' },
          { n:4,  name:'T3',                          description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)', description_en:'Supply air temperature — T3 sensor (x0.1 °C)' },
          { n:5,  name:'Return_temp_value',           description:'Temperatura wyciągu (x0.1 °C)', description_en:'Return air temperature (x0.1 °C)' },
          { n:6,  name:'T5',                          description:'Temperatura — czujnik T5 (x0.1 °C)', description_en:'Temperature — T5 sensor (x0.1 °C)' },
          { n:7,  name:'T4',                          description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:8,  name:'T4Rel',                       description:'Status czujnika T4', description_en:'T4 sensor status' },
          { n:9,  name:'Recirculation_damper_level',  description:'Położenie przepustnicy recyrkulacji (0–100)', description_en:'Recirculation damper position (0–100)' },
          { n:10, name:'Swirl_diffuser_position',     description:'Położenie nawiewnika (0–100)', description_en:'Swirl diffuser position (0–100)' },
          { n:11, name:'Fan_supply_flow',             description:'Wydajność wentylatora nawiewu (0–65535)', description_en:'Supply fan flow (0–65535)' },
          { n:12, name:'CO2_stage',                   description:'Sygnalizacja CO2 (0=poniżej, 1=próg1, 2=próg2)', description_en:'CO2 signal (0=below, 1=threshold1, 2=threshold2)' },
          { n:13, name:'Rooftop_work_mode',           description:'Tryb pracy (0=null, 1=wentylacja, 2=grzanie, 3=odzysk, 4=chłodz, 5=odzysk chłodu)', description_en:'Operating mode (0=null, 1=ventilation, 2=heating, 3=recovery, 4=cooling, 5=cool recovery)' },
          { n:14, name:'Rooftop_current_work_mode',   description:'Aktualny tryb pracy (szczegółowy)', description_en:'Current operating mode (detailed)' },
          { n:15, name:'ValvAct_Cooling',             description:'Sygnał sterujący chłodzeniem (0–100)', description_en:'Cooling control signal (0–100)' },
          { n:16, name:'ValvAct_Heating',             description:'Sygnał sterujący grzaniem (0–100)', description_en:'Heating control signal (0–100)' },
          { n:17, name:'RTCscdHtg',                   description:'Zapotrzebowanie na grzanie — wyjście regulatora (0–100)', description_en:'Heating demand — controller output (0–100)' },
          { n:18, name:'RTCscdClg',                   description:'Zapotrzebowanie na chłodzenie — wyjście regulatora (0–100)', description_en:'Cooling demand — controller output (0–100)' },
          { n:19, name:'RTAlm',                       description:'Alarm CUBE (0=brak, 1=filtr, 2=wyłączone podzespoły, 3=wyłączenie, 4=natychmiastowe wyłączenie)', description_en:'CUBE alarm (0=none, 1=filter, 2=components off, 3=shutdown, 4=immediate shutdown)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',       description:'Tryb pracy (0=OFF, 1=auto, 2=manual/standby)', description_en:'Operating mode (0=OFF, 1=auto, 2=manual/standby)' },
          { n:2,  name:'StpFlow_Cmfrt',  description:'Zadana wydajność wentylatora — tryb Komfort (0–100)', description_en:'Fan flow setpoint — Comfort mode (0–100)' },
          { n:3,  name:'StpFlow_Rem1',   description:'Zadana wydajność — wejście Rem1 (x0.1)', description_en:'Flow setpoint — Rem1 input (x0.1)' },
          { n:4,  name:'StpFlow_Rem2',   description:'Zadana wydajność — wejście Rem2 (x0.1)', description_en:'Flow setpoint — Rem2 input (x0.1)' },
          { n:5,  name:'StpRec_Mode',    description:'Tryb przepustnicy (0=auto, 1=manual)', description_en:'Recirculation damper mode (0=auto, 1=manual)' },
          { n:6,  name:'StpRec_Man',     description:'Zadany poziom recyrkulacji w trybie Manual (0–100)', description_en:'Recirculation setpoint in Manual mode (0–100)' },
          { n:7,  name:'StpRecStptRem1', description:'Zadany poziom recyrkulacji — Rem1 (0–100)', description_en:'Recirculation setpoint — Rem1 (0–100)' },
          { n:8,  name:'StpRecStptRem2', description:'Zadany poziom recyrkulacji — Rem2 (0–100)', description_en:'Recirculation setpoint — Rem2 (0–100)' },
          { n:9,  name:'StpDfsrMode',    description:'Tryb nawiewnika (0=auto, 1=manual)', description_en:'Swirl diffuser mode (0=auto, 1=manual)' },
          { n:10, name:'StpDfsrMan',     description:'Położenie nawiewnika w trybie Manual (0–100)', description_en:'Diffuser position in Manual mode (0–100)' },
          { n:11, name:'StpDfsrHtg',     description:'Zadane położenie nawiewnika — sekwencja grzania (0–100)', description_en:'Diffuser setpoint — heating sequence (0–100)' },
          { n:12, name:'StpDfsrClg',     description:'Zadane położenie nawiewnika — sekwencja chłodzenia (0–100)', description_en:'Diffuser setpoint — cooling sequence (0–100)' },
          { n:13, name:'Tref',           description:'Temperatura zadana (x0.1 °C, zakres 50–450)', description_en:'Target temperature (x0.1 °C, range 50–450)' },
          { n:14, name:'Reserved',       description:'Zarezerwowane', description_en:'Reserved' },
          { n:15, name:'Reserved',       description:'Zarezerwowane', description_en:'Reserved' },
          { n:16, name:'AlmAck',         description:'Potwierdzenie alarmów (0=brak, 1=potwierdź)', description_en:'Alarm acknowledgement (0=none, 1=acknowledge)' },
          { n:17, name:'StdByDB',        description:'Histereza dla trybu StandBy (x0.1 °C)', description_en:'StandBy mode deadband (x0.1 °C)' },
          { n:18, name:'Reserved',       description:'Zarezerwowane', description_en:'Reserved' },
          { n:19, name:'Reserved',       description:'Zarezerwowane', description_en:'Reserved' },
          { n:20, name:'Reserved',       description:'Zarezerwowane', description_en:'Reserved' },
          { n:21, name:'Reserved',       description:'Zarezerwowane', description_en:'Reserved' },
          { n:22, name:'Reserved',       description:'Zarezerwowane', description_en:'Reserved' },
          { n:23, name:'StdByMode',      description:'Rodzaj trybu StandBy (1=termostatyczny, 2=Night Cool)', description_en:'StandBy mode type (1=thermostat, 2=Night Cool)' },
          { n:24, name:'SlaveAdrs',      description:'Adres Modbus urządzenia CUBE (1–31)', description_en:'CUBE Modbus address (1–31)' },
          { n:25, name:'Reset',          description:'Reset urządzenia CUBE (0=brak, 1=reset)', description_en:'CUBE device reset (0=none, 1=reset)' },
        ],
      },

      'LEO AC (DRV V)': {
        ir: [
          { n:1,  name:'Type',              description:'Typ urządzenia (wartość: 5)', description_en:'Device type (value: 5)' },
          { n:2,  name:'Ver',               description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',              description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'UnderCeilling',     description:'Temperatura przy suficie — czujnik T3 (x0.1 °C)', description_en:'Ceiling temperature — T3 sensor (x0.1 °C)' },
          { n:5,  name:'T4',                description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:6,  name:'FanSpeed',          description:'Prędkość wentylatora', description_en:'Fan speed' },
          { n:7,  name:'ValveStatus',       description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)', description_en:'Valve state (0=standby, 1=open, 2=closed)' },
          { n:8,  name:'AFStateWarehouse',  description:'Ochrona przed zamrożeniem — pomieszczenie', description_en:'Warehouse antifreeze protection' },
          { n:9,  name:'AFStateWaterExch',  description:'Ochrona przed zamrożeniem — wymiennik', description_en:'Heat exchanger antifreeze protection' },
          { n:10, name:'FuseStateRoof',     description:'Zabezpieczenie wentylatora dachowego', description_en:'Roof fan fuse state' },
          { n:11, name:'FuseStateEC',       description:'Zabezpieczenie wentylatora EC', description_en:'EC fan fuse state' },
          { n:12, name:'FuseState3V',       description:'Zabezpieczenie wentylatora AC', description_en:'AC fan fuse state' },
          { n:13, name:'DestStatus',        description:'Status destratyfikacji (1=nieaktywna, 2=aktywna)', description_en:'Destratification status (1=inactive, 2=active)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto grz, 3=manual grz, 4=auto chł, 5=manual chł, 6=wentylacja)', description_en:'Operating mode (1=OFF, 2=auto heat, 3=manual heat, 4=auto cool, 5=manual cool, 6=ventilation)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora', description_en:'Fan speed setpoint' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)', description_en:'Lead sensor selection (1=zone, 3=T4)' },
          { n:6,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)', description_en:'Warehouse antifreeze protection (1=active, 2=inactive)' },
          { n:7,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)', description_en:'Antifreeze threshold temperature (x0.1 °C)' },
          { n:8,  name:'DestTempRef',                 description:'Próg temperatury destratyfikacji (x0.1 °C)', description_en:'Destratification threshold temperature (x0.1 °C)' },
          { n:9,  name:'DestModeForce',               description:'Wymuszenie destratyfikacji (1=brak, 2=wymuszona)', description_en:'Forced destratification (1=none, 2=forced)' },
          { n:10, name:'DestMode',                    description:'Tryb destratyfikacji (1=wył, 2=zależny, 3=niezależny)', description_en:'Destratification mode (1=off, 2=dependent, 3=independent)' },
          { n:11, name:'ModeAuto_FanEffRefMin',       description:'Min. wydajność wentylatora w trybie Auto (0–100)', description_en:'Min. fan speed in Auto mode (0–100)' },
          { n:12, name:'ModeAuto_FanEffRefMax',       description:'Max. wydajność wentylatora w trybie Auto (0–100)', description_en:'Max. fan speed in Auto mode (0–100)' },
          { n:13, name:'ModeManual_FanEffRef',        description:'Wydajność wentylatora w trybie Manual (0–100)', description_en:'Fan speed in Manual mode (0–100)' },
        ],
      },

      'LEO EL (DRV EL)': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 6)', description_en:'Device type (value: 6)' },
          { n:2,  name:'Ver',                   description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',                  description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'UnderLeilling',         description:'Temperatura przy suficie — czujnik T3 (x0.1 °C)', description_en:'Ceiling temperature — T3 sensor (x0.1 °C)' },
          { n:5,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:6,  name:'FanSpeed',              description:'Prędkość wentylatora', description_en:'Fan speed' },
          { n:7,  name:'AFStateWarehouse',      description:'Ochrona przed zamrożeniem — pomieszczenie', description_en:'Warehouse antifreeze protection' },
          { n:8,  name:'FuseStateRoof',         description:'Zabezpieczenie wentylatora dachowego', description_en:'Roof fan fuse state' },
          { n:9,  name:'FuseStateEC',           description:'Zabezpieczenie wentylatora EC', description_en:'EC fan fuse state' },
          { n:10, name:'FuseState3V',           description:'Zabezpieczenie wentylatora AC', description_en:'AC fan fuse state' },
          { n:11, name:'DestStatus',            description:'Status destratyfikacji', description_en:'Destratification status' },
          { n:12, name:'ElectricHeaterType',    description:'Typ nagrzewnicy (1=LEO EL S — 2 stopnie, 2=LEO EL L — 3 stopnie)', description_en:'Heater type (1=LEO EL S — 2 stages, 2=LEO EL L — 3 stages)' },
          { n:13, name:'ThermalContactState',   description:'Status TK (1=alarm, 2=brak alarmu)', description_en:'Thermal contact state (1=alarm, 2=no alarm)' },
          { n:14, name:'PTCHeaterPowerState',   description:'Aktualna moc nagrzewnicy (1=wył, 2=stopień1, 3=stopień2, 4=stopień3)', description_en:'Current heater power (1=off, 2=stage1, 3=stage2, 4=stage3)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto, 3=manual, 4=wentylacja)', description_en:'Operating mode (1=OFF, 2=auto, 3=manual, 4=ventilation)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora', description_en:'Fan speed setpoint' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)', description_en:'Lead sensor selection (1=zone, 3=T4)' },
          { n:6,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)', description_en:'Warehouse antifreeze protection (1=active, 2=inactive)' },
          { n:7,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)', description_en:'Antifreeze threshold temperature (x0.1 °C)' },
          { n:8,  name:'DestTempRef',                 description:'Próg temperatury destratyfikacji (x0.1 °C)', description_en:'Destratification threshold temperature (x0.1 °C)' },
          { n:9,  name:'DestModeForce',               description:'Wymuszenie destratyfikacji (1=brak, 2=wymuszona)', description_en:'Forced destratification (1=none, 2=forced)' },
          { n:10, name:'DestMode',                    description:'Tryb destratyfikacji (1=wył, 2=zależny, 3=niezależny)', description_en:'Destratification mode (1=off, 2=dependent, 3=independent)' },
          { n:11, name:'ModeManual_FanEffRef',        description:'Zadana wydajność wentylatora w trybie Manual', description_en:'Fan speed setpoint in Manual mode' },
          { n:12, name:'ElectricHeaterPTCPower',      description:'Moc nagrzewnicy (1=wył, 2=stopień1, 3=stopień2, 4=stopień3)', description_en:'Heater power (1=off, 2=stage1, 3=stage2, 4=stage3)' },
          { n:13, name:'ModeAuto_FanEffRef',          description:'Min. wydajność wentylatora w trybie Auto', description_en:'Min. fan speed in Auto mode' },
        ],
      },

      'LEO COOL (DRV COOL)': {
        ir: [
          { n:1,  name:'Type',              description:'Typ urządzenia (wartość: 7)', description_en:'Device type (value: 7)' },
          { n:2,  name:'Ver',               description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',              description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'T4',                description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:5,  name:'FanSpeed',          description:'Prędkość wentylatora (x1)', description_en:'Fan speed (x1)' },
          { n:6,  name:'ValveStatus',       description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)', description_en:'Valve state (0=standby, 1=open, 2=closed)' },
          { n:7,  name:'AFStateWaterExch',  description:'Ochrona przed zamrożeniem — wymiennik', description_en:'Heat exchanger antifreeze protection' },
          { n:8,  name:'AFStateWarehouse',  description:'Ochrona przed zamrożeniem — pomieszczenie', description_en:'Warehouse antifreeze protection' },
          { n:9,  name:'FuseStateRoof',     description:'Zabezpieczenie wentylatora dachowego', description_en:'Roof fan fuse state' },
          { n:10, name:'FuseStateEC',       description:'Zabezpieczenie wentylatora EC', description_en:'EC fan fuse state' },
          { n:11, name:'FuseState3V',       description:'Zabezpieczenie wentylatora AC', description_en:'AC fan fuse state' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto grz, 3=manual grz, 4=auto chł, 5=manual chł, 6=wentylacja)', description_en:'Operating mode (1=OFF, 2=auto heat, 3=manual heat, 4=auto cool, 5=manual cool, 6=ventilation)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora', description_en:'Fan speed setpoint' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)', description_en:'Lead sensor selection (1=zone, 3=T4)' },
          { n:6,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)', description_en:'Warehouse antifreeze protection (1=active, 2=inactive)' },
          { n:7,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)', description_en:'Antifreeze threshold temperature (x0.1 °C)' },
          { n:8,  name:'Reserved',                    description:'Zarezerwowane', description_en:'Reserved' },
          { n:9,  name:'ModeAuto_FanEffRefMax',       description:'Max. wydajność wentylatora w trybie Auto (0–100)', description_en:'Max. fan speed in Auto mode (0–100)' },
          { n:10, name:'ModeManual_FanEffRef',        description:'Zadana wydajność wentylatora w trybie Manual (0–100)', description_en:'Fan speed setpoint in Manual mode (0–100)' },
        ],
      },

      'ROBUR R KM NEXT (DRV R KM NEXT)': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 8)', description_en:'Device type (value: 8)' },
          { n:2,  name:'Ver',                   description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',                  description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'T1',                    description:'Temperatura świeżego powietrza — czujnik T1 (x0.1 °C)', description_en:'Fresh air temperature — T1 sensor (x0.1 °C)' },
          { n:5,  name:'T3',                    description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)', description_en:'Supply air temperature — T3 sensor (x0.1 °C)', description_en:'Exhaust air temperature — T3 sensor (x0.1 °C)' },
          { n:6,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:7,  name:'T5',                    description:'Temperatura powrotu wody — czujnik T5 (x0.1 °C)', description_en:'Return water temperature — T5 sensor (x0.1 °C)' },
          { n:8,  name:'AFStateWarehouse',      description:'Ochrona przed zamrożeniem — pomieszczenie', description_en:'Warehouse antifreeze protection' },
          { n:9,  name:'FuseStateRoof',         description:'Zabezpieczenie wentylatora dachowego', description_en:'Roof fan fuse state' },
          { n:10, name:'ExternalGasDetectTH1',  description:'Detektor gazu — próg 1', description_en:'Gas detector — threshold 1' },
          { n:11, name:'ExternalGasDetectTH2',  description:'Detektor gazu — próg 2', description_en:'Gas detector — threshold 2' },
          { n:12, name:'GasAlarmState',         description:'Status zasilania gazem (2=brak alarmu, 1=alarm)', description_en:'Gas supply status (2=no alarm, 1=alarm)' },
          { n:13, name:'STBAlarmState',         description:'Status czujnika STB (2=brak alarmu, 1=alarm)', description_en:'STB sensor status (2=no alarm, 1=alarm)' },
          { n:14, name:'FilterWorkTime',        description:'Czas pracy filtra (x5 min)', description_en:'Filter operating time (x5 min)' },
          { n:15, name:'FanRoofTK',             description:'Zabezpieczenie termiczne wentylatora dachowego', description_en:'Roof fan thermal protection' },
          { n:16, name:'FanRoofEff',            description:'Prędkość wentylatora dachowego (0–100)', description_en:'Roof fan speed (0–100)' },
          { n:17, name:'DamperLevel',           description:'Położenie przepustnicy (0–100)', description_en:'Damper position (0–100)' },
          { n:18, name:'DamperFroceState',      description:'Status wymuszonego trybu przepustnicy', description_en:'Forced damper mode status' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto, 3=manual, 4=wentylacja)', description_en:'Operating mode (1=OFF, 2=auto, 3=manual, 4=ventilation)' },
          { n:2,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:3,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:4,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (x0.1)', description_en:'Lead sensor selection (x0.1)' },
          { n:5,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)', description_en:'Warehouse antifreeze protection (1=active, 2=inactive)' },
          { n:6,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)', description_en:'Antifreeze threshold temperature (x0.1 °C)' },
          { n:7,  name:'ModeManual_FanEffRef',        description:'Wydajność wentylatora w trybie Manual', description_en:'Fan speed in Manual mode' },
          { n:8,  name:'GasAlarmReset',               description:'Reset alarmu palnika (0=brak, 1=reset)', description_en:'Burner alarm reset (0=none, 1=reset)' },
          { n:9,  name:'STBTemperatuureAlarmOn',      description:'Temperatura progowa alarmu STB — aktywacja (x0.1 °C)', description_en:'STB alarm activation threshold (x0.1 °C)' },
          { n:10, name:'STBTemperatuureAlarmOff',     description:'Temperatura progowa alarmu STB — dezaktywacja (x0.1 °C)', description_en:'STB alarm deactivation threshold (x0.1 °C)' },
          { n:11, name:'FilterTimeCntRst',            description:'Reset licznika filtra (0=brak, 1=reset)', description_en:'Filter counter reset (0=none, 1=reset)' },
          { n:12, name:'STBAlarmReset',               description:'Reset alarmu STB (0=brak, 1=reset)', description_en:'STB alarm reset (0=none, 1=reset)' },
          { n:13, name:'GasBurnerLvlRef',             description:'Zadana moc palnika (1=stopień1, 2=stopień2)', description_en:'Burner power setpoint (1=stage1, 2=stage2)' },
          { n:14, name:'DamperForceMode',             description:'Wymuszony tryb przepustnicy (0=wył, 1=wł)', description_en:'Forced damper mode (0=off, 1=on)' },
          { n:15, name:'DamperForceTempRef',          description:'Temperatura progowa wymuszonego trybu przepustnicy (x0.1 °C)', description_en:'Forced damper temperature threshold (x0.1 °C)' },
          { n:16, name:'DamperForcelevelRef',         description:'Położenie przepustnicy w trybie wymuszonym (0–100)', description_en:'Damper position in forced mode (0–100)' },
          { n:17, name:'DamperLevelRef',              description:'Zadane położenie przepustnicy (0–100)', description_en:'Damper position setpoint (0–100)' },
          { n:18, name:'DamperContLevelRef',          description:'Zadane położenie przepustnicy po osiągnięciu parametrów (0–100)', description_en:'Damper position after reaching setpoint (0–100)' },
          { n:19, name:'FanroofForceEffRef',          description:'Offset wydajności wentylatora dachowego w trybie wymuszonym', description_en:'Roof fan speed offset in forced mode' },
          { n:20, name:'FanroofMode',                 description:'Tryb wentylatora dachowego (0=wentylator+przepustnica, 1=przepustnica)', description_en:'Roof fan mode (0=fan+damper, 1=damper only)' },
        ],
      },

      'ROBUR R NEXT (DRV R NEXT)': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 9)', description_en:'Device type (value: 9)' },
          { n:2,  name:'Ver',                   description:'Wersja oprogramowania', description_en:'Firmware version' },
          { n:3,  name:'Zone',                  description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'T3',                    description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)', description_en:'Supply air temperature — T3 sensor (x0.1 °C)', description_en:'Exhaust air temperature — T3 sensor (x0.1 °C)' },
          { n:5,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:6,  name:'AFStateWarehouse',      description:'Ochrona przed zamrożeniem — pomieszczenie', description_en:'Warehouse antifreeze protection' },
          { n:7,  name:'FuseStateRoof',         description:'Zabezpieczenie wentylatora dachowego', description_en:'Roof fan fuse state' },
          { n:8,  name:'ExternalGasDetectTH1',  description:'Detektor gazu — próg 1', description_en:'Gas detector — threshold 1' },
          { n:9,  name:'ExternalGasDetectTH2',  description:'Detektor gazu — próg 2', description_en:'Gas detector — threshold 2' },
          { n:10, name:'GasAlarmState',         description:'Status zasilania gazem (2=brak alarmu, 1=alarm)', description_en:'Gas supply status (2=no alarm, 1=alarm)' },
          { n:11, name:'STBAlarmState',         description:'Status czujnika STB (2=brak alarmu, 1=alarm)', description_en:'STB sensor status (2=no alarm, 1=alarm)' },
          { n:12, name:'FilterWorkTime',        description:'Czas pracy filtra (x5 min)', description_en:'Filter operating time (x5 min)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto, 3=manual, 4=wentylacja)', description_en:'Operating mode (1=OFF, 2=auto, 3=manual, 4=ventilation)' },
          { n:2,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)', description_en:'Target temperature (x0.1 °C)' },
          { n:3,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:4,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (x0.1)', description_en:'Lead sensor selection (x0.1)' },
          { n:5,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)', description_en:'Warehouse antifreeze protection (1=active, 2=inactive)' },
          { n:6,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)', description_en:'Antifreeze threshold temperature (x0.1 °C)' },
          { n:7,  name:'ModeManual_FanEffRef',        description:'Wydajność wentylatora w trybie Manual', description_en:'Fan speed in Manual mode' },
          { n:8,  name:'GasAlarmReset',               description:'Reset alarmu palnika (2=brak, 1=reset)', description_en:'Burner alarm reset (2=none, 1=reset)' },
          { n:9,  name:'STBTemperatuureAlarmOn',      description:'Temperatura progowa alarmu STB — aktywacja (x0.1 °C)', description_en:'STB alarm activation threshold (x0.1 °C)' },
          { n:10, name:'STBTemperatuureAlarmOff',     description:'Temperatura progowa alarmu STB — dezaktywacja (x0.1 °C)', description_en:'STB alarm deactivation threshold (x0.1 °C)' },
          { n:11, name:'FilterTimeCntRst',            description:'Reset licznika filtra (0=brak, 1=reset)', description_en:'Filter counter reset (0=none, 1=reset)' },
          { n:12, name:'STBAlarmReset',               description:'Reset alarmu STB (1=reset, 2=brak)', description_en:'STB alarm reset (1=reset, 2=none)' },
          { n:13, name:'GasBurnerLvlRef',             description:'Zadana moc palnika (1=stopień1, 2=stopień2)', description_en:'Burner power setpoint (1=stage1, 2=stage2)' },
        ],
      },

      'LUNA (DRV LUNA)': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 14)', description_en:'Device type (value: 14)' },
          { n:2,  name:'Hardware',              description:'Wersja hardware', description_en:'Hardware version' },
          { n:3,  name:'Zone',                  description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:4,  name:'Software',              description:'Wersja software', description_en:'Software version' },
          { n:5,  name:'Ver',                   description:'Wersja oprogramowania DRV', description_en:'DRV firmware version' },
          { n:6,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:7,  name:'LeadingTemp',           description:'Temperatura z czujnika wiodącego (x0.1 °C)', description_en:'Lead sensor temperature (x0.1 °C)' },
          { n:8,  name:'T2',                    description:'Temperatura — czujnik T2 (x0.1 °C)', description_en:'Temperature — T2 sensor (x0.1 °C)' },
          { n:9,  name:'T3',                    description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)', description_en:'Supply air temperature — T3 sensor (x0.1 °C)', description_en:'Exhaust air temperature — T3 sensor (x0.1 °C)' },
          { n:10, name:'T5',                    description:'Temperatura — czujnik T5 (x0.1 °C)', description_en:'Temperature — T5 sensor (x0.1 °C)' },
          { n:11, name:'FanSpeed',              description:'Prędkość wentylatora (0–100)', description_en:'Fan speed (0–100)' },
          { n:12, name:'CondensatePompAlarm',   description:'Alarm pompki kondensatu (0=brak, 1=alarm)', description_en:'Condensate pump alarm (0=none, 1=alarm)' },
          { n:13, name:'FilterOperationTime',   description:'Czas pracy filtrów (x5 min)', description_en:'Filter operating time (x5 min)' },
          { n:14, name:'ValvAct_Heating',       description:'Sygnał sterujący grzania (0–1000 → 0–100%)', description_en:'Heating control signal (0–1000 → 0–100%)' },
          { n:15, name:'ValvAct_Cooling',       description:'Sygnał sterujący chłodzenia (0–1000 → 0–100%)', description_en:'Cooling control signal (0–1000 → 0–100%)' },
        ],
        hr: [
          { n:1,  name:'ON_OFF',                description:'Włączenie/wyłączenie urządzenia (0=OFF, 1=ON)', description_en:'Device on/off (0=OFF, 1=ON)' },
          { n:2,  name:'Tref',                  description:'Temperatura zadana (x0.1 °C, zakres 50–450)', description_en:'Target temperature (x0.1 °C, range 50–450)' },
          { n:3,  name:'WorkMode',              description:'Tryb pracy (x0.1 — 0=auto, 1=manual)', description_en:'Operating mode (x0.1 — 0=auto, 1=manual)' },
          { n:4,  name:'DestMode',              description:'Destratyfikacja (1=wył, 2=wł)', description_en:'Destratification (1=off, 2=on)' },
          { n:5,  name:'TLeadSensorSelect',     description:'Wybór czujnika wiodącego (0=czerpnia, 1=strefa, 2=nawiew, 3=pomieszczenie)', description_en:'Lead sensor selection (0=intake, 1=zone, 2=supply, 3=room)' },
          { n:6,  name:'LowCeiling',            description:'Tryb niskiego sufitu (0=wył, 1=wł)', description_en:'Low ceiling mode (0=off, 1=on)' },
          { n:7,  name:'NozzleManual',          description:'Położenie dyszy — tryb manual (0–100%)', description_en:'Nozzle position — manual mode (0–100%)' },
          { n:8,  name:'Preheat',               description:'Funkcja PREHEAT (0=wył, 1=wł)', description_en:'PREHEAT function (0=off, 1=on)' },
          { n:9,  name:'FanEffRef',             description:'Prędkość wentylatora (200–1000 → 20–100%)', description_en:'Fan speed setpoint (200–1000 → 20–100%)' },
          { n:10, name:'ModeManual_FanEffRef',  description:'Prędkość wentylatora w trybie manual (200–1000)', description_en:'Fan speed in manual mode (200–1000)' },
          { n:11, name:'DestTempRef',           description:'Min. różnica temperatur dla destratyfikacji (20–60 → 2.0–6.0 K)', description_en:'Min. temperature difference for destratification (20–60 → 2.0–6.0 K)' },
          { n:12, name:'PreheatTemp',           description:'Temperatura uruchomienia nawiewu w trybie PREHEAT (280–370 → 28–37 °C)', description_en:'Fan start temperature in PREHEAT mode (280–370 → 28–37 °C)' },
          { n:13, name:'DI_Active',             description:'Zezwolenie na pracę — CONTACT DI (0=nieaktywne, 1=NC, 2=NO)', description_en:'Enable operation — CONTACT DI (0=inactive, 1=NC, 2=NO)' },
          { n:14, name:'DestFanSpeed',          description:'Prędkość wentylatora w trybie destratyfikacji (400–1000)', description_en:'Fan speed in destratification mode (400–1000)' },
          { n:15, name:'LowCeilingFanSpeed',    description:'Prędkość wentylatora w trybie niskiego sufitu (0–1000)', description_en:'Fan speed in low ceiling mode (0–1000)' },
          { n:16, name:'LowCeilingFanLimitLOW', description:'Min. prędkość wentylatora — tryb niskiego sufitu (0–1000)', description_en:'Min. fan speed in low ceiling mode (0–1000)' },
          { n:17, name:'LowCeilingFanLimitHIGH',description:'Max. prędkość wentylatora — tryb niskiego sufitu (0–1000)', description_en:'Max. fan speed in low ceiling mode (0–1000)' },
        ],
      },

      'OXEN (DRV OXEN)': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 666)', description_en:'Device type (value: 666)' },
          { n:2,  name:'Zone',                  description:'Przypisana strefa (1–6)', description_en:'Assigned zone (1–6)', description_en:'Assigned zone (1\u20136)' },
          { n:3,  name:'T1',                    description:'Temperatura — czujnik T1 (x0.1 °C)', description_en:'Temperature — T1 sensor (x0.1 °C)' },
          { n:4,  name:'T2',                    description:'Temperatura — czujnik T2 (x0.1 °C)', description_en:'Temperature — T2 sensor (x0.1 °C)' },
          { n:5,  name:'T3',                    description:'Temperatura — czujnik T3 (x0.1 °C)', description_en:'Temperature — T3 sensor (x0.1 °C)' },
          { n:6,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)', description_en:'Room temperature — T4 sensor (x0.1 °C)' },
          { n:7,  name:'T5',                    description:'Temperatura — czujnik T5 (x0.1 °C)', description_en:'Temperature — T5 sensor (x0.1 °C)' },
          { n:8,  name:'FansEff1',              description:'Prędkość wentylatorów nawiewu (x0.1, 0–100)', description_en:'Supply fan speed (x0.1, 0–100)' },
          { n:9,  name:'FansEff2',              description:'Prędkość wentylatorów wyciągu (0–100)', description_en:'Exhaust fan speed (0–100)' },
          { n:10, name:'ValveStatus',           description:'Stan zaworu (0=stand-by, 1=otwarty, 2=zamknięty)', description_en:'Valve state (0=standby, 1=open, 2=closed)' },
          { n:11, name:'AFStateWaterExch',      description:'Ochrona przed zamrożeniem wymiennika (0=normalna, 1=aktywna)', description_en:'Heat exchanger antifreeze protection (0=normal, 1=active)' },
          { n:12, name:'ExternalGasDetectTH1',  description:'Detektor gazu — próg 1', description_en:'Gas detector — threshold 1' },
          { n:13, name:'ExternalGasDetectTH2',  description:'Detektor gazu — próg 2', description_en:'Gas detector — threshold 2' },
          { n:14, name:'FilterWorkTime',        description:'Czas pracy filtrów (x5 min)', description_en:'Filter operating time (x5 min)' },
          { n:15, name:'OxenWorkMode',          description:'Tryb pracy (0=OFF, 1=auto, 2=zima, 3=lato)', description_en:'Operating mode (0=OFF, 1=auto, 2=winter, 3=summer)' },
          { n:16, name:'OxenType',              description:'Typ OXEN (1=zimny, 2=elektryczny, 3=wodny)', description_en:'OXEN type (1=cold, 2=electric, 3=water)' },
          { n:17, name:'AFCrossEx',             description:'Ochrona przed zamrożeniem — wymiennik krzyżowy (0=normalna, 1=aktywna)', description_en:'Cross exchanger antifreeze protection (0=normal, 1=active)' },
          { n:18, name:'OxenDamper',            description:'Status przepustnicy (0=zamknięta, 1=otwarta)', description_en:'Damper status (0=closed, 1=open)' },
          { n:19, name:'Bypass',                description:'Status przepustnicy By-pass (0=zamknięta, 1=otwarta)', description_en:'Bypass damper status (0=closed, 1=open)' },
          { n:20, name:'PTCHeaterPowerState',   description:'Status nagrzewnicy PTC (0=wył, 1=stopień1, 2=stopień2, 3=stopień3)', description_en:'PTC heater power state (0=off, 1=stage1, 2=stage2, 3=stage3)' },
          { n:21, name:'ThermalContactState',   description:'Status TK (0=normalna praca, 1=aktywne zabezpieczenie)', description_en:'Thermal contact state (0=normal, 1=protection active)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',          description:'Tryb pracy (0=OFF, 1=auto, 2=zima, 3=lato)', description_en:'Operating mode (0=OFF, 1=auto, 2=winter, 3=summer)' },
          { n:2,  name:'Tref FanEffRef',    description:'Zadana prędkość wentylatora (0–100)', description_en:'Fan speed setpoint (0–100)' },
          { n:3,  name:'TLeadVal',          description:'Wartość temperatury wiodącej (x0.1 °C)', description_en:'Lead temperature value (x0.1 °C)' },
          { n:4,  name:'TLeadSenorSelect',  description:'Wybór czujnika wiodącego (1=strefa, 2=nawiew, 3=pomieszczenie)', description_en:'Lead sensor selection (1=zone, 2=supply, 3=room)' },
          { n:5,  name:'FilterTimeCntRst',  description:'Reset licznika filtra (0=brak, 1=reset)', description_en:'Filter counter reset (0=none, 1=reset)' },
          { n:6,  name:'FanEffRef_1',       description:'Zadana prędkość wentylatorów nawiewu (0–100)', description_en:'Supply fan speed setpoint (0–100)' },
          { n:7,  name:'FanEffRef_2',       description:'Zadana prędkość wentylatorów wyciągu (x0.1, 0–100)', description_en:'Exhaust fan speed setpoint (x0.1, 0–100)' },
          { n:8,  name:'WorkState',         description:'Status pracy (0=OFF, 1/2/3=ON)', description_en:'Work state (0=OFF, 1/2/3=ON)' },
          { n:9,  name:'ElectricWorkMode',  description:'Zadany tryb pracy nagrzewnicy', description_en:'Electric heater operating mode setpoint' },
        ],
      },

    }, // koniec devices

  }, // koniec MBOX

  // ---- HMI Wi-Fi AC — termostat FCU Series (Modbus RTU) ----

  HMI_WIFI_AC: {
    regs: [
      { addr: 0,  rw: 'R/W', name: 'OnOffFlag',
        description:    'Włączenie/wyłączenie termostatu.',
        description_en: 'Thermostat on/off.',
        values:    { '0': 'OFF — wyłączony', '1': 'ON — włączony' },
        values_en: { '0': 'OFF — off',       '1': 'ON — on' } },

      { addr: 1,  rw: 'RO',  name: 'RoomTempMeasurement',
        description:    'Pomiar temperatury pomieszczenia (×0,1 °C). Np. 215 = 21,5 °C.',
        description_en: 'Room temperature measurement (×0.1 °C). E.g. 215 = 21.5 °C.',
        min: 0, max: 500, unit: '×0.1 °C' },

      { addr: 2,  rw: 'R/W', name: 'SetTemperature',
        description:    'Nastawa temperatury setpoint (×0,1 °C). Np. 210 = 21,0 °C.',
        description_en: 'Temperature setpoint (×0.1 °C). E.g. 210 = 21.0 °C.',
        min: 50, max: 350, unit: '×0.1 °C' },

      { addr: 3,  rw: 'R/W', name: 'TemperatureCalibration',
        description:    'Kalibracja czujnika temperatury (×0,1 °C). Wartość dodatnia przesuwa pomiar w górę.',
        description_en: 'Temperature sensor calibration (×0.1 °C). Positive value shifts reading up.',
        min: -90, max: 90, unit: '×0.1 °C' },

      { addr: 4,  rw: 'R/W', name: 'WorkingMode',
        description:    'Tryb pracy termostatu.',
        description_en: 'Thermostat operating mode.',
        values:    { '0': 'Chłodzenie (Cooling)', '1': 'Grzanie (Heating)', '2': 'Wentylacja (Ventilation)' },
        values_en: { '0': 'Cooling',              '1': 'Heating',           '2': 'Ventilation' } },

      { addr: 5,  rw: 'R/W', name: 'SensorSelection',
        description:    'Wybór czujnika temperatury — wewnętrzny lub zewnętrzny NTC.',
        description_en: 'Temperature sensor selection — internal or external NTC.',
        values:    { '0': 'Wewnętrzny (Internal)', '1': 'Zewnętrzny (External / NTC)' },
        values_en: { '0': 'Internal',              '1': 'External / NTC' } },

      { addr: 6,  rw: 'RO',  name: 'OutputStatusFan',
        description:    'Aktualny bieg wentylatora — status wyjścia.',
        description_en: 'Current fan speed — output status.',
        values:    { '0': 'Fan OFF — wentylator wyłączony', '1': 'Low — bieg niski', '2': 'Medium — bieg średni', '3': 'High — bieg wysoki' },
        values_en: { '0': 'Fan OFF',                        '1': 'Low',              '2': 'Medium',               '3': 'High' } },

      { addr: 7,  rw: 'R/W', name: 'ButtonLock',
        description:    'Blokada przycisków (Child Lock). Opcjonalne — 0 jeśli funkcja niedostępna.',
        description_en: 'Button lock (Child Lock). Optional — 0 if function unavailable.',
        values:    { '0': 'Odblokowane', '1': 'Zablokowane' },
        values_en: { '0': 'Unlocked',    '1': 'Locked' } },

      { addr: 8,  rw: 'R/W', name: 'AntifreezeEnable',
        description:    'Włączenie funkcji przeciwzamrożeniowej.',
        description_en: 'Enable antifreeze function.',
        values:    { '0': 'Nieaktywna (Disable)', '1': 'Aktywna (Enable)' },
        values_en: { '0': 'Disabled',             '1': 'Enabled' } },

      { addr: 9,  rw: 'R/W', name: 'AntifreezeTemperature',
        description:    'Nastawa temperatury przeciwzamrożeniowej (×0,1 °C). Domyślnie: 80 = 8,0 °C.',
        description_en: 'Antifreeze temperature setpoint (×0.1 °C). Default: 80 = 8.0 °C.',
        min: 50, max: 100, unit: '×0.1 °C' },

      { addr: 10, rw: 'R/W', name: 'TimeSettingHour',
        description:    'Ustawienie czasu — godzina (format BCD, 00–23).',
        description_en: 'Time setting — hour (BCD format, 00–23).',
        min: 0, max: 23, unit: 'BCD' },

      { addr: 11, rw: 'R/W', name: 'TimeSettingMinute',
        description:    'Ustawienie czasu — minuta (format BCD, 00–59).',
        description_en: 'Time setting — minute (BCD format, 00–59).',
        min: 0, max: 59, unit: 'BCD' },

      { addr: 12, rw: 'R/W', name: 'TimeSettingWeekday',
        description:    'Ustawienie dnia tygodnia (format BCD). 01 = Poniedziałek, 07 = Niedziela.',
        description_en: 'Weekday setting (BCD format). 01 = Monday, 07 = Sunday.',
        min: 1, max: 7, unit: 'BCD' },

      { addr: 13, rw: 'R/W', name: 'C1C2',
        description:    'Tryb funkcji C1/C2 — termostatyczny lub ciągły.',
        description_en: 'C1/C2 function mode — thermostat or continuous.',
        values:    { '0': 'C1 — tryb termostatyczny', '1': 'C2 — tryb ciągły' },
        values_en: { '0': 'C1 — thermostat mode',     '1': 'C2 — continuous mode' } },

      { addr: 14, rw: 'R/W', name: 'FanSpeedSetting',
        description:    'Zadany bieg wentylatora.',
        description_en: 'Fan speed setpoint.',
        values:    { '0': 'Auto', '1': 'Low — bieg niski', '2': 'Medium — bieg średni', '3': 'High — bieg wysoki' },
        values_en: { '0': 'Auto', '1': 'Low',              '2': 'Medium',               '3': 'High' } },

      { addr: 15, rw: 'R/W', name: 'OperationMode',
        description:    'Tryb sterowania termostatem.',
        description_en: 'Thermostat control mode.',
        values:    { '0': 'Ręczny (Manual)',   '1': 'Automatyczny (Auto)', '2': 'Chwilowo ręczny (Temporary Manual)' },
        values_en: { '0': 'Manual',            '1': 'Auto',                '2': 'Temporary Manual' } },

      { addr: 16, rw: 'R/W', name: 'DryContactEnable',
        description:    'Aktywacja wejścia bezpotencjałowego (suchego styku).',
        description_en: 'Enable dry contact input.',
        values:    { '0': 'Wyłączona (Disable)', '1': 'Włączona (Enable)' },
        values_en: { '0': 'Disabled',            '1': 'Enabled' } },

      { addr: 17, rw: 'R/W', name: 'DryContactSetting',
        description:    'Typ styku bezpotencjałowego — normalnie zamknięty lub otwarty.',
        description_en: 'Dry contact type — normally closed or open.',
        values:    { '0': 'NC — normalnie zamknięty', '1': 'NO — normalnie otwarty' },
        values_en: { '0': 'NC — normally closed',     '1': 'NO — normally open' } },

      { addr: 18, rw: 'RO',  name: 'OutputStatusValve',
        description:    'Aktualny status wyjścia zaworu.',
        description_en: 'Current valve output status.',
        values:    { '0': 'Valve OFF — zawór zamknięty', '1': 'Valve ON — zawór otwarty' },
        values_en: { '0': 'Valve OFF',                   '1': 'Valve ON' } },

      { addr: 19, rw: 'RO',  name: 'DryContactInput',
        description:    'Status wejścia bezpotencjałowego (suchego styku).',
        description_en: 'Dry contact input status.',
        values:    { '0': 'Nieaktywne (Inactive)', '1': 'Aktywne (Active)' },
        values_en: { '0': 'Inactive',              '1': 'Active' } },

      { addr: 21, rw: 'RO',  name: 'ModbusVersion',
        description:    'Wersja protokołu Modbus (format HEX/UINT).',
        description_en: 'Modbus protocol version (HEX/UINT format).' },

      { addr: 22, rw: 'RO',  name: 'FirmwareVersion',
        description:    'Wersja oprogramowania termostatu (format HEX/UINT).',
        description_en: 'Thermostat firmware version (HEX/UINT format).' },
    ],
  },
};

// ============================================================
// HMI Wi-Fi EC — RL309 EC ROOM THERMOSTAT
// Źródło: RL309 EC WIFI-A3.docx, sekcja Modbus Setting
// ============================================================
const HMI_WIFI_EC = {
  regs: [
    {
      addr: 0x0000, rw: 'R/W', name: 'OnOffFlag',
      description: 'Stan termostatu',
      description_en: 'Thermostat on/off state',
      values: { 0: 'Wyłączony', 1: 'Włączony' },
      values_en: { 0: 'Off', 1: 'On' },
    },
    {
      addr: 0x0001, rw: 'RO', name: 'RoomTempMeasurement',
      description: 'Zmierzona temperatura pokojowa (rejestr × 0.1 °C, zakres 0.0–50.0 °C)',
      description_en: 'Measured room temperature (register × 0.1 °C, range 0.0–50.0 °C)',
      min: 0, max: 500, unit: '×0.1°C',
    },
    {
      addr: 0x0002, rw: 'R/W', name: 'SetTemperature',
      description: 'Temperatura zadana (rejestr × 0.1 °C, zakres 5.0–40.0 °C)',
      description_en: 'Set temperature (register × 0.1 °C, range 5.0–40.0 °C)',
      min: 50, max: 400, unit: '×0.1°C',
    },
    {
      addr: 0x0003, rw: 'R/W', name: 'TemperatureCalibration',
      description: 'Kalibracja temperatury (00–80, zakres –9.0 do +9.0 °C)',
      description_en: 'Temperature calibration (00–80, range –9.0 to +9.0 °C)',
      min: 0, max: 80,
    },
    {
      addr: 0x0004, rw: 'R/W', name: 'WorkingMode',
      description: 'Tryb HVAC',
      description_en: 'HVAC working mode',
      values: { 0: 'Chłodzenie', 1: 'Grzanie', 2: 'Wentylacja' },
      values_en: { 0: 'Cooling', 1: 'Heating', 2: 'Ventilation' },
    },
    {
      addr: 0x0005, rw: 'R/W', name: 'SensorSelection',
      description: 'Wybór czujnika temperatury',
      description_en: 'Temperature sensor selection',
      values: { 0: 'Wewnętrzny', 1: 'Zewnętrzny' },
      values_en: { 0: 'Internal sensor', 1: 'External sensor' },
    },
    {
      addr: 0x0006, rw: 'RO', name: 'OutputStatusFan',
      description: 'Stan wyjścia wentylatora (tylko odczyt)',
      description_en: 'Fan output status (read only)',
      values: { 0: 'Niska prędkość', 1: 'Średnia prędkość', 2: 'Wysoka prędkość', 4: 'Wyłączony' },
      values_en: { 0: 'Low speed', 1: 'Medium speed', 2: 'High speed', 4: 'Fan off' },
    },
    {
      addr: 0x0007, rw: 'R/W', name: 'ButtonLock',
      description: 'Blokada przycisków panelu',
      description_en: 'Panel button lock',
      values: { 0: 'Odblokowane', 1: 'Zablokowane' },
      values_en: { 0: 'Unlocked', 1: 'Locked' },
    },
    {
      addr: 0x0008, rw: 'R/W', name: 'AntifreezeEnable',
      description: 'Funkcja przeciwzamrożeniowa',
      description_en: 'Anti-freeze function',
      values: { 0: 'Wyłączona', 1: 'Włączona' },
      values_en: { 0: 'Disable', 1: 'Enable' },
    },
    {
      addr: 0x0009, rw: 'R/W', name: 'AntifreezeTemperature',
      description: 'Temperatura przeciwzamrożeniowa (rejestr × 0.1 °C, zakres 5.0–19.0 °C)',
      description_en: 'Anti-freeze temperature (register × 0.1 °C, range 5.0–19.0 °C)',
      min: 50, max: 190, unit: '×0.1°C',
    },
    {
      addr: 0x000A, rw: 'R/W', name: 'TimeSettingHour',
      description: 'Ustawienie czasu — godzina (BCD, zakres 09–23)',
      description_en: 'Time setting — hour (BCD, range 09–23)',
      min: 9, max: 23,
    },
    {
      addr: 0x000B, rw: 'R/W', name: 'TimeSettingMinute',
      description: 'Ustawienie czasu — minuta (BCD, zakres 00–59)',
      description_en: 'Time setting — minute (BCD, range 00–59)',
      min: 0, max: 59,
    },
    {
      addr: 0x000C, rw: 'R/W', name: 'TimeSettingWeekday',
      description: 'Ustawienie czasu — dzień tygodnia (BCD)',
      description_en: 'Time setting — weekday (BCD)',
    },
    {
      addr: 0x000D, rw: 'R/W', name: 'C1C2Selection',
      description: 'Wybór obwodu wyjściowego C1/C2',
      description_en: 'Output circuit selection C1/C2',
      values: { 0: 'C1', 1: 'C2' },
      values_en: { 0: 'C1', 1: 'C2' },
    },
    {
      addr: 0x000E, rw: 'R/W', name: 'FanSpeedSetting',
      description: 'Nastawienie prędkości wentylatora',
      description_en: 'Fan speed setting',
      values: { 1: 'Niska', 2: 'Średnia', 3: 'Wysoka', 4: 'Auto' },
      values_en: { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Auto' },
    },
    {
      addr: 0x000F, rw: 'R/W', name: 'OperationMode',
      description: 'Tryb sterowania (tygodniowy/ręczny)',
      description_en: 'Operation mode (weekly/manual)',
      values: { 0: 'Auto (tygodniowy)', 1: 'Ręczny', 2: 'Chwilowo ręczny' },
      values_en: { 0: 'Auto (weekly)', 1: 'Manual', 2: 'Temporary Manual' },
    },
    {
      addr: 0x0010, rw: 'R/W', name: 'DryContactEnable',
      description: 'Czujnik magnetyczny / suchy styk — aktywacja',
      description_en: 'Magnetic sensor dry contact — enable',
      values: { 0: 'Wyłączony', 1: 'Włączony' },
      values_en: { 0: 'Disable', 1: 'Enable' },
    },
    {
      addr: 0x0011, rw: 'R/W', name: 'DryContactSetting',
      description: 'Typ styku suchego',
      description_en: 'Dry contact type',
      values: { 0: 'NC — normalnie zamknięty', 1: 'NO — normalnie otwarty' },
      values_en: { 0: 'NC — Normally Close', 1: 'NO — Normally Open' },
    },
    {
      addr: 0x0012, rw: 'RO', name: 'OutputStatusValve',
      description: 'Stan wyjścia zaworu (tylko odczyt)',
      description_en: 'Valve output status (read only)',
      values: { 0: 'Zamknięty', 1: 'Otwarty' },
      values_en: { 0: 'Valve off', 1: 'Valve on' },
    },
    {
      addr: 0x0013, rw: 'RO', name: 'PracticalStatusOutput',
      description: 'Faktyczny stan wyjścia (tylko odczyt)',
      description_en: 'Practical status of output (read only)',
      values: { 0: 'Otwarty', 1: 'Zamknięty', 2: 'Nieznany' },
      values_en: { 0: 'Open', 1: 'Close', 2: 'Unknown/Open/Close' },
    },
    {
      addr: 0x0014, rw: 'R/W', name: 'FeedbackAlarm',
      description: 'Alarm sprzężenia zwrotnego zaworu',
      description_en: 'Valve feedback alarm',
      values: { 0: 'Włączony', 1: 'Wyłączony' },
      values_en: { 0: 'Enable', 1: 'Disable' },
    },
    {
      addr: 0x0015, rw: 'RO', name: 'ModbusVersion',
      description: 'Wersja protokołu Modbus (tylko odczyt)',
      description_en: 'Modbus protocol version (read only)',
    },
    {
      addr: 0x0016, rw: 'RO', name: 'FirmwareVersion',
      description: 'Numer części wersji Modbus (tylko odczyt)',
      description_en: 'Part number of Modbus version (read only)',
    },
  ],
};
