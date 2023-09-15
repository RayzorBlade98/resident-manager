import { atom } from 'recoil';
import sortWaterCostsEffect from './waterCosts.state.effect';
import WaterCosts from '_/models/incidentals/WaterCosts';

export type WaterCostsState = WaterCosts;

/**
 * Water costs recoil state
 */
const waterCostsState = atom<WaterCostsState>({
  key: 'waterCostsState',
  default: {
    waterUsageCosts: [],
    sewageCosts: [],
  },
  effects: [sortWaterCostsEffect],
});

export default waterCostsState;
