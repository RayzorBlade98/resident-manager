import { atom, selector } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { Incidentals } from '_/types/incidentals';

/**
 * Invoice generation state
 */
export interface InvoiceGenerationState {
  /**
   * List of all selected incidentals
   */
  selectedIncidentals: Incidentals[];
}

/**
 * Invoice generation recoil state
 */
export const invoiceGenerationState = atom<InvoiceGenerationState>({
  key: 'invoiceGenerationState',
  default: {
    selectedIncidentals: [],
  },
});

/**
 * Selector for the selected incidentals
 */
export const selectedInvoiceIncidentalsState = selector<Incidentals[]>({
  key: 'invoiceGenerationState-selectedIncidentals',
  get: ({ get }) => get(invoiceGenerationState).selectedIncidentals,
});

/**
 * Adds new incidentals to the list of selected incidentals
 * @param incidentals incidentals that should be added
 */
export function addSelectedIncidentals(incidentals: Incidentals): void {
  setRecoil(invoiceGenerationState, (state) => ({
    ...state,
    selectedIncidentals: [...state.selectedIncidentals, incidentals],
  }));
}

/**
 * Removes incidentals from the list of selected incidentals
 * @param incidentals incidentals that should be removed
 */
export function removeSelectedIncidentals(incidentals: Incidentals): void {
  setRecoil(invoiceGenerationState, (state) => ({
    ...state,
    selectedIncidentals: state.selectedIncidentals.filter(
      (i) => i.id !== incidentals.id,
    ),
  }));
}

export default invoiceGenerationState;
