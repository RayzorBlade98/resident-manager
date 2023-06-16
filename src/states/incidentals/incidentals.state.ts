import { atom, selector } from 'recoil';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';

/**
 * List of all incidentals
 */
export interface IncidentalsState {
  ongoingIncidentals: OngoingIncidentals[];
  oneTimeIncidentals: OneTimeIncidentals[];
}

/**
 * Incidentals recoil state
 */
const incidentalsState = atom<IncidentalsState>({
  key: 'incidentalsState',
  default: {
    ongoingIncidentals: [],
    oneTimeIncidentals: [],
  },
});

/**
 * Selector for the ongoing incidentals
 */
export const ongoingIncidentalsSelector = selector<OngoingIncidentals[]>({
  key: 'incidentalsState-ongoingIncidentals',
  get: ({ get }) => get(incidentalsState).ongoingIncidentals,
});

/**
 * Selector for the one-time incidentals
 */
export const oneTimeIncidentalsSelector = selector<OneTimeIncidentals[]>({
  key: 'incidentalsState-oneTimeIncidentals',
  get: ({ get }) => get(incidentalsState).oneTimeIncidentals,
});

export default incidentalsState;
