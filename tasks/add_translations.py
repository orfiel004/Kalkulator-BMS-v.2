#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dodaje pola description_en i values_en do wszystkich plików devices/*.json.
Bezpieczna metoda: modyfikuje dane przez json.load/json.dump, nie przez edycję tekstu.
"""
import json, os

# ===========================================================
# Słownik tłumaczeń description_en — klucz: (device_name, register_name)
# Fallback: klucz (None, register_name) dla rejestrów wspólnych
# ===========================================================
DESCRIPTION_EN = {
    # --- drv_ax ---
    ('drv_ax', 'T1'):               'Outdoor air temperature (T1 sensor).',
    ('drv_ax', 'T3'):               'Supply air temperature after water heat exchanger (T3 sensor).',
    ('drv_ax', 'T4'):               'Room temperature (T4 sensor).',
    ('drv_ax', 'T5'):               'Water heat exchanger return pipe temperature (T5 sensor).',
    ('drv_ax', 'CurtainState1'):    'Controller status register — bits represent active functions and operating modes.',
    ('drv_ax', 'CurtainState2'):    'Controller status register extension.',
    ('drv_ax', 'CurtainState3'):    'Controller status register extension.',
    ('drv_ax', 'Fan1Speed'):        'Actual supply fan 1 speed [RPM].',
    ('drv_ax', 'Fan2Speed'):        'Actual supply fan 2 speed [RPM].',
    ('drv_ax', 'Fan3Speed'):        'Actual supply fan 3 speed [RPM].',
    ('drv_ax', 'Fan4Speed'):        'Actual supply fan 4 speed [RPM].',
    ('drv_ax', 'Fan5Speed'):        'Actual supply fan 5 speed [RPM].',
    ('drv_ax', 'Fan6Speed'):        'Actual supply fan 6 speed [RPM].',
    ('drv_ax', 'Fan7Speed'):        'Actual supply fan 7 speed [RPM].',
    ('drv_ax', 'FilterWorkTime'):   'Filter operating time. Actual value = 5 × register value [min].',
    ('drv_ax', 'ValveRelaysState'): 'Current valve status on VALVE_RELAYS contacts (L1, L2). 0=open, 1=closed.',
    ('drv_ax', 'Valve0-10State'):   'Current 0–10V valve status.',
    ('drv_ax', 'FanWorkMode'):               'Fan operating mode. Default: MANUAL.',
    ('drv_ax', 'Program'):                   'Curtain operating program (K1, K2...). Default: K1.',
    ('drv_ax', 'FWM_ManualHeatVentRef'):     'Fan capacity in MANUAL mode (HEAT or VENT). Default: 50%.',
    ('drv_ax', 'FWM_StandbyRef'):            'Fan capacity in STANDBY mode. Default: 20%.',
    ('drv_ax', 'FWM_AutoHeatVentMin'):       'Minimum fan capacity in AUTO mode (HEAT/VENT). Constraint: Min < Max. Default: 0%.',
    ('drv_ax', 'FWM_AutoHeatVentMax'):       'Maximum fan capacity in AUTO mode (HEAT/VENT). Constraint: Max > Min. Default: 100%.',
    ('drv_ax', 'EWM_HeatT3Ref'):            'Supply air setpoint temperature for HEAT mode. Default: 320 = 32.0°C.',
    ('drv_ax', 'EWM_HeatT5Max'):            'Return water temperature limit for HEAT mode. Default: 320 = 32.0°C.',
    ('drv_ax', 'EWM_HeatT5LimitMode'):      'Enable/disable return water temperature limit. Default: OFF.',
    ('drv_ax', 'PreheatT5Ref'):             'Return water temperature (T5) threshold to start fan (PREHEAT). Default: 300 = 30.0°C.',
    ('drv_ax', 'StandbyFanIdleDelay'):      'Fan idle delay in STANDBY mode [s]. Default: 300s. Constraint: ≥ StandbyValveIdleDelay.',
    ('drv_ax', 'StandbyValveIdleDelay'):    'Valve idle delay in STANDBY mode [s]. Default: 300s. Constraint: ≤ StandbyFanIdleDelay.',
    ('drv_ax', 'AntifreezeWareHouseOn'):    'Warehouse antifreeze protection. Default: OFF.',
    ('drv_ax', 'AntifreezeWareTempOn'):     'Warehouse antifreeze activation temperature threshold. Default: 70 = 7.0°C.',
    ('drv_ax', 'AntifreezeWaterExchangeOn'):'Water heat exchanger antifreeze protection. Default: ON.',
    ('drv_ax', 'AntifreezeWaterExchangeT3'):'Supply air temperature (T3) threshold for exchanger antifreeze activation. Default: 70 = 7.0°C.',
    ('drv_ax', 'AntifreezeWaterExchangeT5'):'Water temperature (T5) threshold for exchanger antifreeze activation. Default: 70 = 7.0°C.',
    ('drv_ax', 'PreheatOnOff'):             'Enable/disable preheat function. Default: OFF.',
    ('drv_ax', 'FilterMaxWorkTime'):        'Reset filter operating time counter. Default: OFF.',
    ('drv_ax', 'DoorOpenFreqAlphaThreshold'):'Door opening frequency detection threshold in SMART mode. Default: 60.',
    ('drv_ax', 'DoorOpenFreqTimePeriod'):   'Door opening frequency detection time period in SMART mode. Default: 300s.',
    ('drv_ax', 'FWMAutoAddHeatMin'):        'Minimum fan capacity in ADD HEAT mode, Auto. Default: 5%. Constraint: Min < Max.',
}

# ===========================================================
# Słownik tłumaczeń values_en — klucz: (register_name, value_key)
# ===========================================================
VALUES_EN = {
    # WorkMode — różne urządzenia
    ('WorkMode', '0'): {
        'WM_DEF — wartość domyślna po resecie zasilania': 'WM_DEF — default after power reset',
        'WM_DEF — domyślny po resecie': 'WM_DEF — default after reset',
        'WM_NS — tylko odczyt': 'WM_NS — read-only',
        'WM_TS — tylko odczyt': 'WM_TS — read-only',
        'OFF — urządzenie wyłączone': 'OFF — device off',
    },
    ('WorkMode', '1'): {
        'WM_OFF — urządzenie wyłączone': 'WM_OFF — device off',
        'WM_OFF — odszranianie wyłączone': 'WM_OFF — defrost disabled',
        'HEAT — tryb grzania': 'HEAT — heating mode',
        'WM_HEAT — tryb grzania': 'WM_HEAT — heating mode',
        'WM_HT_AUTO — automatyczne grzanie': 'WM_HT_AUTO — automatic heating',
        'WM_HT_AUTO — grzanie automatyczne': 'WM_HT_AUTO — automatic heating',
        'WM_HEAT_AUTO — automatyczne grzanie': 'WM_HEAT_AUTO — automatic heating',
        'WM_ON — urządzenie włączone': 'WM_ON — device on',
    },
    ('WorkMode', '2'): {
        'WM_AUTO_DEPEND — AUTO zależny od trybu pracy': 'WM_AUTO_DEPEND — AUTO dependent on operating mode',
        'WM_AUTO — tryb automatyczny': 'WM_AUTO — automatic mode',
        'VENT — wentylacja': 'VENT — ventilation',
        'WM_HEAT — tryb grzania': 'WM_HEAT — heating mode',
        'WM_HT_AUTO — automatyczne grzanie': 'WM_HT_AUTO — automatic heating',
        'WM_HT_AUTO — grzanie automatyczne': 'WM_HT_AUTO — automatic heating',
        'WM_HT_MANUAL — ręczne grzanie': 'WM_HT_MANUAL — manual heating',
        'WM_HEAT_AUTO — automatyczne grzanie': 'WM_HEAT_AUTO — automatic heating',
        'WM_HEAT_MANUAL — ręczne grzanie': 'WM_HEAT_MANUAL — manual heating',
        'WM_ON — urządzenie włączone': 'WM_ON — device on',
        'WM_VENT — wentylacja': 'WM_VENT — ventilation',
        'WM_OFF — urządzenie wyłączone': 'WM_OFF — device off',
    },
    ('WorkMode', '3'): {
        'WM_AUTO_INDEPEND — AUTO niezależny': 'WM_AUTO_INDEPEND — AUTO independent',
        'SMART — tryb automatyczny': 'SMART — automatic mode',
        'WM_HEAT — tryb grzania': 'WM_HEAT — heating mode',
        'WM_HT_MANUAL — ręczne grzanie': 'WM_HT_MANUAL — manual heating',
        'WM_HEAT_MANUAL — ręczne grzanie': 'WM_HEAT_MANUAL — manual heating',
        'WM_COOL_AUTO — automatyczne chłodzenie': 'WM_COOL_AUTO — automatic cooling',
        'WM_THERM — tryb termostatyczny': 'WM_THERM — thermostat mode',
        'WM_VENTILATION — wentylacja': 'WM_VENTILATION — ventilation',
    },
    ('WorkMode', '4'): {
        'WM_MANUAL — tryb ręczny': 'WM_MANUAL — manual mode',
        'WM_VENT — wentylacja': 'WM_VENT — ventilation',
        'WM_COOL_AUTO — automatyczne chłodzenie': 'WM_COOL_AUTO — automatic cooling',
        'WM_COOL_MANUAL — ręczne chłodzenie': 'WM_COOL_MANUAL — manual cooling',
        'WM_VENTILATION — wentylacja': 'WM_VENTILATION — ventilation',
    },
    ('WorkMode', '5'): {
        'WM_COOL_MANUAL — ręczne chłodzenie': 'WM_COOL_MANUAL — manual cooling',
        'WM_RAW — tryb surowy': 'WM_RAW — raw mode',
    },
    ('WorkMode', '6'): {
        'WM_VENT — wentylacja': 'WM_VENT — ventilation',
    },

    # ON/OFF generic
    ('EWM_HeatT5LimitMode', '1'): {'ON — aktywne': 'ON — active'},
    ('EWM_HeatT5LimitMode', '2'): {'OFF — wyłączone': 'OFF — disabled'},
    ('AntifreezeWareHouseOn', '1'): {'ON — aktywne': 'ON — active', 'WM_ON — włączony': 'WM_ON — enabled', 'ON — włączony': 'ON — enabled'},
    ('AntifreezeWareHouseOn', '2'): {'OFF — wyłączone': 'OFF — disabled', 'WM_OFF — wyłączony': 'WM_OFF — disabled', 'OFF — wyłączony': 'OFF — disabled'},
    ('AntiFreezeWareHouseOn', '1'): {'disable — wyłączony': 'disable — disabled'},
    ('AntiFreezeWareHouseOn', '2'): {'enable — włączony': 'enable — enabled'},
    ('AntifreezeWaterExchangeOn', '1'): {'ON — aktywne': 'ON — active'},
    ('AntifreezeWaterExchangeOn', '2'): {'OFF — wyłączone': 'OFF — disabled'},

    # recirculation_mode (CUBE)
    ('recirculation_mode', '0'): {'RM_AUTO — tryb automatyczny': 'RM_AUTO — automatic mode'},
    ('recirculation_mode', '1'): {'RM_MANUAL — tryb ręczny': 'RM_MANUAL — manual mode'},

    # work_mode_NW (CUBE)
    ('work_mode_NW', '0'): {'WM_NW_AUTO — tryb automatyczny dyfuzora': 'WM_NW_AUTO — automatic diffuser mode'},
    ('work_mode_NW', '1'): {'WM_NW_MANUAL — tryb ręczny dyfuzora': 'WM_NW_MANUAL — manual diffuser mode'},

    # room_sensor_selection (CUBE)
    ('room_sensor_selection', '1'): {'TSL_PREFERRED_TLEAD — wartość przez Modbus (gdy lokalny czujnik CUBE jest aktywny)': 'TSL_PREFERRED_TLEAD — value via Modbus (when local CUBE sensor is active)'},
    ('room_sensor_selection', '2'): {'TSL_TLEAD — wartość przez Modbus (tylko gdy lokalny czujnik CUBE jest wyłączony)': 'TSL_TLEAD — value via Modbus (only when local CUBE sensor is disabled)'},
    ('room_sensor_selection', '3'): {'TSL_PREFERRED_LOCAL — czujnik lokalny CUBE (gdy jest aktywny)': 'TSL_PREFERRED_LOCAL — local CUBE sensor (when active)'},

    # CO2 (CUBE)
    ('CO2_status', '0'): {'CO2_STAT_OK — status CO2 OK': 'CO2_STAT_OK — CO2 status OK'},
    ('CO2_status', '1'): {'CO2_STAT_L1 — poziom CO2 próg 1': 'CO2_STAT_L1 — CO2 level threshold 1'},
    ('CO2_status', '2'): {'CO2_STAT_L2 — poziom CO2 próg 2': 'CO2_STAT_L2 — CO2 level threshold 2'},
    ('CO2_source', '0'): {'CO2_SOURCE_LOCAL — lokalny czujnik CO2 w CUBE': 'CO2_SOURCE_LOCAL — local CO2 sensor in CUBE'},
    ('CO2_source', '1'): {'CO2_SOURCE_TBOX — źródło CO2 z T-box': 'CO2_SOURCE_TBOX — CO2 source from T-box'},

    # TLeadSensorSelect / TleadSensorSelect
    ('TLeadSensorSelect', '0'): {'TSL_TNS — tylko odczyt': 'TSL_TNS — read-only'},
    ('TLeadSensorSelect', '1'): {
        'TSL_TLEAD — wartość przez Modbus (TLeadVal)': 'TSL_TLEAD — value via Modbus (TLeadVal)',
        'TSL_TLEAD — wartość przez Modbus': 'TSL_TLEAD — value via Modbus',
    },
    ('TLeadSensorSelect', '2'): {'TSL_T3 — czujnik T3 (złącze DRV)': 'TSL_T3 — T3 sensor (DRV connector)'},
    ('TLeadSensorSelect', '3'): {
        'TSL_T4 — czujnik T4 (złącze DRV)': 'TSL_T4 — T4 sensor (DRV connector)',
        'TSL_T4 — czujnik T4 (temperatura pomieszczenia)': 'TSL_T4 — T4 sensor (room temperature)',
        'TSL_T4 — czujnik T4 (powietrze przed wymiennikiem)': 'TSL_T4 — T4 sensor (air before heat exchanger)',
        'TSL_T4 — czujnik T4 (powietrze przed wymiennikiem wodnym)': 'TSL_T4 — T4 sensor (air before water heat exchanger)',
    },
    ('TleadSensorSelect', '0'): {'TSL_TNS — tylko odczyt': 'TSL_TNS — read-only', 'T_NS — tylko odczyt': 'T_NS — read-only'},
    ('TleadSensorSelect', '1'): {
        'TSL_TLEAD — wartość przez Modbus (TLeadVal)': 'TSL_TLEAD — value via Modbus (TLeadVal)',
        'TSL_TLEAD — wartość przez Modbus': 'TSL_TLEAD — value via Modbus',
        'T_LEAD — wartość przez Modbus (TLeadVal)': 'T_LEAD — value via Modbus (TLeadVal)',
    },
    ('TleadSensorSelect', '2'): {'TSL_T3 — czujnik T3 (złącze DRV)': 'TSL_T3 — T3 sensor (DRV connector)'},
    ('TleadSensorSelect', '3'): {
        'TSL_T4 — czujnik T4 (złącze DRV)': 'TSL_T4 — T4 sensor (DRV connector)',
        'TSL_T4 — czujnik T4 (powietrze przed wymiennikiem)': 'TSL_T4 — T4 sensor (air before heat exchanger)',
    },

    # drv_el DestModeForce / DestMode
    ('DestModeForce', '1'): {
        'DEST_MDF_OFF — wymuszanie destratyfikacji wyłączone': 'DEST_MDF_OFF — destratification forcing disabled',
        'DEST_MDF_OFF — wymuś wyłączenie': 'DEST_MDF_OFF — force off',
    },
    ('DestModeForce', '2'): {
        'DEST_MDF_ON — wymuszanie destratyfikacji włączone': 'DEST_MDF_ON — destratification forcing enabled',
        'DEST_MDF_ON — wymuś włączenie': 'DEST_MDF_ON — force on',
    },
    ('DestMode', '1'): {
        'DEST_MD_OFF — destratyfikacja wyłączona': 'DEST_MD_OFF — destratification disabled',
        'DEST_MD_OFF — wyłączony': 'DEST_MD_OFF — disabled',
    },
    ('DestMode', '2'): {
        'DEST_MD_AUTO_DEPEND — AUTO zależny od trybu pracy': 'DEST_MD_AUTO_DEPEND — AUTO dependent on operating mode',
    },
    ('DestMode', '3'): {
        'DEST_MD_AUTO_INDEPEND — AUTO niezależny': 'DEST_MD_AUTO_INDEPEND — AUTO independent',
    },

    # ElectricHeaterPTCPower (drv_el)
    ('ElectricHeaterPTCPower', '1'): {'Off — grzanie wyłączone': 'Off — heating disabled'},
    ('ElectricHeaterPTCPower', '2'): {'1 — 1 stopień grzania': '1 — heating stage 1'},
    ('ElectricHeaterPTCPower', '3'): {'2 — 2 stopnie grzania': '2 — heating stage 2'},
    ('ElectricHeaterPTCPower', '4'): {'3 — 3 stopnie grzania (tylko SW3.5=K1)': '3 — heating stage 3 (only SW3.5=K1)'},

    # drv_elis / drv_slim CurtainHeatRef, HeaterHeatRef, CurtainProgram, ContactDoor
    ('CurtainHeatRef', '0'): {'HEAT_NS — tylko odczyt': 'HEAT_NS — read-only'},
    ('CurtainHeatRef', '1'): {'HEAT_ON — grzanie włączone': 'HEAT_ON — heating on'},
    ('CurtainHeatRef', '2'): {'HEAT_OFF — grzanie wyłączone': 'HEAT_OFF — heating off'},
    ('HeaterHeatRef', '0'): {'HEAT_NS — tylko odczyt': 'HEAT_NS — read-only'},
    ('HeaterHeatRef', '1'): {'HEAT_ON — grzanie włączone': 'HEAT_ON — heating on'},
    ('HeaterHeatRef', '2'): {'HEAT_OFF — grzanie wyłączone': 'HEAT_OFF — heating off'},
    ('CurtainProgram', '0'): {'CURT_PRG_NS — brak wymuszenia': 'CURT_PRG_NS — no override'},
    ('CurtainProgram', '1'): {'CURT_PRG_K1 — wymuszenie SW3 na K1': 'CURT_PRG_K1 — force SW3 to K1'},
    ('CurtainProgram', '2'): {'CURT_PRG_K2 — wymuszenie SW3 na K2': 'CURT_PRG_K2 — force SW3 to K2'},
    ('ContactDoor', '1'): {'DOOR_OPEN — drzwi otwarte': 'DOOR_OPEN — door open'},
    ('ContactDoor', '2'): {'DOOR_CLOSE — drzwi zamknięte': 'DOOR_CLOSE — door closed'},

    # drv_km DamperForceMode, FanRoofMode, FilterTimeCntRst, ThermostatModeState
    ('DamperForceMode', '0'): {'DAMPER_FMD_NS — tylko odczyt': 'DAMPER_FMD_NS — read-only'},
    ('DamperForceMode', '1'): {'DAMPER_FMD_OFF — wymuszanie wyłączone': 'DAMPER_FMD_OFF — forcing disabled'},
    ('DamperForceMode', '2'): {'DAMPER_FMD_ON — wymuszanie włączone (jeśli T1 < DamperForceTempRef)': 'DAMPER_FMD_ON — forcing enabled (if T1 < DamperForceTempRef)'},
    ('FanRoofMode', '0'): {'FR_MD_NS — tylko odczyt': 'FR_MD_NS — read-only'},
    ('FanRoofMode', '1'): {
        'FR_MD_01 — zależny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)': 'FR_MD_01 — dependent on damper position (DamperLevelRef) and fan setpoint (FanEffRef)',
        'FR_MD_01 — zależny od pozycji klapy i nastawy wentylatora': 'FR_MD_01 — dependent on damper position and fan setpoint',
    },
    ('FanRoofMode', '2'): {
        'FR_MD_02 — zależny wyłącznie od pozycji klapy (DamperLevelRef)': 'FR_MD_02 — dependent on damper position only (DamperLevelRef)',
        'FR_MD_02 — zależny wyłącznie od pozycji klapy': 'FR_MD_02 — dependent on damper position only',
    },
    ('FilterTimeCntRst', '0'): {'FLT_CNT_RST_NS — tylko odczyt (po resecie)': 'FLT_CNT_RST_NS — read-only (after reset)'},
    ('FilterTimeCntRst', '1'): {
        'FLT_CNT_RST — reset licznika czasu filtra': 'FLT_CNT_RST — reset filter time counter',
        'FLT_CNT_RST — reset licznika czasu filtra (FilterWorkTime = 0)': 'FLT_CNT_RST — reset filter time counter (FilterWorkTime = 0)',
    },
    ('ThermostatModeState', '1'): {'THERMO_MD_ON — tryb termostatu włączony': 'THERMO_MD_ON — thermostat mode on'},
    ('ThermostatModeState', '2'): {'THERMO_MD_OFF — tryb termostatu wyłączony': 'THERMO_MD_OFF — thermostat mode off'},

    # drv_luna OnOff
    ('OnOff', '0'): {'OFF — wyłączone': 'OFF — off'},
    ('OnOff', '1'): {'ON — włączone': 'ON — on'},

    # drv_oxen OxenState, OxenMode
    ('OxenState', '0'): {'OX_OFF — wyłączony': 'OX_OFF — off'},
    ('OxenState', '1'): {'OX_ON — włączony': 'OX_ON — on'},
    ('OxenState', '2'): {'OX_ON — włączony': 'OX_ON — on'},
    ('OxenState', '3'): {'OX_ON — włączony': 'OX_ON — on'},
    ('OxenMode', '0'): {'OXEN_MD_AUTO — automatyczny (automatyczna regulacja bypass)': 'OXEN_MD_AUTO — automatic (automatic bypass control)'},
    ('OxenMode', '1'): {'OXEN_MD_WINTER — tryb zimowy (bypass wyłączony)': 'OXEN_MD_WINTER — winter mode (bypass off)'},
    ('OxenMode', '2'): {'OXEN_MD_SUMMER — tryb letni (bypass włączony)': 'OXEN_MD_SUMMER — summer mode (bypass on)'},

    # drv_robur_next / drv_robur_next_km GasAlarmReset, STBAlarmReset, ContModeFanSpeedRef, GasBurnerLvlRef
    ('GasAlarmReset', '0'): {'RO — tylko odczyt': 'RO — read-only'},
    ('GasAlarmReset', '1'): {'ON — wysyłanie sygnału resetującego (ciągłe)': 'ON — sending reset signal (continuous)'},
    ('GasAlarmReset', '2'): {'OFF — zatrzymanie sygnału resetującego': 'OFF — stop reset signal'},
    ('STBAlarmReset', '1'): {'ON — reset alarmu aktywny': 'ON — alarm reset active'},
    ('STBAlarmReset', '2'): {'OFF — reset alarmu nieaktywny': 'OFF — alarm reset inactive'},
    ('ContModeFanSpeedRef', '0'): {'Fan OFF — wentylator wyłączony': 'Fan OFF — fan off'},
    ('ContModeFanSpeedRef', '100'): {'Fan ON — wentylator włączony': 'Fan ON — fan on'},
    ('GasBurnerLvlRef', '0'): {'RO — tylko odczyt': 'RO — read-only'},
    ('GasBurnerLvlRef', '1'): {'FIRST_STEP — pierwszy stopień spalania': 'FIRST_STEP — first combustion stage'},
    ('GasBurnerLvlRef', '2'): {'SECOND_STEP — drugi stopień spalania': 'SECOND_STEP — second combustion stage'},
}


def get_device_key(fname):
    return fname.replace('.json', '')


def translate_value(reg_name, val_key, val_text):
    """Zwraca angielskie tłumaczenie wartości lub None jeśli brak."""
    mapping = VALUES_EN.get((reg_name, str(val_key)))
    if mapping and val_text in mapping:
        return mapping[val_text]
    return None


def add_translations(obj, device_key):
    """Rekurencyjnie dodaje description_en i values_en do obiektów rejestrów."""
    if isinstance(obj, dict):
        reg_name = obj.get('name')

        # description_en
        if reg_name and 'description' in obj and 'description_en' not in obj:
            key = (device_key, reg_name)
            if key in DESCRIPTION_EN:
                obj['description_en'] = DESCRIPTION_EN[key]

        # values_en
        if reg_name and 'values' in obj and isinstance(obj['values'], dict) and 'values_en' not in obj:
            values_en = {}
            for k, v in obj['values'].items():
                translated = translate_value(reg_name, k, v)
                if translated:
                    values_en[k] = translated
                else:
                    values_en[k] = v  # zachowaj oryginał jeśli brak tłumaczenia
            if any(values_en[k] != obj['values'][k] for k in values_en):
                obj['values_en'] = values_en

        for val in obj.values():
            add_translations(val, device_key)

    elif isinstance(obj, list):
        for item in obj:
            add_translations(item, device_key)


devices_dir = 'devices'
for fname in sorted(os.listdir(devices_dir)):
    if not fname.endswith('.json') or fname == '_schema.json':
        continue
    fpath = os.path.join(devices_dir, fname)
    device_key = get_device_key(fname)

    with open(fpath, encoding='utf-8') as f:
        data = json.load(f)

    add_translations(data, device_key)

    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')

    print(f'OK: {fname}')

print('\nWszystkie pliki zaktualizowane.')
