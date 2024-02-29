import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
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
}

/**
 * All groups of the form
 */
export type InitializationGroups = 'property' | 'landlord' | 'waterCosts';

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
      numberOfApartments: ValidationConstraint.Defined,
      zipCodeProperty: ValidationConstraint.Defined,
      cityProperty: ValidationConstraint.NoEmptyString,
      streetProperty: ValidationConstraint.NoEmptyString,
      houseNumberProperty: ValidationConstraint.Defined,
      waterUsageCost: ValidationConstraint.Currency,
      sewageCost: ValidationConstraint.Currency,
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
      numberOfApartments: undefined,
      zipCodeProperty: undefined,
      cityProperty: '',
      streetProperty: '',
      houseNumberProperty: undefined,
      waterUsageCost: undefined,
      sewageCost: undefined,
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
      numberOfApartments: 'property',
      zipCodeProperty: 'property',
      cityProperty: 'property',
      streetProperty: 'property',
      houseNumberProperty: 'property',
      waterUsageCost: 'waterCosts',
      sewageCost: 'waterCosts',
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
      waterCosts: {
        label: 'Wasserkosten',
        icon: {
          component: <WaterDropIcon />,
          iconPosition: 'start',
        },
      },
    },
    defaultGroup: 'property',
  },
};
