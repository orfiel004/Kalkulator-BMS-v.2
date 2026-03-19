# Kalkulator BMS — Rejestry Modbus

> Narzędzie do obliczania adresów rejestrów Modbus dla urządzeń podłączonych do sterowników T-box i T-box Zone systemu BMS.

---

## Spis treści

1. [Co robi ten program](#co-robi-ten-program)
2. [Kontekst techniczny — czym jest Modbus i BMS](#kontekst-techniczny)
3. [Jak działa kalkulator](#jak-działa-kalkulator)
4. [Skąd program bierze informacje o rejestrach](#skąd-program-bierze-informacje)
5. [Jak dodać nowe urządzenie](#jak-dodać-nowe-urządzenie)
6. [Struktura projektu](#struktura-projektu)
7. [Uruchomienie lokalne](#uruchomienie-lokalne)
8. [Plan budowy — etapy wdrożenia](#plan-budowy)
9. [Historia projektu — POC](#historia-projektu)

---

## Co robi ten program

Kalkulator BMS to aplikacja webowa pomagająca inżynierom i serwisantom systemu BMS w wyznaczaniu **dokładnych adresów rejestrów Modbus** urządzeń wentylacyjnych podłączonych do sterownika T-box lub T-box Zone.

> **Ważne:** Aplikacja jest **wyłącznie kalkulatorem offline**. Nie komunikuje się z żadnym urządzeniem przez Modbus — nie odczytuje ani nie zapisuje rejestrów. Służy wyłącznie do obliczania i wyświetlania adresów rejestrów wraz z opisem ich funkcji.

**Problem, który rozwiązuje:**

W systemie BMS każde urządzenie (nagrzewnica, kurtyna, wentylator itp.) podłączone do sterownika zajmuje określony blok rejestrów Modbus. Adres konkretnego rejestru zależy od:
- modelu urządzenia (np. DRV V, DRV KM, DRV ROBUR)
- adresu Modbus przypisanego urządzeniu (1–31)
- trybu pracy sterownika (Single mode / Group mode)
- dla T-box Zone — numeru strefy

Obliczanie tych adresów ręcznie jest czasochłonne i podatne na błędy. Kalkulator robi to automatycznie.

**Co użytkownik dostaje na wyjściu:**
- Tabelę `INPUT REGISTERS` (IR) — rejestry tylko do odczytu (stany, temperatury, alarmy)
- Tabelę `HOLDING REGISTERS` (HR) — rejestry do odczytu i zapisu (ustawienia, tryby)
- Adresy w formacie DEC i HEX
- Rejestry samego sterownika (T-box / T-box Zone)
- Dla T-box Zone — rejestry strefy

---

## Kontekst techniczny

### Modbus RTU / TCP

Modbus to przemysłowy protokół komunikacyjny. Urządzenia w sieci Modbus identyfikowane są adresem (1–247). Każde urządzenie udostępnia rejestry:

| Typ rejestru | Opis | Dostęp |
|---|---|---|
| **Input Registers (IR)** | Dane odczytowe: temperatury, stany, alarmy | Tylko odczyt |
| **Holding Registers (HR)** | Parametry konfiguracyjne, tryby pracy | Odczyt i zapis |

### Wzory obliczania adresów

#### Tryb Single mode (sterownik T-box)
```
IR adres  = bazowy_nr_rejestru + 256 + (adres_urządzenia - 1) × 64
HR adres  = bazowy_nr_rejestru + 256 + (adres_urządzenia - 1) × 64
```

#### Tryb Group mode (sterownik T-box)
```
IR adres  = bazowy_nr_rejestru + 256 + (adres_urządzenia - 1) × 64
HR adres  = bazowy_nr_rejestru + 4096 + (nr_grupy - 1) × 256
```
> Numer grupy jest przypisywany automatycznie według kolejności typów urządzeń zgodnie z predefiniowaną sekwencją priorytetów.

#### T-box Zone — rejestry strefy
```
Adres rejestru strefy = bazowy_adres_strefy + (nr_strefy × 16)
```

---

## Jak działa kalkulator

```
┌─────────────────────────────────┐
│         FORMULARZ               │
│  Wybierz sterownik: [T-box ▼]   │
│  Tryb pracy: ● Single  ○ Group  │
│                                 │
│  Urządzenie   Adres   Strefa    │
│  [DRV V  ▼]   [1 ▼]            │
│  [DRV KM ▼]   [2 ▼]            │
│  [+ Dodaj kolejne]              │
│                                 │
│         [  OBLICZ  ]            │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│   Plik JSON z definicją         │
│   rejestrów urządzenia          │
│   np. devices/drv_v.json        │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│   WYNIK: tabele z adresami      │
│                                 │
│  Sterownik T-box                │
│  IR: HEX | DEC | Nazwa          │
│  HR: HEX | DEC | Nazwa          │
│                                 │
│  DRV V  adres: 1  [←] [→]      │
│  IR: HEX | DEC | Nazwa          │
│  HR: HEX | DEC | Nazwa          │
└─────────────────────────────────┘
```

### Przepływ danych krok po kroku

1. Użytkownik wypełnia formularz — wybiera modele urządzeń, adresy Modbus i tryb pracy
2. Po kliknięciu „Oblicz" walidowane są dane (unikalne adresy, wypełnione pola)
3. Dla każdego urządzenia ładowany jest odpowiedni plik JSON z definicją rejestrów
4. Adresy rejestrów obliczane są według wzorów opisanych wyżej
5. Wyniki wyświetlane są w tabelach — można przełączać między urządzeniami strzałkami

---

## Skąd program bierze informacje

Dane o rejestrach każdego urządzenia przechowywane są w **oddzielnych plikach JSON** w katalogu `devices/`.

### Struktura pliku urządzenia

Każde urządzenie ma własny plik, np. `devices/drv_v.json`:

```json
{
  "name": "DRV V",
  "description": "Nagrzewnica wodna z wentylatorem EC",
  "input_registers": [
    { "offset": 4, "name": "T3" },
    { "offset": 5, "name": "T4" },
    { "offset": 6, "name": "FanEff" },
    { "offset": 7, "name": "AntifreezeState" },
    { "offset": 8, "name": "DestStatus" },
    { "offset": 9, "name": "FanEcConnect" },
    { "offset": 10, "name": "FuseState" },
    { "offset": 11, "name": "ValveState" }
  ],
  "holding_registers_single": [
    { "offset": 4, "name": "WorkMode" },
    { "offset": 5, "name": "AntifreezeWareHouseOn" },
    { "offset": 6, "name": "AntifreezeWareHouseTempRef" },
    { "offset": 7, "name": "FanEffRef" },
    { "offset": 8, "name": "Tref" },
    { "offset": 9, "name": "TLeadVal" },
    { "offset": 10, "name": "TleadSensorSelect" },
    { "offset": 11, "name": "DestModeForce" },
    { "offset": 12, "name": "DestMode" },
    { "offset": 13, "name": "DestTempRef" },
    { "offset": 14, "name": "DestStratTimeDelay" },
    { "offset": 15, "name": "ModeAuto_FanEffRefMin" },
    { "offset": 16, "name": "ModeAuto_FanEffRefMax" },
    { "offset": 17, "name": "ModeManual_FanEffRef" }
  ],
  "holding_registers_group": [
    { "offset": 4, "name": "WorkMode" },
    { "offset": 5, "name": "FanEffRef" },
    { "offset": 6, "name": "DestModeForce" },
    { "offset": 7, "name": "DestTempRef" },
    { "offset": 8, "name": "DestStratTimeDelay" },
    { "offset": 9, "name": "ModeAuto_FanEffRefMin" },
    { "offset": 10, "name": "ModeManual_FanEffRef" }
  ]
}
```

### Dostępne urządzenia

| ID pliku | Model | Opis |
|---|---|---|
| `drv_v.json` | DRV V | Nagrzewnica wodna |
| `drv_d.json` | DRV D | Nagrzewnica wodna (wariant D) |
| `drv_elis.json` | DRV ELIS | Kurtyna powietrzna |
| `drv_slim.json` | DRV SLIM | Kurtyna powietrzna Slim |
| `drv_km.json` | DRV KM | Centrala z klapą mieszającą |
| `drv_m.json` | DRV M | Nagrzewnica M |
| `drv_oxen.json` | DRV OXEN | Centrala klimatyzacyjna |
| `drv_robur.json` | DRV ROBUR | Nagrzewnica gazowa |
| `drv_robur_km.json` | DRV ROBUR KM | Nagrzewnica gazowa z klapą |
| `drv_robur_next.json` | DRV ROBUR NEXT | Nagrzewnica gazowa Next |
| `drv_robur_next_km.json` | DRV ROBUR NEXT KM | Nagrzewnica gazowa Next z klapą |
| `drv_el.json` | DRV EL | Nagrzewnica elektryczna |
| `drv_cool.json` | DRV COOL | Chłodnica |
| `drv_cube.json` | DRV CUBE | Centrala dachowa |

---

## Jak dodać nowe urządzenie

Dodanie nowego modelu urządzenia **nie wymaga modyfikacji kodu** — wystarczy dodać nowy plik JSON.

### Kroki

1. **Utwórz plik** `devices/drv_nowe_urzadzenie.json`

2. **Wypełnij strukturę** według wzoru powyżej:
   - `name` — nazwa wyświetlana w aplikacji (musi być unikalna)
   - `description` — opis urządzenia
   - `input_registers` — lista rejestrów IR z offsetami (bazowymi numerami rejestrów)
   - `holding_registers_single` — lista HR dla trybu Single mode
   - `holding_registers_group` — lista HR dla trybu Group mode

3. **Offsety rejestrów** — to są numery rejestrów **przed** przeliczeniem na adres Modbus. Znajdziesz je w dokumentacji technicznej urządzenia (tabela rejestrów Modbus).

4. **Zrestartuj aplikację** — nowe urządzenie pojawi się automatycznie na liście.

> **Ważne:** Nie zmieniaj formatu pliku JSON. Każdy rejestr musi mieć pola `offset` (liczba całkowita) i `name` (string).

### Weryfikacja

Po dodaniu pliku możesz sprawdzić poprawność uruchamiając:
```bash
python tools/validate_devices.py
```

---

## Struktura projektu

```
Kalkulator BMS v.2/
│
├── README.md                   # Ten plik
│
├── devices/                    # Pliki JSON z definicjami rejestrów urządzeń
│   ├── drv_v.json
│   ├── drv_d.json
│   ├── drv_elis.json
│   ├── drv_slim.json
│   ├── drv_km.json
│   ├── drv_m.json
│   ├── drv_oxen.json
│   ├── drv_robur.json
│   ├── drv_robur_km.json
│   ├── drv_robur_next.json
│   ├── drv_robur_next_km.json
│   ├── drv_el.json
│   ├── drv_cool.json
│   └── drv_cube.json
│
├── controllers/                # Pliki JSON z definicjami rejestrów sterowników
│   ├── tbox.json
│   └── tbox_zone.json
│
├── frontend/                   # Aplikacja webowa (statyczna)
│   ├── index.html              # Strona główna
│   ├── css/
│   │   └── style.css           # Style
│   └── js/
│       ├── app.js              # Główna logika UI
│       ├── calculator.js       # Silnik obliczania adresów Modbus
│       ├── device_loader.js    # Wczytywanie plików JSON urządzeń
│       ├── form.js             # Obsługa formularza
│       └── table.js            # Renderowanie tabel wynikowych
│
├── tools/                      # Narzędzia pomocnicze
│   └── validate_devices.py     # Walidacja plików JSON urządzeń (Python, opcjonalnie)
│
└── .gitignore
```

---

## Uruchomienie lokalne

Aplikacja jest statyczną stroną HTML+JS — **nie wymaga instalacji ani serwera**.

### Opcja 1 — Bezpośrednio z pliku

Otwórz `frontend/index.html` w przeglądarce.

> Uwaga: niektóre przeglądarki blokują `fetch()` dla lokalnych plików (`file://`). W takim przypadku użyj opcji 2.

### Opcja 2 — Lokalny serwer HTTP (zalecane)

```bash
# Python (wbudowany serwer)
cd "Kalkulator BMS v.2"
python -m http.server 8080
```

Aplikacja dostępna pod adresem: `http://localhost:8080/frontend/`

---

## Plan budowy

Projekt budowany etapami. Każdy etap kończy się działającą, testowalną wersją.

---

### Etap 1 — Warstwa danych (pliki JSON)

**Cel:** Wyekstrahować wszystkie dane rejestrów z kodu Python do plików JSON.

**Rezultat etapu:** Wszystkie dane rejestrów w plikach JSON, Python nic nie hardkoduje. Logika obliczeniowa nie jest jeszcze napisana — tylko dane.

---

#### Krok 1.1 — Przygotowanie struktury katalogów

Utwórz katalogi projektu:

```
Kalkulator BMS v.2/
├── devices/
├── controllers/
├── backend/
├── tools/
└── tests/
```

---

#### Krok 1.2 — Zdefiniowanie schematu JSON urządzenia

Zanim przepiszemy dane, ustalamy kontrakt — jak wygląda poprawny plik urządzenia.

Utwórz plik `devices/_schema.json` (dokumentacja formatu, nie wczytywany przez aplikację):

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "required": ["name", "description", "input_registers", "holding_registers_single", "holding_registers_group"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Nazwa modelu urządzenia wyświetlana w aplikacji, np. 'DRV V'"
    },
    "description": {
      "type": "string",
      "description": "Opis słowny urządzenia"
    },
    "group_priority": {
      "type": "integer",
      "description": "Kolejność przydzielania numeru grupy w Group mode (niższy = wyższy priorytet)"
    },
    "input_registers": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["offset", "name"],
        "properties": {
          "offset": { "type": "integer", "minimum": 0 },
          "name":   { "type": "string" }
        }
      }
    },
    "holding_registers_single": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["offset", "name"],
        "properties": {
          "offset": { "type": "integer", "minimum": 0 },
          "name":   { "type": "string" }
        }
      }
    },
    "holding_registers_group": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["offset", "name"],
        "properties": {
          "offset": { "type": "integer", "minimum": 0 },
          "name":   { "type": "string" }
        }
      }
    }
  }
}
```

**Pole `group_priority`** — opcjonalne. Określa kolejność przydzielania numerów grup w Group mode. W POC kolejność była zakodowana w liście `groups_sequence`. Teraz każde urządzenie nosi tę informację przy sobie, co ułatwia dodawanie nowych modeli.

---

#### Krok 1.3 — Przepisanie urządzeń do plików JSON

Dla każdego z 14 urządzeń utwórz oddzielny plik w `devices/`. Dane pobieramy z `registers.py` z oryginalnego POC.

**Lista plików do utworzenia:**

| Plik | Źródło w registers.py |
|---|---|
| `devices/drv_v.json` | `drv_v_ir`, `drv_v_single_hr`, `drv_v_group_hr` |
| `devices/drv_d.json` | `drv_d_ir`, `drv_d_single_hr`, `drv_d_group_hr` |
| `devices/drv_elis.json` | `drv_elis_ir`, `drv_elis_single_hr`, `drv_elis_group_hr` |
| `devices/drv_slim.json` | `drv_slim_ir`, `drv_slim_single_hr`, `drv_slim_group_hr` |
| `devices/drv_km.json` | `drv_km_ir`, `drv_km_single_hr`, `drv_km_group_hr` |
| `devices/drv_m.json` | `drv_m_ir`, `drv_m_single_hr`, `drv_m_group_hr` |
| `devices/drv_oxen.json` | `drv_oxen_ir`, `drv_oxen_single_hr`, `drv_oxen_group_hr` |
| `devices/drv_robur.json` | `drv_robur_ir`, `drv_robur_single_hr`, `drv_robur_group_hr` |
| `devices/drv_robur_km.json` | `drv_robur_km_ir`, `drv_robur_km_single_hr`, `drv_robur_km_group_hr` |
| `devices/drv_robur_next.json` | `drv_robur_next_ir`, `drv_robur_next_single_hr`, `drv_robur_next_group_hr` |
| `devices/drv_robur_next_km.json` | `drv_robur_next_km_ir`, `drv_robur_next_km_single_hr`, `drv_robur_next_km_group_hr` |
| `devices/drv_el.json` | `drv_el_ir`, `drv_el_single_hr`, `drv_el_group_hr` |
| `devices/drv_cool.json` | `drv_cool_ir`, `drv_cool_single_hr`, `drv_cool_group_hr` |
| `devices/drv_cube.json` | `drv_cube_ir`, `drv_cube_single_hr`, `drv_cube_group_hr` |

Każda krotka `(offset, nazwa)` z list w `registers.py` staje się obiektem `{"offset": X, "name": "Y"}` w JSON.

---

#### Krok 1.4 — Przepisanie sterowników do plików JSON

Utwórz pliki dla sterowników (dane z funkcji `get_controller_registers` w POC):

**`controllers/tbox.json`** — rejestry sterownika T-box:
```json
{
  "name": "T-box",
  "input_registers": [
    { "offset": 0, "name": "HardwareType" },
    { "offset": 1, "name": "SoftType" },
    { "offset": 2, "name": "ConnectionCnt" },
    { "offset": 3, "name": "SoftVer" },
    { "offset": 5, "name": "TempTBox" },
    { "offset": 6, "name": "TempT4Ave" },
    { "offset": 16, "name": "DrvCount" }
  ],
  "holding_registers_single": [
    { "offset": 4, "name": "BmsMode" },
    { "offset": 5, "name": "Enable" },
    { "offset": 6, "name": "Tref" },
    { "offset": 7, "name": "AntifreezeWareHouseEnable" },
    { "offset": 8, "name": "AntifreezeWareHouseTempRef" },
    { "offset": 9, "name": "TleadSensorSelect" },
    { "offset": 10, "name": "Tsl_Tlead_Offset" },
    { "offset": 11, "name": "Tsl_T4_Offset" },
    { "offset": 12, "name": "GasSensorEnable" },
    { "offset": 13, "name": "GasSensorConnectId" },
    { "offset": 14, "name": "DateYear" },
    { "offset": 15, "name": "DateMonth" },
    { "offset": 16, "name": "DateDay" },
    { "offset": 17, "name": "DateHours" },
    { "offset": 18, "name": "DateMinutes" },
    { "offset": 19, "name": "DateSeconds" }
  ],
  "holding_registers_group": [
    { "offset": 1, "name": "SoftType" },
    { "offset": 4, "name": "BmsMode" },
    { "offset": 5, "name": "Enable" },
    { "offset": 6, "name": "Tref" },
    { "offset": 7, "name": "AntifreezeWareHouseEnable" },
    { "offset": 8, "name": "AntifreezeWareHouseTempRef" },
    { "offset": 9, "name": "TleadSensorSelect" },
    { "offset": 10, "name": "Tsl_Tlead_Offset" },
    { "offset": 11, "name": "Tsl_T4_Offset" },
    { "offset": 12, "name": "GasSensorEnable" },
    { "offset": 13, "name": "GasSensorConnectId" },
    { "offset": 14, "name": "DateYear" },
    { "offset": 15, "name": "DateMonth" },
    { "offset": 16, "name": "DateDay" },
    { "offset": 17, "name": "DateHours" },
    { "offset": 18, "name": "DateMinutes" },
    { "offset": 19, "name": "DateSeconds" }
  ]
}
```

**`controllers/tbox_zone.json`** — analogicznie, na podstawie `tbox_zone_ir` i `tbox_zone_hr` z POC.

---

#### Krok 1.5 — Napisanie device_loader.py

Moduł `backend/device_loader.py` odpowiada za wczytywanie plików JSON i udostępnianie ich reszcie aplikacji.

**Interfejs (co ma umieć):**
```python
# Zwraca listę nazw wszystkich dostępnych urządzeń
get_available_devices() -> list[str]

# Zwraca pełną definicję urządzenia po nazwie, np. "DRV V"
get_device(name: str) -> dict

# Zwraca definicję sterownika po typie, np. "T-box"
get_controller(controller_type: str) -> dict

# Waliduje plik JSON względem schematu — rzuca wyjątek jeśli błąd
validate_device_file(filepath: str) -> None
```

**Zasady implementacji:**
- Wczytuje wszystkie pliki z `devices/` raz przy starcie (cache w pamięci)
- Jeśli plik JSON jest niepoprawny — rzuca czytelny wyjątek z nazwą pliku i opisem błędu
- Nie zna nic o Modbus ani o obliczeniach — tylko ładuje dane

---

#### Krok 1.6 — Napisanie validate_devices.py

Skrypt `tools/validate_devices.py` uruchamia się ręcznie (lub w CI) i sprawdza czy wszystkie pliki JSON są poprawne.

**Co sprawdza:**
- Każdy plik w `devices/` daje się sparsować jako JSON
- Każdy plik zawiera wymagane pola (`name`, `description`, `input_registers`, itd.)
- Żadne dwa urządzenia nie mają tej samej wartości `name`
- Każdy rejestr ma pola `offset` (int ≥ 0) i `name` (niepusty string)
- Każde urządzenie z listy wymaganej w aplikacji ma swój plik

**Wyjście skryptu:**
```
✓  drv_v.json          — OK  (8 IR, 14 HR single, 7 HR group)
✓  drv_d.json          — OK  (5 IR, 7 HR single, 4 HR group)
✗  drv_elis.json       — BŁĄD: brak pola 'holding_registers_group'
...
Wynik: 13/14 plików OK
```

---

#### Krok 1.7 — Testy jednostkowe warstwy danych

Utwórz plik `tests/test_device_loader.py`.

**Co testować:**
- `get_available_devices()` zwraca niepustą listę
- `get_device("DRV V")` zwraca słownik z kluczami `input_registers`, `holding_registers_single`, `holding_registers_group`
- `get_device("NIEISTNIEJĄCE")` rzuca czytelny wyjątek
- Każde urządzenie z listy dostępnych ma co najmniej 1 rejestr IR i 1 rejestr HR
- `get_controller("T-box")` i `get_controller("T-box Zone")` działają poprawnie
- Plik z brakującym polem nie przechodzi walidacji

---

#### Weryfikacja ukończenia Etapu 1

Etap 1 jest skończony gdy:

- [ ] Katalog `devices/` zawiera 14 plików `.json` (po jednym na urządzenie)
- [ ] Katalog `controllers/` zawiera `tbox.json` i `tbox_zone.json`
- [ ] `python tools/validate_devices.py` kończy się bez błędów
- [ ] `python -m pytest tests/test_device_loader.py` — wszystkie testy zielone
- [ ] Żadna definicja rejestru nie pozostała w kodzie Python

---

### Etap 2 — Logika obliczeniowa (JavaScript)

**Cel:** Zaimplementować silnik obliczania adresów rejestrów po stronie przeglądarki (bez backendu).

> Aplikacja jest kalkulatorem offline — nie potrzebuje serwera. Wszystkie obliczenia wykonywane są w przeglądarce na podstawie lokalnie załadowanych plików JSON.

**Zadania:**
- [ ] Napisać `js/calculator.js` — czysty silnik obliczeniowy
  - Wzory dla Single mode, Group mode
  - Wzory dla T-box Zone (rejestry urządzeń, sterownika, stref)
- [ ] Napisać `js/device_loader.js` — wczytywanie plików JSON urządzeń (fetch)
- [ ] Zweryfikować wyniki względem POC (te same wyniki dla tych samych danych)

**Rezultat:** Działający silnik obliczeniowy, możliwy do przetestowania w przeglądarce.

---

### Etap 3 — Frontend webowy

**Cel:** Zbudować interfejs webowy zastępujący okno Tkinter.

**Zadania:**
- [ ] Zaprojektować układ strony (formularz + tabele wynikowe)
- [ ] Zaimplementować formularz dynamiczny (dodawanie urządzeń, zmiana sterownika)
- [ ] Obsługa przełączania T-box / T-box Zone
- [ ] Obsługa trybu Single / Group mode
- [ ] Walidacja formularza po stronie klienta (duplikaty adresów, puste pola)
- [ ] Wywołanie API i renderowanie tabel wynikowych
- [ ] Nawigacja między urządzeniami (strzałki ← →)
- [ ] Responsywny layout (tablet/desktop)

**Rezultat:** Działająca aplikacja webowa funkcjonalnie równoważna POC.

---

### Etap 4 — Wdrożenie (deployment)

**Cel:** Udostępnić aplikację pod adresem URL.

**Zadania:**
- [ ] Wybrać platformę hostingową (np. Railway, Render, VPS)
- [ ] Skonfigurować `Dockerfile` lub konfigurację WSGI/ASGI
- [ ] Skonfigurować zmienne środowiskowe
- [ ] Ustawić pipeline CI/CD (automatyczny deploy po push do main)
- [ ] Skonfigurować domenę
- [ ] Przetestować na środowisku produkcyjnym

**Rezultat:** Aplikacja dostępna publicznie pod adresem URL.

---

### Etap 5 — Rozbudowa (funkcje dodatkowe)

Funkcje planowane po pierwszym wdrożeniu:

- [ ] **Eksport do PDF/CSV** — gotowy raport rejestrów do wydruku lub przekazania
- [ ] **Tryb porównania** — zestawienie dwóch konfiguracji obok siebie
- [ ] **Historia obliczeń** — zapisywanie wyników w przeglądarce (localStorage)
- [ ] **Panel dodawania urządzeń przez GUI** — formularz webowy do tworzenia nowych plików JSON bez edycji pliku ręcznie
- [ ] **Wersjonowanie urządzeń** — obsługa różnych wersji firmware tego samego modelu (różne mapy rejestrów)
- [ ] **Tryb ciemny** (dark mode)
- [ ] **Internacjonalizacja** (EN/PL)

---

## Historia projektu — POC

Pierwsza wersja (`KALKULATOR BMS/`) powstała jako **proof of concept** w Pythonie z interfejsem Tkinter. Działała poprawnie i potwierdziła logikę obliczeń, ale miała szereg ograniczeń dyskwalifikujących ją jako gotowe wdrożenie:

| Problem | Opis |
|---|---|
| Dane w kodzie | Wszystkie rejestry hardkodowane wewnątrz funkcji Python |
| Duplikacja kodu | `get_registers()` i `get_device_zone_registers()` zawierają identyczne definicje urządzeń |
| Brak rozszerzalności | Dodanie nowego urządzenia wymaga zmiany kodu |
| Desktop only | Tkinter — brak dostępu przez przeglądarkę |
| Brak testów | Logika obliczeniowa nieprzetestowana automatycznie |
| Niekompletny reset | Przycisk "Serwisowy" tylko niszczy ramkę, nie resetuje stanu |
| Dług techniczny | `locals()[ir_name]` — wybór zmiennej przez string, kruche rozwiązanie |

Nowa wersja (`Kalkulator BMS v.2/`) rozwiązuje wszystkie powyższe problemy.

---

*Projekt tworzony iteracyjnie — każdy etap jest niezależnie działającą wersją.*
