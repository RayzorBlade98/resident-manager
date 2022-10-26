import { atom } from 'recoil';
import { defaultIncidentalsState, IncidentalsState } from './incidentals_state';
import { defaultResidentsState, ResidentState } from './resident_state';

export interface SaveState {
  residents: ResidentState;
  incidentals: IncidentalsState;
}

const defaultSaveState: SaveState = {
  residents: defaultResidentsState(),
  incidentals: defaultIncidentalsState(),
};

export const saveState = atom<SaveState>({
  key: 'saveState',
  default: defaultSaveState,
});

export default saveState;
