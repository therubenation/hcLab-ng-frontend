# Use Case Analyse

## Use Case 0: Empfang und Persistierung eines Messergebnisses
*(unverändert, aber erweitert)*

**Akteur:** Mobile Applikation / Messsystem

**Ziel:**  
Messdaten werden an das Backend übermittelt und konsistent gespeichert.

**Erweiterung (neu):**
- Das System kann optional eine Replikat-Kennzeichnung (replicateLabel) speichern, um Messungen innerhalb einer Kalibrierung unterscheiden zu können.
  Diese Kennzeichnung ist kein zwingender Produktionscode.
- Das Rohsignal wird als versioniertes Payload-Format  
  (`RawSignalPayload`) persistiert.

**Akzeptanzkriterien – Ergänzungen:**
- Das Rohsignal wird vollständig gespeichert  
  (FormatVersion, Units, Messpunkte).
- Ein optionaler `cartridgeInstanceCode` wird gespeichert, wenn er geliefert wird.

---

## Use Case 1: Übersicht über Messergebnisse
*(leicht erweitert)*

**Akteur:** Wissenschaftler

**Ziel:**  
Messungen finden, filtern und vergleichen.

**Erweiterte Filtermöglichkeiten**  
(aus der Supervisor-Mail abgeleitet):
- Filter nach `ElectrodeBatchCode` (z. B. „0x37“)
- Filter nach Messart (Standard / Kalibrierung)
- Filter nach `includedInCalibration`  
  (nur „berücksichtigte“ Kalibriermessungen)
- Optional: Filter nach `cartridgeInstanceCode`  
  (um die drei Exemplare getrennt betrachten zu können)

**Anzeige in der Liste (Minimum):**
- Zeitpunkt der Messung
- Device (Serial)
- BatchCode + ElectrodeBatchCode
- Messart (Standard / Kalibrierung)

---

## Use Case 2: Detailansicht einer Messung
*(im Kern unverändert)*

**Akteur:** Wissenschaftler

**Ziel:**  
Rohdaten und Kontext einer Messung analysieren.

**Erweiterte Inhalte in der Detailansicht:**
- Rohsignal als Kurve (Plot)
- Messart (Standard / Kalibrierung)
- Falls Kalibrierung:
  - Sollkonzentration + Einheit
- `cartridgeInstanceCode` (falls gesetzt)
- Datum
- Operator: email

---

## Use Case 2a: Nachträgliche Kalibrier-Markierung
*(neu / angepasst)*

**Akteur:** Wissenschaftler

**Ziel:**  
Vorhandene Messungen nachträglich für die Kalibrierung „befähigen“.

**Beschreibung:**  
Der Wissenschaftler wählt in der Messübersicht eine oder mehrere Messungen aus und setzt:
- Messart = Kalibriermessung
- Sollkonzentration + Einheit (Kalibrierflüssigkeit)
- optional: „in Kalibrierung berücksichtigen“ (Häkchen)

**Akzeptanzkriterien:**
- Messungen können einzeln oder mehrfach ausgewählt werden.
- Für ausgewählte Messungen können gesetzt werden:
  - `measurementType = CALIBRATION`
  - `referenceConcentration`, `referenceUnit`  
    (Pflicht bei `CALIBRATION`)
- Rückgängig machen ist möglich:
  - `measurementType = STANDARD`
  - Referenzfelder werden gelöscht oder ignoriert
  - `includedInCalibration` wird auf false gesetzt
- Die UI zeigt klar:
  - welche Messungen Kalibriermessungen sind
  - welche davon tatsächlich berücksichtigt werden

---

## Use Case 3: Erstellung / Aktualisierung einer Kalibrierkurve
*(präzisiert)*

**Akteur:** Wissenschaftler

**Ziel:**  
Aus ausgewählten Kalibriermessungen eine Kalibrierkurve ableiten.

**Präzisierung (Supervisor-Mail):**
- Pro Konzentration existieren mehrere Messungen  
  (z. B. drei Exemplare).
- Pro Konzentration werden Mittelwert und Standardabweichung  
  aus den Messwerten gebildet (Folgeschritt).
- Es werden nur Messungen berücksichtigt, bei denen:
  - `measurementType = CALIBRATION`
  - `includedInCalibration = true`
  - eine Sollkonzentration gesetzt ist

**Akzeptanzkriterien – Ergänzungen:**
- Messungen können nach `ElectrodeBatchCode` gefiltert und selektiert werden  
  (z. B. „Elektrode 0x37“).
- Das System gruppiert Kalibriermessungen nach  
  `referenceConcentration` (+ Einheit).
- Für jede Konzentration werden Aggregationen berechnet:
  - Mittelwert (Mean)
  - Standardabweichung (StdDev)
- Ergebnis ist eine **CalibrationCurve** mit:
  - Bezug auf ElectrodeBatch *oder* CartridgeBatch  
    (abhängig von der Modellentscheidung),
  - ParameterSignature,
  - Version und Gültigkeitsbereich.
