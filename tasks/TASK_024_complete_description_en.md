# TASK_024 — Kompletne tłumaczenia description_en + naprawa JSON

## Problem

1. Pliki `devices/*.json` w katalogu roboczym są uszkodzone (niezatwierdzone zmiany)
2. W zatwierdzonym HEAD większości rejestrów brakuje pola `description_en`

## Krok 1 — Przywróć devices/*.json z HEAD

```bash
git checkout HEAD -- devices/
```

Zweryfikuj:
```bash
python3 -c "import json,os; [json.load(open(f'devices/{f}',encoding='utf-8')) for f in os.listdir('devices') if f.endswith('.json') and f!='_schema.json']; print('JSON OK')"
```

---

## Krok 2 — Uruchom skrypt z kompletnymi tłumaczeniami

Zapisz jako `tasks/add_desc_en.py` i uruchom z katalogu głównego projektu.

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dodaje description_en do rejestrów które jej nie mają."""
import json, os

# Klucz: (device, register_name) → angielski opis
# Dla wpisów z device=None — pasuje do wszystkich urządzeń (fallback)
DESC = {
  # ── drv_ax ─────────────────────────────────────────────────────────────────
  ('drv_ax', 'ELIS AX (DRV AX)'): 'ELIS AX air curtain (multi-speed EC fans)',
  ('drv_ax', 'FWMAutoAddHeatMax'): 'Maximum fan capacity in ADD HEAT mode, Auto. Default: 5%. Constraint: Max > Min.',
  ('drv_ax', 'EWMSmartT124h'):     'Setpoint for VENT→HEAT transition in SMART mode. Default: 170 = 17.0°C. Constraint: ≤ EWMSmartT13h − 1K.',
  ('drv_ax', 'EWMSmartT13h'):      'Setpoint for HEAT→VENT transition in SMART mode. Default: 210 = 21.0°C. Constraint: ≥ EWMSmartT124h + 1K.',
  ('drv_ax', 'HeatT3_PI_KP'):      'Proportional gain KP of the T3 supply temperature PI controller. Default: 3.',
  ('drv_ax', 'HeatT3_PI_TI'):      'Integral time TI of the T3 supply temperature PI controller. Default: 180s.',
  ('drv_ax', 'HeatT5_PI_KP'):      'Proportional gain KP of the T5 return water temperature PI controller. Default: 3.',
  ('drv_ax', 'HeatT5_PI_TI'):      'Integral time TI of the T5 return water temperature PI controller. Default: 180s.',

  # ── drv_cool ───────────────────────────────────────────────────────────────
  ('drv_cool', 'LEO COOL (DRV COOL)'): 'Water heating/cooling unit',
  ('drv_cool', 'T3'):                  'Ceiling temperature (T3 sensor).',
  ('drv_cool', 'T4'):                  'Room temperature (T4 sensor).',
  ('drv_cool', 'FanEff'):              'Fan speed (3-speed AC fan).',
  ('drv_cool', 'AntifreezeState'):     'Warehouse antifreeze protection state — 8 bits.',
  ('drv_cool', 'FilterPressureState'): 'Filter pressure switch state.',
  ('drv_cool', 'FuseState'):           'Fan fuse state (bits). Example: 0x100 = OK, 0x200 = blown.',
  ('drv_cool', 'ValveState'):          'Water valve state.',
  ('drv_cool', 'FanEffRef'):           '3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_cool', 'ModeAuto_FanEffRefMin'):  'Minimum fan capacity in AUTO mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3',
  ('drv_cool', 'ModeAuto_FanEffRefMax'):  'Maximum fan capacity in AUTO mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3',
  ('drv_cool', 'ModeManual_FanEffRef'):   'Fan capacity after reaching target temperature in MANUAL mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3',

  # ── drv_cube ───────────────────────────────────────────────────────────────
  ('drv_cube', 'CUBE (DRV CUBE)'):            'CUBE ventilation unit with swirl diffuser and CO2 sensor',
  ('drv_cube', 'ambient_temp_value'):          'Outdoor air temperature.',
  ('drv_cube', 'supply_temp_value'):           'Supply air temperature.',
  ('drv_cube', 'return_temp_value'):           'Return air temperature.',
  ('drv_cube', 'water_temp_value'):            'Heat exchanger water temperature.',
  ('drv_cube', 'TempRoom_ADD'):                'Temperature from additional room sensor.',
  ('drv_cube', 'recirculation_damper_level'):  'Current recirculation damper position.',
  ('drv_cube', 'swirl_diffuser_position'):     'Swirl diffuser position.',
  ('drv_cube', 'rotary_level'):               'Rotary level.',
  ('drv_cube', 'fan_supply_flow'):            'Supply air flow.',
  ('drv_cube', 'gas_heating_value'):          'Gas heating value.',
  ('drv_cube', 'CO2_status'):                 'CO2 status — LSB value (MSB ignored).',
  ('drv_cube', 'Rooftop_work_mode'):          'Rooftop unit operating mode setpoint — LSB value.',
  ('drv_cube', 'Rooftop_current_work_mode'):  'Rooftop unit current operating mode — LSB value.',
  ('drv_cube', 'Alarm'):                      'Alarm state — LSB value.',
  ('drv_cube', 'WorkMode'):                   '16-bit register: MSB ignored, LSB = operating mode',
  ('drv_cube', 'fan_eff'):                    'EC fan capacity setpoint, continuous regulation 0–100%',
  ('drv_cube', 'fan_eff_CO2_I'):              'EC fan capacity setpoint for CO2 sensor threshold 1',
  ('drv_cube', 'fan_eff_CO2_II'):             'EC fan capacity setpoint for CO2 sensor threshold 2',
  ('drv_cube', 'recirculation_mode'):         '16-bit register: MSB ignored, LSB = recirculation mode',
  ('drv_cube', 'recirculation_value'):        'Recirculation value, continuous regulation 0–100%',
  ('drv_cube', 'recirculation_value_CO2_I'):  'Recirculation value for CO2 sensor threshold 1',
  ('drv_cube', 'recirculation_value_CO2_II'): 'Recirculation value for CO2 sensor threshold 2',
  ('drv_cube', 'work_mode_NW'):               'Swirl diffuser (NW) operating mode. 16-bit register: MSB ignored, LSB = mode',
  ('drv_cube', 'swirl_diffuser_level'):       'Swirl diffuser opening level',
  ('drv_cube', 'Htg_swirl_diffuser_level'):   'Swirl diffuser opening level in heating mode',
  ('drv_cube', 'Clg_swirl_diffuser_level'):   'Swirl diffuser opening level in cooling mode',
  ('drv_cube', 'temperature_ref'):            'Target room temperature',
  ('drv_cube', 'temperature_room'):           'Room temperature sent to the device via Modbus',
  ('drv_cube', 'room_sensor_selection'):      'Room temperature source selection',
  ('drv_cube', 'CO2_status'):                 'CO2 status written by T-box to the device. 16-bit register: MSB ignored, LSB = status',
  ('drv_cube', 'CO2_source'):                 'CO2 data source selection. 16-bit register: MSB ignored, LSB = source',

  # ── drv_d ──────────────────────────────────────────────────────────────────
  ('drv_d', 'LEO D (DRV D)'): 'Destratification fan (DRV D / LEO D)',
  ('drv_d', 'T3'):             'Ceiling temperature (T3 sensor).',
  ('drv_d', 'T4'):             'Room temperature (T4 sensor).',
  ('drv_d', 'FanEff'):         'Fan speed (3-speed AC fan).',
  ('drv_d', 'DestStatus'):     'Destratification state: active when (DestTempRef > Td–Tm) and (Tz > Tm). Td=T3, Tm=TLeadVal or T4.',
  ('drv_d', 'FuseState'):      'Fan fuse state (bits 8–11). Example: 0x100 = OK, 0x200 = blown.',
  ('drv_d', 'FanEffRef'):      '3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_d', 'DestTempRef'):    'Destratification threshold: condition DestTempRef > Td − Tm (Td=T3 ceiling, Tm=lead sensor)',
  ('drv_d', 'WorkModeTempRef'):'Target ceiling temperature in manual mode; condition: WorkModeTempRef > lead sensor',

  # ── drv_el ─────────────────────────────────────────────────────────────────
  ('drv_el', 'LEO EL (DRV EL)'): 'Electric heater',
  ('drv_el', 'T3'):               'Ceiling temperature (T3 sensor).',
  ('drv_el', 'T4'):               'Room temperature (T4 sensor).',
  ('drv_el', 'FanEff'):           'Fan speed (3-speed AC fan).',
  ('drv_el', 'AntifreezeeState'): 'Antifreeze protection state.',
  ('drv_el', 'DestStatus'):       'Destratification state.',
  ('drv_el', 'ThermalContactState'): 'Thermal contact state. When = 1: FanEffRef → 100, ElectricHeaterPTCPower → 0 (overheating protection).',
  ('drv_el', 'FuseState'):        'Fan fuse state (EC/3V/roof fans, bits). Example: 0x100 = 3V fan OK.',
  ('drv_el', 'PTCHeaterPowerState'): 'PTC electric heater power. LEO EL L (SW3.5=K1) or LEO EL S (SW3.5=K2).',
  ('drv_el', 'ElectricHeaterType'): 'Electric heater type.',
  ('drv_el', 'FanEffRef'):        '3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_el', 'DestTempRef'):      'Destratification threshold: condition DestTempRef > Td − Tm (Td=T3 ceiling, Tm=lead sensor)',
  ('drv_el', 'ElectricHeaterPTCPower'): 'SW3.5=K1 (3 stages): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 stages): 1=Off, 2=1heat, 3=2heat, 4=2heat',
  ('drv_el', 'ModeAuto_FanEffRef'):    'Fan speed in AUTO mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3',
  ('drv_el', 'ModeManual_FanEffRef'):  'Fan speed in manual mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3',

  # ── drv_elis ───────────────────────────────────────────────────────────────
  ('drv_elis', 'ELIS (DRV ELIS)'):      'ELIS air curtain',
  ('drv_elis', 'T3'):                   'Supply air temperature after water heat exchanger (T3 sensor).',
  ('drv_elis', 'T4'):                   'Air temperature before water heat exchanger (T4 sensor).',
  ('drv_elis', 'CurtainFanSpeed'):      'Curtain fan speed (3-speed AC fan: 0=stop, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3).',
  ('drv_elis', 'ValveState'):           'Water valve state.',
  ('drv_elis', 'HeaterFanSpeed'):       'Heater fan speed (3-speed AC fan).',
  ('drv_elis', 'ContactDoor'):          'Door contact state.',
  ('drv_elis', 'HeaterDetect'):         'Heater detection procedure (ELIS-DUO).',
  ('drv_elis', 'AntifreezeState'):      'Antifreeze protection state — 8 bits for individual modes.',
  ('drv_elis', 'FuseState'):            'Fan fuse state (bits 8–11). Example: 0x100 = OK, 0x200 = blown.',
  ('drv_elis', 'CurtainElectricpower'): 'Curtain electric heater power (L1/L2 outputs on VALVE connector).',
  ('drv_elis', 'CurtainFanSpeedRef'):   'Curtain fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_elis', 'HeaterFanSpeedRef'):    'Heater fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_elis', 'CurtainFanIdleRef'):    'Curtain fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_elis', 'HeaterFanIdleRef'):     'Heater fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_elis', 'FanIdleDelay'):         'Fan stand-by delay in seconds; 65535 = infinite',
  ('drv_elis', 'ValveIdleDelay'):       'Valve stand-by delay in seconds; 65535 = infinite. Constraint: ValveIdleDelay < FanIdleDelay',

  # ── drv_km ─────────────────────────────────────────────────────────────────
  ('drv_km', 'LEO KM (DRV KM)'):          'Mixing chamber ventilation unit',
  ('drv_km', 'T1'):                        'Fresh air temperature (T1 sensor).',
  ('drv_km', 'T3'):                        'T3 sensor temperature (air after water heat exchanger).',
  ('drv_km', 'T4'):                        'Air temperature before heat exchanger (T4 sensor).',
  ('drv_km', 'T5'):                        'Heat exchanger water temperature (T5 sensor).',
  ('drv_km', 'ExternalGasDetectTH1'):      'External gas sensor signal — first threshold.',
  ('drv_km', 'ExternalGasDetectTH2'):      'External gas sensor signal — second threshold.',
  ('drv_km', 'ExternalGasDetectVal'):      'Gas concentration — 0–10V DC input.',
  ('drv_km', 'FanRoofTK'):                 'TK signal from roof fan.',
  ('drv_km', 'FanEff'):                    'EC or AC fan capacity (3-speed).',
  ('drv_km', 'FanRoofEff'):               'Roof fan capacity.',
  ('drv_km', 'DamperLevel'):              'Current damper position.',
  ('drv_km', 'DamperForceState'):         'Damper forcing state.',
  ('drv_km', 'AntiFreezeState'):          'Antifreeze protection state — 8 bits.',
  ('drv_km', 'FilterWorkTime'):           'Filter operating time. Actual value = 5 × register value [min].',
  ('drv_km', 'FilterPressureSwitchState'):'Filter pressure switch state.',
  ('drv_km', 'FanEcConnect'):             'EC fan connection status.',
  ('drv_km', 'FuseState'):               'Fan fuse state (EC/3V/roof fans, masked bits).',
  ('drv_km', 'ValveState'):              'Water valve state.',
  ('drv_km', 'FanEffRef'):               'EC fan: continuous regulation 0–100%. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_km', 'FanRoofForceEffRef'):      'Roof fan speed correction — value added to current speed',
  ('drv_km', 'ThermostatModeFanEffRef'): 'Fan speed in thermostat mode. EC: continuous 0–100%. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3',

  # ── drv_luna ───────────────────────────────────────────────────────────────
  ('drv_luna', 'LUNA (DRV LUNA)'):             'LUNA heater',
  ('drv_luna', 'RoomTemperatureValue'):         'Temperature measured by T4 sensor (room temperature).',
  ('drv_luna', 'LeadTemperatureValue'):         'Temperature from lead sensor (MODBUS, ROOM, SUPPLY or INTAKE — depends on settings).',
  ('drv_luna', 'IntakeTemperatureValue'):       'Temperature measured by Ti3 sensor (intake air).',
  ('drv_luna', 'SupplyTemperatureValue'):       'Temperature measured by T1 sensor (supply air).',
  ('drv_luna', 'HeaterTemperatureValue'):       'Temperature measured by T2 sensor (water heat exchanger).',
  ('drv_luna', 'FanEfficiencyValue'):           'Current fan efficiency.',
  ('drv_luna', 'DrainPumpAlarm'):              'Drain pump alarm state.',
  ('drv_luna', 'FilterWorkTime'):              'Filter operating time. Actual value = 5 × register value [min].',
  ('drv_luna', 'ValveHTValue'):               'Current heating valve (HT) state.',
  ('drv_luna', 'ValveCLValue'):               'Current cooling valve (CL) state.',
  ('drv_luna', 'Smart1State'):               'SMART MODE I state — indicates whether mode is active.',
  ('drv_luna', 'Smart2State'):               'SMART MODE II state — indicates whether mode is active.',
  ('drv_luna', 'Smart3State'):               'SMART MODE III state — indicates whether mode is active.',
  ('drv_luna', 'TechnologicalHeatAlarm'):    'No heat from power source.',
  ('drv_luna', 'Smart2LowTempAlarm'):        'Low supply temperature alarm — state II.',
  ('drv_luna', 'SupplyTemperatureValue2'):   'Supply air temperature — additional reading (T1 sensor).',
  ('drv_luna', 'HeaterTemperatureValue2'):   'Heat exchanger temperature — additional reading (T2 sensor).',
  ('drv_luna', 'IntakeTemperatureValue2'):   'Intake air temperature — additional reading (T3 sensor).',
  ('drv_luna', 'RoomTemperatureValue2'):     'Room air temperature — additional reading (T4 sensor).',
  ('drv_luna', 'InputDIState'):             'Digital input DI state.',
  ('drv_luna', 'FanWorkTime'):             'Fan operating time.',
  ('drv_luna', 'PreheatState'):            'Preheat function state.',
  ('drv_luna', 'OnOff'):                  'Turn device on/off. Default: OFF.',
  ('drv_luna', 'ManualWorkMode'):          'Fan operating mode. Default: MANUAL.',
  ('drv_luna', 'DestratificationMode'):    'Enable/disable destratification mode. Active when LowCeilingMode=OFF.',
  ('drv_luna', 'LowCeilingMode'):         'Enable/disable low ceiling mode.',
  ('drv_luna', 'NozzleLvl'):             'Nozzle setting (5 steps). Active when ManualWorkMode=ON. Default: 0%.',
  ('drv_luna', 'SmartMode'):             'Enable/disable SMART mode. Active when InputDIConfiguration=1 or 2.',
  ('drv_luna', 'PreheatMode'):           'Enable/disable preheat. Active when ExchangerTypeConfiguration=0 or 2.',
  ('drv_luna', 'FanManualLvl'):          'Manual fan capacity. Active when ManualWorkMode=1. Default: 200 = 20%.',
  ('drv_luna', 'DestratificationTempRef'):'Temperature difference to activate destratification: IntakeTemp − RoomTemp > value. Default: 50 = 5.0°C.',
  ('drv_luna', 'PreheatTempRef'):         'Heat exchanger temperature threshold to start fan (heating mode). Default: 280 = 28.0°C.',
  ('drv_luna', 'SmartMode1TimeRef'):      'SMART MODE I activation time. Default: 1800s.',
  ('drv_luna', 'SmartMode2TimeRef'):      'SMART MODE II activation time. Default: 3600s.',
  ('drv_luna', 'SmartMode3TimeRef'):      'SMART MODE III activation time. Default: 7200s.',
  ('drv_luna', 'SmartMode2HysteresisHeat'):'Temperature hysteresis for heating in SMART MODE II. Default: 20 = 2.0°C.',
  ('drv_luna', 'SmartMode2HysteresisCool'):'Temperature hysteresis for cooling in SMART MODE II. Default: 20 = 2.0°C.',
  ('drv_luna', 'SmartMode3TempMin'):      'Minimum temperature for SMART MODE III. Default: 180 = 18.0°C.',
  ('drv_luna', 'InputDiForce'):          'Override DI input via MODBUS. Active when InputDIConfiguration=1 or 2 and IR[0x0E]=1. Default: 0.',
  ('drv_luna', 'DestratificationFanRef'): 'Fan capacity in destratification mode. Default: 600 = 60%.',
  ('drv_luna', 'LowCeilingFanRef'):       'Fan capacity in low ceiling mode. Default: 600 = 60%.',
  ('drv_luna', 'LowCeilingLowLimit'):     'Lower fan capacity limit in Low Ceiling mode. Default: 0%.',
  ('drv_luna', 'LowCeilingHighLimit'):    'Upper fan capacity limit in Low Ceiling mode. Default: 600 = 60%.',
  ('drv_luna', 'InputDIConfiguration'):   'DI input activation and polarity selection.',
  ('drv_luna', 'ActuatorsTimeConfiguration'):'3-way actuator opening time — per manufacturer data. Default: 150s.',
  ('drv_luna', 'ExchangerTypeConfiguration'):'Heat exchanger type. Default: 2.',
  ('drv_luna', 'ValveTypeConfiguration'): 'Valve actuator type. Default: 0.',
  ('drv_luna', 'DrainPumpAlarmConfiguration'):'Drain pump alarm contact polarity. Default: 0.',
  ('drv_luna', 'FilterMaxWorkTime'):       'Maximum filter operating time. Default: 4000h.',
  ('drv_luna', 'GroupTLeadSensorSelect'):  'Group lead sensor selection.',

  # ── drv_m ──────────────────────────────────────────────────────────────────
  ('drv_m', 'LEO EC (DRV M)'):       'Water heater with EC fan (continuous regulation)',
  ('drv_m', 'T3'):                   'Supply air temperature after water heat exchanger (T3 sensor).',
  ('drv_m', 'T4'):                   'Room temperature (T4 sensor).',
  ('drv_m', 'FanEff'):               'EC fan efficiency — rotational speed [rpm].',
  ('drv_m', 'AntifreezeeState'):     'Antifreeze protection state — 8 bits.',
  ('drv_m', 'DestStatus'):           'Destratification state: active when (DestTempRef > Td–Tm) and (Tz > Tm).',
  ('drv_m', 'FanEcConnect'):         'EC fan connection status with DRV M device.',
  ('drv_m', 'FuseState'):            'Fan fuse state (EC/3V/roof fans, bits). Example: 0x100 = 3V fan OK.',
  ('drv_m', 'ValveState'):           'Water valve state.',

  # ── drv_oxen ───────────────────────────────────────────────────────────────
  ('drv_oxen', 'OXEN (DRV OXEN)'):  'OXEN heat recovery unit',
  ('drv_oxen', 'Status1'):           'Status register 1 (bitfield).',
  ('drv_oxen', 'T1'):                'Supply air temperature (T1 sensor).',
  ('drv_oxen', 'T2'):                'Air temperature at exhaust fan (T2 sensor).',
  ('drv_oxen', 'T3'):                'Air temperature after water heat exchanger (T3 sensor).',
  ('drv_oxen', 'T4'):                'Return air / room temperature (T4 sensor).',
  ('drv_oxen', 'T5'):                'Heat exchanger water temperature (T5 sensor).',
  ('drv_oxen', 'Outputs'):           'Controller output states.',
  ('drv_oxen', 'Inputs'):            'Controller input states (volt-free inputs and switches).',
  ('drv_oxen', 'FilterWorkTime'):    'Filter operating time.',
  ('drv_oxen', 'FansEff_1'):         'Supply fan group I capacity [%].',
  ('drv_oxen', 'FansEff_2'):         'Exhaust fan group II capacity [%].',
  ('drv_oxen', 'Config1'):           'Bit 0: FilterWorkTimeRST — 0=no action, 1=reset filter time counter (sets address 0x09 to 0x000)',
  ('drv_oxen', 'FanEffRef_1'):       'EC fan — supply fans (group I), continuous regulation 0–100%',
  ('drv_oxen', 'FanEffRef_2'):       'EC fan — exhaust fans (group II), continuous regulation 0–100%',

  # ── drv_robur_next ─────────────────────────────────────────────────────────
  ('drv_robur_next', 'ROBUR R NEXT (DRV R NEXT)'):  'ROBUR NEXT gas heater',
  ('drv_robur_next', 'T3'):                          'Ceiling temperature (T3 sensor).',
  ('drv_robur_next', 'T4'):                          'Room temperature (T4 sensor).',
  ('drv_robur_next', 'ExternalGasDetectTH1'):        'External gas sensor signal — first threshold.',
  ('drv_robur_next', 'ExternalGasDetectTH2'):        'External gas sensor signal — second threshold.',
  ('drv_robur_next', 'ExternalGasDetectVal'):        'Gas concentration — 0–10V DC input (sensor calibration required).',
  ('drv_robur_next', 'AntifreezeStateWarehouse'):    'Warehouse antifreeze protection state.',
  ('drv_robur_next', 'FuseState'):                   'Fan fuse state.',
  ('drv_robur_next', 'GasAlarmState'):               'Robur alarm — gas/flame. Read from terminal 6 (inside heater).',
  ('drv_robur_next', 'STBAlarmState'):               'Exhaust air temperature alarm (STB).',
  ('drv_robur_next', 'FilterWorkTime'):              'Filter operating time. Actual value = 5 × register value [min].',
  ('drv_robur_next', 'GasAlarmReset'):               'Gas/flame alarm reset. Reset time must not exceed 5 s (then set value to 0x02)',
  ('drv_robur_next', 'STBTemperatureAlarmOn'):       'STB alarm activation temperature threshold (Input Register 0x12). Alarm active when set value > T3 (IR 0x05). Default value 900 ensures fault before actual Robur STB alarm (which requires manual reset from control box)',
  ('drv_robur_next', 'STBTemperatureAlarmOff'):      'STB alarm reset temperature. Reset possible when set value > T3 (IR 0x05). Additional condition: STB_T_OFF < STB_T_REF',
  ('drv_robur_next', 'STBAlarmReset'):               'If STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), register will be automatically set to 0x02 (OFF)',
  ('drv_robur_next', 'ContModeFanSpeedRef'):         'Fan capacity setpoint after reaching target temperature',
  ('drv_robur_next', 'GasBurnerLvlRef'):             'Gas combustion stage setting (active only in WM_HEAT_MANUAL mode)',

  # ── drv_robur_next_km ──────────────────────────────────────────────────────
  ('drv_robur_next_km', 'ROBUR R KM NEXT (DRV R KM NEXT)'): 'ROBUR NEXT gas heater with mixing damper',
  ('drv_robur_next_km', 'T1'):                               'Fresh air temperature (T1 sensor).',
  ('drv_robur_next_km', 'T3'):                               'Exhaust air temperature (T3 sensor).',
  ('drv_robur_next_km', 'T4'):                               'Room temperature (T4 sensor).',
  ('drv_robur_next_km', 'ExternalGasDetectTH1'):             'External gas sensor signal — first threshold.',
  ('drv_robur_next_km', 'ExternalGasDetectTH2'):             'External gas sensor signal — second threshold.',
  ('drv_robur_next_km', 'ExternalGasDetectVal'):             'Gas concentration — 0–10V DC input.',
  ('drv_robur_next_km', 'FanRoofTK'):                        'TK signal from roof fan.',
  ('drv_robur_next_km', 'FanRoofEff'):                       'Roof fan capacity.',
  ('drv_robur_next_km', 'DamperLevel'):                      'Current mixing damper position.',
  ('drv_robur_next_km', 'DamperForceState'):                 'Damper forcing state (DamperForceMode = ON).',
  ('drv_robur_next_km', 'AntifreezeStateWarehouse'):         'Warehouse antifreeze protection state.',
  ('drv_robur_next_km', 'FuseState'):                        'Fan fuse state.',
  ('drv_robur_next_km', 'GasAlarmState'):                    'Robur alarm — gas/flame.',
  ('drv_robur_next_km', 'STBAlarmState'):                    'STB alarm — exhaust air temperature.',
  ('drv_robur_next_km', 'FilterWorkTime'):                   'Filter operating time. Actual value = 5 × register value [min].',
  ('drv_robur_next_km', 'DamperForceTempRef'):               'Forced damper opening temperature. Connected to T1 (fresh air temperature — IR 0x04)',
  ('drv_robur_next_km', 'DamperForceLevelRef'):              'Target damper opening when forced (DamperForceMode == DAMPER_FMD_ON, condition: Temp < DamperForceTempRef)',
  ('drv_robur_next_km', 'DamperLevelRef'):                   'Mixing damper position',
  ('drv_robur_next_km', 'DamperContLevelRef'):               'Damper position when WorkMode == WM_WINTER_CONT',
  ('drv_robur_next_km', 'GasAlarmReset'):                    'Gas/flame alarm reset. Reset time must not exceed 5 s (then set value to 0x02)',
  ('drv_robur_next_km', 'FanRoofForceEffRef'):               'Roof fan speed override — value added to current speed',
  ('drv_robur_next_km', 'STBTemperatureAlarmOn'):            'STB alarm activation temperature threshold (IR 0x12). Alarm active when set value > T3 (IR 0x05)',
  ('drv_robur_next_km', 'STBTemperatureAlarmOff'):           'STB alarm reset temperature. Reset possible when set value > T3. Additional condition: STB_T_OFF < STB_T_REF',
  ('drv_robur_next_km', 'STBAlarmReset'):                    'If STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), register will be automatically set to 0x02 (OFF)',
  ('drv_robur_next_km', 'ContModeFanSpeedRef'):              'Fan capacity setpoint after reaching target temperature',
  ('drv_robur_next_km', 'GasBurnerLvlRef'):                  'Gas combustion stage setting (active only in WM_HEAT_MANUAL mode)',
  ('drv_robur_next_km', 'ExternalInputTH1DamperLevelRef'):   'Damper position for EXT TH1 input. Step: 5.',
  ('drv_robur_next_km', 'FilterMaxWorkTime'):                'Time after which filter alarm activates. Step: 100.',
  ('drv_robur_next_km', 'ExternalInputTH2DamperLevelRef'):   'Damper position for EXT TH2 input. Step: 5.',

  # ── drv_slim ───────────────────────────────────────────────────────────────
  ('drv_slim', 'SLIM (DRV SLIM)'):        'SLIM air curtain',
  ('drv_slim', 'T3'):                     'Supply air temperature after water heat exchanger (T3 sensor).',
  ('drv_slim', 'T4'):                     'Air temperature before water heat exchanger (T4 sensor).',
  ('drv_slim', 'CurtainFanSpeed'):        'Curtain fan speed (3-speed AC fan: 0=stop, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3).',
  ('drv_slim', 'ValveState'):             'Water valve state.',
  ('drv_slim', 'HeaterFanSpeed'):         'Heater fan speed (3-speed AC fan).',
  ('drv_slim', 'ContactDoor'):            'Door contact state.',
  ('drv_slim', 'HeaterDetect'):           'Heater detection procedure (ELIS-DUO).',
  ('drv_slim', 'AntifreezeState'):        'Antifreeze protection state — 8 bits for individual modes.',
  ('drv_slim', 'FuseState'):             'Fan fuse state (bits 8–11). Example: 0x100 = OK, 0x200 = blown.',
  ('drv_slim', 'CurtainElectricpower'):  'Curtain electric heater power (L1/L2 outputs on VALVE connector).',
  ('drv_slim', 'CurtainFanSpeedRef'):    'Curtain fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_slim', 'HeaterFanSpeedRef'):     'Heater fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_slim', 'CurtainFanIdleRef'):     'Curtain fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_slim', 'HeaterFanIdleRef'):      'Heater fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
  ('drv_slim', 'FanIdleDelay'):          'Fan stand-by delay in seconds; 65535 = infinite',
  ('drv_slim', 'ValveIdleDelay'):        'Valve stand-by delay in seconds; 65535 = infinite. Constraint: ValveIdleDelay < FanIdleDelay',

  # ── drv_v ──────────────────────────────────────────────────────────────────
  ('drv_v', 'LEO AC (DRV V)'):       'Water heater with EC fan',
  ('drv_v', 'T3'):                   'Ceiling temperature (T3 sensor).',
  ('drv_v', 'T4'):                   'Room temperature (T4 sensor).',
  ('drv_v', 'FanEff'):               'Fan speed (3-speed AC fan).',
  ('drv_v', 'AntifreezeeState'):     'Warehouse antifreeze protection state — 8 bits.',
  ('drv_v', 'DestStatus'):           'Destratification state: active when (DestTempRef > Td–Tm) and (Tz > Tm).',
  ('drv_v', 'FilterPressureState'):  'Filter pressure switch state.',
  ('drv_v', 'FuseState'):            'Fan fuse state (bits). Example: 0x100 = OK, 0x200 = blown.',
  ('drv_v', 'ValveState'):           'Water valve state.',
  ('drv_v', 'FanEffRef'):            '3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)',
}


def add_desc_en(obj, device):
    if isinstance(obj, dict):
        name = obj.get('name')
        if name and 'description' in obj and 'description_en' not in obj:
            key = (device, name)
            if key in DESC:
                obj['description_en'] = DESC[key]
        for v in list(obj.values()):
            add_desc_en(v, device)
    elif isinstance(obj, list):
        for item in obj:
            add_desc_en(item, device)


devices_dir = 'devices'
for fname in sorted(os.listdir(devices_dir)):
    if not fname.endswith('.json') or fname == '_schema.json':
        continue
    device = fname.replace('.json', '')
    fpath = os.path.join(devices_dir, fname)
    with open(fpath, encoding='utf-8') as f:
        data = json.load(f)
    add_desc_en(data, device)
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'OK: {fname}')

print('Gotowe.')
```

Uruchom:
```bash
python3 tasks/add_desc_en.py
```

Zweryfikuj:
```bash
python3 -c "import json,os; [json.load(open(f'devices/{f}',encoding='utf-8')) for f in os.listdir('devices') if f.endswith('.json') and f!='_schema.json']; print('JSON OK')"
```

---

## Krok 3 — Przebuduj devices-data.js

```bash
python3 -c "
import json, os
devices = {}
for fname in sorted(os.listdir('devices')):
    if not fname.endswith('.json') or fname == '_schema.json': continue
    with open(f'devices/{fname}', encoding='utf-8') as f:
        d = json.load(f)
    devices[d['name']] = d
devices_sorted = dict(sorted(devices.items(), key=lambda x: x[1].get('group_priority', 99)))
output = 'const DEVICES_DATA = ' + json.dumps(devices_sorted, ensure_ascii=False, indent=2) + ';'
open('frontend/js/devices-data.js', 'w', encoding='utf-8').write(output)
print('devices-data.js OK')
"
```

---

## Weryfikacja

1. Otwórz `frontend/index.html`, oblicz dla CUBE (M-box lub T-box Zone)
2. Kliknij rejestr `CO2_status` — opis po polsku: "Status CO2 zapisywany..." ✓
3. Kliknij **EN** — opis zmienia się na: "CO2 status written by T-box..." ✓
4. Kliknij **PL** — wraca do polskiego ✓

---

## Commit

```
feat(i18n): complete description_en for all device registers
```
