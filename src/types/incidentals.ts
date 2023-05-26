import { v4 as uuid } from 'uuid';
import { CurrencyInCents } from '_/utils/currency';
import {
  createValidationFunction,
  ValidationConstraint,
  ValidationErrorMessages,
} from '_/utils/validation';

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

export interface CreateIncidentalsArguments {
  name: string;
  currentPrice: number | null;
  deductionType: DeductionType;
  invoiceInterval: number | null;
}

export type CreateIncidentalsErrors =
  ValidationErrorMessages<CreateIncidentalsArguments>;

export function createIncidentals(
  args: CreateIncidentalsArguments,
): Incidentals {
  return {
    id: uuid(),
    ...args,
    currentPrice: args.currentPrice as number,
    invoiceInterval: args.invoiceInterval as number,
  };
}

// eslint-disable-next-line max-len
export const validateIncidentalsArgs = createValidationFunction<CreateIncidentalsArguments>({
  name: [ValidationConstraint.NotEmptyString],
  currentPrice: [
    ValidationConstraint.NotNull,
    ValidationConstraint.GreaterThanZero,
  ],
  deductionType: [],
  invoiceInterval: [
    ValidationConstraint.NotNull,
    ValidationConstraint.Integer,
    ValidationConstraint.Month,
  ],
});
