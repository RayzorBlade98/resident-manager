import { v4 as uuid } from 'uuid';
import { ValidationConstraint } from '../utils/validation/validation_constraints';
import { CurrencyInCents } from '_/utils/currency/currency';
import {
  createValidationFunction,
  ValidationErrorMessages,
} from '_/utils/validation/validation';

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
  name: [ValidationConstraint.NoEmptyString],
  currentPrice: [ValidationConstraint.Currency],
  deductionType: [],
  invoiceInterval: [ValidationConstraint.Month],
});
