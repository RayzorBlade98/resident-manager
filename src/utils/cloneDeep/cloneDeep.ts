import _ from 'lodash';
import MonthYear from '_/extensions/date/month_year.extension';

/**
 * Creates a deep clone of the provided object.
 * Unlike the lodash `cloneDeep` function it can handle `MonthYear` objects correctly.
 * @param toClone object that should be cloned
 * @returns deep clone of the provided object
 */
export function cloneDeep<T extends object>(toClone: T): T {
  return _.cloneDeepWith(toClone, (value) => {
    if (value instanceof MonthYear) return MonthYear.fromDate(value);
    if (value instanceof Date) return new Date(value);

    return undefined;
  }) as T;
}
