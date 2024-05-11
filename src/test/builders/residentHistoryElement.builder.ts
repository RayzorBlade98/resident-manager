import MonthYear from '_/extensions/date/month_year.extension';
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

  public build(): ResidentHistoryElement {
    return this.history;
  }
}

export default ResidentHistoryElementBuilder;
