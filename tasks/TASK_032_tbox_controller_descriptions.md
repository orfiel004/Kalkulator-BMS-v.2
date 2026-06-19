# TASK_032 — Opisy rejestrów sterownika T-box (Single i Group)

## Problem

W `frontend/js/calculator.js`, obiekt `Calculator.CONTROLLER.tbox`,
rejestry `ir`, `hr_single` i `hr_group` nie mają pól `description` ani `description_en`.
W trybie Single Mode sekcja sterownika wyświetla rejestry bez żadnego opisu.

---

## Zmiana — `frontend/js/calculator.js`

Znajdź i zamień cały blok `tbox: {` wewnątrz `CONTROLLER`:

### Znajdź:
```js
    tbox: {
      ir: [
        { addr: 0,  name: 'HardwareType' },
        { addr: 1,  name: 'SoftType' },
        { addr: 2,  name: 'ConnectionCnt' },
        { addr: 3,  name: 'SoftVer' },
        { addr: 5,  name: 'TempTBox' },
        { addr: 6,  name: 'TempT4Ave' },
        { addr: 16, name: 'DrvCount' },
      ],
      hr_single: [
        { addr: 4, name: 'BmsMode' },
      ],
      hr_group: [
        { addr: 1,  name: 'SoftType' },
        { addr: 4,  name: 'BmsMode' },
        { addr: 5,  name: 'Enable' },
        { addr: 6,  name: 'Tref' },
        { addr: 7,  name: 'AntifreezeWareHouseEnable' },
        { addr: 8,  name: 'AntifreezeWareHouseTempRef' },
        { addr: 9,  name: 'TleadSensorSelect' },
        { addr: 10, name: 'Tsl_Tlead_Offset' },
        { addr: 11, name: 'Tsl_T4_Offset' },
        { addr: 12, name: 'GasSensorEnable' },
        { addr: 13, name: 'GasSensorConnectId' },
        { addr: 14, name: 'DateYear' },
        { addr: 15, name: 'DateMonth' },
        { addr: 16, name: 'DateDay' },
        { addr: 17, name: 'DateHours' },
        { addr: 18, name: 'DateMinutes' },
        { addr: 19, name: 'DateSeconds' },
      ],
    },
```

### Zamień na:
```js
    tbox: {
      ir: [
        { addr: 0,  name: 'HardwareType',  description: 'Informacja o typie sprzętu i wersji PCB.',                                                                                    description_en: 'Hardware type and PCB version information.' },
        { addr: 1,  name: 'SoftType',      description: 'Typ i wersja oprogramowania sterownika.',                                                                                      description_en: 'Controller firmware type and version.' },
        { addr: 2,  name: 'ConnectionCnt', description: 'Licznik połączeń — rośnie przy każdym odczycie. Pierwsze zapytanie zawsze zwraca 0x01. Monitoring tego rejestru umożliwia diagnostykę połączenia.', description_en: 'Connection counter — increments on each read. First query always returns 0x01. Monitoring this register enables connection diagnostics.' },
        { addr: 3,  name: 'SoftVer',       description: 'Wersja oprogramowania sterownika.',                                                                                            description_en: 'Controller firmware version.' },
        { addr: 5,  name: 'TempTBox',      description: 'Temperatura wewnętrzna sterownika T-box (x0.1 °C).',                                                                           description_en: 'T-box internal temperature (x0.1 °C).' },
        { addr: 6,  name: 'TempT4Ave',     description: 'Średnia temperatura z czujników T4 wszystkich podłączonych urządzeń (x0.1 °C).',                                               description_en: 'Average T4 temperature from all connected devices (x0.1 °C).' },
        { addr: 16, name: 'DrvCount',      description: 'Liczba wykrytych urządzeń podłączonych do sterownika.',                                                                        description_en: 'Number of devices detected on the controller.' },
      ],
      hr_single: [
        { addr: 4, name: 'BmsMode', description: 'Tryb BMS — włącza sterowanie przez Modbus (1=aktywny, 0=nieaktywny).', description_en: 'BMS mode — enables Modbus control (1=active, 0=inactive).' },
      ],
      hr_group: [
        { addr: 1,  name: 'SoftType',                    description: 'Typ i wersja oprogramowania sterownika.',                                                              description_en: 'Controller firmware type and version.' },
        { addr: 4,  name: 'BmsMode',                     description: 'Tryb BMS — włącza sterowanie przez Modbus (1=aktywny, 0=nieaktywny).',                                 description_en: 'BMS mode — enables Modbus control (1=active, 0=inactive).' },
        { addr: 5,  name: 'Enable',                      description: 'Włączenie/wyłączenie grupy urządzeń (1=włączona, 0=wyłączona).',                                       description_en: 'Enable/disable device group (1=enabled, 0=disabled).' },
        { addr: 6,  name: 'Tref',                        description: 'Temperatura zadana dla grupy urządzeń (x0.1 °C).',                                                     description_en: 'Target temperature for the device group (x0.1 °C).' },
        { addr: 7,  name: 'AntifreezeWareHouseEnable',   description: 'Włączenie ochrony przed zamrożeniem pomieszczenia (1=aktywna, 0=nieaktywna).',                         description_en: 'Enable warehouse antifreeze protection (1=active, 0=inactive).' },
        { addr: 8,  name: 'AntifreezeWareHouseTempRef',  description: 'Temperatura progowa ochrony przed zamrożeniem pomieszczenia (x0.1 °C).',                               description_en: 'Warehouse antifreeze protection threshold temperature (x0.1 °C).' },
        { addr: 9,  name: 'TleadSensorSelect',           description: 'Wybór czujnika wiodącego (1=strefa, 2=nawiew, 3=pomieszczenie T4).',                                   description_en: 'Lead sensor selection (1=zone, 2=supply, 3=room T4).' },
        { addr: 10, name: 'Tsl_Tlead_Offset',            description: 'Offset temperatury wiodącej względem wartości zadanej (x0.1 °C).',                                    description_en: 'Lead temperature offset relative to setpoint (x0.1 °C).' },
        { addr: 11, name: 'Tsl_T4_Offset',               description: 'Offset temperatury T4 względem wartości zadanej (x0.1 °C).',                                          description_en: 'T4 temperature offset relative to setpoint (x0.1 °C).' },
        { addr: 12, name: 'GasSensorEnable',             description: 'Włączenie obsługi czujnika gazu (1=aktywny, 0=nieaktywny).',                                           description_en: 'Gas sensor enable (1=active, 0=inactive).' },
        { addr: 13, name: 'GasSensorConnectId',          description: 'Adres Modbus czujnika gazu w sieci sterownika.',                                                       description_en: 'Modbus address of the gas sensor on the controller network.' },
        { addr: 14, name: 'DateYear',                    description: 'Ustawienie daty — rok.',                                                                               description_en: 'Date setting — year.' },
        { addr: 15, name: 'DateMonth',                   description: 'Ustawienie daty — miesiąc.',                                                                           description_en: 'Date setting — month.' },
        { addr: 16, name: 'DateDay',                     description: 'Ustawienie daty — dzień.',                                                                             description_en: 'Date setting — day.' },
        { addr: 17, name: 'DateHours',                   description: 'Ustawienie czasu — godzina.',                                                                          description_en: 'Time setting — hour.' },
        { addr: 18, name: 'DateMinutes',                 description: 'Ustawienie czasu — minuty.',                                                                           description_en: 'Time setting — minutes.' },
        { addr: 19, name: 'DateSeconds',                 description: 'Ustawienie czasu — sekundy.',                                                                          description_en: 'Time setting — seconds.' },
      ],
    },
```

---

## Weryfikacja

1. Otwórz kalkulator, wybierz T-box, tryb Single
2. Kliknij „Pokaż rejestry sterownika"
3. Rozwiń dowolny rejestr IR lub HR — opis powinien być widoczny
4. Przełącz na EN — opisy powinny zmienić język
5. Sprawdź tryb Group — rejestry HR grupy też powinny mieć opisy

---

## Commit

```
feat(i18n): add descriptions to T-box controller registers (ir, hr_single, hr_group)
```
