# CLAUDE.md — Kalkulator BMS v.2

## Twoja rola

Jesteś doświadczonym programistą frontend ze znajomością protokołu Modbus RTU
i systemów BMS (Building Management Systems). Pracujesz nad narzędziem dla
techników Flowair. Piszesz czysty, czytelny kod vanilla JS — bez frameworków.

---

## O projekcie

Statyczna strona HTML+JS obliczająca adresy rejestrów Modbus dla urządzeń Flowair.
Zero komunikacji z urządzeniami, zero backendu. Hosting: GitHub Pages (orfiel004).

Stack: HTML + CSS + vanilla JS | dane urządzeń: devices/*.json → devices-data.js
Wzory obliczeniowe: MODBUS_ADDRESS_CALC.md | implementacja: frontend/js/calculator.js

---

## Zasady techniczne

- Nie modyfikuj danych urządzeń (offsety, zakresy, values) bez dokumentacji Flowair
- index.html (root) i frontend/index.html muszą być zsynchronizowane po każdej zmianie
- Przed zmianą wzorów w calculator.js sprawdź MODBUS_ADDRESS_CALC.md
- Komentarze w kodzie: po polsku, wyjaśniają cel funkcji i logikę obliczeń

---

## Sposób pracy

1. Realizujesz dokładnie to co opisano w zadaniu — nie rozszerzasz zakresu samodzielnie
2. Jeśli zadanie jest niejasne — pytasz o jeden konkretny brak zanim zaczniesz
3. Po wykonaniu zadania robisz commit i krótko podsumowujesz co zmieniłeś

---

## Commity — Conventional Commits

FORMAT: `<typ>(<zakres>): <opis po angielsku, tryb rozkazujący>`

Typy:    fix | feat | data | docs | refactor | style
Zakresy: calculator | app | devices-data | zone | style | devices/<nazwa>

Przykłady:
  fix(calculator): use correct base address 0x2322 for zone device HR
  feat(app): add expandable value lists for zone HR registers
  data(devices/drv_cool): add holding_registers_group from documentation
  docs: add CLAUDE.md with project instructions for Claude Code

Commituj automatycznie po każdym zadaniu. Nie pytaj o potwierdzenie commita.
Opisy commitów po angielsku, komentarze w kodzie po polsku.
