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
import { residents } from './residents';

export const invoiceGenerationArgs = {
  start: invoiceStart,
  end: invoiceEnd,
  residents,
  includedOngoingIncidentals,
  includedOneTimeIncidentals,
  property,
  waterCosts,
};
