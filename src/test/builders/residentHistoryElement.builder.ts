import MonthYear from '_/extensions/date/month_year.extension';
import { ContractResident } from '_/models/resident/contractResident';
import { ResidentHistoryElement } from '_/models/resident/history';

class ResidentHistoryElementBuilder {
  private history: ResidentHistoryElement = {
    invalidSince: new MonthYear(),
  };

  public withInvalidSince(
    invalidSince: MonthYear,
  ): ResidentHistoryElementBuilder {
    this.history.invalidSince = invalidSince;
    return this;
  }

  public addContractResident(
    resident: ContractResident,
  ): ResidentHistoryElementBuilder {
    if (!this.history.contractResidents) {
      this.history.contractResidents = [];
    }
    this.history.contractResidents.push(resident);
    return this;
  }

  public withKeys(
    keys: Partial<ResidentHistoryElement['keys']>,
  ): ResidentHistoryElementBuilder {
    this.history.keys = {
      ...this.history.keys,
      ...keys,
    };
    return this;
  }

  public withNumberOfResidents(
    residents: number,
  ): ResidentHistoryElementBuilder {
    this.history.numberOfResidents = residents;
    return this;
  }

  public withParkingSpace(
    parkingSpaceId: string | null,
  ): ResidentHistoryElementBuilder {
    this.history.parkingSpaceId = parkingSpaceId;
    return this;
  }

  public build(): ResidentHistoryElement {
    return this.history;
  }
}

export default ResidentHistoryElementBuilder;
