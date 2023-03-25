import { atom } from 'recoil';
import { IncidentalsState } from './incidentals_state';
import { InvoiceState } from './invoice_state';
import { ResidentState } from './resident_state';

export interface SaveState {
  residents: ResidentState;
  incidentals: IncidentalsState;
  invoices: InvoiceState;
}

export const saveState = atom<SaveState>({
  key: 'saveState',
  default: {
    residents: [],
    incidentals: {
      mandatoryIncidentals: [],
    },
    invoices: [],
  },
});

export default saveState;
