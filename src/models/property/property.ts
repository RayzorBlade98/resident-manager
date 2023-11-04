import Address from '../address';

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
  address: Address
}

export default Property;
