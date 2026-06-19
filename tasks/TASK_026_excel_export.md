# TASK_026 — Eksport wyników do pliku Excel

## Status
✅ ZAIMPLEMENTOWANE (przez Cowork, nie Claude Code)

## Cel
Przycisk „Eksportuj Excel" / „Export Excel" obok „Drukuj" w pasku wyników.
Po kliknięciu generuje plik `.xlsx` z aktualnie obliczonymi rejestrami.
Stack: SheetJS (CDN), vanilla JS, parser DOM. Bez backendu.

---

## Wykonane zmiany

### 1. `frontend/js/translations.js`
Dodano klucze:
```js
// pl
'btn.export_xlsx': 'Eksportuj Excel',
// en
'btn.export_xlsx': 'Export Excel',
```

### 2. `frontend/index.html` + `index.html` (root)
Dodano przycisk za `btn-print`:
```html
<button id="btn-export-xlsx" data-i18n="btn.export_xlsx">Eksportuj Excel</button>
```

Dodano SheetJS CDN przed skryptami:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```

### 3. `frontend/css/style.css`
Styl przycisku (zielony akcent):
```css
#btn-export-xlsx {
  background: #f0faf4;
  border-color: #4caf82;
  color: #1a6b42;
  font-weight: 600;
}
#btn-export-xlsx:hover { background: #d8f3e5; }
```

Ukrycie przy druku (dodano do `@media print`):
```css
#btn-export-xlsx,
```

### 4. `frontend/js/app.js`
Listener:
```js
document.getElementById('btn-export-xlsx').addEventListener('click', exportToExcel);
```

Funkcja `exportToExcel()` (linie 849–943):
- Parsuje DOM: wszystkie `.result-block` → `.reg-section` → `.reg-table`
- Kolumny: Sekcja | Typ (IR/HR) | Adres HEX | Adres DEC | Nazwa rejestru | Opis
- Język opisu zgodny z aktywnym `currentLang`
- Opis pobierany z `.val-desc` lub `.values-list` w `.reg-detail-row`
- Nazwa pliku: `modbus_registers_YYYYMMDD.xlsx`
- Zakładka: „Rejestry" (PL) / „Registers" (EN)

---

## Commit
```
feat(export): add Excel export button using SheetJS
```

## Do zrobienia przez użytkownika
```bash
git add frontend/js/app.js frontend/js/translations.js frontend/index.html frontend/css/style.css index.html
git commit -m "feat(export): add Excel export button using SheetJS"
git push
```
