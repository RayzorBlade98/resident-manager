import { atom } from 'recoil';
import sortParkingSpaceCostsEffect from './property.state.effect';
import Property from '_/models/property/property';

export type PropertyState = Property;

/**
 * Property state
 */
const propertyState = atom<PropertyState>({
  key: 'propertyState',
  default: undefined,
  effects: [sortParkingSpaceCostsEffect],
});

export default propertyState;
