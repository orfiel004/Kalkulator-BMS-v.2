# TODO — Niejasności i rzeczy do weryfikacji

## ⚠️ Założenia projektu — WAŻNE

- **Aplikacja = kalkulator offline** — pokazuje użytkownikowi jakie funkcje/parametry są pod jakimi adresami rejestrów Modbus
- **Brak komunikacji Modbus — nigdy** — aplikacja nie łączy się z żadnym urządzeniem, nie czyta ani nie pisze rejestrów przez sieć
- **Docelowo: strona internetowa** — może być statyczna (HTML+JS bez backendu) lub prosta webapp; wystarczy serwer plików
- **Backend (jeśli w ogóle)** — tylko do serwowania plików JSON z definicjami urządzeń; zero Modbus, zero pymodbus

---

## Brakujące pliki urządzeń (do stworzenia)

- [ ] `drv_robur_next.json` — ⏳ HR single + IR gotowe; brakuje **Group HR**
- [x] `drv_robur_km.json` — stary model, nieużywany; pominięty
- [ ] `drv_robur_next_km.json` — ⏳ HR single + IR gotowe; brakuje **Group HR**
- [ ] `drv_cool.json` — ⏳ HR single + IR gotowe; brakuje **Group HR**
- [ ] `drv_cube.json` — ⏳ HR single + IR gotowe; brakuje **Group HR**

---

## drv_oxen.json

- [ ] **group_priority = 8** — wartość domyślna, wymaga korekty zgodnie z faktyczną kolejnością priorytetów
- [ ] **holding_registers_group** — wstawiony domysł (FanEffRef_1, FanEffRef_2, OxenMode, TempRef); zweryfikować na podstawie dokumentacji
- [ ] **OxenState** — wartości 1, 2, 3 wszystkie opisane jako "OX_ON". Czy to różne stany pracy (np. warmup, steady, boost) czy dokumentacja naprawdę nie rozróżnia?
- [ ] **Status2 (offset 1)** — oznaczony "Not used" w dokumentacji, pominięty w IR; czy powinien być mimo to w pliku?
- [ ] **"Not used" rejestry HR** — pominięte: Config2, TempIn, TempOut, RegParam_K, RegParam_T, OxenElectricWorkMode, OxenElectricPtcPower_ref, PtcRegTempLow, PtcRegTempHi; czy któreś z nich będą potrzebne?

---

## drv_km.json

- [ ] **AntiFreezeWareHouseOn** — wartości odwrócone względem innych urządzeń: tu 1=disable, 2=enable (DRV V/M/ELIS/SLIM mają 1=ON, 2=OFF). Czy to celowe i poprawne w dokumentacji KM?

---

## drv_elis.json / drv_slim.json

- [ ] **TLeadSensorSelect** — brak wartości 0=TSL_TNS w dokumentacji ELIS/SLIM (inne urządzenia mają 0=TSL_TNS). Potwierdzić, że DRV ELIS/SLIM faktycznie nie obsługuje trybu "tylko odczyt".

---

## drv_d.json

- [ ] **description** — wpisano "Nagrzewnica wodna (wariant D)", ale DRV D to urządzenie do destratyfikacji (odszranianie/mieszanie powietrza), nie nagrzewnica wodna. Poprawić opis.

---

## Kolejność group_priority — cały katalog

- [ ] Zweryfikować kompletną kolejność `group_priority` dla wszystkich urządzeń. Aktualnie:
  - 2 = DRV KM
  - 3 = DRV ELIS
  - 5 = DRV V
  - 6 = DRV M
  - 7 = DRV D
  - 8 = DRV OXEN (domysł)
  - 15 = DRV SLIM
  - pozostałe urządzenia: do ustalenia

---

## drv_el.json

- [ ] **group_priority = 9** — wartość domyślna, wymaga korekty zgodnie z faktyczną kolejnością priorytetów
- [ ] **holding_registers_group** — wstawiony domysł (WorkMode, FanEffRef, Tref, DestMode, ElectricHeaterPTCPower); zweryfikować na podstawie dokumentacji
- [ ] **DestStratTimeDelay (offset 14)** — oznaczony "Not in use" w dokumentacji, pominięty; czy powinien być w pliku?
- [ ] **FuseState (offset 10 IR)** — bitfield (bits 0–3=Roof fan, 4–7=EC fan, 8–11=3V fan); czy wymagane bardziej szczegółowe opisy bitów?
- [ ] **PTCHeaterPowerState (offset 11 IR)** — zależy od konfiguracji SW3.5=K1/K2; wartości 1–4 mają różne znaczenie w zależności od trybu; czy opisano wystarczająco?

---

## drv_robur_next.json

- [x] **Input Registers** — gotowe (10 rejestrów: T3, T4, ExternalGasDetect×3, AntifreezeStateWarehouse, FuseState, GasAlarmState, STBAlarmState, FilterWorkTime)
- [ ] **holding_registers_group** — brak dokumentacji; plik ma pustą tablicę
- [ ] **group_priority = 10** — wartość domyślna, wymaga korekty
- [ ] **ContModeFanSpeedRef (offset 22)** — wartości tylko 0 i 100 (Fan OFF/ON); czy są inne wartości pośrednie?
- [ ] **STBTemperatureAlarmOn default = 900** — wartość domyślna pominięta w JSON (nie ma pola `default` w schemacie); zanotować dla dokumentacji

---

## drv_cube.json

- [ ] **holding_registers_group** — brak dokumentacji; plik ma pustą tablicę
- [ ] **group_priority = 13** — wartość domyślna, wymaga korekty
- [ ] **Rooftop_current_work_mode (IR 0x15)** — duplikat wartości 7: WM_CO2 i WM_THMST — błąd w dokumentacji? Zweryfikować
- [ ] **IR offsets 0x04–0x08** — brak w dokumentacji; czy są "Not used" czy po prostu nie opisane?
- [ ] **CO2_status** — występuje zarówno w HR (0x13, RW) jak i IR (0x13, RO); HR służy do zapisu statusu przez T-box, IR do odczytu przez T-box — czy to zamierzone?
- [ ] **water_temp_value (IR 0x0C)** — zakres -640 do 1500 (max 150°C) — szersza skala niż inne temperatury; potwierdzić

---

## Stare dane DRV ROBUR (screenshoty z poprzedniej sesji)

- [ ] Screenshoty oznaczone "DRV D" były dla **DRV ROBUR** (starego modelu). Użytkownik potwierdził, że stary ROBUR nie będzie używany. Dane zostały zachowane w planie — usunąć po zakończeniu projektu lub zignorować.
