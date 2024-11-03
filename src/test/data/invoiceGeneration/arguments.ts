import {
  invoiceEnd,
  invoiceStart,
  landlord,
  newDeductionStart,
} from './invoiceInformation';
import { oneTimeIncidentals } from './oneTimeIncidentals';
import { ongoingIncidentals } from './ongoingIncidentals';
import { residents } from './residents';
import { InvoiceGenerationArgs } from '_/utils/invoiceGeneration/generateInvoice';

export const invoiceGenerationArgs: InvoiceGenerationArgs = {
  start: invoiceStart,
  end: invoiceEnd,
  newDeductionStart,
  ongoingIncidentals,
  oneTimeIncidentals,
  landlord,
  residents,
};
