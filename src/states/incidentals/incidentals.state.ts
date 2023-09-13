import { atom } from 'recoil';
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

export default incidentalsState;
