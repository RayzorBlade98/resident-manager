import { v4 as uuid } from 'uuid';
import {
  createValidationFunction,
  ValidationError,
  ValidationErrorMessages,
} from '../utils/validation';
import { CurrencyInCents } from '_/utils/currency';

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  rent: CurrencyInCents;
}

export interface CreateResidentArguments {
  firstName: string;
  lastName: string;
  rent: CurrencyInCents | null;
}

export type CreateResidentErrors =
  ValidationErrorMessages<CreateResidentArguments>;

export function createResident(args: CreateResidentArguments): Resident {
  return {
    id: uuid(),
    ...args,
    rent: args.rent as CurrencyInCents,
  };
}

export const validateResidentArgs =
  createValidationFunction<CreateResidentArguments>({
    firstName: [ValidationError.EmptyString],
    lastName: [ValidationError.EmptyString],
    rent: [ValidationError.Null, ValidationError.LessEqualZero],
  });
