import { v4 as uuid } from 'uuid';
import {
  createValidationFunction,
  ValidationError,
  ValidationErrorMessages,
} from '../utils/validation';

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CreateResidentArguments {
  firstName: string;
  lastName: string;
}

export type CreateResidentErrors =
  ValidationErrorMessages<CreateResidentArguments>;

export function createResident(args: CreateResidentArguments): Resident {
  return {
    id: uuid(),
    ...args,
  };
}

export const validateResidentArgs =
  createValidationFunction<CreateResidentArguments>({
    firstName: [ValidationError.EmptyString],
    lastName: [ValidationError.EmptyString],
  });
