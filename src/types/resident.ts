import { v4 as uuid } from 'uuid';

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CreateResidentArguments {
  firstName: string;
  lastName: string;
}

export type CreateResidentErrors = {
  [k in keyof CreateResidentArguments]?: string;
};

export function createResident(args: CreateResidentArguments): Resident {
  return {
    id: uuid(),
    firstName: args.firstName,
    lastName: args.lastName,
  };
}

const ERROR_NOT_EMPTY = 'Darf nicht leer sein!';

export function validateResidentArgs(
  args: CreateResidentArguments,
  key: keyof CreateResidentArguments | undefined = undefined,
): CreateResidentErrors | string | undefined {
  const errors = {
    firstName: args.firstName === '' ? ERROR_NOT_EMPTY : undefined,
    lastName: args.lastName === '' ? ERROR_NOT_EMPTY : undefined,
  };
  if (key) {
    return errors[key];
  }
  return errors;
}
