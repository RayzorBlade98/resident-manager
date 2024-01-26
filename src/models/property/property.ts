import Address from '../address';
import Apartment from './apartment';

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
   * List of all apartments that are in the property
   */
  apartments: Apartment[];
}

export default Property;
