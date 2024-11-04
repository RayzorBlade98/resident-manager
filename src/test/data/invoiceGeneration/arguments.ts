import {
  invoiceEnd,
  invoiceStart,
  landlord,
  newDeductionStart,
  property,
} from './invoiceInformation';
import { oneTimeIncidentals } from './oneTimeIncidentals';
import { ongoingIncidentals } from './ongoingIncidentals';
import { residents } from './residents';
import { waterCosts } from './waterCosts';
import { InvoiceGenerationArgs } from '_/utils/invoiceGeneration/generateInvoice';

export const invoiceGenerationArgs: InvoiceGenerationArgs = {
  start: invoiceStart,
  end: invoiceEnd,
  newDeductionStart,
  ongoingIncidentals,
  oneTimeIncidentals,
  waterCosts,
  property,
  landlord,
  residents,
};
