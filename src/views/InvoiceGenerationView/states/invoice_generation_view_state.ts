import { atom, selector } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { Incidentals } from '_/models/incidentals/incidentals';

/**
 * Invoice generation state
 */
export interface InvoiceGenerationViewState {
  /**
   * List of all selected incidentals
   */
  selectedIncidentals: Incidentals[];
}

/**
 * Invoice generation recoil state
 */
export const invoiceGenerationViewState = atom<InvoiceGenerationViewState>({
  key: 'invoiceGenerationViewState',
  default: {
    selectedIncidentals: [],
  },
});

/**
 * Selector for the selected incidentals
 */
export const selectedInvoiceIncidentalsState = selector<Incidentals[]>({
  key: 'invoiceGenerationState-selectedIncidentals',
  get: ({ get }) => get(invoiceGenerationViewState).selectedIncidentals,
});

/**
 * Adds new incidentals to the list of selected incidentals
 * @param incidentals incidentals that should be added
 */
export function addSelectedIncidentals(incidentals: Incidentals): void {
  setRecoil(invoiceGenerationViewState, (state) => ({
    ...state,
    selectedIncidentals: [...state.selectedIncidentals, incidentals],
  }));
}

/**
 * Removes incidentals from the list of selected incidentals
 * @param incidentals incidentals that should be removed
 */
export function removeSelectedIncidentals(incidentals: Incidentals): void {
  setRecoil(invoiceGenerationViewState, (state) => ({
    ...state,
    selectedIncidentals: state.selectedIncidentals.filter(
      (i) => i.id !== incidentals.id,
    ),
  }));
}

export default invoiceGenerationViewState;
