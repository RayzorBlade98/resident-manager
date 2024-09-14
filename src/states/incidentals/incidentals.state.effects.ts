import _ from 'lodash';
import { AtomEffect } from 'recoil';
import { IncidentalsState } from './incidentals.state';

/**
 * Effect that sorts the cost of the ongoing incidentals by date in descending order
 */
export const sortOngoingIncidentalsCostEffect: AtomEffect<IncidentalsState> = ({
  onSet,
  setSelf,
}) => {
  onSet((newValue) => {
    const sorted = {
      ...newValue,
      ongoingIncidentals: newValue.ongoingIncidentals.map((i) => ({
        ...i,
        costs: [...i.costs].sort(
          (a, b) => b.dueDate.getTime() - a.dueDate.getTime(),
        ),
      })),
    };
    if (!_.isEqual(newValue, sorted)) {
      setSelf(sorted);
    }
  });
};

/**
 * Effect that sorts the one time incidentals by billing date in descending order
 */
export const sortOneTimeIncidentalsEffect: AtomEffect<IncidentalsState> = ({
  onSet,
  setSelf,
}) => {
  onSet((newValue) => {
    const sorted = {
      ...newValue,
      oneTimeIncidentals: [...newValue.oneTimeIncidentals].sort(
        (a, b) => b.billingDate.getTime() - a.billingDate.getTime(),
      ),
    };
    if (!_.isEqual(newValue, sorted)) {
      setSelf(sorted);
    }
  });
};
