/**
 * Object containing information about an address
 */
interface Address {
  /**
   * Zipcode of the city
   */
  zipCode: number;

  /**
   * City name
   */
  city: string;

  /**
   * Street name
   */
  street: string;

  /**
   * House number
   */
  houseNumber: number;
}

export default Address;
