/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */

import StandardParser from '../parser';
import MonthYear from '_/extensions/date/month_year.extension';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';

/**
 * Parser for `Incidentals` objects
 */
abstract class IncidentalsParser extends StandardParser {
  // eslint-disable-next-line max-len
  public static reviver(
    this: void,
    key: string,
    value: any,
  ):
    | OneTimeIncidentals[keyof OneTimeIncidentals]
    | OngoingIncidentals[keyof OngoingIncidentals] {
    if (['paymentDate', 'billingDate'].includes(key)) {
      return new Date(value);
    }
    if (key === 'costs') {
      return value.map((v: any) => ({
        ...v,
        date: MonthYear.fromString(v.date),
      }));
    }
    return value;
  }
}

export default IncidentalsParser;
