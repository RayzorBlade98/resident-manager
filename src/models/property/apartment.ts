/**
 * Object containing information about an apartment of a property
 */
interface Apartment {
  /**
   * Floor in which the apartment is located
   */
  floor: string;

  /**
   * Location of the aparment on its floor
   */
  location: string;

  /**
   * List of all rooms of the apartment
   */
  rooms: Room[];
}

/**
 * Object containing information about a type of room inside an apartment
 */
interface Room {
  /**
   * Name of the room type
   */
  name: string;

  /**
   * Number of rooms of this type that are contained in the apartment
   */
  quantity: number;
}

export default Apartment;
