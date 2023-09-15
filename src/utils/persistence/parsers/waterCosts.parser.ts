import StandardParser from './parser';
import MonthYear from '_/extensions/date/month_year.extension';

/**
 * Parser for `WaterCosts` objects
 */
abstract class WaterCostsParser extends StandardParser {
  // eslint-disable-next-line max-len
  public static reviver(
    this: void,
    key: string,
    value: string,
  ): string | MonthYear {
    if (key === 'date') {
      return MonthYear.fromString(value);
    }
    return value;
  }
}

export default WaterCostsParser;
