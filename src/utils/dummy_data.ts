/* istanbul ignore file */
/* eslint-disable max-len */

import { v4 as uuid } from 'uuid';
import { DeductionType } from '../models/incidentals/ongoing_incidentals';
import MonthYear from '_/extensions/date/month_year.extension';
import IncidentalsStateManager from '_/states/incidentals/incidentals.state.manager';
import InvoiceStateManager from '_/states/invoice/Invoice.state.manager';
import ResidentStateManager from '_/states/resident/resident.state.manager';

function createDummyData(): void {
  // Dummy residents
  for (let i = 0; i < 8; i += 1) {
    ResidentStateManager.addResident({
      id: uuid(),
      firstName: 'Max',
      lastName: 'Mustermann',
      rentInformation: [
        {
          dueDate: new MonthYear(),
          rent: 50000,
          incidentals: 10000,
        },
      ],
      waterMeterReadings: [
        { waterMeterCount: 1234, readingDate: new Date().toUTC() },
      ],
      invoiceStart: new MonthYear(),
    });
  }

  // Dummy incidentals
  for (let i = 0; i < 8; i += 1) {
    IncidentalsStateManager.addOngoingIncidentals({
      id: uuid(),
      name: 'Nebenkosten',
      deductionType: DeductionType.PerResident,
      currentCost: 10000,
      invoiceInterval: 12,
    });
    IncidentalsStateManager.addOneTimeIncidentals({
      id: uuid(),
      name: 'Nebenkosten',
      cost: 10000,
      billingDate: new Date().toUTC(),
    });
  }

  // Dummy invoices
  const startMonth = new MonthYear(0, 2023);
  const endMonth = new MonthYear(2, 2023);
  for (let i = 0; i < 4; i += 1) {
    InvoiceStateManager.addInvoice({
      id: uuid(),
      start: startMonth.clone(),
      end: endMonth.clone(),
      residentInformation: {},
    });
    startMonth.addMonths(2);
    endMonth.addMonths(2);
  }
}

export default createDummyData;
