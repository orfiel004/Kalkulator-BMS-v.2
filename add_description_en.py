"""
Adds description_en fields to all 14 device JSON files.
description_en is inserted immediately after description in every register entry,
and also added at the top level of each file.
"""

import json
import os
import collections

# ────────────────────────────────────────────────────────────────────────────
# Translation tables  (file_basename → section → name → english text)
# ────────────────────────────────────────────────────────────────────────────

TRANSLATIONS = {

# ─── drv_ax ─────────────────────────────────────────────────────────────────
"drv_ax": {
    "_top": "ELIS AX air curtain (multi-speed EC fans)",
    "input_registers": {
        "T1":               "Outdoor air temperature (T1 sensor).",
        "T3":               "Supply air temperature after water heat exchanger (T3 sensor).",
        "T4":               "Room temperature (T4 sensor).",
        "T5":               "Water heat exchanger return pipe temperature (T5 sensor).",
        "CurtainState1":    "Controller status register — bits represent active functions and operating modes.",
        "CurtainState2":    "Controller status register extension.",
        "CurtainState3":    "Controller status register extension.",
        "Fan1Speed":        "Actual supply fan 1 speed [RPM].",
        "Fan2Speed":        "Actual supply fan 2 speed [RPM].",
        "Fan3Speed":        "Actual supply fan 3 speed [RPM].",
        "Fan4Speed":        "Actual supply fan 4 speed [RPM].",
        "Fan5Speed":        "Actual supply fan 5 speed [RPM].",
        "Fan6Speed":        "Actual supply fan 6 speed [RPM].",
        "Fan7Speed":        "Actual supply fan 7 speed [RPM].",
        "FilterWorkTime":   "Filter operating time. Actual value = 5 × register value [min].",
        "ValveRelaysState": "Current valve status on VALVE_RELAYS contacts (L1, L2). 0=open, 1=closed.",
        "Valve0-10State":   "Current 0–10V valve status.",
    },
    "holding_registers_single": {
        "FanWorkMode":                "Fan operating mode. Default: MANUAL.",
        "Program":                    "Curtain operating program (K1, K2...). Default: K1.",
        "FWM_ManualHeatVentRef":      "Fan capacity in MANUAL mode (HEAT or VENT). Default: 50%.",
        "FWM_StandbyRef":             "Fan capacity in STANDBY mode. Default: 20%.",
        "FWM_AutoHeatVentMin":        "Minimum fan capacity in AUTO mode (HEAT/VENT). Constraint: Min < Max. Default: 0%.",
        "FWM_AutoHeatVentMax":        "Maximum fan capacity in AUTO mode (HEAT/VENT). Constraint: Max > Min. Default: 100%.",
        "EWM_HeatT3Ref":              "Supply air setpoint temperature for HEAT mode. Default: 320 = 32.0°C.",
        "EWM_HeatT5Max":              "Return water temperature limit for HEAT mode. Default: 320 = 32.0°C.",
        "EWM_HeatT5LimitMode":        "Enable/disable return water temperature limit. Default: OFF.",
        "PreheatT5Ref":               "Return water temperature (T5) threshold to start fan (PREHEAT). Default: 300 = 30.0°C.",
        "StandbyFanIdleDelay":        "Fan idle delay in STANDBY mode [s]. Default: 300s. Constraint: ≥ StandbyValveIdleDelay.",
        "StandbyValveIdleDelay":      "Valve idle delay in STANDBY mode [s]. Default: 300s. Constraint: ≤ StandbyFanIdleDelay.",
        "AntifreezeWareHouseOn":      "Warehouse antifreeze protection. Default: OFF.",
        "AntifreezeWareTempOn":       "Warehouse antifreeze activation temperature threshold. Default: 70 = 7.0°C.",
        "AntifreezeWaterExchangeOn":  "Water heat exchanger antifreeze protection. Default: ON.",
        "AntifreezeWaterExchangeT3":  "Supply air temperature (T3) threshold for exchanger antifreeze activation. Default: 70 = 7.0°C.",
        "AntifreezeWaterExchangeT5":  "Water temperature (T5) threshold for exchanger antifreeze activation. Default: 70 = 7.0°C.",
        "PreheatOnOff":               "Enable/disable preheat function (PREHEAT). Default: OFF.",
        "FilterMaxWorkTime":          "Reset filter operating time counter. Default: OFF.",
        "DoorOpenFreqAlphaThreshold": "Door opening frequency detection threshold in SMART mode. Default: 60.",
        "DoorOpenFreqTimePeriod":     "Door opening frequency detection time period in SMART mode. Default: 300s.",
        "FWMAutoAddHeatMin":          "Minimum fan capacity in ADD HEAT mode, Auto. Default: 5%. Constraint: Min < Max.",
        "FWMAutoAddHeatMax":          "Maximum fan capacity in ADD HEAT mode, Auto. Default: 5%. Constraint: Min < Max.",
        "EWMSmartT124h":              "Setpoint temperature for VENT→HEAT transition in SMART mode. Default: 170 = 17.0°C. Constraint: ≤ EWMSmartT13h − 1K.",
        "EWMSmartT13h":               "Setpoint temperature for HEAT→VENT transition in SMART mode. Default: 210 = 21.0°C. Constraint: ≥ EWMSmartT124h + 1K.",
        "HeatT3_PI_KP":               "Proportional gain KP of the PI controller for supply air temperature T3. Default: 3.",
        "HeatT3_PI_TI":               "Integral time TI of the PI controller for supply air temperature T3. Default: 180s.",
        "HeatT5_PI_KP":               "Proportional gain KP of the PI controller for return water temperature T5. Default: 3.",
        "HeatT5_PI_TI":               "Integral time TI of the PI controller for return water temperature T5. Default: 180s.",
    },
    "holding_registers_group": {},
},

# ─── drv_cool ────────────────────────────────────────────────────────────────
"drv_cool": {
    "_top": "LEO COOL water/electric heating and cooling unit with EC fans",
    "input_registers": {
        "T3":                   "Ceiling temperature (T3 sensor).",
        "T4":                   "Room temperature (T4 sensor).",
        "FanEff":               "Fan speed (3-speed AC fan).",
        "AntifreezeState":      "Warehouse antifreeze protection state — 8 bits.",
        "FilterPressureState":  "Filter pressure switch state.",
        "FuseState":            "Fan fuse state (bits). Example: 0x100 = OK, 0x200 = blown.",
        "ValveState":           "Water valve state.",
    },
    "holding_registers_single": {
        "FanEffRef":             "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "ModeAuto_FanEffRefMin": "Minimum fan capacity in AUTO mode. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1, 34–66=speed 2, 67–100=speed 3",
        "ModeAuto_FanEffRefMax": "Maximum fan capacity in AUTO mode. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1, 34–66=speed 2, 67–100=speed 3",
        "ModeManual_FanEffRef":  "Fan capacity after reaching target temperature in MANUAL mode. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1, 34–66=speed 2, 67–100=speed 3",
    },
    "holding_registers_group": {
        "FanEffRef":             "Fan capacity. 3-speed AC fan.",
        "ModeAuto_FanEffRefMin": "Minimum fan capacity in AUTO mode.",
        "ModeManual_FanEffRef":  "Fan capacity after reaching target temperature in MANUAL mode.",
    },
},

# ─── drv_d ───────────────────────────────────────────────────────────────────
"drv_d": {
    "_top": "LEO D water heater (destratification unit)",
    "input_registers": {
        "T3":         "Ceiling temperature (T3 sensor).",
        "T4":         "Room temperature (T4 sensor).",
        "FanEff":     "Fan speed (3-speed AC fan).",
        "DestStatus": "Destratification state: active when (DestTempRef > Td–Tm) and (Tz > Tm). Td=T3, Tm=TLeadVal or T4.",
        "FuseState":  "3-speed fan fuse state (bits 8–11). Example: 0x100 = OK, 0x200 = blown.",
    },
    "holding_registers_single": {
        "FanEffRef":       "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "DestTempRef":     "Destratification threshold: condition DestTempRef > Td − Tm (Td=T3 ceiling, Tm=lead sensor)",
        "WorkModeTempRef": "Target ceiling temperature in manual mode; condition: WorkModeTempRef > lead sensor",
    },
    "holding_registers_group": {
        "FanEffRef":       "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "DestTempRef":     "Destratification threshold: condition DestTempRef > Td − Tm (Td=T3 ceiling, Tm=lead sensor)",
        "WorkModeTempRef": "Target ceiling temperature in manual mode; condition: WorkModeTempRef > lead sensor",
    },
},

# ─── drv_el ───────────────────────────────────────────────────────────────────
"drv_el": {
    "_top": "LEO EL electric heater",
    "input_registers": {
        "T3":                  "Ceiling temperature (T3 sensor).",
        "T4":                  "Room temperature (T4 sensor).",
        "FanEff":              "Fan speed (3-speed AC fan).",
        "AntifreezeeState":    "Antifreeze protection state.",
        "DestStatus":          "Destratification state.",
        "ThermalContactState": "Thermal contact state. When = 1: FanEffRef → 100, ElectricHeaterPTCPower → 0 (overheat protection).",
        "FuseState":           "EC/3-speed/rooftop fan fuse state (bits). Example: 0x100 = 3-speed fan OK.",
        "PTCHeaterPowerState": "PTC electric heater power. LEO EL L (SW3.5=K1) or LEO EL S (SW3.5=K2).",
        "ElectricHeaterType":  "Electric heater type.",
    },
    "holding_registers_single": {
        "FanEffRef":              "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "DestTempRef":            "Destratification threshold: condition DestTempRef > Td − Tm (Td=T3 ceiling, Tm=lead sensor)",
        "ElectricHeaterPTCPower": "SW3.5=K1 (3 steps): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 steps): 1=Off, 2=1heat, 3=2heat, 4=2heat",
        "ModeAuto_FanEffRef":     "Fan speed in AUTO mode. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1, 34–66=speed 2, 67–100=speed 3",
        "ModeManual_FanEffRef":   "Fan speed in MANUAL mode. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1, 34–66=speed 2, 67–100=speed 3",
    },
    "holding_registers_group": {
        "FanEffRef":              "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "ElectricHeaterPTCPower": "SW3.5=K1 (3 steps): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 steps): 1=Off, 2=1heat, 3=2heat, 4=2heat",
    },
},

# ─── drv_elis ────────────────────────────────────────────────────────────────
"drv_elis": {
    "_top": "ELIS air curtain with EC fans",
    "input_registers": {
        "T3":                  "Supply air temperature after water heat exchanger (T3 sensor).",
        "T4":                  "Supply air temperature before water heat exchanger (T4 sensor).",
        "CurtainFanSpeed":     "Curtain fan speed (3-speed AC fan: 0=stop, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3).",
        "ValveState":          "Water valve state.",
        "HeaterFanSpeed":      "Heater fan speed (3-speed AC fan).",
        "ContactDoor":         "Door contact state.",
        "HeaterDetect":        "Heater detection procedure (ELIS-DUO).",
        "AntifreezeState":     "Antifreeze protection state — 8 bits for individual modes.",
        "FuseState":           "3-speed fan fuse state (bits 8–11). Example: 0x100 = OK, 0x200 = blown.",
        "CurtainElectricpower":"Electric heater power of the curtain (L1/L2 outputs on VALVE connector).",
    },
    "holding_registers_single": {
        "CurtainFanSpeedRef": "Curtain 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "HeaterFanSpeedRef":  "Heater 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "CurtainFanIdleRef":  "Curtain 3-speed AC fan (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "HeaterFanIdleRef":   "Heater 3-speed AC fan (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "FanIdleDelay":       "Fan stand-by delay in seconds; 65535 = infinite",
        "ValveIdleDelay":     "Valve stand-by delay in seconds; 65535 = infinite. Constraint: ValveIdleDelay < FanIdleDelay",
    },
    "holding_registers_group": {
        "CurtainFanSpeedRef": "Curtain 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "CurtainFanIdleRef":  "Curtain 3-speed AC fan (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "FanIdleDelay":       "Fan stand-by delay in seconds; 65535 = infinite",
    },
},

# ─── drv_km ────────────────────────────────────────────────────────────────
"drv_km": {
    "_top": "LEO KM mixing chamber air handling unit",
    "input_registers": {
        "T1":                      "Fresh air temperature (T1 sensor).",
        "T3":                      "T3 sensor temperature (air after water heat exchanger).",
        "T4":                      "Air temperature before heat exchanger (T4 sensor).",
        "T5":                      "Water temperature at heat exchanger (T5 sensor).",
        "ExternalGasDetectTH1":    "External gas sensor signal — first threshold.",
        "ExternalGasDetectTH2":    "External gas sensor signal — second threshold.",
        "ExternalGasDetectVal":    "Gas concentration — 0–10V DC input.",
        "FanRoofTK":               "TK signal from rooftop fan.",
        "FanEff":                  "EC or AC fan efficiency (3-speed).",
        "FanRoofEff":              "Rooftop fan efficiency.",
        "DamperLevel":             "Current damper position.",
        "DamperForceState":        "Damper forced position state.",
        "AntiFreezeState":         "Antifreeze protection state — 8 bits.",
        "FilterWorkTime":          "Filter operating time. Actual value = 5 × register value [min].",
        "FilterPressureSwitchState":"Filter pressure switch state.",
        "FanEcConnect":            "EC fan connection status.",
        "FuseState":               "EC/3-speed/rooftop fan fuse state (masked bits).",
        "ValveState":              "Water valve state.",
    },
    "holding_registers_single": {
        "FanEffRef":                 "EC fan: continuous 0–100% control. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "FanRoofForceEffRef":        "Rooftop fan speed correction — value added to current speed",
        "ThermostatModeFanEffRef":   "Fan speed in thermostat mode. EC: continuous 0–100%. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1, 34–66=speed 2, 67–100=speed 3",
    },
    "holding_registers_group": {
        "FanEffRef":                 "EC fan: continuous 0–100% control. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "FanRoofForceEffRef":        "Rooftop fan speed correction — value added to current speed",
        "ThermostatModeFanEffRef":   "Fan speed in thermostat mode. EC: continuous 0–100%. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1, 34–66=speed 2, 67–100=speed 3",
    },
},

# ─── drv_luna ────────────────────────────────────────────────────────────────
"drv_luna": {
    "_top": "LUNA fan coil unit",
    "input_registers": {
        "RoomTemperatureValue":    "Temperature measured by T4 sensor (room temperature).",
        "LeadTemperatureValue":    "Temperature from the lead sensor (MODBUS, ROOM, SUPPLY or INTAKE — depending on settings).",
        "IntakeTemperatureValue":  "Temperature measured by Ti3 sensor (intake air).",
        "SupplyTemperatureValue":  "Temperature measured by T1 sensor (supply air).",
        "HeaterTemperatureValue":  "Temperature measured by T2 sensor (water heat exchanger).",
        "FanEfficiencyValue":      "Current fan efficiency.",
        "DrainPumpAlarm":          "Drain pump alarm state.",
        "FilterWorkTime":          "Filter operating time. Actual value = 5 × register value [min].",
        "ValveHTValue":            "Current heating valve (HT) state.",
        "ValveCLValue":            "Current cooling valve (CL) state.",
        "Smart1State":             "SMART MODE I state — indicates whether the mode is active.",
        "Smart2State":             "SMART MODE II state — indicates whether the mode is active.",
        "Smart3State":             "SMART MODE III state — indicates whether the mode is active.",
        "TechnologicalHeatAlarm":  "No heat from the supply source.",
        "Smart2LowTempAlarm":      "Low supply temperature alarm — state II.",
        "SupplyTemperatureValue2": "Supply air temperature — additional reading (T1 sensor).",
        "HeaterTemperatureValue2": "Water heat exchanger temperature — additional reading (T2 sensor).",
        "IntakeTemperatureValue2": "Intake air temperature — additional reading (T3 sensor).",
        "RoomTemperatureValue2":   "Room air temperature — additional reading (T4 sensor).",
        "InputDIState":            "Digital input DI state.",
        "FanWorkTime":             "Fan operating time.",
        "PreheatState":            "Preheat function state.",
    },
    "holding_registers_single": {
        "OnOff":                       "Turn device on/off. Default: OFF.",
        "ManualWorkMode":              "Fan operating mode. Default: MANUAL.",
        "DestratificationMode":        "Enable/disable destratification mode. Active when LowCeilingMode=OFF.",
        "LowCeilingMode":              "Enable/disable low ceiling mode.",
        "NozzleLvl":                   "Nozzle setting (5 steps). Active when ManualWorkMode=ON. Default: 0%.",
        "SmartMode":                   "Enable/disable SMART mode. Active when InputDIConfiguration=1 or 2.",
        "PreheatMode":                 "Enable/disable preheat. Active when ExchangerTypeConfiguration=0 or 2.",
        "FanManualLvl":                "Manual fan capacity. Active when ManualWorkMode=1. Default: 200 = 20%.",
        "DestratificationTempRef":     "Temperature difference activating destratification: IntakeTemp − RoomTemp > value. Default: 50 = 5.0°C.",
        "PreheatTempRef":              "Exchanger temperature at which fan starts (heating mode). Default: 280 = 28.0°C.",
        "SmartMode1TimeRef":           "Activation time for SMART MODE I condition. Default: 1800s.",
        "SmartMode2TimeRef":           "Activation time for SMART MODE II condition. Default: 3600s.",
        "SmartMode3TimeRef":           "Activation time for SMART MODE III condition. Default: 7200s.",
        "SmartMode2HysteresisHeat":    "Temperature hysteresis for heating in SMART MODE II. Default: 20 = 2.0°C.",
        "SmartMode2HysteresisCool":    "Temperature hysteresis for cooling in SMART MODE II. Default: 20 = 2.0°C.",
        "SmartMode3TempMin":           "Minimum temperature for SMART MODE III. Default: 180 = 18.0°C.",
        "InputDiForce":                "Override DI input via MODBUS. Active when InputDIConfiguration=1 or 2 and IR[0x0E]=1. Default: 0.",
        "DestratificationFanRef":      "Fan capacity in destratification mode. Default: 600 = 60%.",
        "LowCeilingFanRef":            "Fan capacity in low ceiling mode. Default: 600 = 60%.",
        "LowCeilingLowLimit":          "Lower fan capacity limit in Low Ceiling mode. Default: 0%.",
        "LowCeilingHighLimit":         "Upper fan capacity limit in Low Ceiling mode. Default: 600 = 60%.",
        "InputDIConfiguration":        "DI input activation and polarity selection.",
        "ActuatorsTimeConfiguration":  "3-way actuator opening time — as per manufacturer data. Default: 150s.",
        "ExchangerTypeConfiguration":  "Heat exchanger type. Default: 2.",
        "ValveTypeConfiguration":      "Valve actuator type. Default: 0.",
        "DrainPumpAlarmConfiguration": "Drain pump alarm contact polarity. Default: 0.",
        "FilterMaxWorkTime":           "Maximum filter operating time. Default: 4000h.",
        "GroupTLeadSensorSelect":      "Group lead sensor selection.",
    },
    "holding_registers_group": {},
},

# ─── drv_m ────────────────────────────────────────────────────────────────
"drv_m": {
    "_top": "LEO EC water heater series M (EC fan, continuous control)",
    "input_registers": {
        "T3":             "Supply air temperature after water heat exchanger (T3 sensor).",
        "T4":             "Room temperature (T4 sensor).",
        "FanEff":         "EC fan efficiency — rotational speed [rpm].",
        "AntifreezeeState":"Antifreeze protection state — 8 bits.",
        "DestStatus":     "Destratification state: active when (DestTempRef > Td–Tm) and (Tz > Tm).",
        "FanEcConnect":   "EC fan connection status with DRV M device.",
        "FuseState":      "EC/3-speed/rooftop fan fuse state (bits). Example: 0x100 = 3-speed fan OK.",
        "ValveState":     "Water valve state.",
    },
    "holding_registers_single": {},
    "holding_registers_group": {},
},

# ─── drv_oxen ────────────────────────────────────────────────────────────────
"drv_oxen": {
    "_top": "OXEN heat recovery unit (HRV)",
    "input_registers": {
        "Status1":       "Status register no. 1 (bit-mapped).",
        "T1":            "Supply air temperature (T1 sensor).",
        "T2":            "Air temperature at extract fan (T2 sensor).",
        "T3":            "Air temperature after water heat exchanger (T3 sensor).",
        "T4":            "Return air / room temperature (T4 sensor).",
        "T5":            "Water heat exchanger temperature (T5 sensor).",
        "Outputs":       "Controller output states.",
        "Inputs":        "Controller input states (voltage-free inputs and switches).",
        "FilterWorkTime":"Filter operating time.",
        "FansEff_1":     "Group I fan efficiency — supply [%].",
        "FansEff_2":     "Group II fan efficiency — extract [%].",
    },
    "holding_registers_single": {
        "Config1":      "Bit 0: FilterWorkTimeRST — 0=no action, 1=reset filter time counter (sets address 0x09 to 0x000)",
        "FanEffRef_1":  "EC fan — supply fans (group I), continuous 0–100% control",
        "FanEffRef_2":  "EC fan — extract fans (group II), continuous 0–100% control",
    },
    "holding_registers_group": {
        "FanEffRef_1":  "EC fan — supply fans (group I), continuous 0–100% control",
        "FanEffRef_2":  "EC fan — extract fans (group II), continuous 0–100% control",
    },
},

# ─── drv_robur_next ────────────────────────────────────────────────────────
"drv_robur_next": {
    "_top": "ROBUR NEXT gas-fired water heater with EC fans",
    "input_registers": {
        "T3":                       "Ceiling temperature (T3 sensor).",
        "T4":                       "Room temperature (T4 sensor).",
        "ExternalGasDetectTH1":     "External gas sensor signal — first threshold.",
        "ExternalGasDetectTH2":     "External gas sensor signal — second threshold.",
        "ExternalGasDetectVal":     "Gas concentration — 0–10V DC input (sensor calibration required).",
        "AntifreezeStateWarehouse": "Warehouse antifreeze protection state.",
        "FuseState":                "Fan fuse state.",
        "GasAlarmState":            "Robur alarm — gas/flame. Read from terminal no. 6 (inside the heater).",
        "STBAlarmState":            "Extract air temperature alarm (STB).",
        "FilterWorkTime":           "Filter operating time. Actual value = 5 × register value [min].",
    },
    "holding_registers_single": {
        "GasAlarmReset":          "Gas/flame alarm reset. Reset time should not exceed 5 s (then set value to 0x02)",
        "STBTemperatureAlarmOn":  "STB alarm threshold temperature (Input Register 0x12). Alarm active when set value > T3 (IR 0x05). Default value 900 ensures error occurs before actual Robur STB alarm (which requires manual reset from the control box)",
        "STBTemperatureAlarmOff": "STB alarm reset temperature. Reset possible when set value > T3 (IR 0x05). Additional condition: STB_T_OFF < STB_T_REF",
        "STBAlarmReset":          "If STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), the register will be automatically set to 0x02 (OFF)",
        "ContModeFanSpeedRef":    "Fan capacity setting after reaching target temperature",
        "GasBurnerLvlRef":        "Gas combustion stage setting (active only in manual heating mode WM_HEAT_MANUAL)",
    },
    "holding_registers_group": {
        "STBTemperatureAlarmOn":  "STB alarm activation threshold temperature.",
        "STBTemperatureAlarmOff": "STB alarm reset temperature.",
        "ContModeFanSpeedRef":    "Fan capacity after reaching target temperature.",
        "GasBurnerLvlRef":        "Gas combustion stage (active in WM_HEAT_MANUAL mode).",
    },
},

# ─── drv_robur_next_km ────────────────────────────────────────────────────
"drv_robur_next_km": {
    "_top": "ROBUR NEXT KM gas-fired water heater with mixing chamber",
    "input_registers": {
        "T1":                       "Fresh air temperature (T1 sensor).",
        "T3":                       "Extract air temperature (T3 sensor).",
        "T4":                       "Room temperature (T4 sensor).",
        "ExternalGasDetectTH1":     "External gas sensor signal — first threshold.",
        "ExternalGasDetectTH2":     "External gas sensor signal — second threshold.",
        "ExternalGasDetectVal":     "Gas concentration — 0–10V DC input.",
        "FanRoofTK":                "TK signal from rooftop fan.",
        "FanRoofEff":               "Rooftop fan efficiency.",
        "DamperLevel":              "Current mixing damper position.",
        "DamperForceState":         "Damper forced position state (DamperForceMode = ON).",
        "AntifreezeStateWarehouse": "Warehouse antifreeze protection state.",
        "FuseState":                "Fan fuse state.",
        "GasAlarmState":            "Robur alarm — gas/flame.",
        "STBAlarmState":            "STB alarm — extract air temperature.",
        "FilterWorkTime":           "Filter operating time. Actual value = 5 × register value [min].",
    },
    "holding_registers_single": {
        "DamperForceTempRef":     "Damper forced open temperature. Linked to T1 (fresh air temperature — IR 0x04)",
        "DamperForceLevelRef":    "Target damper opening at forced mode (DamperForceMode == DAMPER_FMD_ON, condition: Temp < DamperForceTempRef)",
        "DamperLevelRef":         "Mixing damper position",
        "DamperContLevelRef":     "Damper position when WorkMode == WM_WINTER_CONT",
        "GasAlarmReset":          "Gas/flame alarm reset. Reset time should not exceed 5 s (then set value to 0x02)",
        "FanRoofForceEffRef":     "Rooftop fan speed override — value added to current speed",
        "STBTemperatureAlarmOn":  "STB alarm threshold temperature (IR 0x12). Alarm active when set value > T3 (IR 0x05)",
        "STBTemperatureAlarmOff": "STB alarm reset temperature. Reset possible when set value > T3. Additional condition: STB_T_OFF < STB_T_REF",
        "STBAlarmReset":          "If STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), the register will be automatically set to 0x02 (OFF)",
        "ContModeFanSpeedRef":    "Fan capacity setting after reaching target temperature",
        "GasBurnerLvlRef":        "Gas combustion stage setting (active only in manual heating mode WM_HEAT_MANUAL)",
    },
    "holding_registers_group": {
        "DamperForceTempRef":     "Damper forced open temperature.",
        "DamperForceLevelRef":    "Target damper opening at forced mode.",
        "DamperLevelRef":         "Mixing damper position.",
        "DamperContLevelRef":     "Damper position when WorkMode = WM_WINTER_CONT.",
        "FanRoofForceEffRef":     "Rooftop fan speed override.",
        "STBTemperatureAlarmOn":  "STB alarm activation threshold temperature.",
        "STBTemperatureAlarmOff": "STB alarm reset temperature.",
        "ContModeFanSpeedRef":    "Fan capacity after reaching target temperature.",
        "GasBurnerLvlRef":        "Gas combustion stage (active in WM_HEAT_MANUAL mode).",
        "ExternalInputTH1DamperLevelRef": "Damper position for EXT TH1 input. Step: 5.",
        "FilterMaxWorkTime":      "Time after which the filter alarm activates. Step: 100.",
        "ExternalInputTH2DamperLevelRef": "Damper position for EXT TH2 input. Step: 5.",
    },
},

# ─── drv_slim ────────────────────────────────────────────────────────────────
"drv_slim": {
    "_top": "SLIM compact air curtain",
    "input_registers": {
        "T3":                  "Supply air temperature after water heat exchanger (T3 sensor).",
        "T4":                  "Supply air temperature before water heat exchanger (T4 sensor).",
        "CurtainFanSpeed":     "Curtain fan speed (3-speed AC fan: 0=stop, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3).",
        "ValveState":          "Water valve state.",
        "HeaterFanSpeed":      "Heater fan speed (3-speed AC fan).",
        "ContactDoor":         "Door contact state.",
        "HeaterDetect":        "Heater detection procedure (ELIS-DUO).",
        "AntifreezeState":     "Antifreeze protection state — 8 bits for individual modes.",
        "FuseState":           "3-speed fan fuse state (bits 8–11). Example: 0x100 = OK, 0x200 = blown.",
        "CurtainElectricpower":"Electric heater power of the curtain (L1/L2 outputs on VALVE connector).",
    },
    "holding_registers_single": {
        "CurtainFanSpeedRef": "Curtain 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "HeaterFanSpeedRef":  "Heater 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "CurtainFanIdleRef":  "Curtain 3-speed AC fan (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "HeaterFanIdleRef":   "Heater 3-speed AC fan (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "FanIdleDelay":       "Fan stand-by delay in seconds; 65535 = infinite",
        "ValveIdleDelay":     "Valve stand-by delay in seconds; 65535 = infinite. Constraint: ValveIdleDelay < FanIdleDelay",
    },
    "holding_registers_group": {
        "CurtainFanSpeedRef": "Curtain 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "CurtainFanIdleRef":  "Curtain 3-speed AC fan (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
        "FanIdleDelay":       "Fan stand-by delay in seconds; 65535 = infinite",
        "ValveIdleDelay":     "Valve stand-by delay in seconds; 65535 = infinite. Constraint: ValveIdleDelay < FanIdleDelay",
    },
},

# ─── drv_v ────────────────────────────────────────────────────────────────
"drv_v": {
    "_top": "LEO AC water heater series V (heating/cooling, EC fan)",
    "input_registers": {
        "T3":                 "Ceiling temperature (T3 sensor).",
        "T4":                 "Room temperature (T4 sensor).",
        "FanEff":             "Fan speed (3-speed AC fan).",
        "AntifreezeeState":   "Warehouse antifreeze protection state — 8 bits.",
        "DestStatus":         "Destratification state: active when (DestTempRef > Td–Tm) and (Tz > Tm).",
        "FilterPressureState":"Filter pressure switch state.",
        "FuseState":          "Fan fuse state (bits). Example: 0x100 = OK, 0x200 = blown.",
        "ValveState":         "Water valve state.",
    },
    "holding_registers_single": {
        "FanEffRef": "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)",
    },
    "holding_registers_group": {},
},

# ─── drv_cube ────────────────────────────────────────────────────────────────
"drv_cube": {
    "_top": "CUBE rooftop unit with EC fans and CO2 sensor",
    "input_registers": {
        "ambient_temp_value":          "Outdoor air temperature.",
        "supply_temp_value":           "Supply air temperature.",
        "return_temp_value":           "Return/extract air temperature.",
        "water_temp_value":            "Water heat exchanger temperature.",
        "TempRoom_ADD":                "Temperature from additional room sensor.",
        "recirculation_damper_level":  "Current recirculation damper position.",
        "swirl_diffuser_position":     "Swirl diffuser position.",
        "rotary_level":                "Rotary level.",
        "fan_supply_flow":             "Supply air flow.",
        "gas_heating_value":           "Gas heating value.",
        "CO2_status":                  "CO2 status — LSB value (MSB ignored).",
        "Rooftop_work_mode":           "Commanded rooftop unit operating mode — LSB value.",
        "Rooftop_current_work_mode":   "Current rooftop unit operating mode — LSB value.",
        "Alarm":                       "Alarm states — LSB value.",
    },
    "holding_registers_single": {
        "WorkMode":                    "16-bit register: MSB ignored, LSB = operating mode",
        "fan_eff":                     "EC fan capacity setpoint, continuous 0–100% control",
        "fan_eff_CO2_I":               "EC fan capacity setpoint for CO2 sensor threshold 1",
        "fan_eff_CO2_II":              "EC fan capacity setpoint for CO2 sensor threshold 2",
        "recirculation_mode":          "16-bit register: MSB ignored, LSB = recirculation mode",
        "recirculation_value":         "Recirculation value, continuous 0–100% control",
        "recirculation_value_CO2_I":   "Recirculation value for CO2 sensor threshold 1",
        "recirculation_value_CO2_II":  "Recirculation value for CO2 sensor threshold 2",
        "work_mode_NW":                "Swirl diffuser (NW) operating mode. 16-bit register: MSB ignored, LSB = mode",
        "swirl_diffuser_level":        "Swirl diffuser opening level",
        "Htg_swirl_diffuser_level":    "Swirl diffuser opening level in heating mode",
        "Clg_swirl_diffuser_level":    "Swirl diffuser opening level in cooling mode",
        "temperature_ref":             "Target room temperature",
        "temperature_room":            "Room temperature sent to the device via Modbus",
        "room_sensor_selection":       "Room temperature source selection",
        "CO2_status":                  "CO2 status written by T-box to the device. 16-bit register: MSB ignored, LSB = status",
        "CO2_source":                  "CO2 data source selection. 16-bit register: MSB ignored, LSB = source",
    },
    "holding_registers_group": {
        "WorkMode":                    "16-bit register: MSB ignored, LSB = operating mode",
        "fan_eff":                     "EC fan capacity setpoint, continuous 0–100% control",
        "fan_eff_CO2_I":               "EC fan capacity setpoint for CO2 sensor threshold 1",
        "fan_eff_CO2_II":              "EC fan capacity setpoint for CO2 sensor threshold 2",
        "recirculation_mode":          "16-bit register: MSB ignored, LSB = recirculation mode",
        "recirculation_value":         "Recirculation value, continuous 0–100% control",
        "recirculation_value_CO2_I":   "Recirculation value for CO2 sensor threshold 1",
        "recirculation_value_CO2_II":  "Recirculation value for CO2 sensor threshold 2",
        "work_mode_NW":                "Swirl diffuser (NW) operating mode. 16-bit register: MSB ignored, LSB = mode",
        "swirl_diffuser_level":        "Swirl diffuser opening level",
        "Htg_swirl_diffuser_level":    "Swirl diffuser opening level in heating mode",
        "Clg_swirl_diffuser_level":    "Swirl diffuser opening level in cooling mode",
    },
},

}  # end TRANSLATIONS

# ────────────────────────────────────────────────────────────────────────────
# Helper: rebuild an OrderedDict with description_en inserted after description
# ────────────────────────────────────────────────────────────────────────────

def insert_after(d, key_before, key_new, value):
    """Return a new ordered dict with key_new/value inserted after key_before."""
    result = collections.OrderedDict()
    for k, v in d.items():
        result[k] = v
        if k == key_before and key_new not in d:
            result[key_new] = value
    return result


def add_en_to_register(reg, section_translations):
    """
    Given a register dict and a name→english dict, return a new dict
    with description_en added after description (if description exists).
    """
    name = reg.get("name", "")
    en_text = section_translations.get(name)
    if en_text is None or "description" not in reg:
        # No translation needed / no description field → return as-is
        return reg

    result = collections.OrderedDict()
    for k, v in reg.items():
        result[k] = v
        if k == "description":
            result["description_en"] = en_text
    return result


def process_file(fpath, file_key):
    trans = TRANSLATIONS.get(file_key, {})

    with open(fpath, encoding="utf-8") as f:
        raw = f.read()
    data = json.loads(raw, object_pairs_hook=collections.OrderedDict)

    # --- top-level description_en ---
    if "description" in data and "_top" in trans:
        data = insert_after(data, "description", "description_en", trans["_top"])

    # --- registers ---
    for section in ("input_registers", "holding_registers_single", "holding_registers_group"):
        sec_trans = trans.get(section, {})
        if section in data and isinstance(data[section], list):
            data[section] = [
                add_en_to_register(reg, sec_trans)
                for reg in data[section]
            ]

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(json.dumps(data, ensure_ascii=False, indent=2))
        f.write("\n")

    print(f"  processed: {os.path.basename(fpath)}")


# ────────────────────────────────────────────────────────────────────────────
# Main
# ────────────────────────────────────────────────────────────────────────────
DEVICES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "devices")

FILE_MAP = {
    "drv_ax.json":           "drv_ax",
    "drv_cool.json":         "drv_cool",
    "drv_cube.json":         "drv_cube",
    "drv_d.json":            "drv_d",
    "drv_el.json":           "drv_el",
    "drv_elis.json":         "drv_elis",
    "drv_km.json":           "drv_km",
    "drv_luna.json":         "drv_luna",
    "drv_m.json":            "drv_m",
    "drv_oxen.json":         "drv_oxen",
    "drv_robur_next.json":   "drv_robur_next",
    "drv_robur_next_km.json":"drv_robur_next_km",
    "drv_slim.json":         "drv_slim",
    "drv_v.json":            "drv_v",
}

print("Adding description_en to all device JSON files...")
for fname, key in FILE_MAP.items():
    fpath = os.path.join(DEVICES_DIR, fname)
    if not os.path.exists(fpath):
        print(f"  MISSING: {fname}")
        continue
    process_file(fpath, key)

print("\nDone.")
