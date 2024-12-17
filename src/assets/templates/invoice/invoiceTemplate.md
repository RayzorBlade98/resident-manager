{{ADDRES_HEADER}}

{{DATE_HEADER}}

## Nebenkostenabrechnung

### Nebenkosten

<table class="table">
  <tr>
    <th>Kostenart</th>
    <th>Gesamtkosten</th>
    <th>Umlageschlüssel</th>
    <th>Mieteranteil</th>
  </tr>
  {{INCIDENTALS_TABLE_BODY}}
  <tr>
    <td colspan="3"></td>
    <td>{{TOTAL_INCIDENTALS_COST}}</td>
</tr>
</table>

{{INDIVIDUAL_INCIDENTALS}}

### Wasserkosten

<table class="table">
  <tr>
    <th>Wasserart</th>
    <th>Letzter Zählerstand</th>
    <th>Aktueller Zählerstand</th>
    <th>Verbrauch</th>
    <th>Wasserpreis</th>
    <th>Gesamtkosten</th>
  </tr>
  <tr>
    <td>Trinkwasser</td>
    <td>{{LAST_WATER_METER_COUNT}} m³</td>
    <td>{{CURRENT_WATER_METER_COUNT}} m³</td>
    <td>{{WATER_USAGE}} m³</td>
    <td>{{WATER_USAGE_COST_PER_CUBIC_METER}} / m³</td>
    <td>{{WATER_USAGE_COST}}</td>
  </tr>
  <tr>
    <td>Schmutzwasser</td>
    <td>{{LAST_WATER_METER_COUNT}} m³</td>
    <td>{{CURRENT_WATER_METER_COUNT}} m³</td>
    <td>{{WATER_USAGE}} m³</td>
    <td>{{SEWAGE_COST_PER_CUBIC_METER}} / m³</td>
    <td>{{SEWAGE_COST}}</td>
  </tr>
  <tr>
    <td>Grundkosten</td>
    <td colspan="4"></td>
    <td>{{MONTHLY_WATER_DEDUCTION_COST}}</td>
  </tr>
  <tr>
    <td colspan="5"></td>
    <td>{{TOTAL_WATER_COST}}</td>
  </tr>
</table>

### Gesamtkosten

<table class="table">
  <tr>
    <td>Summe Nebenkosten</td>
    <td>{{TOTAL_INCIDENTALS_COST}}</td>
  </tr>
  <tr>
    <td>Summe indivuduelle Nebenkosten</td>
    <td>{{TOTAL_INDIVIDUAL_INCIDENTALS_COST}}</td>
  </tr>
  <tr>
    <td>Summe Wasserkosten</td>
    <td>{{TOTAL_WATER_COST}}</td>
  </tr>
  <tr>
    <td></td>
    <td>{{SUM_INCIDENTALS}}</td>
  </tr>
</table>

### Neuer Nebenkostenabschlag

{{SUM_INCIDENTALS}} / {{NUMBER_MONTH}} Monate = <b>{{NEW_DEDUCTION}}</b> pro Monat 

Der neue Nebenkostenabschlag von {{NEW_DEDUCTION}} ist fällig ab dem {{NEW_DEDUCTION_DATE}}.

### Nachzahlung

<table class="table">
  <tr>
    <td>Summe aller Nebenkosten</td>
    <td>{{SUM_INCIDENTALS}}</td>
  </tr>
  <tr>
    <td>Fehlende Mietzahlungen</td>
    <td>{{MISSING_RENT}}</td>
  </tr>
  <tr>
    <td>Gezahlte Nebenkosten</td>
    <td>-{{TOTAL_PAID_INCIDENTALS}}</td>
  </tr>
  <tr>
    <td></td>
    <td>{{MISSING_COST}}</td>
  </tr>
</table>