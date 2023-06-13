import StandardParser from '../parser';
import MonthYear from '_/extensions/date/month_year.extension';
import { RentInformation } from '_/models/resident/rent';
import { Resident } from '_/models/resident/resident';
import WaterMeterReading from '_/models/resident/water_meter_reading';

type RentInformationInput = Omit<RentInformation, 'dueDate' | 'paymentDate'> & {
  dueDate: string;
  paymentDate: string;
};

type WaterMeterReadingsInput = Omit<WaterMeterReading, 'readingDate'> & {
  readingDate: string;
};

/**
 * Parser for `Resident` objects
 */
abstract class ResidentParser extends StandardParser {
  public static reviver(
    this: void,
    key: string,
    value:
    | Resident[keyof Resident]
    | string
    | RentInformationInput[]
    | WaterMeterReadingsInput[],
  ): Resident[keyof Resident] {
    if (key === 'rentInformation') {
      return (value as RentInformationInput[]).map(
        (rent: RentInformationInput) => ({
          ...rent,
          dueDate: MonthYear.fromString(rent.dueDate),
          paymentDate: rent.paymentDate
            ? new Date(rent.paymentDate)
            : undefined,
        }),
      ) as RentInformation[];
    }

    if (key === 'waterMeterReadings') {
      return (value as WaterMeterReadingsInput[]).map(
        (reading: WaterMeterReadingsInput) => ({
          ...reading,
          readingDate: new Date(reading.readingDate),
        }),
      ) as WaterMeterReading[];
    }

    if (key === 'invoiceStart') {
      return MonthYear.fromString(value as string);
    }

    return value as Resident[keyof Resident];
  }
}

export default ResidentParser;
