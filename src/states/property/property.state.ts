import { atom } from 'recoil';
import Property from '_/models/property/property';

export type PropertyState = Property;

/**
 * Property state
 */
const propertyState = atom<PropertyState>({
  key: 'propertyState',
  default: undefined,
});

export default propertyState;
