# TASK_027 — Excel: osobne kolumny dla adresu urządzenia i strefy

## Cel

W wygenerowanym pliku Excel dodać osobne kolumny:
- **Adres** — adres Modbus urządzenia (np. `3`)
- **Strefa** — numer strefy, jeśli dotyczy (np. `2`); puste jeśli brak

Docelowy układ kolumn (8 kolumn):

| Sekcja | Adres | Strefa | Typ | Adres HEX | Adres DEC | Nazwa rejestru | Opis |

---

## Skąd wziąć adres i strefę?

Badge nagłówka bloku (`.result-block-header .badge`) zawiera tekst w stylu:
- `Adres: 3, Strefa: 2` (M-box z adresem i strefą)
- `Adres: 3` (M-box bez strefy)
- `addr=3` lub podobne (T-box)

Należy sparsować badge regexem i wyciągnąć liczby.

---

## Zmiana — `frontend/js/app.js`, funkcja `exportToExcel()`

### 1. Zaktualizuj nagłówki kolumn

Znajdź:
```js
  const HDR = currentLang === 'en'
    ? ['Section', 'Type', 'Address HEX', 'Address DEC', 'Register name', 'Description']
    : ['Sekcja',  'Typ',  'Adres HEX',   'Adres DEC',   'Nazwa rejestru', 'Opis'];
```

Zamień na:
```js
  const HDR = currentLang === 'en'
    ? ['Section', 'Address', 'Zone', 'Type', 'Address HEX', 'Address DEC', 'Register name', 'Description']
    : ['Sekcja',  'Adres',   'Strefa', 'Typ', 'Adres HEX',  'Adres DEC',   'Nazwa rejestru', 'Opis'];
```

### 2. Wyciągnij adres i strefę z badge'a

Znajdź:
```js
    // Nazwa sekcji z nagłówka bloku
    const h3 = block.querySelector('.result-block-header h3');
    const sectionName = h3 ? h3.textContent.trim() : '';
```

Zamień na:
```js
    // Nazwa sekcji z nagłówka bloku
    const h3 = block.querySelector('.result-block-header h3');
    const sectionName = h3 ? h3.textContent.trim() : '';

    // Adres i strefa z badge'a (np. "Adres: 3, Strefa: 2" lub "addr=3")
    const badge = block.querySelector('.result-block-header .badge');
    const badgeText = badge ? badge.textContent.trim() : '';
    const addrMatch  = badgeText.match(/(?:Adres|addr)[=:\s]+(\d+)/i);
    const zoneMatch  = badgeText.match(/(?:Strefa|zone)[=:\s]+(\d+)/i);
    const deviceAddr = addrMatch ? addrMatch[1] : '';
    const deviceZone = zoneMatch ? zoneMatch[1] : '';
```

### 3. Zaktualizuj wiersze danych

Znajdź:
```js
        rows.push([sectionName, typeShort, addrHex, addrDec, name, description]);
```

Zamień na:
```js
        rows.push([sectionName, deviceAddr, deviceZone, typeShort, addrHex, addrDec, name, description]);
```

### 4. Zaktualizuj szerokości kolumn

Znajdź:
```js
  ws['!cols'] = [
    { wch: 22 }, // Sekcja
    { wch: 5  }, // Typ
    { wch: 13 }, // Adres HEX
    { wch: 11 }, // Adres DEC
    { wch: 28 }, // Nazwa rejestru
    { wch: 55 }, // Opis
  ];
```

Zamień na:
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

---

## Weryfikacja

1. Oblicz rejestry dla 2 urządzeń M-box (np. LEO D addr=1 strefa=1, ELIS addr=3 strefa=2)
2. Kliknij „Eksportuj Excel"
3. Otwórz plik — sprawdź że:
   - Kolumna A: nazwa urządzenia (`LEO D`, `ELIS`, `Strefa 1`)
   - Kolumna B: adres Modbus (`1`, `3`, puste dla sekcji systemowych)
   - Kolumna C: strefa (`1`, `2`, puste jeśli nie dotyczy)
   - Kolumna D: typ (`IR` / `HR`)
   - Kolumny E–H: adresy HEX, DEC, nazwa, opis
4. Sprawdź też T-box — adres urządzenia widoczny w kolumnie B

---

## Commit

```
fix(export): split device address and zone into separate Excel columns
```
