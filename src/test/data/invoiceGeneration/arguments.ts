import {
  includedOneTimeIncidentals,
  includedOngoingIncidentals,
} from './incidentals';
import {
  invoiceEnd,
  invoiceStart,
  property,
  waterCosts,
} from './invoiceInformation';
import { includedResidents, residents } from './residents';

export const invoiceGenerationArgs = {
  start: invoiceStart,
  end: invoiceEnd,
  residents,
  includedOngoingIncidentals,
  includedOneTimeIncidentals,
  property,
  waterCosts,
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
