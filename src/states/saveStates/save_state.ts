import { atom } from 'recoil';
import { IncidentalsState } from './incidentals_state';
import { ResidentState } from './resident_state';

export interface SaveState {
  residents: ResidentState;
  incidentals: IncidentalsState;
}

export const saveState = atom<SaveState>({
  key: 'saveState',
  default: {
    residents: [],
    incidentals: {
      mandatoryIncidentals: [],
    },
  },
});

export default saveState;
