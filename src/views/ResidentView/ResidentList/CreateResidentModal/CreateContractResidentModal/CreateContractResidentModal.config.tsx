import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import React from 'react';
import { ValidationConstraint } from '../../../../../utils/validation/constraints';
import Validator from '../../../../../utils/validation/validator';
import { Salutation } from '_/models/name';
import { FormConfig } from '_/types/FormConfig';

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

  /**
   * Phone number of the resident
   */
  phone: string;

  /**
   * Zip code of the new resident
   */
  zipCode: number;

  /**
   * City of the new resident
   */
  city: string;

  /**
   * Street of the new resident
   */
  street: string;

  /**
   * House number of the new resident
   */
  houseNumber: number;
}

export type CreateContractResidentGroups = 'resident' | 'oldAdress';

export const createContractResidentModalConfig: FormConfig<
CreateContractResidentInput,
CreateContractResidentGroups
> = {
  formValidationConfig: {
    formValidator: new Validator<CreateContractResidentInput>({
      firstName: ValidationConstraint.NoEmptyString,
      lastName: ValidationConstraint.NoEmptyString,
      phone: ValidationConstraint.NoEmptyString,
      zipCode: ValidationConstraint.Defined,
      city: ValidationConstraint.NoEmptyString,
      street: ValidationConstraint.NoEmptyString,
      houseNumber: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      salutation: Salutation.Male,
      firstName: '',
      lastName: '',
      phone: '',
      zipCode: undefined,
      city: '',
      street: '',
      houseNumber: undefined,
    },
    submitButtonLabel: 'Hinzufügen',
  },
  formGroupConfig: {
    groupMappings: {
      salutation: 'resident',
      firstName: 'resident',
      lastName: 'resident',
      phone: 'resident',
      zipCode: 'oldAdress',
      city: 'oldAdress',
      street: 'oldAdress',
      houseNumber: 'oldAdress',
    },
    groupConfigs: {
      resident: {
        label: 'Mieter',
        icon: {
          component: <PersonIcon />,
          iconPosition: 'start',
        },
      },
      oldAdress: {
        label: 'Alte Adresse',
        icon: {
          component: <HomeIcon />,
          iconPosition: 'start',
        },
      },
    },
    defaultGroup: 'resident',
  },
};
