import {
  invoiceEnd,
  invoiceStart,
  landlord,
  newDeductionStart,
} from './invoiceInformation';
import { property } from './property';
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
      totalCost: 180,
    },
    resident: {
      incidentalsId: 'resident',
      name: 'Ongoing Incidentals per Resident',
      deductionType: DeductionType.PerResident,
      totalCost: 300,
    },
  },
  oneTimeIncidentalsInformation: {
    apartment: {
      incidentalsId: 'apartment',
      name: 'OneTime Incidentals per Apartment',
      deductionType: DeductionType.PerApartment,
      totalCost: 120,
    },
    resident: {
      incidentalsId: 'resident',
      name: 'OneTime Incidentals per Resident',
      deductionType: DeductionType.PerResident,
      totalCost: 180,
    },
  },
  waterCosts: {
    waterUsageCostPerCubicMeter: 3,
    sewageCostPerCubicMeter: 2,
    totalMonthlyDeductions: 600,
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
      ongoingIncidentalsCosts: {
        apartment: 45,
        resident: 105,
      },
      oneTimeIncidentalsCosts: {
        apartment: 30,
        resident: 63,
      },
      individualIncidentalsCosts: {
        Stellplatz: 40,
      },
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
        lastWaterMeterCount: 10000,
        currentWaterMeterCount: 10030,
        waterUsage: 30,
        waterUsageCosts: 90,
        sewageCosts: 60,
        monthlyDeductionCosts: 150,
      },
      totalCosts: {
        ongoingIncidentalsCosts: 150,
        oneTimeIncidentalsCosts: 93,
        individualIncidentalsCosts: 40,
        waterCosts: 300,
        totalIncidentalsCosts: 583,
        missingRentPayments: -5,
        totalCosts: 578,
        totalPaidIncidentals: 25,
        totalMissingCosts: 553,
        newIncidentalsDeduction: 195,
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
      ongoingIncidentalsCosts: {
        apartment: 45,
        resident: 65,
      },
      oneTimeIncidentalsCosts: {
        apartment: 30,
        resident: 39,
      },
      individualIncidentalsCosts: {},
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
        lastWaterMeterCount: 20000,
        currentWaterMeterCount: 20050,
        waterUsage: 50,
        waterUsageCosts: 150,
        sewageCosts: 100,
        monthlyDeductionCosts: 150,
      },
      totalCosts: {
        ongoingIncidentalsCosts: 110,
        oneTimeIncidentalsCosts: 69,
        individualIncidentalsCosts: 0,
        waterCosts: 400,
        totalIncidentalsCosts: 579,
        missingRentPayments: 15,
        totalCosts: 594,
        totalPaidIncidentals: 45,
        totalMissingCosts: 549,
        newIncidentalsDeduction: 193,
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
      ongoingIncidentalsCosts: {
        apartment: 30,
        resident: 40,
      },
      oneTimeIncidentalsCosts: {
        apartment: 20,
        resident: 24,
      },
      individualIncidentalsCosts: {
        Stellplatz: 20,
      },
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
        lastWaterMeterCount: 30000,
        currentWaterMeterCount: 30010,
        waterUsage: 10,
        waterUsageCosts: 30,
        sewageCosts: 20,
        monthlyDeductionCosts: 100,
      },
      totalCosts: {
        ongoingIncidentalsCosts: 70,
        oneTimeIncidentalsCosts: 44,
        individualIncidentalsCosts: 20,
        waterCosts: 150,
        totalIncidentalsCosts: 284,
        missingRentPayments: 0,
        totalCosts: 284,
        totalPaidIncidentals: 90,
        totalMissingCosts: 194,
        newIncidentalsDeduction: 142,
      },
    },
  },
  landlord,
  property: {
    address: property.address,
  },
};
