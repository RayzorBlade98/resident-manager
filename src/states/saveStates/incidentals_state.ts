import { selector } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { v4 as uuid } from 'uuid';
import saveState, { SaveState } from './save_state';
import { DeductionType, Incidentals } from '_/types/incidentals';

export interface IncidentalsState {
  mandatoryIncidentals: Incidentals[];
}

export function defaultIncidentalsState(): IncidentalsState {
  /*
  return {
    mandatoryIncidentals []
  };
  */
  const dummyIncidentals: Incidentals[] = [];
  for (let i = 0; i < 8; i += 1) {
    dummyIncidentals.push({
      id: uuid(),
      name: 'Nebenkosten',
      deductionType: DeductionType.PerResident,
      currentPrice: 10000,
      invoiceInterval: 12,
    });
  }
  return {
    mandatoryIncidentals: dummyIncidentals,
  };
}

export const incidentalsState = selector<IncidentalsState>({
  key: 'incidentalsState',
  get: ({ get }) => {
    const state = get(saveState);
    return state.incidentals;
  },
});

export function addIncidentals(incidentals: Incidentals): void {
  setRecoil(saveState, (state: SaveState) => ({
    ...state,
    incidentals: {
      ...state.incidentals,
      mandatoryIncidentals: [
        ...state.incidentals.mandatoryIncidentals,
        incidentals,
      ],
    },
  }));
}

export default IncidentalsState;
