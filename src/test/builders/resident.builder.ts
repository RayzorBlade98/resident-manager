import { v4 as uuid } from 'uuid';
import MonthYear from '_/extensions/date/month_year.extension';
import { RentInformation } from '_/models/resident/rent';
import { Resident } from '_/models/resident/resident';
import WaterMeterReading from '_/models/resident/water_meter_reading';

class ResidentBuilder {
  private resident: Resident;

  constructor() {
    this.resident = {
      id: uuid(),
      firstName: 'Max',
      lastName: 'Mustermann',
      numberOfResidents: 2,
      rentInformation: [],
      invoiceStart: new MonthYear(2, 2023),
      waterMeterReadings: [],
    };
  }

  public withFirstName(firstName: string): ResidentBuilder {
    this.resident.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): ResidentBuilder {
    this.resident.lastName = lastName;
    return this;
  }

  public withInvoiceStart(start: MonthYear): ResidentBuilder {
    this.resident.invoiceStart = start;
    return this;
  }

  public withNumberOfResidents(residents: number): ResidentBuilder {
    this.resident.numberOfResidents = residents;
    return this;
  }

  public addRentInformation(rentInformation: RentInformation): ResidentBuilder {
    this.resident.rentInformation.push(rentInformation);
    return this;
  }

  public addWaterMeterReading(reading: WaterMeterReading): ResidentBuilder {
    this.resident.waterMeterReadings.push(reading);
    return this;
  }

  public build(): Resident {
    return this.resident;
  }
}

export default ResidentBuilder;
