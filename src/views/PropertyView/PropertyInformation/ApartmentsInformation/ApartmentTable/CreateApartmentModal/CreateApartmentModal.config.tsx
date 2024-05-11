import LocationOnIcon from '@mui/icons-material/LocationOn';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import React from 'react';
import { ValidationConstraint } from '../../../../../../utils/validation/constraints';
import Validator from '../../../../../../utils/validation/validator';
import { FormConfig } from '_/types/FormConfig';

/**
 * All values that can be submitted in the form
 */
export interface CreateApartmentInput {
  /**
   * Floor in which the apartment is located
   */
  floor: string;

  /**
   * Location of the aparment on its floor
   */
  location: string;

  /**
   * Number of generic rooms in the apartment
   */
  genericRooms: number;

  /**
   * Number of kitchens in the apartment
   */
  kitchenRooms: number;

  /**
   * Number of bathrooms / toilets in the apartment
   */
  bathRooms: number;

  /**
   * Number of hallways in the apartment
   */
  hallwayRooms: number;

  /**
   * Number of basement rooms in the apartment
   */
  basementRooms: number;

  /**
   * Number of gardens in the apartment
   */
  gardenRooms: number;
}

/**
 * All groups of the form
 */
export type CreateApartmentGroups = 'location' | 'rooms';

/**
 * Config of the create apartment form
 */
export const createApartmentModalConfig: FormConfig<
CreateApartmentInput,
CreateApartmentGroups
> = {
  formValidationConfig: {
    formValidator: new Validator<CreateApartmentInput>({
      floor: ValidationConstraint.NoEmptyString,
      location: ValidationConstraint.NoEmptyString,
      genericRooms: ValidationConstraint.Defined,
      kitchenRooms: ValidationConstraint.Defined,
      basementRooms: ValidationConstraint.Defined,
      hallwayRooms: ValidationConstraint.Defined,
      bathRooms: ValidationConstraint.Defined,
      gardenRooms: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      floor: '',
      location: '',
      genericRooms: undefined,
      kitchenRooms: 1,
      basementRooms: 1,
      hallwayRooms: 1,
      bathRooms: 1,
      gardenRooms: 1,
    },
    submitButtonLabel: 'Erstellen',
  },
  formGroupConfig: {
    groupMappings: {
      floor: 'location',
      location: 'location',
      genericRooms: 'rooms',
      kitchenRooms: 'rooms',
      basementRooms: 'rooms',
      hallwayRooms: 'rooms',
      bathRooms: 'rooms',
      gardenRooms: 'rooms',
    },
    groupConfigs: {
      location: {
        label: 'Lage',
        icon: {
          component: <LocationOnIcon />,
          iconPosition: 'start',
        },
      },
      rooms: {
        label: 'Räume',
        icon: {
          component: <MeetingRoomIcon />,
          iconPosition: 'start',
        },
      },
    },
    defaultGroup: 'location',
  },
};
