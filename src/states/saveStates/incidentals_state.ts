import { selector } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import saveState, { SaveState } from './save_state';
import { Incidentals } from 'src/types/incidentals';

export interface IncidentalsState {
  mandatoryIncidentals: Incidentals[];
}

export const incidentalsState = selector<IncidentalsState>({
  key: 'incidentalsState',
  get: ({ get }) => {
    const state = get(saveState);
    return state.incidentals;
  },
});

export function addIncidentals(incidentals: Incidentals): void {
  setRecoil(saveState, (state: SaveState) => ({
    ...state,
    incidentals: {
      ...state.incidentals,
      mandatoryIncidentals: [
        ...state.incidentals.mandatoryIncidentals,
        incidentals,
      ],
    },
  }));
}

export default IncidentalsState;
