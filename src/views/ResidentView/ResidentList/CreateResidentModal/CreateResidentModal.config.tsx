import HomeIcon from '@mui/icons-material/Home';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import React from 'react';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import Validator from '../../../../utils/validation/validator';
import { GroupedFormProps } from '_/components/form/GroupedForm/GroupedForm';
import MonthYear from '_/extensions/date/month_year.extension';
import { FormValidationArguments } from '_/hooks/useFormValidation/useFormValidation';
import { Salutation } from '_/models/name';
import Apartment from '_/models/property/apartment';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * All values that can be submitted in the form
 */
export interface CreateResidentInput {
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
   * Rent that the new resident needs to pay
   */
  rent: CurrencyInCents;

  /**
   * Incidentals that the new resident needs to pay
   */
  incidentals: CurrencyInCents;

  /**
   * First month and year the contract of the new resident starts
   */
  contractStart: MonthYear;

  /**
   * Current water meter count
   */
  waterMeter: number;

  /**
   * Number of residents living in the appartment
   */
  numberOfResidents: number;

  /**
   * Id of the apartment the resident lives in
   */
  apartmentId: string;

  /**
   * Number of apartment keys the resident has
   */
  apartmentKeys: number;

  /**
   * Number of basement keys the resident has
   */
  basementKeys: number;

  /**
   * Number of attic keys the resident has
   */
  atticKeys: number;

  /**
   * Number of front door keys the resident has
   */
  frontDoorKeys: number;

  /**
   * Number of mailbox keys the resident has
   */
  mailboxKeys: number;
}

/**
 * All groups of the form
 */
export type CreateResidentGroups = 'resident' | 'apartment' | 'keys';

/**
 * Returns all configs for the create resident modal
 * @param emptyApartments list of all empty apartments
 */
export function getCreateResidentModalConfig(args: {
  emptyApartments: Apartment[];
}): {
    formValidationConfig: Omit<
    FormValidationArguments<CreateResidentInput>,
    'onSubmitSuccess'
    >;
    formGroupConfig: Omit<
    GroupedFormProps<CreateResidentInput, CreateResidentGroups>,
    'children' | 'formErrors'
    >;
  } {
  return {
    formValidationConfig: {
      formValidator: new Validator<CreateResidentInput>({
        firstName: ValidationConstraint.NoEmptyString,
        lastName: ValidationConstraint.NoEmptyString,
        rent: ValidationConstraint.Currency,
        incidentals: ValidationConstraint.Currency,
        contractStart: ValidationConstraint.Defined,
        waterMeter: ValidationConstraint.Defined,
        numberOfResidents: ValidationConstraint.Defined,
        apartmentId: ValidationConstraint.Defined,
        apartmentKeys: ValidationConstraint.Defined,
        basementKeys: ValidationConstraint.Defined,
        atticKeys: ValidationConstraint.Defined,
        frontDoorKeys: ValidationConstraint.Defined,
        mailboxKeys: ValidationConstraint.Defined,
      }),
      defaultFormInput: {
        salutation: Salutation.Male,
        firstName: '',
        lastName: '',
        rent: undefined,
        incidentals: undefined,
        contractStart: new MonthYear(),
        waterMeter: undefined,
        numberOfResidents: undefined,
        apartmentId: args.emptyApartments.at(0)?.id,
        apartmentKeys: undefined,
        basementKeys: undefined,
        atticKeys: undefined,
        frontDoorKeys: undefined,
        mailboxKeys: undefined,
      },
      submitButtonLabel: 'Erstellen',
    },
    formGroupConfig: {
      groupMappings: {
        salutation: 'resident',
        firstName: 'resident',
        lastName: 'resident',
        contractStart: 'resident',
        numberOfResidents: 'resident',
        rent: 'apartment',
        incidentals: 'apartment',
        waterMeter: 'apartment',
        apartmentId: 'apartment',
        apartmentKeys: 'keys',
        basementKeys: 'keys',
        atticKeys: 'keys',
        frontDoorKeys: 'keys',
        mailboxKeys: 'keys',
      },
      groupConfigs: {
        resident: {
          label: 'Mieter',
          icon: {
            component: <PersonIcon />,
            iconPosition: 'start',
          },
        },
        apartment: {
          label: 'Wohnung',
          icon: {
            component: <HomeIcon />,
            iconPosition: 'start',
          },
        },
        keys: {
          label: 'Schlüssel',
          icon: {
            component: <KeyIcon />,
            iconPosition: 'start',
          },
        },
      },
      defaultGroup: 'resident',
    },
  };
}