import Address from '../address';
import Name from '../name';

/**
 * Object containing information about a resident that is included in the contract
 */
export interface ContractResident {
  /**
   * Name of the resident
   */
  name: Name;

  /**
   * Old address of the resident
   */
  oldAddress: Address;

  /**
   * Phone number of the resident
   */
  phone: string | undefined;

  /**
   * Email of the resident
   */
  email: string | undefined;
}
