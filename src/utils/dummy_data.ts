/* istanbul ignore file */
import { v4 as uuid } from 'uuid';
import { DeductionType } from '../types/incidentals';
import { IncidentalsStateManager } from '_/states/saveStates/incidentals_state';
import { InvoiceStateManager } from '_/states/saveStates/invoice_state';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { Month, MonthYearUtils } from '_/types/date';

function createDummyData(): void {
  // Dummy residents
  for (let i = 0; i < 8; i += 1) {
    ResidentStateManager.addResident({
      id: uuid(),
      firstName: 'Max',
      lastName: 'Mustermann',
      rent: [
        {
          dueDate: MonthYearUtils.getCurrentMonthYear(),
          rent: 50000,
          incidentals: 10000,
        },
      ],
      invoiceStart: MonthYearUtils.getCurrentMonthYear(),
    });
  }

  // Dummy incidentals
  for (let i = 0; i < 8; i += 1) {
    IncidentalsStateManager.addIncidentals({
      id: uuid(),
      name: 'Nebenkosten',
      deductionType: DeductionType.PerResident,
      currentPrice: 10000,
      invoiceInterval: 12,
    });
  }

  // Dummy invoices
  InvoiceStateManager.addInvoice({
    start: {
      month: Month.January,
      year: 2023,
    },
    end: { month: Month.May, year: 2023 },
    residentInformation: {},
  });
}

export default createDummyData;
