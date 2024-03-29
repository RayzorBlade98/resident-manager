import { v4 as uuid } from 'uuid';
import NameBuilder from './name.builder';
import MonthYear from '_/extensions/date/month_year.extension';
import Name from '_/models/name';
import { RentInformation } from '_/models/resident/rent';
import { Resident } from '_/models/resident/resident';
import WaterMeterReading from '_/models/resident/water_meter_reading';

class ResidentBuilder {
  private resident: Resident;

  constructor() {
    this.resident = {
      id: uuid(),
      name: new NameBuilder().build(),
      numberOfResidents: 2,
      rentInformation: [],
      contractStart: new MonthYear(2, 2023),
      waterMeterReadings: [],
    };
  }

  public withId(id: string): ResidentBuilder {
    this.resident.id = id;
    return this;
  }

  public withName(name: Name): ResidentBuilder {
    this.resident.name = name;
    return this;
  }

  public withContractStart(start: MonthYear): ResidentBuilder {
    this.resident.contractStart = start;
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

  public withConditionalSetup(
    condition: boolean,
    setup: (rb: ResidentBuilder) => void,
  ): ResidentBuilder {
    if (condition) {
      setup(this);
    }
    return this;
  }

  public addMultiple<T>(
    args: T[],
    adder: (builder: ResidentBuilder, args: T) => void,
  ): ResidentBuilder {
    for (const arg of args) {
      adder(this, arg);
    }
    return this;
  }

  public build(): Resident {
    return this.resident;
  }
}

export default ResidentBuilder;
