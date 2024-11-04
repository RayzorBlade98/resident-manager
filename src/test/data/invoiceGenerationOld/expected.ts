/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  ongoingIncidentalsPerApartment,
  ongoingIncidentalsPerResident,
  oneTimeIncidentalsPerApartment,
  oneTimeIncidentalsPerResident,
} from './incidentals';
import {
  invoiceEnd,
  invoiceStart,
  landlord,
  newDeductionStart,
  property,
  sewageCostPerCubicMeter,
  waterUsageCostPerCubicMeter,
} from './invoiceInformation';
import {
  standardResident,
  residentLaterInvoiceStart,
  notIncludedResidents,
} from './residents';
import MonthYear from '_/extensions/date/month_year.extension';
import Invoice from '_/models/invoice/invoice';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';
import { Resident } from '_/models/resident/resident';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

export const expectedIncidentalsCosts: Pick<
Invoice,
'ongoingIncidentalsInformation' | 'oneTimeIncidentalsInformation'
> & {
  residentInformation: Record<
  string,
  {
    ongoingIncidentalsCosts: Record<string, CurrencyInCents>;
    oneTimeIncidentalsCosts: Record<string, CurrencyInCents>;
  }
  >;
} = {
  ongoingIncidentalsInformation: {
    [ongoingIncidentalsPerApartment.id]: {
      incidentalsId: ongoingIncidentalsPerApartment.id,
      name: ongoingIncidentalsPerApartment.name,
      totalCost: 200,
      deductionType: ongoingIncidentalsPerApartment.deductionType,
    },
    [ongoingIncidentalsPerResident.id]: {
      incidentalsId: ongoingIncidentalsPerResident.id,
      name: ongoingIncidentalsPerResident.name,
      totalCost: 300,
      deductionType: ongoingIncidentalsPerResident.deductionType,
    },
  },
  oneTimeIncidentalsInformation: {
    [oneTimeIncidentalsPerApartment.id]: {
      incidentalsId: oneTimeIncidentalsPerApartment.id,
      name: oneTimeIncidentalsPerApartment.name,
      totalCost: oneTimeIncidentalsPerApartment.cost,
      deductionType: oneTimeIncidentalsPerApartment.deductionType,
    },
    [oneTimeIncidentalsPerResident.id]: {
      incidentalsId: oneTimeIncidentalsPerResident.id,
      name: oneTimeIncidentalsPerResident.name,
      totalCost: oneTimeIncidentalsPerResident.cost,
      deductionType: oneTimeIncidentalsPerResident.deductionType,
    },
  },
  residentInformation: {
    [standardResident.id]: {
      ongoingIncidentalsCosts: {
        [ongoingIncidentalsPerApartment.id]: 20,
        [ongoingIncidentalsPerResident.id]: 200,
      },
      oneTimeIncidentalsCosts: {
        [oneTimeIncidentalsPerApartment.id]: 50,
        [oneTimeIncidentalsPerResident.id]: 500,
      },
    },
    [residentLaterInvoiceStart.id]: {
      ongoingIncidentalsCosts: {
        [ongoingIncidentalsPerApartment.id]: 20,
        [ongoingIncidentalsPerResident.id]: 100,
      },
      oneTimeIncidentalsCosts: {
        [oneTimeIncidentalsPerResident.id]: 500,
      },
    },
  },
};

export const expectedRentPayments: Record<
string,
ResidentInvoiceInformation['rentPayments']
> = {
  [standardResident.id]: [
    {
      dueDate: new MonthYear(0, 2023),
      rent: 500,
      incidentals: 100,
      paymentAmount: 600,
      paymentMissing: 0,
    },
    {
      dueDate: new MonthYear(1, 2023),
      rent: 600,
      incidentals: 200,
      paymentAmount: 600,
      paymentMissing: 200,
    },
    {
      dueDate: new MonthYear(2, 2023),
      rent: 700,
      incidentals: 300,
      paymentAmount: 0,
      paymentMissing: 1000,
    },
  ],
  [residentLaterInvoiceStart.id]: [
    {
      dueDate: new MonthYear(1, 2023),
      rent: 700,
      incidentals: 100,
      paymentAmount: 1000,
      paymentMissing: -200,
    },
    {
      dueDate: new MonthYear(2, 2023),
      rent: 800,
      incidentals: 200,
      paymentAmount: 0,
      paymentMissing: 1000,
    },
  ],
};

export const expectedWaterCosts: Pick<Invoice, 'waterCosts'> & {
  residentCosts: Record<string, ResidentInvoiceInformation['waterCosts']>;
} = {
  waterCosts: {
    waterUsageCostPerCubicMeter,
    sewageCostPerCubicMeter,
    totalMonthlyDeductions: 0,
  },
  residentCosts: {
    [standardResident.id]: {
      lastWaterMeterCount: 1000,
      currentWaterMeterCount: 1300,
      waterUsage: 300,
      waterUsageCosts: 600,
      sewageCosts: 300,
      monthlyDeductionCosts: 0,
    },
    [residentLaterInvoiceStart.id]: {
      lastWaterMeterCount: 2000,
      currentWaterMeterCount: 2000,
      waterUsage: 0,
      waterUsageCosts: 0,
      sewageCosts: 0,
      monthlyDeductionCosts: 0,
    },
  },
};

export const expectedTotalCosts: Record<
string,
ResidentInvoiceInformation['totalCosts']
> = {
  [standardResident.id]: {
    ongoingIncidentalsCosts: 220,
    oneTimeIncidentalsCosts: 550,
    totalIncidentalsDeductionCosts: 1670,
    newIncidentalsDeduction: 557,
    missingRentPayments: 1200,
    waterCosts: 900,
    totalCosts: 2870,
    totalPaidIncidentals: 600,
    totalMissingCosts: 2270,
  },
  [residentLaterInvoiceStart.id]: {
    ongoingIncidentalsCosts: 120,
    oneTimeIncidentalsCosts: 500,
    totalIncidentalsDeductionCosts: 620,
    newIncidentalsDeduction: 310,
    missingRentPayments: 800,
    waterCosts: 0,
    totalCosts: 1420,
    totalPaidIncidentals: 300,
    totalMissingCosts: 1120,
  },
};

export const expectedInvoice: Omit<Invoice, 'id'> = {
  start: invoiceStart,
  end: invoiceEnd,
  newDeductionStart,
  ongoingIncidentalsInformation:
    expectedIncidentalsCosts.ongoingIncidentalsInformation,
  oneTimeIncidentalsInformation:
    expectedIncidentalsCosts.oneTimeIncidentalsInformation,
  residentInformation: {
    [standardResident.id]: getExpectedResidentInformation(standardResident),
    [residentLaterInvoiceStart.id]: getExpectedResidentInformation(
      residentLaterInvoiceStart,
    ),
  },
  waterCosts: expectedWaterCosts.waterCosts,
  property: {
    address: property.address,
  },
  landlord,
};

function getExpectedResidentInformation(
  resident: Resident,
): ResidentInvoiceInformation {
  return {
    residentId: resident.id,
    names: [resident.contractResidents[0].name],
    ongoingIncidentalsCosts:
      expectedIncidentalsCosts.residentInformation[resident.id]
        .ongoingIncidentalsCosts,
    oneTimeIncidentalsCosts:
      expectedIncidentalsCosts.residentInformation[resident.id]
        .oneTimeIncidentalsCosts,
    rentPayments: expectedRentPayments[resident.id],
    waterCosts: expectedWaterCosts.residentCosts[resident.id],
    totalCosts: expectedTotalCosts[resident.id],
  };
}

export const expectedResidentsAfterInvoiceGeneration: Resident[] = [
  {
    ...standardResident,
    rentInformation: [
      ...standardResident.rentInformation
        .slice(0, -2)
        .map((r) => ({ ...r, wasDeductedInInvoice: true })),
      standardResident.rentInformation.at(-2)!,
      {
        ...standardResident.rentInformation.at(-1)!,
        incidentals:
          expectedTotalCosts[standardResident.id].newIncidentalsDeduction,
        wasDeductedInInvoice: false,
      },
    ].reverse(),
    waterMeterReadings: standardResident.waterMeterReadings
      .map((r) => ({
        ...r,
        wasDeductedInInvoice: true,
      }))
      .reverse(),
  },
  {
    ...residentLaterInvoiceStart,
    rentInformation: [
      ...residentLaterInvoiceStart.rentInformation.slice(0, -1).map((r) => ({
        ...r,
        wasDeductedInInvoice: true,
      })),
      residentLaterInvoiceStart.rentInformation.at(-1)!,
      new RentInformationBuilder()
        .withDueDate(new MonthYear(4, 2023))
        .withRent(700)
        .withIncidentals(
          expectedTotalCosts[residentLaterInvoiceStart.id]
            .newIncidentalsDeduction,
        )
        .build(),
    ].reverse(),
    waterMeterReadings: residentLaterInvoiceStart.waterMeterReadings
      .map((r) => ({
        ...r,
        wasDeductedInInvoice: true,
      }))
      .reverse(),
  },
  ...notIncludedResidents,
];
