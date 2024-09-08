import { atom, selector } from 'recoil';
import {
  sortOneTimeIncidentalsEffect,
  sortOngoingIncidentalsCostEffect,
} from './incidentals.state.effects';
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
  effects: [sortOngoingIncidentalsCostEffect, sortOneTimeIncidentalsEffect],
});

/**
 * Selector for the one time incidentals recoil state
 */
export const oneTimeIncidentalsState = selector({
  key: 'incidentalsState-oneTimeIncidentals',
  get: ({ get }) => get(incidentalsState).oneTimeIncidentals,
  set: ({ set }, newValue) => set(incidentalsState, (state) => ({
    ...state,
    oneTimeIncidentals: newValue as OneTimeIncidentals[],
  })),
});

/**
 * Selector for the ongoing incidentals recoil state
 */
export const ongoingIncidentalsState = selector({
  key: 'incidentalsState-oneTimeIncidentals',
  get: ({ get }) => get(incidentalsState).ongoingIncidentals,
  set: ({ set }, newValue) => set(incidentalsState, (state) => ({
    ...state,
    ongoingIncidentals: newValue as OngoingIncidentals[],
  })),
});

export default incidentalsState;
