import { atom } from 'recoil';
import {
  sortDocumentsEffect,
  sortHistoryEffect,
  sortRentInformationEffect,
  sortWaterMeterReadingsEffect,
} from './resident.state.effects';
import { Resident } from '_/models/resident/resident';

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
  effects: [
    sortRentInformationEffect,
    sortWaterMeterReadingsEffect,
    sortHistoryEffect,
    sortDocumentsEffect,
  ],
});

export default residentState;
