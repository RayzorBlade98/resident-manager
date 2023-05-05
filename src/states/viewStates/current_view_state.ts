import { atom } from 'recoil';

export enum View {
  Main,
  Resident,
  Incidentals,
  Invoice,
  InvoiceGeneration,
}

export const currentViewState = atom<View>({
  key: 'currentViewState',
  default: View.Main,
});

export default currentViewState;
