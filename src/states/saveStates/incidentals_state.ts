import { atom } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { Incidentals } from 'src/types/incidentals';

/**
 * List of all incidentals
 */
export type IncidentalsState = Incidentals[];

/**
 * Incidentals recoil state
 */
export const incidentalsState = atom<IncidentalsState>({
  key: 'incidentalsState',
  default: [],
});

export abstract class IncidentalsStateManager {
  /**
   * Adds new incidentals to the incidentals state
   * @param incidentals new incidentals that should be added
   */
  public static addIncidentals(incidentals: Incidentals): void {
    setRecoil(incidentalsState, (state: IncidentalsState) => [
      ...state,
      incidentals,
    ]);
  }
}

export default IncidentalsState;
