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

