import MonthYear from '_/extensions/date/month_year.extension';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

export type GenerateRentIncreasePdfArgs = {
  resident: Resident;
  property: Property;
  newRent: CurrencyInCents;
  monthForIncrease: MonthYear;
};
