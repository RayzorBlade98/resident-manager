import { selector } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import saveState, { SaveState } from './save_state';
import { MonthYear, MonthYearUtils } from '_/types/date';
import { RentInformation } from '_/types/rent';
import { Resident } from '_/types/resident';

/**
 * The resident state is a list of all residents
 */
export type ResidentState = Resident[];

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
 * Class that provides utility functions to manage the resident state
 */
export abstract class ResidentStateManager {
  /**
   * Adds a new resident to the resident state
   * @param resident new resident that should be added
   */
  public static addResident(resident: Resident): void {
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
  public static updateResident(
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
  public static updateRentInformation(
    residentId: string,
    dueDate: MonthYear,
    update: Partial<RentInformation>,
  ): void {
    const rentInformation = [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...getRecoil(residentState).find((r: Resident) => residentId === r.id)!
        .rent,
    ];
    // eslint-disable-next-line max-len
    const rentIndex = rentInformation.findIndex((r: RentInformation) => MonthYearUtils.areEqual(r.dueDate, dueDate));
    rentInformation[rentIndex] = {
      ...rentInformation[rentIndex],
      ...update,
    };

    ResidentStateManager.updateResident(residentId, { rent: rentInformation });
  }
}

export default residentState;
