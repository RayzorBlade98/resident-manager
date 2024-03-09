import { ValidationConstraint } from '../../../../../utils/validation/constraints';
import Validator from '../../../../../utils/validation/validator';
import { Salutation } from '_/models/name';

/**
 * All values that can be submitted in the form
 */
export interface CreateContractResidentInput {
  /**
   * Salutation of the new resident
   */
  salutation: Salutation;

  /**
   * First name of the new resident
   */
  firstName: string;

  /**
   * Last name of the new resident
   */
  lastName: string;
}

export const CreateContractResidentFormConfig = {
  formValidator: new Validator<CreateContractResidentInput>({
    firstName: ValidationConstraint.NoEmptyString,
    lastName: ValidationConstraint.NoEmptyString,
  }),
  defaultFormInput: {
    salutation: Salutation.Male,
    firstName: '',
    lastName: '',
  },
  submitButtonLabel: 'Hinzufügen',
};
