/**
 * Object containing information about an apartment of a property
 */
interface Apartment {
  /**
   * Unique id of the apartment
   */
  id: string;

  /**
   * Floor in which the apartment is located
   */
  floor: string;

  /**
   * Location of the aparment on its floor
   */
  location: string;

  /**
   * Number of rooms in the apartment (excluding bath, kitchen etc.)
   */
  rooms: number;
}

export default Apartment;
