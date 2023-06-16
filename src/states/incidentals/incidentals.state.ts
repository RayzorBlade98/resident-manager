import { atom, selector } from 'recoil';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';

/**
 * List of all incidentals
 */
export type IncidentalsState = OngoingIncidentals[];

/**
 * Incidentals recoil state
 */
const incidentalsState = atom<IncidentalsState>({
  key: 'incidentalsState',
  default: [],
});

export const ongoingIncidentalsSelector = selector<OngoingIncidentals[]>({
  key: 'incidentalsState-ongoingIncidentals',
  get: ({ get }) => get(incidentalsState),
  set:
    ({ set }) => (newIncidentals: OngoingIncidentals[]) => {
      set(incidentalsState, newIncidentals);
    },
});

export default incidentalsState;
