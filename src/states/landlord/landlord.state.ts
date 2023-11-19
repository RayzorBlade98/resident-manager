import { atom } from 'recoil';
import Landlord from '_/models/landlord/landlord';

export type LandlordState = Landlord;

/**
 * Landlord state
 */
const landlordState = atom<LandlordState>({
  key: 'landlordState',
  default: undefined,
});

export default landlordState;
