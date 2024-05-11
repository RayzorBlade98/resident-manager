import _ from 'lodash';
import { AtomEffect } from 'recoil';
import { ResidentState } from './resident.state';

/**
 * Effect that sorts the rent information of the reisdents by due date in descending order
 */
export const sortRentInformationEffect: AtomEffect<ResidentState> = ({
  onSet,
  setSelf,
}) => {
  onSet((newValue) => {
    const sorted = newValue.map((r) => ({
      ...r,
      rentInformation: [...r.rentInformation].sort(
        (a, b) => b.dueDate.getTime() - a.dueDate.getTime(),
      ),
    }));
    if (!_.isEqual(newValue, sorted)) {
      setSelf(sorted);
    }
  });
};

/**
 * Effect that sorts the water readings of the reisdents by reading date in descending order
 */
export const sortWaterMeterReadingsEffect: AtomEffect<ResidentState> = ({
  onSet,
  setSelf,
}) => {
  onSet((newValue) => {
    const sorted = newValue.map((r) => ({
      ...r,
      waterMeterReadings: [...r.waterMeterReadings].sort(
        (a, b) => b.readingDate.getTime() - a.readingDate.getTime(),
      ),
    }));
    if (!_.isEqual(newValue, sorted)) {
      setSelf(sorted);
    }
  });
};

/**
 * Effect that sorts the history of the reisdents by invalidSince date in descending order
 */
export const sortHistoryEffect: AtomEffect<ResidentState> = ({
  onSet,
  setSelf,
}) => {
  onSet((newValue) => {
    const sorted = newValue.map((r) => ({
      ...r,
      history: [...r.history].sort(
        (a, b) => b.invalidSince.getTime() - a.invalidSince.getTime(),
      ),
    }));
    if (!_.isEqual(newValue, sorted)) {
      setSelf(sorted);
    }
  });
};
