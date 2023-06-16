import StandardParser from '../parser';
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
    value: string,
  ):
    | OneTimeIncidentals[keyof OneTimeIncidentals]
    | OngoingIncidentals[keyof OngoingIncidentals] {
    if (['paymentDate', 'billingDate'].includes(key)) {
      return new Date(value);
    }
    return value;
  }
}

export default IncidentalsParser;
