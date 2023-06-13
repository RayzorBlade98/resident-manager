/**
 * Information of a single water meter reading
 */
interface WaterMeterReading {
  /**
   * Date the water count was read
   */
  readingDate: Date;

  /**
   * Count of the water meter
   */
  waterMeterCount: number;
}

export default WaterMeterReading;
