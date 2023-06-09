import { CurrencyInCents } from '_/utils/currency/currency.utils';

export enum DeductionType {
  PerResident = 'Pro Bewohner',
  PerApartment = 'Pro Wohnung',
}

export interface Incidentals {
  id: string;
  name: string;
  currentPrice: CurrencyInCents;
  deductionType: DeductionType;
  invoiceInterval: number; // in months
}
