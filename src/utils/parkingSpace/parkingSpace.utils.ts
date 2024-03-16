/* eslint-disable import/prefer-default-export */

import { CurrencyInCents } from '../currency/currency.utils';
import MonthYear from '_/extensions/date/month_year.extension';
import ParkingSpace from '_/models/property/parkingSpace';

/**
 * Returns the cost for the parking space for a specified month
 * @param parkingSpace parking space for which the costs should be determined
 * @param date moth for which the cost should be determined
 * @returns cost of the parking space for the given month
 */
export function getCostForParkingSpace(
  parkingSpace: ParkingSpace,
  date: MonthYear,
): CurrencyInCents {
  const cost = parkingSpace.costs.find((c) => c.date <= date);

  if (!cost) {
    throw new Error(`There is no parking space cost for date ${date}`);
  }

  return cost.cost;
}
