# Sauberer Frontend-Plan  
*(klein, aber fachlich korrekt)*

---

## View 1: Measurement List (Home)

**Zweck:**  
UC1 + Einstieg in UC2 + UC2a

### Funktionen

- Tabs / Select:
  - All
  - Standard
  - Calibration

- Tabelle mit Spalten:
  - UUID (short)
  - Datum
  - BatchCode
  - ElectrodeBatchCode
  - Type
  - optional: Sollwert

- Row-Click → Navigation zur Detailansicht

### Actions

- **Wenn Filter = Standard:**
  - Bulk-Select möglich
  - Button **„Als Kalibrierung markieren …“**
  - Öffnet Modal (Sollwert + Einheit)

- **Wenn Filter = Calibration:**
  - Checkbox **`includedInCalibration`** pro Zeile
  - optional: Multi-Select + gemeinsames Toggle

### Modal: *Mark Calibration*

- Pflichtfelder:
  - `referenceConcentration`
  - `unit`
- Optional:
  - `replicateLabel`
- Submit:
  - `PATCH` pro UUID  
  - (optional später: Bulk-`PATCH`)

---

## View 2: Measurement Detail

**Zweck:**  
UC2 + UC2a (Einzelmessung)

### Inhalte

- Chart:
  - Darstellung des `rawSignal`

- Metadaten:
  - Kontextinformationen zur Messung

### Actions

- **Wenn Standard:**
  - Button **„Als Kalibrierung markieren“**
  - Öffnet Modal

- **Wenn Calibration:**
  - Sollwert editierbar
  - Toggle für `includedInCalibration`

---

## View 3: Calibration Builder *(später)*

**Zweck:**  
UC3

### Funktionen

- Filter:
  - `electrodeBatchCode`
  - Zeitraum
  - optional: Analyte

- Gruppierung:
  - nach Sollkonzentration

- Anzeige:
  - pro Konzentration:
    - Anzahl der Messungen (N)
    - später: Mittelwert / Standardabweichung

- Action:
  - Button **„Kalibrierkurve berechnen“**
