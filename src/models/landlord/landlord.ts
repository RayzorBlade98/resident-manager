import Address from '../address';
import Name from '../name';

/**
 * Object containing information about the landlord
 */
interface Landlord {
  /**
   * Company or joint that functions as landlord
   */
  company?: string;

  /**
   * Name of the company representative or the landlord
   */
  representative: Name;

  /**
   * Address of the landlord
   */
  address: Address;

  /**
   * Banking account information of the landlord
   */
  bankAccount: {
    /**
     * Holder of the banking account
     */
    holder: string;

    /**
     * IBAN of the banking account
     */
    iban: string;
  };
}

export default Landlord;
