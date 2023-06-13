import StandardParser from '../parser';
import MonthYear from '_/extensions/date/month_year.extension';
import { Invoice } from '_/models/invoice/invoice';

/**
 * Parser for `Invoice` objects
 */
abstract class InvoiceParser extends StandardParser {
  // eslint-disable-next-line max-len
  public static reviver(
    this: void,
    key: string,
    value: string,
  ): Invoice[keyof Invoice] {
    if (['start', 'end'].includes(key)) {
      return MonthYear.fromString(value);
    }
    return value;
  }
}

export default InvoiceParser;
