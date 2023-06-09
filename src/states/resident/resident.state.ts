import { atom } from 'recoil';
import { Resident } from '_/types/resident';

/**
 * The resident state is a list of all residents
 */
export type ResidentState = Resident[];

/**
 * Resident recoil state
 */
const residentState = atom<ResidentState>({
  key: 'residentState',
  default: [],
});

export default residentState;
