import { getRecoil, setRecoil } from 'recoil-nexus';
import residentState from './resident.state';
import MonthYear from '_/extensions/date/month_year.extension';
import { RentInformation } from '_/models/resident/rent';
import { Resident } from '_/models/resident/resident';

/**
 * Class that provides utility functions to manage the resident state
 */

export default abstract class ResidentStateManager {
  /**
   * Adds a new resident to the resident state
   * @param resident new resident that should be added
   */
  public static addResident(resident: Resident): void {
    setRecoil(residentState, (state) => [...state, resident]);
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
    setRecoil(residentState, (state) => {
      const newResidentState = [...state];
      const residentIndex = newResidentState.findIndex(
        (r: Resident) => residentId === r.id,
      );
      newResidentState[residentIndex] = {
        ...newResidentState[residentIndex],
        ...update,
      };
      return newResidentState;
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
        .rentInformation,
    ];
    // eslint-disable-next-line max-len
    const rentIndex = rentInformation.findIndex((r: RentInformation) => dueDate.equals(r.dueDate));
    rentInformation[rentIndex] = {
      ...rentInformation[rentIndex],
      ...update,
    };

    ResidentStateManager.updateResident(residentId, {
      rentInformation,
    });
  }
}
