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
}

export default Landlord;
