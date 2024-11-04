import {
  invoiceEnd,
  invoiceStart,
  landlord,
  newDeductionStart,
  property,
  sewageCostPerCubicMeter,
  waterUsageCostPerCubicMeter,
} from './invoiceInformation';
import { DeductionType } from '_/models/incidentals/deduction_type';
import Invoice from '_/models/invoice/invoice';
import { Salutation } from '_/models/name';

export const expectedInvoice: Omit<Invoice, 'id'> = {
  start: invoiceStart,
  end: invoiceEnd,
  newDeductionStart,
  ongoingIncidentalsInformation: {
    apartment: {
      incidentalsId: 'apartment',
      name: 'Ongoing Incidentals per Apartment',
      deductionType: DeductionType.PerApartment,
      totalCost: 150,
    },
    resident: {
      incidentalsId: 'resident',
      name: 'Ongoing Incidentals per Resident',
      deductionType: DeductionType.PerResident,
      totalCost: 100,
    },
  },
  oneTimeIncidentalsInformation: {
    apartment: {
      incidentalsId: 'apartment',
      name: 'OneTime Incidentals per Apartment',
      deductionType: DeductionType.PerApartment,
      totalCost: 100,
    },
    resident: {
      incidentalsId: 'resident',
      name: 'OneTime Incidentals per Resident',
      deductionType: DeductionType.PerResident,
      totalCost: 200,
    },
  },
  residentInformation: {
    resident1: {
      residentId: 'resident1',
      names: [
        {
          salutation: Salutation.Male,
          firstName: 'Max 1',
          lastName: 'Mustermann 1',
        },
        {
          salutation: Salutation.Female,
          firstName: 'Maxine 1',
          lastName: 'Musterfrau 1',
        },
      ],
      ongoingIncidentalsCosts: {},
      oneTimeIncidentalsCosts: {},
      rentPayments: [
        {
          dueDate: invoiceEnd,
          rent: 100,
          incidentals: 10,
          paymentAmount: 110,
          paymentMissing: 0,
        },
        {
          dueDate: invoiceStart.addMonths(1),
          rent: 90,
          incidentals: 5,
          paymentAmount: 90,
          paymentMissing: 5,
        },
        {
          dueDate: invoiceStart,
          rent: 75,
          incidentals: 10,
          paymentAmount: 95,
          paymentMissing: -10,
        },
      ],
      waterCosts: {
        lastWaterMeterCount: -1,
        currentWaterMeterCount: -1,
        waterUsage: -1,
        waterUsageCosts: -1,
        sewageCosts: -1,
      },
      totalCosts: {
        ongoingIncidentalsCosts: -1,
        oneTimeIncidentalsCosts: -1,
        waterCosts: -1,
        totalIncidentalsDeductionCosts: -1,
        missingRentPayments: -5,
        totalCosts: -1,
        totalPaidIncidentals: -1,
        totalMissingCosts: -1,
        newIncidentalsDeduction: -1,
      },
    },
    resident2: {
      residentId: 'resident2',
      names: [
        {
          salutation: Salutation.Male,
          firstName: 'Max 2',
          lastName: 'Mustermann 2',
        },
      ],
      ongoingIncidentalsCosts: {},
      oneTimeIncidentalsCosts: {},
      rentPayments: [
        {
          dueDate: invoiceEnd,
          rent: 85,
          incidentals: 15,
          paymentAmount: 100,
          paymentMissing: 0,
        },
        {
          dueDate: invoiceStart.addMonths(1),
          rent: 100,
          incidentals: 10,
          paymentAmount: 100,
          paymentMissing: 10,
        },
        {
          dueDate: invoiceStart,
          rent: 90,
          incidentals: 20,
          paymentAmount: 105,
          paymentMissing: 5,
        },
      ],
      waterCosts: {
        lastWaterMeterCount: -1,
        currentWaterMeterCount: -1,
        waterUsage: -1,
        waterUsageCosts: -1,
        sewageCosts: -1,
      },
      totalCosts: {
        ongoingIncidentalsCosts: -1,
        oneTimeIncidentalsCosts: -1,
        waterCosts: -1,
        totalIncidentalsDeductionCosts: -1,
        missingRentPayments: 15,
        totalCosts: -1,
        totalPaidIncidentals: -1,
        totalMissingCosts: -1,
        newIncidentalsDeduction: -1,
      },
    },
    residentPartial: {
      residentId: 'residentPartial',
      names: [
        {
          salutation: Salutation.Male,
          firstName: 'Max 3',
          lastName: 'Mustermann 3',
        },
      ],
      ongoingIncidentalsCosts: {},
      oneTimeIncidentalsCosts: {},
      rentPayments: [
        {
          dueDate: invoiceEnd,
          rent: 100,
          incidentals: 50,
          paymentAmount: 290,
          paymentMissing: -140,
        },
        {
          dueDate: invoiceStart.addMonths(1),
          rent: 100,
          incidentals: 40,
          paymentAmount: 0,
          paymentMissing: 140,
        },
      ],
      waterCosts: {
        lastWaterMeterCount: -1,
        currentWaterMeterCount: -1,
        waterUsage: -1,
        waterUsageCosts: -1,
        sewageCosts: -1,
      },
      totalCosts: {
        ongoingIncidentalsCosts: -1,
        oneTimeIncidentalsCosts: -1,
        waterCosts: -1,
        totalIncidentalsDeductionCosts: -1,
        missingRentPayments: 0,
        totalCosts: -1,
        totalPaidIncidentals: -1,
        totalMissingCosts: -1,
        newIncidentalsDeduction: -1,
      },
    },
  },
  waterCosts: {
    waterUsageCostPerCubicMeter,
    sewageCostPerCubicMeter,
    totalMonthlyDeductions: -1,
  },
  landlord,
  property: {
    address: property.address,
  },
};
