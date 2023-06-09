import { setRecoil } from 'recoil-nexus';
import incidentalsState from './incidentals.state';

import { Incidentals } from '_/types/incidentals';

/**
 * Utility class that provides functionality for the incidentals state
 */
export default abstract class IncidentalsStateManager {
  /**
   * Adds new incidentals to the incidentals state
   * @param incidentals new incidentals that should be added
   */
  public static addIncidentals(incidentals: Incidentals): void {
    setRecoil(incidentalsState, (state) => [...state, incidentals]);
  }
}
