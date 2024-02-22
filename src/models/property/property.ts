import Address from '../address';
import Apartment from './apartment';
import ParkingSpace from './parkingSpace';

/**
 * Object containing information about a property
 */
interface Property {
  /**
   * Number of aparments that get rented in the property
   */
  numberOfApartments: number;

  /**
   * Address of the property
   */
  address: Address;

  /**
   * List of all apartments that are on the property
   */
  apartments: Apartment[];

  /**
   * List of all parking spaces that are on the property
   */
  parkingSpaces: ParkingSpace[];
}

export default Property;
