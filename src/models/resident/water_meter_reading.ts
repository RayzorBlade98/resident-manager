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

  /**
   * Whether the water meter reading was included in an invoice
   */
  wasDeductedInInvoice: boolean;

  /**
   * Document id of the water meter reading
   */
  readingDocumentId?: string;
}

export default WaterMeterReading;
