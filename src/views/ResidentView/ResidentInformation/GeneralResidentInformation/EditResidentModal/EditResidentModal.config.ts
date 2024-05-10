import _ from 'lodash';
import { ValidationConstraint } from '../../../../../utils/validation/constraints';
import Validator from '../../../../../utils/validation/validator';
import MonthYear from '_/extensions/date/month_year.extension';
import { Resident } from '_/models/resident/resident';
import { FormConfig } from '_/types/FormConfig';
import {
  genericCreateResidentFormConfig,
  CreateResidentGroups,
  CreateResidentInput,
} from '_/views/ResidentView/ResidentList/CreateResidentModal/CreateResidentModal.config';

/**
 * Inputs of the CreateResidentModal that aren't included in the EditResidentModal
 */
const omittedFormInputs = [
  'rent',
  'incidentals',
  'rentDeposit',
  'contractStart',
  'waterMeter',
  'apartmentId',
] as const satisfies Readonly<(keyof CreateResidentInput)[]>;

/**
 * Inputs of the CreateResidentModal that aren't included in the EditResidentModal
 */
type OmittedFormInputs = (typeof omittedFormInputs)[number];

/**
 * All values that can be submitted in the form
 */
export type EditResidentInput = Omit<CreateResidentInput, OmittedFormInputs> & {
  /**
   * First month the new values are valid
   */
  validSince: MonthYear;
};

/**
 * All groups of the form
 */
export type EditResidentGroups = CreateResidentGroups;

/**
 * Config of the edit resident form
 */
export function getEditResidentFormConfig(
  resident: Resident,
): FormConfig<EditResidentInput, EditResidentGroups> {
  return {
    ...genericCreateResidentFormConfig,
    formValidationConfig: {
      ...genericCreateResidentFormConfig.formValidationConfig,
      formValidator: new Validator<EditResidentInput>({
        ..._.omit(
          genericCreateResidentFormConfig.formValidationConfig.formValidator
            .constraints,
          omittedFormInputs,
        ),
        validSince: ValidationConstraint.Defined,
      }),
      defaultFormInput: {
        validSince: new MonthYear().addMonths(1),
        contractResidents: resident.contractResidents,
        numberOfResidents: resident.numberOfResidents,
        parkingSpaceId: resident.parkingSpaceId,
        apartmentKeys: resident.keys.apartment,
        basementKeys: resident.keys.basement,
        atticKeys: resident.keys.attic,
        frontDoorKeys: resident.keys.frontDoor,
        mailboxKeys: resident.keys.mailbox,
      },
      submitButtonLabel: 'Bearbeiten',
    },
    formGroupConfig: {
      ...genericCreateResidentFormConfig.formGroupConfig,
      groupMappings: {
        ..._.omit(
          genericCreateResidentFormConfig.formGroupConfig.groupMappings,
          omittedFormInputs,
        ),
        validSince: 'resident',
      },
    },
  };
}
