/* istanbul ignore file */
/* eslint-disable max-len */

import { range } from 'lodash';
import { setRecoil } from 'recoil-nexus';
import { v4 as uuid } from 'uuid';
import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import incidentalsState from '_/states/incidentals/incidentals.state';
import InvoiceStateManager from '_/states/invoice/Invoice.state.manager';
import ResidentStateManager from '_/states/resident/resident.state.manager';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

function createDummyData(): void {
  // Dummy residents
  for (let i = 0; i < 8; i += 1) {
    ResidentStateManager.addResident({
      id: uuid(),
      firstName: 'Max',
      lastName: 'Mustermann',
      numberOfResidents: 2,
      rentInformation: [
        {
          dueDate: new MonthYear(),
          rent: 50000,
          incidentals: 10000,
        },
      ],
      waterMeterReadings: [
        {
          waterMeterCount: 1234,
          readingDate: new Date(2023, 6, 1).toUTC(),
          wasDeductedInInvoice: true,
        },
        {
          waterMeterCount: 1235,
          readingDate: new Date().toUTC(),
          wasDeductedInInvoice: false,
        },
      ],
      invoiceStart: new MonthYear(),
    });
  }

  // Dummy incidentals
  const ongoingIncidentals = range(0, 8).map((i) => new OngoingIncidentalsBuilder()
    .withName(`Laufende Nebenkosten ${i + 1}`)
    .withDeductionType(
      i % 2 === 0 ? DeductionType.PerApartment : DeductionType.PerResident,
    )
    .withCosts([{ cost: 10000, date: new MonthYear() }])
    .withInvoiceInterval(i + 1)
    .build());
  const oneTimeIncidentals = range(0, 8).map((i) => new OneTimeIncidentalsBuilder()
    .withName(`Einmalige Nebenkosten ${i + 1}`)
    .withDeductionType(
      i % 2 === 0 ? DeductionType.PerApartment : DeductionType.PerResident,
    )
    .withCosts(10000)
    .withBillingDate(new Date().toUTC())
    .build());
  setRecoil(incidentalsState, { ongoingIncidentals, oneTimeIncidentals });

  // Dummy invoices
  const startMonth = new MonthYear(0, 2023);
  const endMonth = new MonthYear(2, 2023);
  for (let i = 0; i < 4; i += 1) {
    InvoiceStateManager.addInvoice({
      id: uuid(),
      start: startMonth.clone(),
      end: endMonth.clone(),
      residentInformation: {},
      ongoingIncidentalsInformation: {},
      oneTimeIncidentalsInformation: {},
    });
    startMonth.addMonths(2);
    endMonth.addMonths(2);
  }
}

export default createDummyData;
