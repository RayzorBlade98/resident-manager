import HomeIcon from '@mui/icons-material/Home';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import PersonIcon from '@mui/icons-material/Person';
import React from 'react';
import { ValidationConstraint } from '../../../utils/validation/constraints';
import Validator from '../../../utils/validation/validator';
import { Salutation } from '_/models/name';
import { FormConfig } from '_/types/FormConfig';

/**
 * All values that can be submitted in the form
 */
export interface InitializationInput {
  /**
   * Company of the landlord
   */
  companyLandlord: string;

  /**
   * salutation of the landlord
   */
  salutationLandlord: Salutation;

  /**
   * first name of the landlord
   */
  firstNameLandlord: string;

  /**
   * last name of the landlord
   */
  lastNameLandlord: string;

  /**
   * Zip code of the landlord
   */
  zipCodeLandlord: number;

  /**
   * City of the landlord
   */
  cityLandlord: string;

  /**
   * Street of the landlord
   */
  streetLandlord: string;

  /**
   * House number of the landlord
   */
  houseNumberLandlord: number;

  /**
   * Email of the landlord
   */
  emailLandlord: string;

  /**
   * Phone number of the landlord
   */
  phoneLandlord: string;

  /**
   * Holder of the landlord's banking account
   */
  bankaccountHolderLandlord: string;

  /**
   * IBAN of the landlord's banking account
   */
  bankaccountIBANLandlord: string;

  /**
   * Number of aparments that get rented in the property
   */
  numberOfApartments: number;

  /**
   * Zip code of the property
   */
  zipCodeProperty: number;

  /**
   * City of the property
   */
  cityProperty: string;

  /**
   * Street of the property
   */
  streetProperty: string;

  /**
   * House number of the property
   */
  houseNumberProperty: number;

  /**
   * Current cost of the water usage
   */
  waterUsageCost: number;

  /**
   * Current cost of the sewage
   */
  sewageCost: number;

  /**
   * Url to the official rent index website of the city
   */
  rentIndexUrl: string;

  /**
   * Capping limit of the rent increase in %
   */
  cappingLimit: number;
}

/**
 * All groups of the form
 */
export type InitializationGroups = 'property' | 'landlord' | 'other';

/**
 * Config of the initialization form
 */
export const initializationFormConfig: FormConfig<
InitializationInput,
InitializationGroups
> = {
  formValidationConfig: {
    formValidator: new Validator<InitializationInput>({
      firstNameLandlord: ValidationConstraint.NoEmptyString,
      lastNameLandlord: ValidationConstraint.NoEmptyString,
      zipCodeLandlord: ValidationConstraint.Defined,
      cityLandlord: ValidationConstraint.NoEmptyString,
      streetLandlord: ValidationConstraint.NoEmptyString,
      houseNumberLandlord: ValidationConstraint.Defined,
      emailLandlord: ValidationConstraint.NoEmptyString,
      phoneLandlord: ValidationConstraint.NoEmptyString,
      bankaccountHolderLandlord: ValidationConstraint.NoEmptyString,
      bankaccountIBANLandlord: ValidationConstraint.NoEmptyString,
      numberOfApartments: ValidationConstraint.Defined,
      zipCodeProperty: ValidationConstraint.Defined,
      cityProperty: ValidationConstraint.NoEmptyString,
      streetProperty: ValidationConstraint.NoEmptyString,
      houseNumberProperty: ValidationConstraint.Defined,
      waterUsageCost: ValidationConstraint.Currency,
      sewageCost: ValidationConstraint.Currency,
      rentIndexUrl: ValidationConstraint.NoEmptyString,
      cappingLimit: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      companyLandlord: '',
      salutationLandlord: Salutation.Male,
      firstNameLandlord: '',
      lastNameLandlord: '',
      zipCodeLandlord: undefined,
      cityLandlord: '',
      streetLandlord: '',
      houseNumberLandlord: undefined,
      emailLandlord: '',
      phoneLandlord: '',
      bankaccountHolderLandlord: '',
      bankaccountIBANLandlord: '',
      numberOfApartments: undefined,
      zipCodeProperty: undefined,
      cityProperty: '',
      streetProperty: '',
      houseNumberProperty: undefined,
      waterUsageCost: undefined,
      sewageCost: undefined,
      rentIndexUrl: '',
      cappingLimit: undefined,
    },
    submitButtonLabel: 'Fertig',
  },
  formGroupConfig: {
    groupMappings: {
      companyLandlord: 'landlord',
      salutationLandlord: 'landlord',
      firstNameLandlord: 'landlord',
      lastNameLandlord: 'landlord',
      zipCodeLandlord: 'landlord',
      cityLandlord: 'landlord',
      streetLandlord: 'landlord',
      houseNumberLandlord: 'landlord',
      emailLandlord: 'landlord',
      phoneLandlord: 'landlord',
      bankaccountHolderLandlord: 'landlord',
      bankaccountIBANLandlord: 'landlord',
      numberOfApartments: 'property',
      zipCodeProperty: 'property',
      cityProperty: 'property',
      streetProperty: 'property',
      houseNumberProperty: 'property',
      waterUsageCost: 'other',
      sewageCost: 'other',
      rentIndexUrl: 'other',
      cappingLimit: 'other',
    },
    groupConfigs: {
      property: {
        label: 'Immobilie',
        icon: {
          component: <HomeIcon />,
          iconPosition: 'start',
        },
      },
      landlord: {
        label: 'Vermieter',
        icon: {
          component: <PersonIcon />,
          iconPosition: 'start',
        },
      },
      other: {
        label: 'Sonstiges',
        icon: {
          component: <MiscellaneousServicesIcon />,
          iconPosition: 'start',
        },
      },
    },
    defaultGroup: 'property',
  },
};
