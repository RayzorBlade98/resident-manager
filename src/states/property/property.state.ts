import { atom, selector } from 'recoil';
import Property from '_/models/property/property';

/**
 * Property state
 *
 * Only use this when initializing the state. Otherwise use `property`
 */
export const propertyState = atom<Property | undefined>({
  key: 'propertyState',
  default: undefined,
});

/**
 * Selector for the property
 */
const property = selector<Property>({
  key: 'propertyState-property',
  get: ({ get }) => get(propertyState) as Property,
});

export default property;
