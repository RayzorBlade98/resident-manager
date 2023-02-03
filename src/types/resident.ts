import { v4 as uuid } from 'uuid';
import {
  createValidationFunction,
  ValidationError,
  ValidationErrorMessages,
} from '../utils/validation';
import { CurrencyInCents } from '_/utils/currency';
import { MonthYear } from './date';

/**
 * Object containing information about a specific resident
 */
export interface Resident {
  /**
   * Unique id that is used to identify a resident
   */
  id: string;

  /**
   * First name of the resident
   */
  firstName: string;

  /**
   * Last name of the resident
   */
  lastName: string;

  /**
   * Rent that the resident currently needs to pay
   */
  rent: CurrencyInCents;

  /**
   * First month and year the next invoice calculation will include
   */
  invoiceStart: MonthYear;
}

/**
 * Object that contains all information that is needed to create a new resident
 */
export interface CreateResidentArguments {
  /**
   * First name of the new resident
   */
  firstName: string;

  /**
   * Last name of the new resident
   */
  lastName: string;

  /**
   * Rent that the new resident needs to pay
   */
  rent: CurrencyInCents | null;

  /**
   * First month and year the contract of the new resident starts
   */
  contractStart: MonthYear;
}

/**
 * Type that represents an object containing error messages
 * for invalid field during the creation of a new resident.
 */
export type CreateResidentErrors =
  ValidationErrorMessages<CreateResidentArguments>;

/**
 * Creates a new `Resident` object by using the specified `CreateResidentArguments` object
 * @param args all information needed to create a new `Resident` object
 * @returns newly created `Resident` object
 */
export function createResident(args: CreateResidentArguments): Resident {
  return {
    id: uuid(),
    firstName: args.firstName,
    lastName: args.lastName,
    rent: args.rent as CurrencyInCents,
    invoiceStart: args.contractStart,
  };
}

/**
 * Validates a `CreateResidentArguments` object and
 * returns the error messages of the invalid fields
 *
 * @param object `CreateResidentArguments` object that should be validated
 * @param key optional key of the object. If provided only this field is validated.
 * @returns If key is specified the error message of the field or `undefined` if the field valid.
 *          Otherwise a `CreateResidentErrors` object containing error messages for all invalid fields.
 */
export const validateResidentArgs =
  createValidationFunction<CreateResidentArguments>({
    firstName: [ValidationError.EmptyString],
    lastName: [ValidationError.EmptyString],
    rent: [ValidationError.Null, ValidationError.LessEqualZero],
  });
