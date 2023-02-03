import { selector } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { v4 as uuid } from 'uuid';
import saveState, { SaveState } from './save_state';
import { Resident } from '_/types/resident';
import { getCurrentMonthYear } from '_/types/date';

/**
 * The resident state is a list of all residents
 */
export type ResidentState = Resident[];

export function defaultResidentsState(): ResidentState {
  // return [];
  const dummyResidents: ResidentState = [];
  for (let i = 0; i < 8; i += 1) {
    dummyResidents.push({
      id: uuid(),
      firstName: 'Max',
      lastName: 'Mustermann',
      rent: 50000,
      invoiceStart: getCurrentMonthYear(),
    });
  }
  return dummyResidents;
}

/**
 * Selector for the resident state
 */
export const residentState = selector<ResidentState>({
  key: 'residentState',
  get: ({ get }) => {
    const state = get(saveState);
    return state.residents;
  },
});

/**
 * Adds a new resident to the resident state
 * @param resident new resident that should be added
 */
export function addResident(resident: Resident): void {
  setRecoil(saveState, (state: SaveState) => ({
    ...state,
    residents: [...state.residents, resident],
  }));
}

export default residentState;
