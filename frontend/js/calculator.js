/**
 * calculator.js — Silnik obliczania adresów rejestrów Modbus
 *
 * Wzory (T-box):
 *   IR  Single:  offset + 256 + (deviceAddr - 1) × 64
 *   HR  Single:  offset + 256 + (deviceAddr - 1) × 64
 *   HR  Group:   offset + 4096 + (groupNum - 1) × 256
 *
 * W trybie Group, IR adresy są takie same jak w Single.
 */

const Calculator = {

  /**
   * Adres rejestru IR lub HR Single dla urządzenia przy danym adresie Modbus.
   * @param {number} offset      - bazowy numer rejestru z JSON
   * @param {number} deviceAddr  - adres Modbus urządzenia (1–31)
   */
  calcSingleAddress(offset, deviceAddr) {
    return offset + 256 + (deviceAddr - 1) * 64;
  },

  /**
   * Adres rejestru HR Group.
   * @param {number} offset    - bazowy numer rejestru z JSON
   * @param {number} groupNum  - numer grupy (1, 2, 3, ...)
   */
  calcGroupAddress(offset, groupNum) {
    return offset + 4096 + (groupNum - 1) * 256;
  },

  /**
   * Konwersja DEC → HEX string (np. 260 → "0x0104")
   */
  toHex(dec) {
    return '0x' + dec.toString(16).toUpperCase().padStart(4, '0');
  },

  /**
   * Przypisuje numery grup wybranym urządzeniom na podstawie pola group_priority.
   * Każdy TYP urządzenia dostaje unikalny numer grupy (kolejno od 1).
   * Urządzenia tego samego typu (np. dwa DRV V) mają ten sam numer grupy.
   *
   * @param {string[]} selectedNames  - nazwy wybranych urządzeń (z duplikatami)
   * @param {Object}   allDevices     - słownik { nazwa: definicjaJSON }
   * @returns {Object} { "DRV V": 1, "DRV KM": 2, ... }
   */
  assignGroupNumbers(selectedNames, allDevices) {
    // Unikalne typy urządzeń wśród wybranych
    const uniqueNames = [...new Set(selectedNames)].filter(n => allDevices[n]);

    // Sortowanie wg group_priority (niższy = wcześniejsza grupa)
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

  /**
   * Buduje HTML z opisem wartości rejestru (enum lub zakres).
   */
  renderValueInfo(reg) {
    const parts = [];

    if (reg.values && Object.keys(reg.values).length > 0) {
      const items = Object.entries(reg.values)
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

    if (reg.description) {
      parts.push(`<div class="val-desc">${reg.description}</div>`);
    }

    return parts.join('') || '<span style="color:#ccc">—</span>';
  },

  /**
   * Oblicza kompletną tabelę rejestrów dla jednego urządzenia.
   *
   * @param {Object} device     - definicja urządzenia z JSON
   * @param {number} deviceAddr - adres Modbus urządzenia (1–31)
   * @param {string} mode       - "single" | "group"
   * @param {number} groupNum   - numer grupy (tylko dla mode="group")
   * @returns {{ ir: Array, hrSingle: Array, hrGroup: Array }}
   *   Każdy element: { offset, addrDec, addrHex, name, reg (pełny obiekt) }
   */
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
      ir:       (device.input_registers              || []).map(r => mapReg(r, singleFn)),
      hrSingle: (device.holding_registers_single     || []).map(r => mapReg(r, singleFn)),
      hrGroup:  (device.holding_registers_group      || []).map(r => mapReg(r, groupFn)),
    };
  },
};
