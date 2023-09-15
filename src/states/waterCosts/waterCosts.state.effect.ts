import _ from 'lodash';
import { AtomEffect } from 'recoil';
import { WaterCostsState } from './waterCosts.state';

/**
 * Effect that sorts the water costs and sewage costs in descending order
 */
const sortWaterCostsEffect: AtomEffect<WaterCostsState> = ({
  onSet,
  setSelf,
}) => {
  onSet((newValue) => {
    const sorted: WaterCostsState = {
      ...newValue,
      waterUsageCosts: [...newValue.waterUsageCosts].sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      ),
      sewageCosts: [...newValue.sewageCosts].sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      ),
    };
    if (!_.isEqual(newValue, sorted)) {
      setSelf(sorted);
    }
  });
};

export default sortWaterCostsEffect;
