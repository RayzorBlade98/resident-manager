import { v4 as uuid } from 'uuid';
import {
  createValidationFunction,
  ValidationConstraint,
  ValidationErrorMessages,
} from '../utils/validation';
import { MonthYear, MonthYearUtils } from './date';
import { RentInformation, RentInformationUtils } from './rent';
import { CurrencyInCents } from '_/utils/currency/currency';

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
   * Information about the rent payments
   */
  rent: RentInformation[];

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
   * Incidentals that the new resident needs to pay
   */
  incidentals: CurrencyInCents | null;

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
    rent: RentInformationUtils.timespan(
      { ...args.contractStart },
      MonthYearUtils.getCurrentMonthYear(),
      args.rent as CurrencyInCents,
      args.incidentals as CurrencyInCents,
    ),
    invoiceStart: { ...args.contractStart },
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
// eslint-disable-next-line max-len
export const validateResidentArgs = createValidationFunction<CreateResidentArguments>({
  firstName: [ValidationConstraint.NoEmptyString],
  lastName: [ValidationConstraint.NoEmptyString],
  rent: [ValidationConstraint.Currency],
  incidentals: [ValidationConstraint.Currency],
});
