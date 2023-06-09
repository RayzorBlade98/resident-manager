import { atom, selector } from 'recoil';
import residentState from '_/states/resident/resident.state';
import { Resident } from '_/types/resident';

/**
 * Resident view state
 */
export interface ResidentViewState {
  /**
   * Currently elected resident
   */
  selectedResident?: string;
}

/**
 * Resident view recoil state
 */
const residentViewState = atom<ResidentViewState>({
  key: 'residentViewState',
  default: {
    selectedResident: undefined,
  },
});

/**
 *
 */
export const residentViewSelectedResidentState = selector<Resident | undefined>(
  {
    key: 'residentViewState-selectedResident',
    get: ({ get }) => get(residentState).find(
      (r) => r.id === get(residentViewState).selectedResident,
    ),
    set: ({ set }, resident) => set(residentViewState, (state) => ({
      ...state,
      selectedResident: (resident as Resident).id,
    })),
  },
);

export default residentViewState;
