import _ from 'lodash';
import { AtomEffect } from 'recoil';
import { PropertyState } from './property.state';

/**
 * Effect that sorts the parking space costs in descending order
 */
const sortParkingSpaceCostsEffect: AtomEffect<PropertyState> = ({
  onSet,
  setSelf,
}) => {
  onSet((newValue) => {
    if (!newValue) {
      return;
    }

    const sorted: PropertyState = {
      ...newValue,
      parkingSpaces: newValue.parkingSpaces.map((p) => ({
        ...p,
        costs: [...p.costs].sort((a, b) => b.date.getTime() - a.date.getTime()),
      })),
    };

    if (!_.isEqual(newValue, sorted)) {
      setSelf(sorted);
    }
  });
};

export default sortParkingSpaceCostsEffect;
