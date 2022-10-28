import { atom } from 'recoil';

export enum View {
  Main,
  Resident,
  Incidentals,
}

export const currentViewState = atom<View>({
  key: 'currentViewState',
  default: View.Resident,
});

export default currentViewState;
