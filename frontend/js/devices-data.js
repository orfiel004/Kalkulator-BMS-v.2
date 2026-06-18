const DEVICES_DATA = {
  "OXEN (DRV OXEN)": {
    "name": "OXEN (DRV OXEN)",
    "description": "Rekuperator OXEN",
    "group_priority": 1,
    "input_registers": [
      {
        "offset": 0,
        "name": "Status1",
        "description": "Rejestr statusu nr 1 (bitowy).",
        "description_en": "Status register 1 (bitfield)."
      },
      {
        "offset": 2,
        "name": "T1",
        "description": "Temperatura powietrza nawiewanego (czujnik T1).",
        "description_en": "Supply air temperature (T1 sensor)."
      },
      {
        "offset": 3,
        "name": "T2",
        "description": "Temperatura powietrza przy wentylatorze wyciągowym (czujnik T2).",
        "description_en": "Air temperature at exhaust fan (T2 sensor)."
      },
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3).",
        "description_en": "Air temperature after water heat exchanger (T3 sensor)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura powietrza powrotnego / pomieszczenia (czujnik T4).",
        "description_en": "Return air / room temperature (T4 sensor)."
      },
      {
        "offset": 6,
        "name": "T5",
        "description": "Temperatura wymiennika wodnego (czujnik T5).",
        "description_en": "Heat exchanger water temperature (T5 sensor)."
      },
      {
        "offset": 7,
        "name": "Outputs",
        "description": "Stan wyjść sterownika.",
        "description_en": "Controller output states."
      },
      {
        "offset": 8,
        "name": "Inputs",
        "description": "Stan wejść sterownika (wejścia beznap. i przełączniki).",
        "description_en": "Controller input states (volt-free inputs and switches)."
      },
      {
        "offset": 9,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra.",
        "description_en": "Filter operating time."
      },
      {
        "offset": 10,
        "name": "FansEff_1",
        "description": "Wydajność wentylatorów grupy I — nawiew [%].",
        "description_en": "Supply fan group I capacity [%]."
      },
      {
        "offset": 11,
        "name": "FansEff_2",
        "description": "Wydajność wentylatorów grupy II — wyciąg [%].",
        "description_en": "Exhaust fan group II capacity [%]."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 0,
        "name": "Config1",
        "description": "Bit 0: FilterWorkTimeRST — 0=brak akcji, 1=reset licznika czasu filtra (ustawia adres 0x09 na 0x000)",
        "description_en": "Bit 0: FilterWorkTimeRST — 0=no action, 1=reset filter time counter (sets address 0x09 to 0x000)"
      },
      {
        "offset": 2,
        "name": "FanEffRef_1",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC — wentylatory nawiewne (grupa I), płynna regulacja 0–100%",
        "description_en": "EC fan — supply fans (group I), continuous regulation 0–100%"
      },
      {
        "offset": 3,
        "name": "FanEffRef_2",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC — wentylatory wywiewne (grupa II), płynna regulacja 0–100%",
        "description_en": "EC fan — exhaust fans (group II), continuous regulation 0–100%"
      },
      {
        "offset": 4,
        "name": "OxenState",
        "values": {
          "0": "OX_OFF — wyłączony",
          "1": "OX_ON — włączony",
          "2": "OX_ON — włączony",
          "3": "OX_ON — włączony"
        },
        "values_en": {
          "0": "OX_OFF — off",
          "1": "OX_ON — on",
          "2": "OX_ON — on",
          "3": "OX_ON — on"
        }
      },
      {
        "offset": 5,
        "name": "OxenMode",
        "values": {
          "0": "OXEN_MD_AUTO — automatyczny (automatyczna regulacja bypass)",
          "1": "OXEN_MD_WINTER — tryb zimowy (bypass wyłączony)",
          "2": "OXEN_MD_SUMMER — tryb letni (bypass włączony)"
        },
        "values_en": {
          "0": "OXEN_MD_AUTO — automatic (automatic bypass control)",
          "1": "OXEN_MD_WINTER — winter mode (bypass off)",
          "2": "OXEN_MD_SUMMER — summer mode (bypass on)"
        }
      },
      {
        "offset": 6,
        "name": "TempRef",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "TLeadVal",
        "min": -500,
        "max": 1500,
        "unit": "°C×0.1"
      },
      {
        "offset": 12,
        "name": "TleadSensorSelect",
        "values": {
          "0": "T_NS — tylko odczyt",
          "1": "T_LEAD — wartość przez Modbus (TLeadVal)",
          "2": "TSL_T3 — czujnik T3 (złącze DRV)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
        },
        "values_en": {
          "0": "T_NS — read-only",
          "1": "T_LEAD — value via Modbus (TLeadVal)",
          "2": "TSL_T3 — T3 sensor (DRV connector)",
          "3": "TSL_T4 — T4 sensor (DRV connector)"
        }
      }
    ],
    "holding_registers_group": [
      {
        "offset": 2,
        "name": "FanEffRef_1",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC — wentylatory nawiewne (grupa I), płynna regulacja 0–100%",
        "description_en": "EC fan — supply fans (group I), continuous regulation 0–100%"
      },
      {
        "offset": 3,
        "name": "FanEffRef_2",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC — wentylatory wywiewne (grupa II), płynna regulacja 0–100%",
        "description_en": "EC fan — exhaust fans (group II), continuous regulation 0–100%"
      },
      {
        "offset": 5,
        "name": "OxenMode",
        "values": {
          "0": "OXEN_MD_AUTO — automatyczny (automatyczna regulacja bypass)",
          "1": "OXEN_MD_WINTER — tryb zimowy (bypass wyłączony)",
          "2": "OXEN_MD_SUMMER — tryb letni (bypass włączony)"
        },
        "values_en": {
          "0": "OXEN_MD_AUTO — automatic (automatic bypass control)",
          "1": "OXEN_MD_WINTER — winter mode (bypass off)",
          "2": "OXEN_MD_SUMMER — summer mode (bypass on)"
        }
      },
      {
        "offset": 6,
        "name": "TempRef",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      }
    ],
    "description_en": "OXEN heat recovery unit"
  },
  "LEO KM (DRV KM)": {
    "name": "LEO KM (DRV KM)",
    "description": "Centrala wentylacyjna z klapą mieszającą",
    "group_priority": 2,
    "input_registers": [
      {
        "offset": 4,
        "name": "T1",
        "description": "Temperatura powietrza świeżego (czujnik T1).",
        "description_en": "Fresh air temperature (T1 sensor)."
      },
      {
        "offset": 5,
        "name": "T3",
        "description": "Temperatura czujnika T3 (powietrze za wymiennikiem wodnym).",
        "description_en": "T3 sensor temperature (air after water heat exchanger)."
      },
      {
        "offset": 6,
        "name": "T4",
        "description": "Temperatura powietrza przed wymiennikiem (czujnik T4).",
        "description_en": "Air temperature before heat exchanger (T4 sensor)."
      },
      {
        "offset": 7,
        "name": "T5",
        "description": "Temperatura wody na wymienniku (czujnik T5).",
        "description_en": "Heat exchanger water temperature (T5 sensor)."
      },
      {
        "offset": 8,
        "name": "ExternalGasDetectTH1",
        "description": "Sygnał zewnętrznego czujnika gazu — próg pierwszy.",
        "description_en": "External gas sensor signal — first threshold."
      },
      {
        "offset": 9,
        "name": "ExternalGasDetectTH2",
        "description": "Sygnał zewnętrznego czujnika gazu — próg drugi.",
        "description_en": "External gas sensor signal — second threshold."
      },
      {
        "offset": 10,
        "name": "ExternalGasDetectVal",
        "description": "Stężenie gazu — wejście 0–10V DC.",
        "description_en": "Gas concentration — 0–10V DC input."
      },
      {
        "offset": 11,
        "name": "FanRoofTK",
        "description": "Sygnał TK z wentylatora dachowego.",
        "description_en": "TK signal from roof fan."
      },
      {
        "offset": 12,
        "name": "FanEff",
        "description": "Wydajność wentylatora EC lub AC (3-biegowy).",
        "description_en": "EC or AC fan capacity (3-speed)."
      },
      {
        "offset": 13,
        "name": "FanRoofEff",
        "description": "Wydajność wentylatora dachowego.",
        "description_en": "Roof fan capacity."
      },
      {
        "offset": 14,
        "name": "DamperLevel",
        "description": "Aktualna pozycja klapy.",
        "description_en": "Current damper position."
      },
      {
        "offset": 15,
        "name": "DamperForceState",
        "description": "Stan wymuszenia pozycji klapy.",
        "description_en": "Damper forcing state."
      },
      {
        "offset": 16,
        "name": "AntiFreezeState",
        "description": "Stan ochrony przeciwzamrożeniowej — 8 bitów.",
        "description_en": "Antifreeze protection state — 8 bits."
      },
      {
        "offset": 17,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min].",
        "description_en": "Filter operating time. Actual value = 5 × register value [min]."
      },
      {
        "offset": 18,
        "name": "FilterPressureSwitchState",
        "description": "Stan presostatu filtra.",
        "description_en": "Filter pressure switch state."
      },
      {
        "offset": 19,
        "name": "FanEcConnect",
        "description": "Status połączenia wentylatora EC.",
        "description_en": "EC fan connection status."
      },
      {
        "offset": 20,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów EC/3V/dachowych (bity maskowane).",
        "description_en": "Fan fuse state (EC/3V/roof fans, masked bits)."
      },
      {
        "offset": 21,
        "name": "ValveState",
        "description": "Stan zaworu wodnego.",
        "description_en": "Water valve state."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT — tryb grzania",
          "3": "WM_COOL — tryb chłodzenia",
          "4": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HT — tryb grzania",
          "3": "WM_COOL — tryb chłodzenia",
          "4": "WM_VENT — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "AntiFreezeWareHouseOn",
        "values": {
          "1": "disable — wyłączony",
          "2": "enable — włączony"
        },
        "values_en": {
          "1": "disable — disabled",
          "2": "enable — enabled"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS — tylko odczyt",
          "1": "DAMPER_FMD_OFF — wymuszanie wyłączone",
          "2": "DAMPER_FMD_ON — wymuszanie włączone (jeśli T1 < DamperForceTempRef)"
        },
        "values_en": {
          "0": "DAMPER_FMD_NS — read-only",
          "1": "DAMPER_FMD_OFF — forcing disabled",
          "2": "DAMPER_FMD_ON — forcing enabled (if T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 8,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 9,
        "name": "DamperForceLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 10,
        "name": "DamperLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 11,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC: płynna regulacja 0–100%. Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "EC fan: continuous regulation 0–100%. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 12,
        "name": "FanRoofForceEffRef",
        "min": -10,
        "max": 10,
        "unit": "%",
        "description": "Korekta prędkości wentylatora dachowego — wartość dodawana do aktualnej prędkości",
        "description_en": "Roof fan speed correction — value added to current speed"
      },
      {
        "offset": 13,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 14,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 15,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (powietrze przed wymiennikiem)"
        },
        "values_en": {
          "0": "TSL_TNS — read-only",
          "1": "TSL_TLEAD — value via Modbus (TLeadVal)",
          "3": "TSL_T4 — T4 sensor (air before heat exchanger)"
        }
      },
      {
        "offset": 16,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS — tylko odczyt",
          "1": "FR_MD_01 — zależny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)",
          "2": "FR_MD_02 — zależny wyłącznie od pozycji klapy (DamperLevelRef)"
        },
        "values_en": {
          "0": "FR_MD_NS — read-only",
          "1": "FR_MD_01 — dependent on damper position (DamperLevelRef) and fan setpoint (FanEffRef)",
          "2": "FR_MD_02 — dependent on damper position only (DamperLevelRef)"
        }
      },
      {
        "offset": 17,
        "name": "FilterTimeCntRst",
        "values": {
          "0": "FLT_CNT_RST_NS — tylko odczyt (po resecie)",
          "1": "FLT_CNT_RST — reset licznika czasu filtra"
        },
        "values_en": {
          "0": "FLT_CNT_RST_NS — read-only (after reset)",
          "1": "FLT_CNT_RST — reset filter time counter"
        }
      },
      {
        "offset": 18,
        "name": "ThermostatModeState",
        "values": {
          "1": "THERMO_MD_ON — tryb termostatu włączony",
          "2": "THERMO_MD_OFF — tryb termostatu wyłączony"
        },
        "values_en": {
          "1": "THERMO_MD_ON — thermostat mode on",
          "2": "THERMO_MD_OFF — thermostat mode off"
        }
      },
      {
        "offset": 19,
        "name": "ThermostatModeFanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Prędkość wentylatora w trybie termostatu. EC: płynna 0–100%. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3",
        "description_en": "Fan speed in thermostat mode. EC: continuous 0–100%. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT — tryb grzania",
          "3": "WM_COOL — tryb chłodzenia",
          "4": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HT — tryb grzania",
          "3": "WM_COOL — tryb chłodzenia",
          "4": "WM_VENT — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS — tylko odczyt",
          "1": "DAMPER_FMD_OFF — wymuszanie wyłączone",
          "2": "DAMPER_FMD_ON — wymuszanie włączone (jeśli T1 < DamperForceTempRef)"
        },
        "values_en": {
          "0": "DAMPER_FMD_NS — read-only",
          "1": "DAMPER_FMD_OFF — forcing disabled",
          "2": "DAMPER_FMD_ON — forcing enabled (if T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 6,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "DamperForceLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 8,
        "name": "DamperLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 9,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC: płynna regulacja 0–100%. Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "EC fan: continuous regulation 0–100%. 3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 10,
        "name": "FanRoofForceEffRef",
        "min": -10,
        "max": 10,
        "unit": "%",
        "description": "Korekta prędkości wentylatora dachowego — wartość dodawana do aktualnej prędkości",
        "description_en": "Roof fan speed correction — value added to current speed"
      },
      {
        "offset": 11,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS — tylko odczyt",
          "1": "FR_MD_01 — zależny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)",
          "2": "FR_MD_02 — zależny wyłącznie od pozycji klapy (DamperLevelRef)"
        },
        "values_en": {
          "0": "FR_MD_NS — read-only",
          "1": "FR_MD_01 — dependent on damper position (DamperLevelRef) and fan setpoint (FanEffRef)",
          "2": "FR_MD_02 — dependent on damper position only (DamperLevelRef)"
        }
      },
      {
        "offset": 12,
        "name": "ThermostatModeState",
        "values": {
          "1": "THERMO_MD_ON — tryb termostatu włączony",
          "2": "THERMO_MD_OFF — tryb termostatu wyłączony"
        },
        "values_en": {
          "1": "THERMO_MD_ON — thermostat mode on",
          "2": "THERMO_MD_OFF — thermostat mode off"
        }
      },
      {
        "offset": 13,
        "name": "ThermostatModeFanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Prędkość wentylatora w trybie termostatu. EC: płynna 0–100%. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3",
        "description_en": "Fan speed in thermostat mode. EC: continuous 0–100%. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3"
      }
    ],
    "description_en": "Mixing chamber ventilation unit"
  },
  "ELIS (DRV ELIS)": {
    "name": "ELIS (DRV ELIS)",
    "description": "Kurtyna powietrzna ELIS",
    "group_priority": 3,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3).",
        "description_en": "Supply air temperature after water heat exchanger (T3 sensor)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura powietrza przed wymiennikiem wodnym (czujnik T4).",
        "description_en": "Air temperature before water heat exchanger (T4 sensor)."
      },
      {
        "offset": 6,
        "name": "CurtainFanSpeed",
        "description": "Prędkość wentylatora kurtyny (AC 3-biegowy: 0=stop, 1–33=bieg1, 34–66=bieg2, 67–100=bieg3).",
        "description_en": "Curtain fan speed (3-speed AC fan: 0=stop, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3)."
      },
      {
        "offset": 7,
        "name": "ValveState",
        "description": "Stan zaworu wodnego.",
        "description_en": "Water valve state."
      },
      {
        "offset": 8,
        "name": "HeaterFanSpeed",
        "description": "Prędkość wentylatora nagrzewnicy (AC 3-biegowy).",
        "description_en": "Heater fan speed (3-speed AC fan)."
      },
      {
        "offset": 9,
        "name": "ContactDoor",
        "description": "Stan styku drzwiowego.",
        "description_en": "Door contact state."
      },
      {
        "offset": 10,
        "name": "HeaterDetect",
        "description": "Procedura wykrywania nagrzewnicy (ELIS-DUO).",
        "description_en": "Heater detection procedure (ELIS-DUO)."
      },
      {
        "offset": 11,
        "name": "AntifreezeState",
        "description": "Stan ochrony przeciwzamrożeniowej — 8 bitów dla poszczególnych trybów.",
        "description_en": "Antifreeze protection state — 8 bits for individual modes."
      },
      {
        "offset": 12,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora 3V (bity 8–11). Przykład: 0x100 = OK, 0x200 = przepalony.",
        "description_en": "Fan fuse state (bits 8–11). Example: 0x100 = OK, 0x200 = blown."
      },
      {
        "offset": 13,
        "name": "CurtainElectricpower",
        "description": "Moc elektrycznej nagrzewnicy kurtyny (wyjścia L1/L2 na złączu VALVE).",
        "description_en": "Curtain electric heater power (L1/L2 outputs on VALVE connector)."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT — tryb grzania",
          "3": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HEAT — heating mode",
          "3": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Curtain fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        },
        "values_en": {
          "0": "HEAT_NS — read-only",
          "1": "HEAT_ON — heating on",
          "2": "HEAT_OFF — heating off"
        }
      },
      {
        "offset": 7,
        "name": "HeaterFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Heater fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "HeaterHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        },
        "values_en": {
          "0": "HEAT_NS — read-only",
          "1": "HEAT_ON — heating on",
          "2": "HEAT_OFF — heating off"
        }
      },
      {
        "offset": 10,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 11,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 12,
        "name": "TLeadSensorSelect",
        "values": {
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
        },
        "values_en": {
          "1": "TSL_TLEAD — value via Modbus (TLeadVal)",
          "3": "TSL_T4 — T4 sensor (DRV connector)"
        }
      },
      {
        "offset": 13,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS — brak wymuszenia",
          "1": "CURT_PRG_K1 — wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 — wymuszenie SW3 na K2"
        },
        "values_en": {
          "0": "CURT_PRG_NS — no override",
          "1": "CURT_PRG_K1 — force SW3 to K1",
          "2": "CURT_PRG_K2 — force SW3 to K2"
        }
      },
      {
        "offset": 14,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Curtain fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 15,
        "name": "HeaterFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Heater fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 16,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie stand-by wentylatora w sekundach; 65535 = nieskończone",
        "description_en": "Fan stand-by delay in seconds; 65535 = infinite"
      },
      {
        "offset": 17,
        "name": "ValveIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie zaworu w trybie stand-by w sekundach; 65535 = nieskończone. Warunek: ValveIdleDelay < FanIdleDelay",
        "description_en": "Valve stand-by delay in seconds; 65535 = infinite. Constraint: ValveIdleDelay < FanIdleDelay"
      },
      {
        "offset": 18,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        },
        "values_en": {
          "1": "WM_ON — enabled",
          "2": "WM_OFF — disabled"
        }
      },
      {
        "offset": 19,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT — tryb grzania",
          "3": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HEAT — heating mode",
          "3": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Curtain fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        },
        "values_en": {
          "0": "HEAT_NS — read-only",
          "1": "HEAT_ON — heating on",
          "2": "HEAT_OFF — heating off"
        }
      },
      {
        "offset": 7,
        "name": "ContactDoor",
        "values": {
          "1": "DOOR_OPEN — drzwi otwarte",
          "2": "DOOR_CLOSE — drzwi zamknięte"
        },
        "values_en": {
          "1": "DOOR_OPEN — door open",
          "2": "DOOR_CLOSE — door closed"
        }
      },
      {
        "offset": 8,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS — brak wymuszenia",
          "1": "CURT_PRG_K1 — wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 — wymuszenie SW3 na K2"
        },
        "values_en": {
          "0": "CURT_PRG_NS — no override",
          "1": "CURT_PRG_K1 — force SW3 to K1",
          "2": "CURT_PRG_K2 — force SW3 to K2"
        }
      },
      {
        "offset": 9,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Curtain fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 10,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie stand-by wentylatora w sekundach; 65535 = nieskończone",
        "description_en": "Fan stand-by delay in seconds; 65535 = infinite"
      }
    ],
    "description_en": "ELIS air curtain"
  },
  "ELIS AX (DRV AX)": {
    "name": "ELIS AX (DRV AX)",
    "description": "Kurtyna powietrzna ELIS AX (wielobiegowe wentylatory EC)",
    "group_priority": 4,
    "tbox_zone_only": true,
    "input_registers": [
      {
        "offset": 4,
        "name": "T1",
        "description": "Temperatura powietrza zewnętrznego (czujnik T1).",
        "description_en": "Outdoor air temperature (T1 sensor)."
      },
      {
        "offset": 5,
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3).",
        "description_en": "Supply air temperature after water heat exchanger (T3 sensor)."
      },
      {
        "offset": 6,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4).",
        "description_en": "Room temperature (T4 sensor)."
      },
      {
        "offset": 7,
        "name": "T5",
        "description": "Temperatura wymiennika wodnego — rura powrotna (czujnik T5).",
        "description_en": "Water heat exchanger return pipe temperature (T5 sensor)."
      },
      {
        "offset": 8,
        "name": "CurtainState1",
        "description": "Rejestr statusu sterownika — bity reprezentują aktywne funkcje i tryby pracy.",
        "description_en": "Controller status register — bits represent active functions and operating modes."
      },
      {
        "offset": 9,
        "name": "CurtainState2",
        "description": "Rozszerzenie rejestru statusu sterownika.",
        "description_en": "Controller status register extension."
      },
      {
        "offset": 10,
        "name": "CurtainState3",
        "description": "Rozszerzenie rejestru statusu sterownika.",
        "description_en": "Controller status register extension."
      },
      {
        "offset": 11,
        "name": "Fan1Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 1 [RPM].",
        "description_en": "Actual supply fan 1 speed [RPM]."
      },
      {
        "offset": 12,
        "name": "Fan2Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 2 [RPM].",
        "description_en": "Actual supply fan 2 speed [RPM]."
      },
      {
        "offset": 13,
        "name": "Fan3Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 3 [RPM].",
        "description_en": "Actual supply fan 3 speed [RPM]."
      },
      {
        "offset": 14,
        "name": "Fan4Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 4 [RPM].",
        "description_en": "Actual supply fan 4 speed [RPM]."
      },
      {
        "offset": 15,
        "name": "Fan5Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 5 [RPM].",
        "description_en": "Actual supply fan 5 speed [RPM]."
      },
      {
        "offset": 16,
        "name": "Fan6Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 6 [RPM].",
        "description_en": "Actual supply fan 6 speed [RPM]."
      },
      {
        "offset": 17,
        "name": "Fan7Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 7 [RPM].",
        "description_en": "Actual supply fan 7 speed [RPM]."
      },
      {
        "offset": 18,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min].",
        "description_en": "Filter operating time. Actual value = 5 × register value [min]."
      },
      {
        "offset": 19,
        "name": "ValveRelaysState",
        "description": "Aktualny status zaworu na stykach VALVE_RELAYS (L1, L2). 0=otwarty, 1=zamknięty.",
        "description_en": "Current valve status on VALVE_RELAYS contacts (L1, L2). 0=open, 1=closed."
      },
      {
        "offset": 20,
        "name": "Valve0-10State",
        "description": "Aktualny status zaworu 0–10V.",
        "description_en": "Current 0–10V valve status."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "OFF — urządzenie wyłączone",
          "1": "HEAT — tryb grzania",
          "2": "VENT — wentylacja",
          "3": "SMART — tryb automatyczny"
        },
        "values_en": {
          "0": "OFF — device off",
          "1": "HEAT — heating mode",
          "2": "VENT — ventilation",
          "3": "SMART — automatic mode"
        }
      },
      {
        "offset": 5,
        "name": "FanWorkMode",
        "values": {
          "0": "AUTO",
          "1": "MANUAL"
        },
        "description": "Tryb pracy wentylatora. Domyślnie MANUAL.",
        "description_en": "Fan operating mode. Default: MANUAL."
      },
      {
        "offset": 6,
        "name": "Program",
        "description": "Program pracy kurtyny (K1, K2...). Domyślnie K1.",
        "description_en": "Curtain operating program (K1, K2...). Default: K1."
      },
      {
        "offset": 7,
        "name": "FWM_ManualHeatVentRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wydajność wentylatora w trybie MANUAL (HEAT lub VENT). Domyślnie 50%.",
        "description_en": "Fan capacity in MANUAL mode (HEAT or VENT). Default: 50%."
      },
      {
        "offset": 8,
        "name": "FWM_StandbyRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wydajność wentylatora w trybie STANDBY. Domyślnie 20%.",
        "description_en": "Fan capacity in STANDBY mode. Default: 20%."
      },
      {
        "offset": 9,
        "name": "FWM_AutoHeatVentMin",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Minimalna wydajność wentylatora w trybie AUTO (HEAT/VENT). Warunek: Min < Max. Domyślnie 0%.",
        "description_en": "Minimum fan capacity in AUTO mode (HEAT/VENT). Constraint: Min < Max. Default: 0%."
      },
      {
        "offset": 10,
        "name": "FWM_AutoHeatVentMax",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Maksymalna wydajność wentylatora w trybie AUTO (HEAT/VENT). Warunek: Max > Min. Domyślnie 100%.",
        "description_en": "Maximum fan capacity in AUTO mode (HEAT/VENT). Constraint: Max > Min. Default: 100%."
      },
      {
        "offset": 11,
        "name": "EWM_HeatT3Ref",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura zadana nawiewu dla trybu grzania (HEAT). Domyślnie 320 = 32.0°C.",
        "description_en": "Supply air setpoint temperature for HEAT mode. Default: 320 = 32.0°C."
      },
      {
        "offset": 12,
        "name": "EWM_HeatT5Max",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Ograniczenie temperatury wody powrotnej dla trybu grzania. Domyślnie 320 = 32.0°C.",
        "description_en": "Return water temperature limit for HEAT mode. Default: 320 = 32.0°C."
      },
      {
        "offset": 13,
        "name": "EWM_HeatT5LimitMode",
        "values": {
          "1": "ON — aktywne",
          "2": "OFF — wyłączone"
        },
        "description": "Włącz/wyłącz ograniczenie temperatury wody powrotnej. Domyślnie OFF.",
        "description_en": "Enable/disable return water temperature limit. Default: OFF.",
        "values_en": {
          "1": "ON — active",
          "2": "OFF — disabled"
        }
      },
      {
        "offset": 14,
        "name": "PreheatT5Ref",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura wody powrotnej po której włącza się wentylator (PREHEAT). Domyślnie 300 = 30.0°C.",
        "description_en": "Return water temperature (T5) threshold to start fan (PREHEAT). Default: 300 = 30.0°C."
      },
      {
        "offset": 15,
        "name": "StandbyFanIdleDelay",
        "min": 0,
        "max": 9999,
        "unit": "s",
        "description": "Opóźnienie pracy wentylatora w trybie STANDBY [s]. Domyślnie 300s. Warunek: ≥ StandbyValveIdleDelay.",
        "description_en": "Fan idle delay in STANDBY mode [s]. Default: 300s. Constraint: ≥ StandbyValveIdleDelay."
      },
      {
        "offset": 16,
        "name": "StandbyValveIdleDelay",
        "min": 0,
        "max": 9999,
        "unit": "s",
        "description": "Opóźnienie pracy zaworu w trybie STANDBY [s]. Domyślnie 300s. Warunek: ≤ StandbyFanIdleDelay.",
        "description_en": "Valve idle delay in STANDBY mode [s]. Default: 300s. Constraint: ≤ StandbyFanIdleDelay."
      },
      {
        "offset": 17,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "ON — aktywne",
          "2": "OFF — wyłączone"
        },
        "description": "Ochrona przeciwzamrożeniowa magazynu. Domyślnie OFF.",
        "description_en": "Warehouse antifreeze protection. Default: OFF.",
        "values_en": {
          "1": "ON — active",
          "2": "OFF — disabled"
        }
      },
      {
        "offset": 18,
        "name": "AntifreezeWareTempOn",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura progowa aktywacji ochrony przeciwzamrożeniowej magazynu. Domyślnie 70 = 7.0°C.",
        "description_en": "Warehouse antifreeze activation temperature threshold. Default: 70 = 7.0°C."
      },
      {
        "offset": 19,
        "name": "AntifreezeWaterExchangeOn",
        "values": {
          "1": "ON — aktywne",
          "2": "OFF — wyłączone"
        },
        "description": "Ochrona przeciwzamrożeniowa wymiennika wodnego. Domyślnie ON.",
        "description_en": "Water heat exchanger antifreeze protection. Default: ON.",
        "values_en": {
          "1": "ON — active",
          "2": "OFF — disabled"
        }
      },
      {
        "offset": 20,
        "name": "AntifreezeWaterExchangeT3",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Progowa temperatura nawiewu T3 dla aktywacji ochrony wymiennika. Domyślnie 70 = 7.0°C.",
        "description_en": "Supply air temperature (T3) threshold for exchanger antifreeze activation. Default: 70 = 7.0°C."
      },
      {
        "offset": 21,
        "name": "AntifreezeWaterExchangeT5",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Progowa temperatura wody T5 dla aktywacji ochrony wymiennika. Domyślnie 70 = 7.0°C.",
        "description_en": "Water temperature (T5) threshold for exchanger antifreeze activation. Default: 70 = 7.0°C."
      },
      {
        "offset": 22,
        "name": "PreheatOnOff",
        "values": {
          "1": "ON",
          "2": "OFF"
        },
        "description": "Włącz/wyłącz podgrzewanie wstępne (PREHEAT). Domyślnie OFF.",
        "description_en": "Enable/disable preheat function. Default: OFF."
      },
      {
        "offset": 23,
        "name": "FilterMaxWorkTime",
        "description": "Kasowanie licznika czasu pracy filtra. Domyślnie OFF.",
        "description_en": "Reset filter operating time counter. Default: OFF."
      },
      {
        "offset": 24,
        "name": "DoorOpenFreqAlphaThreshold",
        "min": 0,
        "max": 100,
        "description": "Próg detekcji częstotliwości otwierania drzwi w trybie SMART. Domyślnie 60.",
        "description_en": "Door opening frequency detection threshold in SMART mode. Default: 60."
      },
      {
        "offset": 25,
        "name": "DoorOpenFreqTimePeriod",
        "unit": "s",
        "description": "Okres detekcji częstotliwości otwierania drzwi w trybie SMART. Domyślnie 300s.",
        "description_en": "Door opening frequency detection time period in SMART mode. Default: 300s."
      },
      {
        "offset": 26,
        "name": "FWMAutoAddHeatMin",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Minimalna wydajność wentylatora w trybie dogrzewania (ADD HEAT), Auto. Domyślnie 5%. Warunek: Min < Max.",
        "description_en": "Minimum fan capacity in ADD HEAT mode, Auto. Default: 5%. Constraint: Min < Max."
      },
      {
        "offset": 27,
        "name": "FWMAutoAddHeatMax",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Maksymalna wydajność wentylatora w trybie dogrzewania (ADD HEAT), Auto. Domyślnie 5%. Warunek: Min < Max.",
        "description_en": "Maximum fan capacity in ADD HEAT mode, Auto. Default: 5%. Constraint: Max > Min."
      },
      {
        "offset": 28,
        "name": "EWMSmartT124h",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura zadana przejścia VENT→HEAT w trybie SMART. Domyślnie 170 = 17.0°C. Warunek: ≤ EWMSmartT13h − 1K.",
        "description_en": "Setpoint for VENT→HEAT transition in SMART mode. Default: 170 = 17.0°C. Constraint: ≤ EWMSmartT13h − 1K."
      },
      {
        "offset": 29,
        "name": "EWMSmartT13h",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura zadana przejścia HEAT→VENT w trybie SMART. Domyślnie 210 = 21.0°C. Warunek: ≥ EWMSmartT124h + 1K.",
        "description_en": "Setpoint for HEAT→VENT transition in SMART mode. Default: 210 = 21.0°C. Constraint: ≥ EWMSmartT124h + 1K."
      },
      {
        "offset": 30,
        "name": "HeatT3_PI_KP",
        "description": "Wzmocnienie KP regulatora PI temperatury nawiewu T3. Domyślnie 3.",
        "description_en": "Proportional gain KP of the T3 supply temperature PI controller. Default: 3."
      },
      {
        "offset": 31,
        "name": "HeatT3_PI_TI",
        "unit": "s",
        "description": "Czas podwajania TI regulatora PI temperatury nawiewu T3. Domyślnie 180s.",
        "description_en": "Integral time TI of the T3 supply temperature PI controller. Default: 180s."
      },
      {
        "offset": 32,
        "name": "HeatT5_PI_KP",
        "description": "Wzmocnienie KP regulatora PI temperatury wody powrotnej T5. Domyślnie 3.",
        "description_en": "Proportional gain KP of the T5 return water temperature PI controller. Default: 3."
      },
      {
        "offset": 33,
        "name": "HeatT5_PI_TI",
        "unit": "s",
        "description": "Czas TI regulatora PI temperatury wody powrotnej T5. Domyślnie 180s.",
        "description_en": "Integral time TI of the T5 return water temperature PI controller. Default: 180s."
      }
    ],
    "holding_registers_group": [],
    "description_en": "ELIS AX air curtain (multi-speed EC fans)"
  },
  "LEO AC (DRV V)": {
    "name": "LEO AC (DRV V)",
    "description": "Nagrzewnica wodna z wentylatorem EC",
    "group_priority": 5,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura przy suficie (czujnik T3).",
        "description_en": "Ceiling temperature (T3 sensor)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4).",
        "description_en": "Room temperature (T4 sensor)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Prędkość wentylatora (AC 3-biegowy).",
        "description_en": "Fan speed (3-speed AC fan)."
      },
      {
        "offset": 7,
        "name": "AntifreezeeState",
        "description": "Stan ochrony przeciwzamrożeniowej magazynu — 8 bitów.",
        "description_en": "Warehouse antifreeze protection state — 8 bits."
      },
      {
        "offset": 8,
        "name": "DestStatus",
        "description": "Stan destratyfikacji: aktywna gdy (DestTempRef > Td–Tm) oraz (Tz > Tm).",
        "description_en": "Destratification state: active when (DestTempRef > Td–Tm) and (Tz > Tm)."
      },
      {
        "offset": 9,
        "name": "FilterPressureState",
        "description": "Stan presostatu filtra.",
        "description_en": "Filter pressure switch state."
      },
      {
        "offset": 10,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów (bity). Przykład: 0x100 = OK, 0x200 = przepalony.",
        "description_en": "Fan fuse state (bits). Example: 0x100 = OK, 0x200 = blown."
      },
      {
        "offset": 11,
        "name": "ValveState",
        "description": "Stan zaworu wodnego.",
        "description_en": "Water valve state."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF — domyślny po resecie",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — grzanie automatyczne",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_DEF — default after reset",
          "1": "WM_OFF — device off",
          "2": "WM_HT_AUTO — automatic heating",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        },
        "values_en": {
          "1": "WM_ON — enabled",
          "2": "WM_OFF — disabled"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 10,
        "name": "TleadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus",
          "3": "TSL_T4 — czujnik T4 (powietrze przed wymiennikiem)"
        },
        "values_en": {
          "0": "TSL_TNS — read-only",
          "1": "TSL_TLEAD — value via Modbus",
          "3": "TSL_T4 — T4 sensor (air before heat exchanger)"
        }
      },
      {
        "offset": 11,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF — wymuś wyłączenie",
          "2": "DEST_MDF_ON — wymuś włączenie"
        },
        "values_en": {
          "1": "DEST_MDF_OFF — force off",
          "2": "DEST_MDF_ON — force on"
        }
      },
      {
        "offset": 12,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF — wyłączony",
          "2": "DEST_MD_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO niezależny"
        },
        "values_en": {
          "1": "DEST_MD_OFF — disabled",
          "2": "DEST_MD_AUTO_DEPEND — AUTO dependent on operating mode",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO independent"
        }
      },
      {
        "offset": 13,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K×0.1"
      },
      {
        "offset": 14,
        "name": "DestStratTimeDelay"
      },
      {
        "offset": 15,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRefMax",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF — domyślny po resecie",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — grzanie automatyczne",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_DEF — default after reset",
          "1": "WM_OFF — device off",
          "2": "WM_HT_AUTO — automatic heating",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 6,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF — wymuś wyłączenie",
          "2": "DEST_MDF_ON — wymuś włączenie"
        },
        "values_en": {
          "1": "DEST_MDF_OFF — force off",
          "2": "DEST_MDF_ON — force on"
        }
      },
      {
        "offset": 7,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K×0.1"
      },
      {
        "offset": 8,
        "name": "DestStratTimeDelay"
      },
      {
        "offset": 9,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 10,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      }
    ],
    "description_en": "Water heater with EC fan"
  },
  "LEO EC (DRV M)": {
    "name": "LEO EC (DRV M)",
    "description": "Nagrzewnica wodna z wentylatorem EC (płynna regulacja)",
    "group_priority": 6,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3).",
        "description_en": "Supply air temperature after water heat exchanger (T3 sensor)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4).",
        "description_en": "Room temperature (T4 sensor)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Wydajność wentylatora EC — prędkość obrotowa [rpm].",
        "description_en": "EC fan efficiency — rotational speed [rpm]."
      },
      {
        "offset": 7,
        "name": "AntifreezeeState",
        "description": "Stan ochrony przeciwzamrożeniowej — 8 bitów.",
        "description_en": "Antifreeze protection state — 8 bits."
      },
      {
        "offset": 8,
        "name": "DestStatus",
        "description": "Stan destratyfikacji: aktywna gdy (DestTempRef > Td–Tm) oraz (Tz > Tm).",
        "description_en": "Destratification state: active when (DestTempRef > Td–Tm) and (Tz > Tm)."
      },
      {
        "offset": 9,
        "name": "FanEcConnect",
        "description": "Status połączenia wentylatora EC z urządzeniem DRV M.",
        "description_en": "EC fan connection status with DRV M device."
      },
      {
        "offset": 10,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów EC/3V/dachowych (bity). Przykład: 0x100 = wentylator 3V OK.",
        "description_en": "Fan fuse state (EC/3V/roof fans, bits). Example: 0x100 = 3V fan OK."
      },
      {
        "offset": 11,
        "name": "ValveState",
        "description": "Stan zaworu wodnego.",
        "description_en": "Water valve state."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF — domyślny po resecie",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — grzanie automatyczne",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_DEF — default after reset",
          "1": "WM_OFF — device off",
          "2": "WM_HT_AUTO — automatic heating",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        },
        "values_en": {
          "1": "WM_ON — enabled",
          "2": "WM_OFF — disabled"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 10,
        "name": "TleadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus",
          "3": "TSL_T4 — czujnik T4 (powietrze przed wymiennikiem)"
        },
        "values_en": {
          "0": "TSL_TNS — read-only",
          "1": "TSL_TLEAD — value via Modbus",
          "3": "TSL_T4 — T4 sensor (air before heat exchanger)"
        }
      },
      {
        "offset": 11,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF — wymuś wyłączenie",
          "2": "DEST_MDF_ON — wymuś włączenie"
        },
        "values_en": {
          "1": "DEST_MDF_OFF — force off",
          "2": "DEST_MDF_ON — force on"
        }
      },
      {
        "offset": 12,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF — wyłączony",
          "2": "DEST_MD_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO niezależny"
        },
        "values_en": {
          "1": "DEST_MD_OFF — disabled",
          "2": "DEST_MD_AUTO_DEPEND — AUTO dependent on operating mode",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO independent"
        }
      },
      {
        "offset": 13,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K×0.1"
      },
      {
        "offset": 14,
        "name": "DestStratTimeDelay"
      },
      {
        "offset": 15,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRefMax",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF — domyślny po resecie",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — grzanie automatyczne",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_DEF — default after reset",
          "1": "WM_OFF — device off",
          "2": "WM_HT_AUTO — automatic heating",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 6,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF — wymuś wyłączenie",
          "2": "DEST_MDF_ON — wymuś włączenie"
        },
        "values_en": {
          "1": "DEST_MDF_OFF — force off",
          "2": "DEST_MDF_ON — force on"
        }
      },
      {
        "offset": 7,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K×0.1"
      },
      {
        "offset": 8,
        "name": "DestStratTimeDelay"
      },
      {
        "offset": 9,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 10,
        "name": "ModeAuto_FanEffRefMax",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 11,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      }
    ],
    "description_en": "Water heater with EC fan (continuous regulation)"
  },
  "LEO D (DRV D)": {
    "name": "LEO D (DRV D)",
    "description": "Destratyfikator (DRV D / LEO D)",
    "group_priority": 7,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura przy suficie (czujnik T3).",
        "description_en": "Ceiling temperature (T3 sensor)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4).",
        "description_en": "Room temperature (T4 sensor)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Prędkość wentylatora (AC 3-biegowy).",
        "description_en": "Fan speed (3-speed AC fan)."
      },
      {
        "offset": 7,
        "name": "DestStatus",
        "description": "Stan destratyfikacji: aktywna gdy (DestTempRef > Td–Tm) oraz (Tz > Tm). Td=T3, Tm=TLeadVal lub T4.",
        "description_en": "Destratification state: active when (DestTempRef > Td–Tm) and (Tz > Tm). Td=T3, Tm=TLeadVal or T4."
      },
      {
        "offset": 8,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora 3V (bity 8–11). Przykład: 0x100 = OK, 0x200 = przepalony.",
        "description_en": "Fan fuse state (bits 8–11). Example: 0x100 = OK, 0x200 = blown."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF — odszranianie wyłączone",
          "2": "WM_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "WM_AUTO_INDEPEND — AUTO niezależny",
          "4": "WM_MANUAL — tryb ręczny"
        },
        "values_en": {
          "1": "WM_OFF — defrost disabled",
          "2": "WM_AUTO_DEPEND — AUTO dependent on operating mode",
          "3": "WM_AUTO_INDEPEND — AUTO independent",
          "4": "WM_MANUAL — manual mode"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 8,
        "name": "TLeadSensorSelect",
        "values": {
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
        },
        "values_en": {
          "1": "TSL_TLEAD — value via Modbus (TLeadVal)",
          "3": "TSL_T4 — T4 sensor (DRV connector)"
        }
      },
      {
        "offset": 10,
        "name": "DestTempRef",
        "min": 0,
        "max": 100,
        "unit": "K×0.1",
        "description": "Próg odszraniania: warunek DestTempRef > Td − Tm (Td=T3 sufit, Tm=czujnik prowadzący)",
        "description_en": "Destratification threshold: condition DestTempRef > Td − Tm (Td=T3 ceiling, Tm=lead sensor)"
      },
      {
        "offset": 11,
        "name": "WorkModeTempRef",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1",
        "description": "Docelowa temperatura przy suficie w trybie ręcznym; warunek: WorkModeTempRef > czujnik prowadzący",
        "description_en": "Target ceiling temperature in manual mode; condition: WorkModeTempRef > lead sensor"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF — odszranianie wyłączone",
          "2": "WM_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "WM_AUTO_INDEPEND — AUTO niezależny",
          "4": "WM_MANUAL — tryb ręczny"
        },
        "values_en": {
          "1": "WM_OFF — defrost disabled",
          "2": "WM_AUTO_DEPEND — AUTO dependent on operating mode",
          "3": "WM_AUTO_INDEPEND — AUTO independent",
          "4": "WM_MANUAL — manual mode"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "DestTempRef",
        "min": 0,
        "max": 100,
        "unit": "K×0.1",
        "description": "Próg odszraniania: warunek DestTempRef > Td − Tm (Td=T3 sufit, Tm=czujnik prowadzący)",
        "description_en": "Destratification threshold: condition DestTempRef > Td − Tm (Td=T3 ceiling, Tm=lead sensor)"
      },
      {
        "offset": 7,
        "name": "WorkModeTempRef",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1",
        "description": "Docelowa temperatura przy suficie w trybie ręcznym; warunek: WorkModeTempRef > czujnik prowadzący",
        "description_en": "Target ceiling temperature in manual mode; condition: WorkModeTempRef > lead sensor"
      }
    ],
    "description_en": "Destratification fan (DRV D / LEO D)"
  },
  "LEO EL (DRV EL)": {
    "name": "LEO EL (DRV EL)",
    "description": "Nagrzewnica elektryczna",
    "group_priority": 9,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura przy suficie (czujnik T3).",
        "description_en": "Ceiling temperature (T3 sensor)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4).",
        "description_en": "Room temperature (T4 sensor)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Prędkość wentylatora (AC 3-biegowy).",
        "description_en": "Fan speed (3-speed AC fan)."
      },
      {
        "offset": 7,
        "name": "AntifreezeeState",
        "description": "Stan ochrony przeciwzamrożeniowej.",
        "description_en": "Antifreeze protection state."
      },
      {
        "offset": 8,
        "name": "DestStatus",
        "description": "Stan destratyfikacji.",
        "description_en": "Destratification state."
      },
      {
        "offset": 9,
        "name": "ThermalContactState",
        "description": "Stan styku termicznego. Gdy = 1: FanEffRef → 100, ElectricHeaterPTCPower → 0 (ochrona przed przegrzaniem).",
        "description_en": "Thermal contact state. When = 1: FanEffRef → 100, ElectricHeaterPTCPower → 0 (overheating protection)."
      },
      {
        "offset": 10,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów EC/3V/dachowych (bity). Przykład: 0x100 = wentylator 3V OK.",
        "description_en": "Fan fuse state (EC/3V/roof fans, bits). Example: 0x100 = 3V fan OK."
      },
      {
        "offset": 11,
        "name": "PTCHeaterPowerState",
        "description": "Moc nagrzewnicy elektrycznej PTC. LEO EL L (SW3.5=K1) lub LEO EL S (SW3.5=K2).",
        "description_en": "PTC electric heater power. LEO EL L (SW3.5=K1) or LEO EL S (SW3.5=K2)."
      },
      {
        "offset": 12,
        "name": "ElectricHeaterType",
        "description": "Typ elektrycznej nagrzewnicy.",
        "description_en": "Electric heater type."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_TS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_AUTO — tryb automatyczny",
          "3": "WM_HEAT — tryb grzania",
          "4": "WM_VENT — wentylacja",
          "5": "WM_RAW — tryb surowy"
        },
        "values_en": {
          "0": "WM_TS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_AUTO — automatic mode",
          "3": "WM_HEAT — heating mode",
          "4": "WM_VENT — ventilation",
          "5": "WM_RAW — raw mode"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        },
        "values_en": {
          "1": "WM_ON — enabled",
          "2": "WM_OFF — disabled"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 10,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
        },
        "values_en": {
          "0": "TSL_TNS — read-only",
          "1": "TSL_TLEAD — value via Modbus (TLeadVal)",
          "3": "TSL_T4 — T4 sensor (DRV connector)"
        }
      },
      {
        "offset": 11,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF — wymuszanie destratyfikacji wyłączone",
          "2": "DEST_MDF_ON — wymuszanie destratyfikacji włączone"
        },
        "values_en": {
          "1": "DEST_MDF_OFF — destratification forcing disabled",
          "2": "DEST_MDF_ON — destratification forcing enabled"
        }
      },
      {
        "offset": 12,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF — destratyfikacja wyłączona",
          "2": "DEST_MD_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO niezależny"
        },
        "values_en": {
          "1": "DEST_MD_OFF — destratification disabled",
          "2": "DEST_MD_AUTO_DEPEND — AUTO dependent on operating mode",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO independent"
        }
      },
      {
        "offset": 13,
        "name": "DestTempRef",
        "min": 0,
        "max": 100,
        "unit": "K×0.1",
        "description": "Próg destratyfikacji: warunek DestTempRef > Td − Tm (Td=T3 sufit, Tm=czujnik prowadzący)",
        "description_en": "Destratification threshold: condition DestTempRef > Td − Tm (Td=T3 ceiling, Tm=lead sensor)"
      },
      {
        "offset": 15,
        "name": "ElectricHeaterPTCPower",
        "values": {
          "1": "Off — grzanie wyłączone",
          "2": "1 — 1 stopień grzania",
          "3": "2 — 2 stopnie grzania",
          "4": "3 — 3 stopnie grzania (tylko SW3.5=K1)"
        },
        "description": "SW3.5=K1 (3 stopnie): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 stopnie): 1=Off, 2=1heat, 3=2heat, 4=2heat",
        "values_en": {
          "1": "Off — heating disabled",
          "2": "1 — heating stage 1",
          "3": "2 — heating stage 2",
          "4": "3 — heating stage 3 (only SW3.5=K1)"
        },
        "description_en": "SW3.5=K1 (3 stages): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 stages): 1=Off, 2=1heat, 3=2heat, 4=2heat"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Prędkość wentylatora w trybie AUTO. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3",
        "description_en": "Fan speed in AUTO mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Prędkość wentylatora w trybie ręcznym. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3",
        "description_en": "Fan speed in manual mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_TS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_AUTO — tryb automatyczny",
          "3": "WM_HEAT — tryb grzania",
          "4": "WM_VENT — wentylacja",
          "5": "WM_RAW — tryb surowy"
        },
        "values_en": {
          "0": "WM_TS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_AUTO — automatic mode",
          "3": "WM_HEAT — heating mode",
          "4": "WM_VENT — ventilation",
          "5": "WM_RAW — raw mode"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF — destratyfikacja wyłączona",
          "2": "DEST_MD_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO niezależny"
        },
        "values_en": {
          "1": "DEST_MD_OFF — destratification disabled",
          "2": "DEST_MD_AUTO_DEPEND — AUTO dependent on operating mode",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO independent"
        }
      },
      {
        "offset": 8,
        "name": "ElectricHeaterPTCPower",
        "values": {
          "1": "Off — grzanie wyłączone",
          "2": "1 — 1 stopień grzania",
          "3": "2 — 2 stopnie grzania",
          "4": "3 — 3 stopnie grzania (tylko SW3.5=K1)"
        },
        "description": "SW3.5=K1 (3 stopnie): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 stopnie): 1=Off, 2=1heat, 3=2heat, 4=2heat",
        "values_en": {
          "1": "Off — heating disabled",
          "2": "1 — heating stage 1",
          "3": "2 — heating stage 2",
          "4": "3 — heating stage 3 (only SW3.5=K1)"
        },
        "description_en": "SW3.5=K1 (3 stages): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 stages): 1=Off, 2=1heat, 3=2heat, 4=2heat"
      }
    ],
    "description_en": "Electric heater"
  },
  "ROBUR R NEXT (DRV R NEXT)": {
    "name": "ROBUR R NEXT (DRV R NEXT)",
    "description": "Nagrzewnica gazowa ROBUR NEXT",
    "group_priority": 10,
    "input_registers": [
      {
        "offset": 5,
        "name": "T3",
        "description": "Temperatura przy suficie (czujnik T3).",
        "description_en": "Ceiling temperature (T3 sensor)."
      },
      {
        "offset": 6,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4).",
        "description_en": "Room temperature (T4 sensor)."
      },
      {
        "offset": 8,
        "name": "ExternalGasDetectTH1",
        "description": "Sygnał zewnętrznego czujnika gazu — próg pierwszy.",
        "description_en": "External gas sensor signal — first threshold."
      },
      {
        "offset": 9,
        "name": "ExternalGasDetectTH2",
        "description": "Sygnał zewnętrznego czujnika gazu — próg drugi.",
        "description_en": "External gas sensor signal — second threshold."
      },
      {
        "offset": 10,
        "name": "ExternalGasDetectVal",
        "description": "Stężenie gazu — wejście 0–10V DC (wymagana kalibracja czujnika).",
        "description_en": "Gas concentration — 0–10V DC input (sensor calibration required)."
      },
      {
        "offset": 15,
        "name": "AntifreezeStateWarehouse",
        "description": "Stan ochrony przeciwzamrożeniowej magazynu.",
        "description_en": "Warehouse antifreeze protection state."
      },
      {
        "offset": 16,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora.",
        "description_en": "Fan fuse state."
      },
      {
        "offset": 17,
        "name": "GasAlarmState",
        "description": "Alarm Robur — gaz/płomień. Odczyt z zacisku nr 6 (terminal wewnątrz nagrzewnicy).",
        "description_en": "Robur alarm — gas/flame. Read from terminal 6 (inside heater)."
      },
      {
        "offset": 18,
        "name": "STBAlarmState",
        "description": "Alarm temperatury wyciągu powietrza (STB).",
        "description_en": "Exhaust air temperature alarm (STB)."
      },
      {
        "offset": 19,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min].",
        "description_en": "Filter operating time. Actual value = 5 × register value [min]."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT_AUTO — automatyczne grzanie",
          "3": "WM_HEAT_MANUAL — ręczne grzanie",
          "4": "WM_VENTILATION — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HEAT_AUTO — automatic heating",
          "3": "WM_HEAT_MANUAL — manual heating",
          "4": "WM_VENTILATION — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "ON — włączony",
          "2": "OFF — wyłączony"
        },
        "values_en": {
          "1": "ON — enabled",
          "2": "OFF — disabled"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 12,
        "name": "GasAlarmReset",
        "values": {
          "0": "RO — tylko odczyt",
          "1": "ON — wysyłanie sygnału resetującego (ciągłe)",
          "2": "OFF — zatrzymanie sygnału resetującego"
        },
        "description": "Reset alarmu gazowego/płomieniowego. Czas resetu nie powinien przekraczać 5 s (następnie ustawić wartość na 0x02)",
        "values_en": {
          "0": "RO — read-only",
          "1": "ON — sending reset signal (continuous)",
          "2": "OFF — stop reset signal"
        },
        "description_en": "Gas/flame alarm reset. Reset time must not exceed 5 s (then set value to 0x02)"
      },
      {
        "offset": 14,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 15,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 16,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (temperatura pomieszczenia)"
        },
        "values_en": {
          "0": "TSL_TNS — read-only",
          "1": "TSL_TLEAD — value via Modbus (TLeadVal)",
          "3": "TSL_T4 — T4 sensor (room temperature)"
        }
      },
      {
        "offset": 18,
        "name": "STBTemperatureAlarmOn",
        "min": 810,
        "max": 1200,
        "unit": "°C×0.1",
        "description": "Temperatura progowa alarmu STB (Input Register 0x12). Alarm aktywny gdy wartość ustawiona > T3 (IR 0x05). Domyślna wartość 900 zapewnia wystąpienie błędu przed rzeczywistym alarmem STB Robur (który wymaga ręcznego resetu ze skrzynki sterowniczej)",
        "description_en": "STB alarm activation temperature threshold (Input Register 0x12). Alarm active when set value > T3 (IR 0x05). Default value 900 ensures fault before actual Robur STB alarm (which requires manual reset from control box)"
      },
      {
        "offset": 19,
        "name": "FilterTimeCntRst",
        "values": {
          "0": "FLT_CNT_RST_NS — tylko odczyt (po resecie)",
          "1": "FLT_CNT_RST — reset licznika czasu filtra (FilterWorkTime = 0)"
        },
        "values_en": {
          "0": "FLT_CNT_RST_NS — read-only (after reset)",
          "1": "FLT_CNT_RST — reset filter time counter (FilterWorkTime = 0)"
        }
      },
      {
        "offset": 20,
        "name": "STBTemperatureAlarmOff",
        "min": 610,
        "max": 800,
        "unit": "°C×0.1",
        "description": "Temperatura resetowania alarmu STB. Reset możliwy gdy wartość ustawiona > T3 (IR 0x05). Dodatkowy warunek: STB_T_OFF < STB_T_REF",
        "description_en": "STB alarm reset temperature. Reset possible when set value > T3 (IR 0x05). Additional condition: STB_T_OFF < STB_T_REF"
      },
      {
        "offset": 21,
        "name": "STBAlarmReset",
        "values": {
          "1": "ON — reset alarmu aktywny",
          "2": "OFF — reset alarmu nieaktywny"
        },
        "description": "Jeśli STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), rejestr zostanie automatycznie ustawiony na 0x02 (OFF)",
        "values_en": {
          "1": "ON — alarm reset active",
          "2": "OFF — alarm reset inactive"
        },
        "description_en": "If STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), register will be automatically set to 0x02 (OFF)"
      },
      {
        "offset": 22,
        "name": "ContModeFanSpeedRef",
        "values": {
          "0": "Fan OFF — wentylator wyłączony",
          "100": "Fan ON — wentylator włączony"
        },
        "description": "Ustawienie wydajności wentylatora po osiągnięciu temperatury docelowej",
        "values_en": {
          "0": "Fan OFF — fan off",
          "100": "Fan ON — fan on"
        },
        "description_en": "Fan capacity setpoint after reaching target temperature"
      },
      {
        "offset": 23,
        "name": "GasBurnerLvlRef",
        "values": {
          "0": "RO — tylko odczyt",
          "1": "FIRST_STEP — pierwszy stopień spalania",
          "2": "SECOND_STEP — drugi stopień spalania"
        },
        "description": "Ustawienie stopnia spalania gazu (aktywne tylko w trybie ręcznego grzania WM_HEAT_MANUAL)",
        "values_en": {
          "0": "RO — read-only",
          "1": "FIRST_STEP — first combustion stage",
          "2": "SECOND_STEP — second combustion stage"
        },
        "description_en": "Gas combustion stage setting (active only in WM_HEAT_MANUAL mode)"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT_AUTO — automatyczne grzanie",
          "3": "WM_HEAT_MANUAL — ręczne grzanie",
          "4": "WM_VENTILATION — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HEAT_AUTO — automatic heating",
          "3": "WM_HEAT_MANUAL — manual heating",
          "4": "WM_VENTILATION — ventilation"
        }
      },
      {
        "offset": 12,
        "name": "STBTemperatureAlarmOn",
        "min": 810,
        "max": 1200,
        "unit": "°C×0.1",
        "description": "Temperatura progowa aktywacji alarmu STB.",
        "description_en": "STB alarm activation temperature threshold (Input Register 0x12). Alarm active when set value > T3 (IR 0x05). Default value 900 ensures fault before actual Robur STB alarm (which requires manual reset from control box)"
      },
      {
        "offset": 13,
        "name": "STBTemperatureAlarmOff",
        "min": 610,
        "max": 800,
        "unit": "°C×0.1",
        "description": "Temperatura resetowania alarmu STB.",
        "description_en": "STB alarm reset temperature. Reset possible when set value > T3 (IR 0x05). Additional condition: STB_T_OFF < STB_T_REF"
      },
      {
        "offset": 14,
        "name": "ContModeFanSpeedRef",
        "values": {
          "0": "Fan OFF — wentylator wyłączony",
          "100": "Fan ON — wentylator włączony"
        },
        "description": "Wydajność wentylatora po osiągnięciu temperatury docelowej.",
        "values_en": {
          "0": "Fan OFF — fan off",
          "100": "Fan ON — fan on"
        },
        "description_en": "Fan capacity setpoint after reaching target temperature"
      },
      {
        "offset": 15,
        "name": "GasBurnerLvlRef",
        "values": {
          "0": "RO — tylko odczyt",
          "1": "FIRST_STEP — pierwszy stopień spalania",
          "2": "SECOND_STEP — drugi stopień spalania"
        },
        "description": "Stopień spalania gazu (aktywne w trybie WM_HEAT_MANUAL).",
        "values_en": {
          "0": "RO — read-only",
          "1": "FIRST_STEP — first combustion stage",
          "2": "SECOND_STEP — second combustion stage"
        },
        "description_en": "Gas combustion stage setting (active only in WM_HEAT_MANUAL mode)"
      }
    ],
    "description_en": "ROBUR NEXT gas heater"
  },
  "ROBUR R KM NEXT (DRV R KM NEXT)": {
    "name": "ROBUR R KM NEXT (DRV R KM NEXT)",
    "description": "Nagrzewnica gazowa ROBUR NEXT z klapą mieszającą",
    "group_priority": 11,
    "input_registers": [
      {
        "offset": 4,
        "name": "T1",
        "description": "Temperatura powietrza świeżego (czujnik T1).",
        "description_en": "Fresh air temperature (T1 sensor)."
      },
      {
        "offset": 5,
        "name": "T3",
        "description": "Temperatura wyciągu powietrza (czujnik T3).",
        "description_en": "Exhaust air temperature (T3 sensor)."
      },
      {
        "offset": 6,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4).",
        "description_en": "Room temperature (T4 sensor)."
      },
      {
        "offset": 8,
        "name": "ExternalGasDetectTH1",
        "description": "Sygnał zewnętrznego czujnika gazu — próg pierwszy.",
        "description_en": "External gas sensor signal — first threshold."
      },
      {
        "offset": 9,
        "name": "ExternalGasDetectTH2",
        "description": "Sygnał zewnętrznego czujnika gazu — próg drugi.",
        "description_en": "External gas sensor signal — second threshold."
      },
      {
        "offset": 10,
        "name": "ExternalGasDetectVal",
        "description": "Stężenie gazu — wejście 0–10V DC.",
        "description_en": "Gas concentration — 0–10V DC input."
      },
      {
        "offset": 11,
        "name": "FanRoofTK",
        "description": "Sygnał TK z wentylatora dachowego.",
        "description_en": "TK signal from roof fan."
      },
      {
        "offset": 12,
        "name": "FanRoofEff",
        "description": "Wydajność wentylatora dachowego.",
        "description_en": "Roof fan capacity."
      },
      {
        "offset": 13,
        "name": "DamperLevel",
        "description": "Aktualna pozycja klapy mieszania.",
        "description_en": "Current mixing damper position."
      },
      {
        "offset": 14,
        "name": "DamperForceState",
        "description": "Stan wymuszenia pozycji klapy (tryb DamperForceMode = ON).",
        "description_en": "Damper forcing state (DamperForceMode = ON)."
      },
      {
        "offset": 15,
        "name": "AntifreezeStateWarehouse",
        "description": "Stan ochrony przeciwzamrożeniowej magazynu.",
        "description_en": "Warehouse antifreeze protection state."
      },
      {
        "offset": 16,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora.",
        "description_en": "Fan fuse state."
      },
      {
        "offset": 17,
        "name": "GasAlarmState",
        "description": "Alarm Robur — gaz/płomień.",
        "description_en": "Robur alarm — gas/flame."
      },
      {
        "offset": 18,
        "name": "STBAlarmState",
        "description": "Alarm STB — temperatura wyciągu powietrza.",
        "description_en": "STB alarm — exhaust air temperature."
      },
      {
        "offset": 19,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min].",
        "description_en": "Filter operating time. Actual value = 5 × register value [min]."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT_AUTO — automatyczne grzanie",
          "3": "WM_HEAT_MANUAL — ręczne grzanie",
          "4": "WM_VENTILATION — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HEAT_AUTO — automatic heating",
          "3": "WM_HEAT_MANUAL — manual heating",
          "4": "WM_VENTILATION — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "ON — włączony",
          "2": "OFF — wyłączony"
        },
        "values_en": {
          "1": "ON — enabled",
          "2": "OFF — disabled"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS — tylko odczyt",
          "1": "DAMPER_FMD_OFF — wymuszanie wyłączone",
          "2": "DAMPER_FMD_ON — wymuszanie włączone (jeśli T1 < DamperForceTempRef)"
        },
        "values_en": {
          "0": "DAMPER_FMD_NS — read-only",
          "1": "DAMPER_FMD_OFF — forcing disabled",
          "2": "DAMPER_FMD_ON — forcing enabled (if T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 8,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "°C×0.1",
        "description": "Temperatura wymuszonego otwarcia klapy. Połączona z T1 (temperatura świeżego powietrza — IR 0x04)",
        "description_en": "Forced damper opening temperature. Connected to T1 (fresh air temperature — IR 0x04)"
      },
      {
        "offset": 9,
        "name": "DamperForceLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Docelowe otwarcie klapy przy wymuszeniu (DamperForceMode == DAMPER_FMD_ON, warunek: Temp < DamperForceTempRef)",
        "description_en": "Target damper opening when forced (DamperForceMode == DAMPER_FMD_ON, condition: Temp < DamperForceTempRef)"
      },
      {
        "offset": 10,
        "name": "DamperLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pozycja klapy mieszającej",
        "description_en": "Mixing damper position"
      },
      {
        "offset": 11,
        "name": "DamperContLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pozycja klapy gdy WorkMode == WM_WINTER_CONT",
        "description_en": "Damper position when WorkMode == WM_WINTER_CONT"
      },
      {
        "offset": 12,
        "name": "GasAlarmReset",
        "values": {
          "0": "RO — tylko odczyt",
          "1": "ON — wysyłanie sygnału resetującego (ciągłe)",
          "2": "OFF — zatrzymanie sygnału resetującego"
        },
        "description": "Reset alarmu gazowego/płomieniowego. Czas resetu nie powinien przekraczać 5 s (następnie ustawić wartość na 0x02)",
        "values_en": {
          "0": "RO — read-only",
          "1": "ON — sending reset signal (continuous)",
          "2": "OFF — stop reset signal"
        },
        "description_en": "Gas/flame alarm reset. Reset time must not exceed 5 s (then set value to 0x02)"
      },
      {
        "offset": 13,
        "name": "FanRoofForceEffRef",
        "min": -100,
        "max": 100,
        "unit": "%",
        "description": "Wymuszenie prędkości wentylatora dachowego — wartość dodawana do aktualnej prędkości",
        "description_en": "Roof fan speed override — value added to current speed"
      },
      {
        "offset": 14,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 15,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 16,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (temperatura pomieszczenia)"
        },
        "values_en": {
          "0": "TSL_TNS — read-only",
          "1": "TSL_TLEAD — value via Modbus (TLeadVal)",
          "3": "TSL_T4 — T4 sensor (room temperature)"
        }
      },
      {
        "offset": 17,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS — tylko odczyt",
          "1": "FR_MD_01 — zależny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)",
          "2": "FR_MD_02 — zależny wyłącznie od pozycji klapy (DamperLevelRef)"
        },
        "values_en": {
          "0": "FR_MD_NS — read-only",
          "1": "FR_MD_01 — dependent on damper position (DamperLevelRef) and fan setpoint (FanEffRef)",
          "2": "FR_MD_02 — dependent on damper position only (DamperLevelRef)"
        }
      },
      {
        "offset": 18,
        "name": "STBTemperatureAlarmOn",
        "min": 810,
        "max": 1200,
        "unit": "°C×0.1",
        "description": "Temperatura progowa alarmu STB (IR 0x12). Alarm aktywny gdy wartość ustawiona > T3 (IR 0x05)",
        "description_en": "STB alarm activation temperature threshold (IR 0x12). Alarm active when set value > T3 (IR 0x05)"
      },
      {
        "offset": 19,
        "name": "FilterTimeCntRst",
        "values": {
          "0": "FLT_CNT_RST_NS — tylko odczyt (po resecie)",
          "1": "FLT_CNT_RST — reset licznika czasu filtra (FilterWorkTime = 0)"
        },
        "values_en": {
          "0": "FLT_CNT_RST_NS — read-only (after reset)",
          "1": "FLT_CNT_RST — reset filter time counter (FilterWorkTime = 0)"
        }
      },
      {
        "offset": 20,
        "name": "STBTemperatureAlarmOff",
        "min": 610,
        "max": 800,
        "unit": "°C×0.1",
        "description": "Temperatura resetowania alarmu STB. Reset możliwy gdy wartość ustawiona > T3. Dodatkowy warunek: STB_T_OFF < STB_T_REF",
        "description_en": "STB alarm reset temperature. Reset possible when set value > T3. Additional condition: STB_T_OFF < STB_T_REF"
      },
      {
        "offset": 21,
        "name": "STBAlarmReset",
        "values": {
          "1": "ON — reset alarmu aktywny",
          "2": "OFF — reset alarmu nieaktywny"
        },
        "description": "Jeśli STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), rejestr zostanie automatycznie ustawiony na 0x02 (OFF)",
        "values_en": {
          "1": "ON — alarm reset active",
          "2": "OFF — alarm reset inactive"
        },
        "description_en": "If STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), register will be automatically set to 0x02 (OFF)"
      },
      {
        "offset": 22,
        "name": "ContModeFanSpeedRef",
        "values": {
          "0": "Fan OFF — wentylator wyłączony",
          "100": "Fan ON — wentylator włączony"
        },
        "description": "Ustawienie wydajności wentylatora po osiągnięciu temperatury docelowej",
        "values_en": {
          "0": "Fan OFF — fan off",
          "100": "Fan ON — fan on"
        },
        "description_en": "Fan capacity setpoint after reaching target temperature"
      },
      {
        "offset": 23,
        "name": "GasBurnerLvlRef",
        "values": {
          "0": "RO — tylko odczyt",
          "1": "FIRST_STEP — pierwszy stopień spalania",
          "2": "SECOND_STEP — drugi stopień spalania"
        },
        "description": "Ustawienie stopnia spalania gazu (aktywne tylko w trybie ręcznego grzania WM_HEAT_MANUAL)",
        "values_en": {
          "0": "RO — read-only",
          "1": "FIRST_STEP — first combustion stage",
          "2": "SECOND_STEP — second combustion stage"
        },
        "description_en": "Gas combustion stage setting (active only in WM_HEAT_MANUAL mode)"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT_AUTO — automatyczne grzanie",
          "3": "WM_HEAT_MANUAL — ręczne grzanie",
          "4": "WM_VENTILATION — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HEAT_AUTO — automatic heating",
          "3": "WM_HEAT_MANUAL — manual heating",
          "4": "WM_VENTILATION — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS — tylko odczyt",
          "1": "DAMPER_FMD_OFF — wymuszanie wyłączone",
          "2": "DAMPER_FMD_ON — wymuszanie włączone (jeśli T1 < DamperForceTempRef)"
        },
        "values_en": {
          "0": "DAMPER_FMD_NS — read-only",
          "1": "DAMPER_FMD_OFF — forcing disabled",
          "2": "DAMPER_FMD_ON — forcing enabled (if T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 6,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "°C×0.1",
        "description": "Temperatura wymuszonego otwarcia klapy.",
        "description_en": "Forced damper opening temperature. Connected to T1 (fresh air temperature — IR 0x04)"
      },
      {
        "offset": 7,
        "name": "DamperForceLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Docelowe otwarcie klapy przy wymuszeniu.",
        "description_en": "Target damper opening when forced (DamperForceMode == DAMPER_FMD_ON, condition: Temp < DamperForceTempRef)"
      },
      {
        "offset": 8,
        "name": "DamperLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pozycja klapy mieszającej.",
        "description_en": "Mixing damper position"
      },
      {
        "offset": 9,
        "name": "DamperContLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pozycja klapy gdy WorkMode = WM_WINTER_CONT.",
        "description_en": "Damper position when WorkMode == WM_WINTER_CONT"
      },
      {
        "offset": 10,
        "name": "FanRoofForceEffRef",
        "min": -100,
        "max": 100,
        "unit": "%",
        "description": "Wymuszenie prędkości wentylatora dachowego.",
        "description_en": "Roof fan speed override — value added to current speed"
      },
      {
        "offset": 11,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS — tylko odczyt",
          "1": "FR_MD_01 — zależny od pozycji klapy i nastawy wentylatora",
          "2": "FR_MD_02 — zależny wyłącznie od pozycji klapy"
        },
        "values_en": {
          "0": "FR_MD_NS — read-only",
          "1": "FR_MD_01 — dependent on damper position and fan setpoint",
          "2": "FR_MD_02 — dependent on damper position only"
        }
      },
      {
        "offset": 12,
        "name": "STBTemperatureAlarmOn",
        "min": 810,
        "max": 1200,
        "unit": "°C×0.1",
        "description": "Temperatura progowa aktywacji alarmu STB.",
        "description_en": "STB alarm activation temperature threshold (IR 0x12). Alarm active when set value > T3 (IR 0x05)"
      },
      {
        "offset": 13,
        "name": "STBTemperatureAlarmOff",
        "min": 610,
        "max": 800,
        "unit": "°C×0.1",
        "description": "Temperatura resetowania alarmu STB.",
        "description_en": "STB alarm reset temperature. Reset possible when set value > T3. Additional condition: STB_T_OFF < STB_T_REF"
      },
      {
        "offset": 14,
        "name": "ContModeFanSpeedRef",
        "values": {
          "0": "Fan OFF — wentylator wyłączony",
          "100": "Fan ON — wentylator włączony"
        },
        "description": "Wydajność wentylatora po osiągnięciu temperatury docelowej.",
        "values_en": {
          "0": "Fan OFF — fan off",
          "100": "Fan ON — fan on"
        },
        "description_en": "Fan capacity setpoint after reaching target temperature"
      },
      {
        "offset": 15,
        "name": "GasBurnerLvlRef",
        "values": {
          "0": "RO — tylko odczyt",
          "1": "FIRST_STEP — pierwszy stopień spalania",
          "2": "SECOND_STEP — drugi stopień spalania"
        },
        "description": "Stopień spalania gazu (aktywne w trybie WM_HEAT_MANUAL).",
        "values_en": {
          "0": "RO — read-only",
          "1": "FIRST_STEP — first combustion stage",
          "2": "SECOND_STEP — second combustion stage"
        },
        "description_en": "Gas combustion stage setting (active only in WM_HEAT_MANUAL mode)"
      },
      {
        "offset": 16,
        "name": "ExternalInputTH1DamperLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pozycja klapy dla wejścia EXT TH1. Krok: 5.",
        "description_en": "Damper position for EXT TH1 input. Step: 5."
      },
      {
        "offset": 17,
        "name": "FilterMaxWorkTime",
        "description": "Czas po którym aktywuje się alarm filtra. Krok: 100.",
        "description_en": "Time after which filter alarm activates. Step: 100."
      },
      {
        "offset": 18,
        "name": "ExternalInputTH2DamperLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pozycja klapy dla wejścia EXT TH2. Krok: 5.",
        "description_en": "Damper position for EXT TH2 input. Step: 5."
      }
    ],
    "description_en": "ROBUR NEXT gas heater with mixing damper"
  },
  "LEO COOL (DRV COOL)": {
    "name": "LEO COOL (DRV COOL)",
    "description": "Nagrzewnica/chłodnica wodna",
    "group_priority": 12,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura przy suficie (czujnik T3).",
        "description_en": "Ceiling temperature (T3 sensor)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4).",
        "description_en": "Room temperature (T4 sensor)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Prędkość wentylatora (AC 3-biegowy).",
        "description_en": "Fan speed (3-speed AC fan)."
      },
      {
        "offset": 7,
        "name": "AntifreezeState",
        "description": "Stan ochrony przeciwzamrożeniowej magazynu — 8 bitów.",
        "description_en": "Warehouse antifreeze protection state — 8 bits."
      },
      {
        "offset": 9,
        "name": "FilterPressureState",
        "description": "Stan presostatu filtra.",
        "description_en": "Filter pressure switch state."
      },
      {
        "offset": 10,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów (bity). Przykład: 0x100 = OK, 0x200 = przepalony.",
        "description_en": "Fan fuse state (bits). Example: 0x100 = OK, 0x200 = blown."
      },
      {
        "offset": 11,
        "name": "ValveState",
        "description": "Stan zaworu wodnego.",
        "description_en": "Water valve state."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_DEF — wartość domyślna po resecie zasilania",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — automatyczne grzanie",
          "3": "WM_HT_MANUAL — ręczne grzanie",
          "4": "WM_COOL_AUTO — automatyczne chłodzenie",
          "5": "WM_COOL_MANUAL — ręczne chłodzenie",
          "6": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_DEF — default after power reset",
          "1": "WM_OFF — device off",
          "2": "WM_HT_AUTO — automatic heating",
          "3": "WM_HT_MANUAL — manual heating",
          "4": "WM_COOL_AUTO — automatic cooling",
          "5": "WM_COOL_MANUAL — manual cooling",
          "6": "WM_VENT — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        },
        "values_en": {
          "1": "WM_ON — enabled",
          "2": "WM_OFF — disabled"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 10,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (powietrze przed wymiennikiem wodnym)"
        },
        "values_en": {
          "0": "TSL_TNS — read-only",
          "1": "TSL_TLEAD — value via Modbus (TLeadVal)",
          "3": "TSL_T4 — T4 sensor (air before water heat exchanger)"
        }
      },
      {
        "offset": 15,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Minimalna wydajność wentylatora w trybie AUTO. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3",
        "description_en": "Minimum fan capacity in AUTO mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRefMax",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Maksymalna wydajność wentylatora w trybie AUTO. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3",
        "description_en": "Maximum fan capacity in AUTO mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wydajność wentylatora po osiągnięciu temperatury docelowej w trybie MANUAL. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3",
        "description_en": "Fan capacity after reaching target temperature in MANUAL mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_DEF — wartość domyślna po resecie zasilania",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — automatyczne grzanie",
          "3": "WM_HT_MANUAL — ręczne grzanie",
          "4": "WM_COOL_AUTO — automatyczne chłodzenie",
          "5": "WM_COOL_MANUAL — ręczne chłodzenie",
          "6": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_DEF — default after power reset",
          "1": "WM_OFF — device off",
          "2": "WM_HT_AUTO — automatic heating",
          "3": "WM_HT_MANUAL — manual heating",
          "4": "WM_COOL_AUTO — automatic cooling",
          "5": "WM_COOL_MANUAL — manual cooling",
          "6": "WM_VENT — ventilation"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wydajność wentylatora. AC 3-biegowy.",
        "description_en": "3-speed AC fan: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 9,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Minimalna wydajność wentylatora w trybie AUTO.",
        "description_en": "Minimum fan capacity in AUTO mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3"
      },
      {
        "offset": 10,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wydajność wentylatora po osiągnięciu temperatury docelowej w trybie MANUAL.",
        "description_en": "Fan capacity after reaching target temperature in MANUAL mode. 3-speed AC fan: 0=off, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3"
      }
    ],
    "description_en": "Water heating/cooling unit"
  },
  "CUBE (DRV CUBE)": {
    "name": "CUBE (DRV CUBE)",
    "description": "Jednostka wentylacyjna CUBE z dyfuzorem wirowym i czujnikiem CO2",
    "group_priority": 13,
    "input_registers": [
      {
        "offset": 9,
        "name": "ambient_temp_value",
        "description": "Temperatura zewnętrzna.",
        "description_en": "Outdoor air temperature."
      },
      {
        "offset": 10,
        "name": "supply_temp_value",
        "description": "Temperatura powietrza nawiewanego.",
        "description_en": "Supply air temperature."
      },
      {
        "offset": 11,
        "name": "return_temp_value",
        "description": "Temperatura powietrza wyciąganego.",
        "description_en": "Return air temperature."
      },
      {
        "offset": 12,
        "name": "water_temp_value",
        "description": "Temperatura wymiennika wodnego.",
        "description_en": "Heat exchanger water temperature."
      },
      {
        "offset": 13,
        "name": "TempRoom_ADD",
        "description": "Temperatura z dodatkowego czujnika pokojowego.",
        "description_en": "Temperature from additional room sensor."
      },
      {
        "offset": 14,
        "name": "recirculation_damper_level",
        "description": "Aktualna pozycja klapy recyrkulacji.",
        "description_en": "Current recirculation damper position."
      },
      {
        "offset": 16,
        "name": "swirl_diffuser_position",
        "description": "Pozycja dyfuzora wirowego.",
        "description_en": "Swirl diffuser position."
      },
      {
        "offset": 17,
        "name": "rotary_level",
        "description": "Poziom obrotowego (rotary).",
        "description_en": "Rotary level."
      },
      {
        "offset": 18,
        "name": "fan_supply_flow",
        "description": "Przepływ powietrza nawiewanego.",
        "description_en": "Supply air flow."
      },
      {
        "offset": 19,
        "name": "gas_heating_value",
        "description": "Wartość ogrzewania gazowego.",
        "description_en": "Gas heating value."
      },
      {
        "offset": 20,
        "name": "CO2_status",
        "description": "Status CO2 — wartość LSB (MSB ignorowany).",
        "description_en": "CO2 status written by T-box to the device. 16-bit register: MSB ignored, LSB = status"
      },
      {
        "offset": 21,
        "name": "Rooftop_work_mode",
        "description": "Zadany tryb pracy jednostki dachowej — wartość LSB.",
        "description_en": "Rooftop unit operating mode setpoint — LSB value."
      },
      {
        "offset": 22,
        "name": "Rooftop_current_work_mode",
        "description": "Aktualny tryb pracy jednostki dachowej — wartość LSB.",
        "description_en": "Rooftop unit current operating mode — LSB value."
      },
      {
        "offset": 23,
        "name": "Alarm",
        "description": "Stan alarmów — wartość LSB.",
        "description_en": "Alarm state — LSB value."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_ON — urządzenie włączone",
          "3": "WM_THERM — tryb termostatyczny"
        },
        "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb pracy",
        "values_en": {
          "1": "WM_OFF — device off",
          "2": "WM_ON — device on",
          "3": "WM_THERM — thermostat mode"
        },
        "description_en": "16-bit register: MSB ignored, LSB = operating mode"
      },
      {
        "offset": 5,
        "name": "fan_eff",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajności wentylatora EC, płynna regulacja 0–100%",
        "description_en": "EC fan capacity setpoint, continuous regulation 0–100%"
      },
      {
        "offset": 6,
        "name": "fan_eff_CO2_I",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajności wentylatora EC dla 1. progu czujnika CO2",
        "description_en": "EC fan capacity setpoint for CO2 sensor threshold 1"
      },
      {
        "offset": 7,
        "name": "fan_eff_CO2_II",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajności wentylatora EC dla 2. progu czujnika CO2",
        "description_en": "EC fan capacity setpoint for CO2 sensor threshold 2"
      },
      {
        "offset": 8,
        "name": "recirculation_mode",
        "values": {
          "0": "RM_AUTO — tryb automatyczny",
          "1": "RM_MANUAL — tryb ręczny"
        },
        "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb recyrkulacji",
        "values_en": {
          "0": "RM_AUTO — automatic mode",
          "1": "RM_MANUAL — manual mode"
        },
        "description_en": "16-bit register: MSB ignored, LSB = recirculation mode"
      },
      {
        "offset": 9,
        "name": "recirculation_value",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wartość recyrkulacji, płynna regulacja 0–100%",
        "description_en": "Recirculation value, continuous regulation 0–100%"
      },
      {
        "offset": 10,
        "name": "recirculation_value_CO2_I",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wartość recyrkulacji dla 1. progu czujnika CO2",
        "description_en": "Recirculation value for CO2 sensor threshold 1"
      },
      {
        "offset": 11,
        "name": "recirculation_value_CO2_II",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wartość recyrkulacji dla 2. progu czujnika CO2",
        "description_en": "Recirculation value for CO2 sensor threshold 2"
      },
      {
        "offset": 12,
        "name": "work_mode_NW",
        "values": {
          "0": "WM_NW_AUTO — tryb automatyczny dyfuzora",
          "1": "WM_NW_MANUAL — tryb ręczny dyfuzora"
        },
        "description": "Tryb pracy dyfuzora wirowego (NW). Rejestr 16-bit: MSB ignorowany, LSB = tryb",
        "values_en": {
          "0": "WM_NW_AUTO — automatic diffuser mode",
          "1": "WM_NW_MANUAL — manual diffuser mode"
        },
        "description_en": "Swirl diffuser (NW) operating mode. 16-bit register: MSB ignored, LSB = mode"
      },
      {
        "offset": 13,
        "name": "swirl_diffuser_level",
        "min": 30,
        "max": 100,
        "unit": "%",
        "description": "Poziom otwarcia dyfuzora wirowego",
        "description_en": "Swirl diffuser opening level"
      },
      {
        "offset": 14,
        "name": "Htg_swirl_diffuser_level",
        "min": 30,
        "max": 100,
        "unit": "%",
        "description": "Poziom otwarcia dyfuzora wirowego w trybie grzania",
        "description_en": "Swirl diffuser opening level in heating mode"
      },
      {
        "offset": 15,
        "name": "Clg_swirl_diffuser_level",
        "min": 30,
        "max": 100,
        "unit": "%",
        "description": "Poziom otwarcia dyfuzora wirowego w trybie chłodzenia",
        "description_en": "Swirl diffuser opening level in cooling mode"
      },
      {
        "offset": 16,
        "name": "temperature_ref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1",
        "description": "Docelowa temperatura pomieszczenia",
        "description_en": "Target room temperature"
      },
      {
        "offset": 17,
        "name": "temperature_room",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1",
        "description": "Temperatura pomieszczenia przekazywana do urządzenia przez Modbus",
        "description_en": "Room temperature sent to the device via Modbus"
      },
      {
        "offset": 18,
        "name": "room_sensor_selection",
        "values": {
          "1": "TSL_PREFERRED_TLEAD — wartość przez Modbus (gdy lokalny czujnik CUBE jest aktywny)",
          "2": "TSL_TLEAD — wartość przez Modbus (tylko gdy lokalny czujnik CUBE jest wyłączony)",
          "3": "TSL_PREFERRED_LOCAL — czujnik lokalny CUBE (gdy jest aktywny)"
        },
        "description": "Wybór źródła temperatury pomieszczenia",
        "values_en": {
          "1": "TSL_PREFERRED_TLEAD — value via Modbus (when local CUBE sensor is active)",
          "2": "TSL_TLEAD — value via Modbus (only when local CUBE sensor is disabled)",
          "3": "TSL_PREFERRED_LOCAL — local CUBE sensor (when active)"
        },
        "description_en": "Room temperature source selection"
      },
      {
        "offset": 19,
        "name": "CO2_status",
        "values": {
          "0": "CO2_STAT_OK — status CO2 OK",
          "1": "CO2_STAT_L1 — poziom CO2 próg 1",
          "2": "CO2_STAT_L2 — poziom CO2 próg 2"
        },
        "description": "Status CO2 zapisywany przez T-box do urządzenia. Rejestr 16-bit: MSB ignorowany, LSB = status",
        "values_en": {
          "0": "CO2_STAT_OK — CO2 status OK",
          "1": "CO2_STAT_L1 — CO2 level threshold 1",
          "2": "CO2_STAT_L2 — CO2 level threshold 2"
        },
        "description_en": "CO2 status written by T-box to the device. 16-bit register: MSB ignored, LSB = status"
      },
      {
        "offset": 20,
        "name": "CO2_source",
        "values": {
          "0": "CO2_SOURCE_LOCAL — lokalny czujnik CO2 w CUBE",
          "1": "CO2_SOURCE_TBOX — źródło CO2 z T-box"
        },
        "description": "Wybór źródła danych CO2. Rejestr 16-bit: MSB ignorowany, LSB = źródło",
        "values_en": {
          "0": "CO2_SOURCE_LOCAL — local CO2 sensor in CUBE",
          "1": "CO2_SOURCE_TBOX — CO2 source from T-box"
        },
        "description_en": "CO2 data source selection. 16-bit register: MSB ignored, LSB = source"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_ON — urządzenie włączone",
          "3": "WM_THERM — tryb termostatyczny"
        },
        "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb pracy",
        "values_en": {
          "1": "WM_OFF — device off",
          "2": "WM_ON — device on",
          "3": "WM_THERM — thermostat mode"
        },
        "description_en": "16-bit register: MSB ignored, LSB = operating mode"
      },
      {
        "offset": 5,
        "name": "fan_eff",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajności wentylatora EC, płynna regulacja 0–100%",
        "description_en": "EC fan capacity setpoint, continuous regulation 0–100%"
      },
      {
        "offset": 6,
        "name": "fan_eff_CO2_I",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajności wentylatora EC dla 1. progu czujnika CO2",
        "description_en": "EC fan capacity setpoint for CO2 sensor threshold 1"
      },
      {
        "offset": 7,
        "name": "fan_eff_CO2_II",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajności wentylatora EC dla 2. progu czujnika CO2",
        "description_en": "EC fan capacity setpoint for CO2 sensor threshold 2"
      },
      {
        "offset": 8,
        "name": "recirculation_mode",
        "values": {
          "0": "RM_AUTO — tryb automatyczny",
          "1": "RM_MANUAL — tryb ręczny"
        },
        "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb recyrkulacji",
        "values_en": {
          "0": "RM_AUTO — automatic mode",
          "1": "RM_MANUAL — manual mode"
        },
        "description_en": "16-bit register: MSB ignored, LSB = recirculation mode"
      },
      {
        "offset": 9,
        "name": "recirculation_value",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wartość recyrkulacji, płynna regulacja 0–100%",
        "description_en": "Recirculation value, continuous regulation 0–100%"
      },
      {
        "offset": 10,
        "name": "recirculation_value_CO2_I",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wartość recyrkulacji dla 1. progu czujnika CO2",
        "description_en": "Recirculation value for CO2 sensor threshold 1"
      },
      {
        "offset": 11,
        "name": "recirculation_value_CO2_II",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wartość recyrkulacji dla 2. progu czujnika CO2",
        "description_en": "Recirculation value for CO2 sensor threshold 2"
      },
      {
        "offset": 12,
        "name": "work_mode_NW",
        "values": {
          "0": "WM_NW_AUTO — tryb automatyczny dyfuzora",
          "1": "WM_NW_MANUAL — tryb ręczny dyfuzora"
        },
        "description": "Tryb pracy dyfuzora wirowego (NW). Rejestr 16-bit: MSB ignorowany, LSB = tryb",
        "values_en": {
          "0": "WM_NW_AUTO — automatic diffuser mode",
          "1": "WM_NW_MANUAL — manual diffuser mode"
        },
        "description_en": "Swirl diffuser (NW) operating mode. 16-bit register: MSB ignored, LSB = mode"
      },
      {
        "offset": 13,
        "name": "swirl_diffuser_level",
        "min": 30,
        "max": 100,
        "unit": "%",
        "description": "Poziom otwarcia dyfuzora wirowego",
        "description_en": "Swirl diffuser opening level"
      },
      {
        "offset": 14,
        "name": "Htg_swirl_diffuser_level",
        "min": 30,
        "max": 100,
        "unit": "%",
        "description": "Poziom otwarcia dyfuzora wirowego w trybie grzania",
        "description_en": "Swirl diffuser opening level in heating mode"
      },
      {
        "offset": 15,
        "name": "Clg_swirl_diffuser_level",
        "min": 30,
        "max": 100,
        "unit": "%",
        "description": "Poziom otwarcia dyfuzora wirowego w trybie chłodzenia",
        "description_en": "Swirl diffuser opening level in cooling mode"
      }
    ],
    "description_en": "CUBE ventilation unit with swirl diffuser and CO2 sensor"
  },
  "LUNA (DRV LUNA)": {
    "name": "LUNA (DRV LUNA)",
    "description": "Nagrzewnica LUNA",
    "group_priority": 14,
    "tbox_zone_only": true,
    "input_registers": [
      {
        "offset": 5,
        "name": "RoomTemperatureValue",
        "description": "Temperatura zmierzona przez czujnik T4 (temperatura w pomieszczeniu).",
        "description_en": "Temperature measured by T4 sensor (room temperature)."
      },
      {
        "offset": 6,
        "name": "LeadTemperatureValue",
        "description": "Temperatura z czujnika wiodącego (MODBUS, ROOM, SUPPLY lub INTAKE — zależnie od ustawień).",
        "description_en": "Temperature from lead sensor (MODBUS, ROOM, SUPPLY or INTAKE — depends on settings)."
      },
      {
        "offset": 7,
        "name": "IntakeTemperatureValue",
        "description": "Temperatura zmierzona przez czujnik Ti3 (powietrze wlotowe).",
        "description_en": "Temperature measured by Ti3 sensor (intake air)."
      },
      {
        "offset": 8,
        "name": "SupplyTemperatureValue",
        "description": "Temperatura zmierzona przez czujnik T1 (powietrze wylotowe).",
        "description_en": "Temperature measured by T1 sensor (supply air)."
      },
      {
        "offset": 9,
        "name": "HeaterTemperatureValue",
        "description": "Temperatura zmierzona przez czujnik T2 (wymiennik wodny).",
        "description_en": "Temperature measured by T2 sensor (water heat exchanger)."
      },
      {
        "offset": 10,
        "name": "FanEfficiencyValue",
        "description": "Aktualna wydajność wentylatora.",
        "description_en": "Current fan efficiency."
      },
      {
        "offset": 11,
        "name": "DrainPumpAlarm",
        "description": "Stan alarmu pompy skroplin.",
        "description_en": "Drain pump alarm state."
      },
      {
        "offset": 12,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min].",
        "description_en": "Filter operating time. Actual value = 5 × register value [min]."
      },
      {
        "offset": 13,
        "name": "ValveHTValue",
        "description": "Aktualny stan zaworu grzewczego (HT).",
        "description_en": "Current heating valve (HT) state."
      },
      {
        "offset": 14,
        "name": "ValveCLValue",
        "description": "Aktualny stan zaworu chłodniczego (CL).",
        "description_en": "Current cooling valve (CL) state."
      },
      {
        "offset": 15,
        "name": "Smart1State",
        "description": "Stan trybu SMART I — informacja czy tryb jest aktywny.",
        "description_en": "SMART MODE I state — indicates whether mode is active."
      },
      {
        "offset": 16,
        "name": "Smart2State",
        "description": "Stan trybu SMART II — informacja czy tryb jest aktywny.",
        "description_en": "SMART MODE II state — indicates whether mode is active."
      },
      {
        "offset": 17,
        "name": "Smart3State",
        "description": "Stan trybu SMART III — informacja czy tryb jest aktywny.",
        "description_en": "SMART MODE III state — indicates whether mode is active."
      },
      {
        "offset": 18,
        "name": "TechnologicalHeatAlarm",
        "description": "Brak ciepła ze źródła zasilania.",
        "description_en": "No heat from power source."
      },
      {
        "offset": 19,
        "name": "Smart2LowTempAlarm",
        "description": "Alarm niskiej temperatury nawiewu — II stan.",
        "description_en": "Low supply temperature alarm — state II."
      },
      {
        "offset": 20,
        "name": "SupplyTemperatureValue2",
        "description": "Temperatura powietrza wylotowego — dodatkowy odczyt (czujnik T1).",
        "description_en": "Supply air temperature — additional reading (T1 sensor)."
      },
      {
        "offset": 21,
        "name": "HeaterTemperatureValue2",
        "description": "Temperatura wymiennika wodnego — dodatkowy odczyt (czujnik T2).",
        "description_en": "Heat exchanger temperature — additional reading (T2 sensor)."
      },
      {
        "offset": 22,
        "name": "IntakeTemperatureValue2",
        "description": "Temperatura powietrza wlotowego — dodatkowy odczyt (czujnik T3).",
        "description_en": "Intake air temperature — additional reading (T3 sensor)."
      },
      {
        "offset": 23,
        "name": "RoomTemperatureValue2",
        "description": "Temperatura powietrza w pomieszczeniu — dodatkowy odczyt (czujnik T4).",
        "description_en": "Room air temperature — additional reading (T4 sensor)."
      },
      {
        "offset": 24,
        "name": "InputDIState",
        "description": "Stan wejścia cyfrowego DI.",
        "description_en": "Digital input DI state."
      },
      {
        "offset": 25,
        "name": "FanWorkTime",
        "description": "Czas pracy wentylatora.",
        "description_en": "Fan operating time."
      },
      {
        "offset": 26,
        "name": "PreheatState",
        "description": "Stan funkcji podgrzewania wstępnego.",
        "description_en": "Preheat function state."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 5,
        "name": "OnOff",
        "values": {
          "0": "OFF — wyłączone",
          "1": "ON — włączone"
        },
        "description": "Włącz/wyłącz urządzenie. Domyślnie OFF.",
        "values_en": {
          "0": "OFF — off",
          "1": "ON — on"
        },
        "description_en": "Turn device on/off. Default: OFF."
      },
      {
        "offset": 6,
        "name": "ManualWorkMode",
        "values": {
          "0": "AUTO",
          "1": "MANUAL"
        },
        "description": "Tryb pracy wentylatora. Domyślnie MANUAL.",
        "description_en": "Fan operating mode. Default: MANUAL."
      },
      {
        "offset": 7,
        "name": "DestratificationMode",
        "values": {
          "0": "OFF",
          "1": "ON"
        },
        "description": "Włącz/wyłącz tryb destratyfikacji. Aktywne gdy LowCeilingMode=OFF.",
        "description_en": "Enable/disable destratification mode. Active when LowCeilingMode=OFF."
      },
      {
        "offset": 8,
        "name": "LowCeilingMode",
        "values": {
          "0": "OFF",
          "1": "ON"
        },
        "description": "Włącz/wyłącz tryb niskiego sufitu.",
        "description_en": "Enable/disable low ceiling mode."
      },
      {
        "offset": 9,
        "name": "NozzleLvl",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Ustawienie dyszy (5 kroków). Aktywne gdy ManualWorkMode=ON. Domyślnie 0%.",
        "description_en": "Nozzle setting (5 steps). Active when ManualWorkMode=ON. Default: 0%."
      },
      {
        "offset": 10,
        "name": "SmartMode",
        "values": {
          "0": "OFF",
          "1": "ON"
        },
        "description": "Włącz/wyłącz tryb SMART. Aktywne gdy InputDIConfiguration=1 lub 2.",
        "description_en": "Enable/disable SMART mode. Active when InputDIConfiguration=1 or 2."
      },
      {
        "offset": 11,
        "name": "PreheatMode",
        "values": {
          "0": "OFF",
          "1": "ON"
        },
        "description": "Włącz/wyłącz podgrzewanie wstępne. Aktywne gdy ExchangerTypeConfiguration=0 lub 2.",
        "description_en": "Enable/disable preheat. Active when ExchangerTypeConfiguration=0 or 2."
      },
      {
        "offset": 12,
        "name": "FanManualLvl",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Ręczna wydajność wentylatora. Aktywne gdy ManualWorkMode=1. Domyślnie 200 = 20%.",
        "description_en": "Manual fan capacity. Active when ManualWorkMode=1. Default: 200 = 20%."
      },
      {
        "offset": 13,
        "name": "DestratificationTempRef",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Różnica temperatur aktywująca destratyfikację: IntakeTemp − RoomTemp > wartość. Domyślnie 50 = 5.0°C.",
        "description_en": "Temperature difference to activate destratification: IntakeTemp − RoomTemp > value. Default: 50 = 5.0°C."
      },
      {
        "offset": 14,
        "name": "PreheatTempRef",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura wymiennika po której włącza się wentylator (tryb grzania). Domyślnie 280 = 28.0°C.",
        "description_en": "Heat exchanger temperature threshold to start fan (heating mode). Default: 280 = 28.0°C."
      },
      {
        "offset": 15,
        "name": "SmartMode1TimeRef",
        "min": 0,
        "max": 99999,
        "unit": "s",
        "description": "Czas aktywacji warunku SMART MODE I. Domyślnie 1800s.",
        "description_en": "SMART MODE I activation time. Default: 1800s."
      },
      {
        "offset": 16,
        "name": "SmartMode2TimeRef",
        "min": 0,
        "max": 99999,
        "unit": "s",
        "description": "Czas aktywacji warunku SMART MODE II. Domyślnie 3600s.",
        "description_en": "SMART MODE II activation time. Default: 3600s."
      },
      {
        "offset": 17,
        "name": "SmartMode3TimeRef",
        "min": 0,
        "max": 99999,
        "unit": "s",
        "description": "Czas aktywacji warunku SMART MODE III. Domyślnie 7200s.",
        "description_en": "SMART MODE III activation time. Default: 7200s."
      },
      {
        "offset": 18,
        "name": "SmartMode2HysteresisHeat",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Histereza temperatury dla grzania w SMART MODE II. Domyślnie 20 = 2.0°C.",
        "description_en": "Temperature hysteresis for heating in SMART MODE II. Default: 20 = 2.0°C."
      },
      {
        "offset": 19,
        "name": "SmartMode2HysteresisCool",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Histereza temperatury dla chłodzenia w SMART MODE II. Domyślnie 20 = 2.0°C.",
        "description_en": "Temperature hysteresis for cooling in SMART MODE II. Default: 20 = 2.0°C."
      },
      {
        "offset": 20,
        "name": "SmartMode3TempMin",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Minimalna temperatura dla SMART MODE III. Domyślnie 180 = 18.0°C.",
        "description_en": "Minimum temperature for SMART MODE III. Default: 180 = 18.0°C."
      },
      {
        "offset": 21,
        "name": "InputDiForce",
        "description": "Nadpisanie wejścia DI przez MODBUS. Aktywne gdy InputDIConfiguration=1 lub 2 i IR[0x0E]=1. Domyślnie 0.",
        "description_en": "Override DI input via MODBUS. Active when InputDIConfiguration=1 or 2 and IR[0x0E]=1. Default: 0."
      },
      {
        "offset": 22,
        "name": "DestratificationFanRef",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Wydajność wentylatora w trybie destratyfikacji. Domyślnie 600 = 60%.",
        "description_en": "Fan capacity in destratification mode. Default: 600 = 60%."
      },
      {
        "offset": 23,
        "name": "LowCeilingFanRef",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Wydajność wentylatora w trybie niskiego sufitu. Domyślnie 600 = 60%.",
        "description_en": "Fan capacity in low ceiling mode. Default: 600 = 60%."
      },
      {
        "offset": 24,
        "name": "LowCeilingLowLimit",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Dolny limit wydajności wentylatora w trybie Low Ceiling. Domyślnie 0%.",
        "description_en": "Lower fan capacity limit in Low Ceiling mode. Default: 0%."
      },
      {
        "offset": 25,
        "name": "LowCeilingHighLimit",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Górny limit wydajności wentylatora w trybie Low Ceiling. Domyślnie 600 = 60%.",
        "description_en": "Upper fan capacity limit in Low Ceiling mode. Default: 600 = 60%."
      },
      {
        "offset": 26,
        "name": "InputDIConfiguration",
        "description": "Aktywacja i wybór polaryzacji wejścia DI.",
        "description_en": "DI input activation and polarity selection."
      },
      {
        "offset": 27,
        "name": "ActuatorsTimeConfiguration",
        "unit": "s",
        "description": "Czas otwarcia siłownika 3-drogowego — zgodnie z danymi producenta. Domyślnie 150s.",
        "description_en": "3-way actuator opening time — per manufacturer data. Default: 150s."
      },
      {
        "offset": 28,
        "name": "ExchangerTypeConfiguration",
        "description": "Typ wymiennika ciepła. Domyślnie 2.",
        "description_en": "Heat exchanger type. Default: 2."
      },
      {
        "offset": 29,
        "name": "ValveTypeConfiguration",
        "description": "Typ siłownika zaworu. Domyślnie 0.",
        "description_en": "Valve actuator type. Default: 0."
      },
      {
        "offset": 30,
        "name": "DrainPumpAlarmConfiguration",
        "description": "Polaryzacja styku alarmu pompy skroplin. Domyślnie 0.",
        "description_en": "Drain pump alarm contact polarity. Default: 0."
      },
      {
        "offset": 31,
        "name": "FilterMaxWorkTime",
        "description": "Maksymalny czas pracy filtra. Domyślnie 4000h.",
        "description_en": "Maximum filter operating time. Default: 4000h."
      },
      {
        "offset": 32,
        "name": "GroupTLeadSensorSelect",
        "description": "Wybór czujnika wiodącego grupy.",
        "description_en": "Group lead sensor selection."
      }
    ],
    "holding_registers_group": [],
    "description_en": "LUNA heater"
  },
  "SLIM (DRV SLIM)": {
    "name": "SLIM (DRV SLIM)",
    "description": "Kurtyna powietrzna SLIM",
    "group_priority": 15,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3).",
        "description_en": "Supply air temperature after water heat exchanger (T3 sensor)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura powietrza przed wymiennikiem wodnym (czujnik T4).",
        "description_en": "Air temperature before water heat exchanger (T4 sensor)."
      },
      {
        "offset": 6,
        "name": "CurtainFanSpeed",
        "description": "Prędkość wentylatora kurtyny (AC 3-biegowy: 0=stop, 1–33=bieg1, 34–66=bieg2, 67–100=bieg3).",
        "description_en": "Curtain fan speed (3-speed AC fan: 0=stop, 1–33=speed 1, 34–66=speed 2, 67–100=speed 3)."
      },
      {
        "offset": 7,
        "name": "ValveState",
        "description": "Stan zaworu wodnego.",
        "description_en": "Water valve state."
      },
      {
        "offset": 8,
        "name": "HeaterFanSpeed",
        "description": "Prędkość wentylatora nagrzewnicy (AC 3-biegowy).",
        "description_en": "Heater fan speed (3-speed AC fan)."
      },
      {
        "offset": 9,
        "name": "ContactDoor",
        "description": "Stan styku drzwiowego.",
        "description_en": "Door contact state."
      },
      {
        "offset": 10,
        "name": "HeaterDetect",
        "description": "Procedura wykrywania nagrzewnicy (ELIS-DUO).",
        "description_en": "Heater detection procedure (ELIS-DUO)."
      },
      {
        "offset": 11,
        "name": "AntifreezeState",
        "description": "Stan ochrony przeciwzamrożeniowej — 8 bitów dla poszczególnych trybów.",
        "description_en": "Antifreeze protection state — 8 bits for individual modes."
      },
      {
        "offset": 12,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora 3V (bity 8–11). Przykład: 0x100 = OK, 0x200 = przepalony.",
        "description_en": "Fan fuse state (bits 8–11). Example: 0x100 = OK, 0x200 = blown."
      },
      {
        "offset": 13,
        "name": "CurtainElectricpower",
        "description": "Moc elektrycznej nagrzewnicy kurtyny (wyjścia L1/L2 na złączu VALVE).",
        "description_en": "Curtain electric heater power (L1/L2 outputs on VALVE connector)."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT — tryb grzania",
          "3": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HEAT — heating mode",
          "3": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Curtain fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        },
        "values_en": {
          "0": "HEAT_NS — read-only",
          "1": "HEAT_ON — heating on",
          "2": "HEAT_OFF — heating off"
        }
      },
      {
        "offset": 7,
        "name": "HeaterFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Heater fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "HeaterHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        },
        "values_en": {
          "0": "HEAT_NS — read-only",
          "1": "HEAT_ON — heating on",
          "2": "HEAT_OFF — heating off"
        }
      },
      {
        "offset": 10,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 11,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 12,
        "name": "TLeadSensorSelect",
        "values": {
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
        },
        "values_en": {
          "1": "TSL_TLEAD — value via Modbus (TLeadVal)",
          "3": "TSL_T4 — T4 sensor (DRV connector)"
        }
      },
      {
        "offset": 13,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS — brak wymuszenia",
          "1": "CURT_PRG_K1 — wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 — wymuszenie SW3 na K2"
        },
        "values_en": {
          "0": "CURT_PRG_NS — no override",
          "1": "CURT_PRG_K1 — force SW3 to K1",
          "2": "CURT_PRG_K2 — force SW3 to K2"
        }
      },
      {
        "offset": 14,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Curtain fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 15,
        "name": "HeaterFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Heater fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 16,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie stand-by wentylatora w sekundach; 65535 = nieskończone",
        "description_en": "Fan stand-by delay in seconds; 65535 = infinite"
      },
      {
        "offset": 17,
        "name": "ValveIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie zaworu w trybie stand-by w sekundach; 65535 = nieskończone. Warunek: ValveIdleDelay < FanIdleDelay",
        "description_en": "Valve stand-by delay in seconds; 65535 = infinite. Constraint: ValveIdleDelay < FanIdleDelay"
      },
      {
        "offset": 18,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        },
        "values_en": {
          "1": "WM_ON — enabled",
          "2": "WM_OFF — disabled"
        }
      },
      {
        "offset": 19,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT — tryb grzania",
          "3": "WM_VENT — wentylacja"
        },
        "values_en": {
          "0": "WM_NS — read-only",
          "1": "WM_OFF — device off",
          "2": "WM_HEAT — heating mode",
          "3": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Curtain fan AC 3-speed: 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        },
        "values_en": {
          "0": "HEAT_NS — read-only",
          "1": "HEAT_ON — heating on",
          "2": "HEAT_OFF — heating off"
        }
      },
      {
        "offset": 7,
        "name": "ContactDoor",
        "values": {
          "1": "DOOR_OPEN — drzwi otwarte",
          "2": "DOOR_CLOSE — drzwi zamknięte"
        },
        "values_en": {
          "1": "DOOR_OPEN — door open",
          "2": "DOOR_CLOSE — door closed"
        }
      },
      {
        "offset": 8,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS — brak wymuszenia",
          "1": "CURT_PRG_K1 — wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 — wymuszenie SW3 na K2"
        },
        "values_en": {
          "0": "CURT_PRG_NS — no override",
          "1": "CURT_PRG_K1 — force SW3 to K1",
          "2": "CURT_PRG_K2 — force SW3 to K2"
        }
      },
      {
        "offset": 9,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)",
        "description_en": "Curtain fan AC 3-speed (stand-by): 0=off (FAN_SPEED0), 1–33=speed 1 (FAN_SPEED1), 34–66=speed 2 (FAN_SPEED2), 67–100=speed 3 (FAN_SPEED3)"
      },
      {
        "offset": 10,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie stand-by wentylatora w sekundach; 65535 = nieskończone",
        "description_en": "Fan stand-by delay in seconds; 65535 = infinite"
      },
      {
        "offset": 11,
        "name": "ValveIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie zaworu w trybie stand-by w sekundach; 65535 = nieskończone. Warunek: ValveIdleDelay < FanIdleDelay",
        "description_en": "Valve stand-by delay in seconds; 65535 = infinite. Constraint: ValveIdleDelay < FanIdleDelay"
      }
    ],
    "description_en": "SLIM air curtain"
  }
};
