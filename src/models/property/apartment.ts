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
   * Number of rooms in the apartment grouped by type
   */
  rooms: {
    /**
     * Number of generic rooms
     */
    generic: number;

    /**
     * Number of kitchens
     */
    kitchen: number;

    /**
     * Number of bathrooms / toilets
     */
    bath: number;

    /**
     * Number of hallways
     */
    hallway: number;

    /**
     * Number of basement rooms
     */
    basement: number;

    /**
     * Number of gardens
     */
    garden: number
  };
}

export default Apartment;
