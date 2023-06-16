import { setRecoil } from 'recoil-nexus';
import incidentalsState from './incidentals.state';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';

/**
 * Utility class that provides functionality for the incidentals state
 */
export default abstract class IncidentalsStateManager {
  /**
   * Adds new ongoing incidentals to the incidentals state
   * @param incidentals new incidentals that should be added
   */
  public static addOngoingIncidentals(incidentals: OngoingIncidentals): void {
    setRecoil(incidentalsState, (state) => ({
      ...state,
      ongoingIncidentals: [...state.ongoingIncidentals, incidentals],
    }));
  }

  /**
   * Adds new ongoing incidentals to the incidentals state
   * @param incidentals new incidentals that should be added
   */
  public static addOneTimeIncidentals(incidentals: OneTimeIncidentals): void {
    setRecoil(incidentalsState, (state) => ({
      ...state,
      oneTimeIncidentals: [...state.oneTimeIncidentals, incidentals],
    }));
  }
}
