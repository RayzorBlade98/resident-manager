import { v4 as uuid } from 'uuid';
import MonthYear from '_/extensions/date/month_year.extension';
import { ContractResident } from '_/models/resident/contractResident';
import { RentInformation } from '_/models/resident/rent';
import { Resident } from '_/models/resident/resident';
import WaterMeterReading from '_/models/resident/water_meter_reading';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

class ResidentBuilder {
  private resident: Resident;

  constructor() {
    this.resident = {
      id: uuid(),
      contractResidents: [],
      numberOfResidents: 2,
      rentInformation: [],
      contractStart: new MonthYear(2, 2023),
      waterMeterReadings: [],
      apartmentId: '',
      parkingSpaceId: undefined,
      rentDeposit: 0,
      keys: {
        apartment: 1,
        basement: 1,
        attic: 1,
        frontDoor: 1,
        mailbox: 1,
      },
      history: [],
    };
  }

  public withId(id: string): ResidentBuilder {
    this.resident.id = id;
    return this;
  }

  public addContractResident(resident: ContractResident): ResidentBuilder {
    this.resident.contractResidents.push(resident);
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

  public withApartment(apartmentId: string): ResidentBuilder {
    this.resident.apartmentId = apartmentId;
    return this;
  }

  public withParkingSpace(parkingSpaceId: string): ResidentBuilder {
    this.resident.parkingSpaceId = parkingSpaceId;
    return this;
  }

  public withKeys(keys: Partial<Resident['keys']>): ResidentBuilder {
    this.resident.keys = {
      ...this.resident.keys,
      ...keys,
    };
    return this;
  }

  public withRentDeposit(rentDeposit: CurrencyInCents): ResidentBuilder {
    this.resident.rentDeposit = rentDeposit;
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
