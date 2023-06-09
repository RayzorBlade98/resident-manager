import { atom } from 'recoil';
import { Incidentals } from 'src/types/incidentals';

/**
 * List of all incidentals
 */
export type IncidentalsState = Incidentals[];

/**
 * Incidentals recoil state
 */
const incidentalsState = atom<IncidentalsState>({
  key: 'incidentalsState',
  default: [],
});

export default incidentalsState;
