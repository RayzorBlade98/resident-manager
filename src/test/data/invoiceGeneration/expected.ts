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
  residentInformation: {},
  waterCosts: {
    waterUsageCostPerCubicMeter,
    sewageCostPerCubicMeter,
  },
  landlord,
  property: {
    address: property.address,
  },
};
