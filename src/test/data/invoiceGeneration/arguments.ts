import { expectedIncidentalsCosts, expectedRentPayments, expectedWaterCosts } from './expected';
import {
  includedOneTimeIncidentals,
  includedOngoingIncidentals,
} from './incidentals';
import {
  invoiceEnd,
  invoiceStart,
  landlord,
  newDeductionStart,
  property,
  waterCosts,
} from './invoiceInformation';
import { includedResidents, residents } from './residents';

export const invoiceGenerationArgs = {
  start: invoiceStart,
  end: invoiceEnd,
  newDeductionStart,
  residents,
  includedOngoingIncidentals,
  includedOneTimeIncidentals,
  property,
  waterCosts,
  landlord,
};

export const incidentalsCalculationArgs = {
  includedOngoingIncidentals,
  includedOneTimeIncidentals,
  invoiceStart,
  invoiceEnd,
  residents: includedResidents,
  property,
};

export const rentPaymentCalculationArgs = {
  invoiceStart,
  invoiceEnd,
  residents: includedResidents,
};

export const waterCostCalculationArgs = {
  invoiceEnd,
  residents: includedResidents,
  waterCosts,
};

export const totalCostCalculationArgs = {
  incidentalsCalculations: expectedIncidentalsCosts,
  waterCostCalculations: expectedWaterCosts,
  rentPayments: expectedRentPayments,
  residents: includedResidents,
};
