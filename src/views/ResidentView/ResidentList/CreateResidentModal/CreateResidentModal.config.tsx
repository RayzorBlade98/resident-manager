import HomeIcon from '@mui/icons-material/Home';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import React from 'react';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import Validator from '../../../../utils/validation/validator';
import MonthYear from '_/extensions/date/month_year.extension';
import Apartment from '_/models/property/apartment';
import { ContractResident } from '_/models/resident/contractResident';
import { FormConfig } from '_/types/FormConfig';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

/**
 * All values that can be submitted in the form
 */
export interface CreateResidentInput {
  /**
   * Rent that the new resident needs to pay
   */
  rent: CurrencyInCents;

  /**
   * Incidentals that the new resident needs to pay
   */
  incidentals: CurrencyInCents;

  /**
   * Rent deposit that the resident payed at contract start
   */
  rentDeposit: CurrencyInCents;

  /**
   * First month and year the contract of the new resident starts
   */
  contractStart: MonthYear;

  /**
   * Current water meter count
   */
  waterMeter: number;

  /**
   * Residents included in the contract
   */
  contractResidents: ContractResident[];

  /**
   * Number of residents living in the appartment
   */
  numberOfResidents: number;

  /**
   * Id of the apartment the resident lives in
   */
  apartmentId: string;

  /**
   * Id of the parking space the resident rented
   */
  parkingSpaceId: string | undefined;

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
 * Config of the edit resident form
 */
export const genericCreateResidentFormConfig: FormConfig<
CreateResidentInput,
CreateResidentGroups
> = {
  formValidationConfig: {
    formValidator: new Validator<CreateResidentInput>({
      rent: ValidationConstraint.Currency,
      incidentals: ValidationConstraint.Currency,
      rentDeposit: ValidationConstraint.Currency,
      contractStart: ValidationConstraint.Defined,
      waterMeter: ValidationConstraint.Defined,
      contractResidents: ValidationConstraint.NoEmptyArray,
      numberOfResidents: ValidationConstraint.Defined,
      apartmentId: ValidationConstraint.Defined,
      apartmentKeys: ValidationConstraint.Defined,
      basementKeys: ValidationConstraint.Defined,
      atticKeys: ValidationConstraint.Defined,
      frontDoorKeys: ValidationConstraint.Defined,
      mailboxKeys: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      rent: undefined,
      incidentals: undefined,
      rentDeposit: undefined,
      contractStart: new MonthYear(),
      waterMeter: undefined,
      contractResidents: [],
      numberOfResidents: undefined,
      apartmentId: undefined,
      parkingSpaceId: undefined,
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
      contractStart: 'resident',
      contractResidents: 'resident',
      numberOfResidents: 'resident',
      rent: 'apartment',
      incidentals: 'apartment',
      rentDeposit: 'apartment',
      waterMeter: 'apartment',
      apartmentId: 'apartment',
      parkingSpaceId: 'apartment',
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

export function getCreateResidentModalConfig(args: {
  emptyApartments: Apartment[];
}): FormConfig<CreateResidentInput, CreateResidentGroups> {
  return {
    ...genericCreateResidentFormConfig,
    formValidationConfig: {
      ...genericCreateResidentFormConfig.formValidationConfig,
      defaultFormInput: {
        ...genericCreateResidentFormConfig.formValidationConfig
          .defaultFormInput,
        apartmentId: args.emptyApartments.at(0)?.id,
      },
    },
  };
}
