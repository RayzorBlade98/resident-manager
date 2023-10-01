import {
  ongoingIncidentalsPerApartment,
  ongoingIncidentalsPerResident,
  oneTimeIncidentalsPerApartment,
  oneTimeIncidentalsPerResident,
} from './incidentals';
import {
  invoiceEnd,
  invoiceStart,
  property,
  sewageCostPerCubicMeter,
  waterUsageCostPerCubicMeter,
} from './invoiceInformation';
import { standardResident, residentLaterInvoiceStart } from './residents';
import MonthYear from '_/extensions/date/month_year.extension';
import Invoice from '_/models/invoice/invoice';

export const expectedInvoice: Omit<Invoice, 'id'> = {
  start: invoiceStart,
  end: invoiceEnd,
  ongoingIncidentalsInformation: {
    [ongoingIncidentalsPerApartment.id]: {
      incidentalsId: ongoingIncidentalsPerApartment.id,
      name: ongoingIncidentalsPerApartment.name,
      totalCost: ongoingIncidentalsPerApartment.costs[0].cost,
      deductionType: ongoingIncidentalsPerApartment.deductionType,
    },
    [ongoingIncidentalsPerResident.id]: {
      incidentalsId: ongoingIncidentalsPerResident.id,
      name: ongoingIncidentalsPerResident.name,
      totalCost: ongoingIncidentalsPerResident.costs[0].cost,
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
      residentId: standardResident.id,
      ongoingIncidentalsCosts: {
        [ongoingIncidentalsPerApartment.id]: 20,
        [ongoingIncidentalsPerResident.id]: 200,
      },
      oneTimeIncidentalsCosts: {
        [oneTimeIncidentalsPerApartment.id]:
          oneTimeIncidentalsPerApartment.cost / property.numberOfApartments,
        [oneTimeIncidentalsPerResident.id]:
          oneTimeIncidentalsPerResident.cost / 2,
      },
      rentPayments: [
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
      waterCosts: {
        lastWaterMeterCount: 1000,
        currentWaterMeterCount: 1300,
        waterUsage: 300,
        waterUsageCosts: 600,
        sewageCosts: 300,
      },
    },
    [residentLaterInvoiceStart.id]: {
      residentId: residentLaterInvoiceStart.id,
      ongoingIncidentalsCosts: {
        [ongoingIncidentalsPerApartment.id]: 20,
        [ongoingIncidentalsPerResident.id]: 100,
      },
      oneTimeIncidentalsCosts: {
        [oneTimeIncidentalsPerApartment.id]:
          oneTimeIncidentalsPerApartment.cost / property.numberOfApartments,
        [oneTimeIncidentalsPerResident.id]:
          oneTimeIncidentalsPerResident.cost / 2,
      },
      rentPayments: [
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
      waterCosts: {
        lastWaterMeterCount: 2000,
        currentWaterMeterCount: 2000,
        waterUsage: 0,
        waterUsageCosts: 0,
        sewageCosts: 0,
      },
    },
  },
  waterCosts: {
    waterUsageCostPerCubicMeter,
    sewageCostPerCubicMeter,
  },
};
