import { selector } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { v4 as uuid } from 'uuid';
import saveState, { SaveState } from './save_state';
import { MonthYear, MonthYearUtils } from '_/types/date';
import { RentInformation } from '_/types/rent';
import { Resident } from '_/types/resident';

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
      rent: [
        {
          dueDate: MonthYearUtils.getCurrentMonthYear(),
          rent: 50000,
          incidentals: 10000,
        },
      ],
      invoiceStart: MonthYearUtils.getCurrentMonthYear(),
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

/**
 * Updates a resident in the state
 * @param residentId Id of the resident that should be updated
 * @param update Fields that should be updated
 */
export function updateResident(
  residentId: string,
  update: Partial<Resident>,
): void {
  setRecoil(saveState, (state: SaveState) => {
    const newResidentState = [...state.residents];
    const residentIndex = newResidentState.findIndex(
      (r: Resident) => residentId === r.id,
    );
    newResidentState[residentIndex] = {
      ...newResidentState[residentIndex],
      ...update,
    };
    return {
      ...state,
      residents: newResidentState,
    };
  });
}

/**
 * Updates a rent information in the state
 * @param residentId Id of the resident for which the rent information should be updated
 * @param dueDate Month and year of the rent information
 * @param update Fields that should be updated
 */
export function updateRentInformation(
  residentId: string,
  dueDate: MonthYear,
  update: Partial<RentInformation>,
): void {
  const rentInformation = [
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...getRecoil(residentState).find((r: Resident) => residentId === r.id)!
      .rent,
  ];
  const rentIndex = rentInformation.findIndex((r: RentInformation) => MonthYearUtils.areEqual(r.dueDate, dueDate)); // eslint-disable-line max-len
  rentInformation[rentIndex] = {
    ...rentInformation[rentIndex],
    ...update,
  };

  updateResident(residentId, { rent: rentInformation });
}

export default residentState;
