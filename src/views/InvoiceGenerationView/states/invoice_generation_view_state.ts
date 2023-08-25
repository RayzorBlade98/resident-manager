import _ from 'lodash';
import { atom, selector } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { ValidationConstraint } from '../../../utils/validation/constraints';
import { STEPPER_FINISHED } from '_/components/generic/GenericStepper/GenericStepper';
import MonthYear from '_/extensions/date/month_year.extension';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import Invoice from '_/models/invoice/invoice';
import { Resident } from '_/models/resident/resident';
import residentState from '_/states/resident/resident.state';
import {
  CompleteFormValidationState,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';
import Validator from '_/utils/validation/validator';

/**
 * Enum containing all steps for the invoice generation
 */
export enum InvoiceGenerationSteps {
  Timespan = 0,
  OngoingIncidentals = 1, // eslint-disable-line @typescript-eslint/no-shadow
  OneTimeIncidentals = 2, // eslint-disable-line @typescript-eslint/no-shadow
  WaterMeterReadings = 3,
  RentPayment = 4,
  Finished = STEPPER_FINISHED,
}

/**
 * Current form input for the invoice generation
 */
export interface InvoiceGenerationInput {
  /**
   * Start month of the invoice
   */
  invoiceStart: MonthYear | undefined;

  /**
   * End month of the invoice
   */
  invoiceEnd: MonthYear | undefined;
}

/**
 * Invoice generation state
 */
export interface InvoiceGenerationViewState {
  /**
   * Current step of the invoice generation
   */
  currentStep: InvoiceGenerationSteps;

  /**
   * List of all selected ongoing incidentals
   */
  selectedOngoingIncidentals: OngoingIncidentals[];

  /**
   * List of all selected one time incidentals
   */
  selectedOneTimeIncidentals: OneTimeIncidentals[];

  /**
   * Invoice that got generated
   */
  generatedInvoice: Invoice | undefined;
}

/**
 * Invoice generation recoil state
 */
export const invoiceGenerationViewState = atom<
CompleteFormValidationState<
InvoiceGenerationViewState,
InvoiceGenerationInput
>
>({
  key: 'invoiceGenerationViewState',
  default: {
    currentStep: 0,
    selectedOngoingIncidentals: [],
    selectedOneTimeIncidentals: [],
    generatedInvoice: undefined,
    formValidation: {
      formInput: {
        invoiceStart: undefined,
        invoiceEnd: undefined,
      },
      formErrors: {},
      formValidator: new Validator<InvoiceGenerationInput>({
        invoiceStart: ValidationConstraint.Defined,
        invoiceEnd: ValidationConstraint.Defined,
      }),
    },
  },
});

/**
 * Selector for the invoice generation form validation
 */
// eslint-disable-next-line max-len
export const generateInvoiceFormValidationSelector = createFormValidationStateSelector<
InvoiceGenerationViewState,
InvoiceGenerationInput
>(invoiceGenerationViewState);

/**
 * Adds new incidentals to the list of selected ongoing incidentals
 * @param incidentals incidentals that should be added
 */
export function addSelectedOngoingIncidentals(
  incidentals: OngoingIncidentals,
): void {
  setRecoil(invoiceGenerationViewState, (state) => ({
    ...state,
    selectedOngoingIncidentals: [
      ...state.selectedOngoingIncidentals,
      incidentals,
    ],
  }));
}

/**
 * Removes incidentals from the list of selected ongoing incidentals
 * @param incidentals incidentals that should be removed
 */
export function removeSelectedOngoingIncidentals(
  incidentals: OngoingIncidentals,
): void {
  setRecoil(invoiceGenerationViewState, (state) => ({
    ...state,
    selectedOngoingIncidentals: state.selectedOngoingIncidentals.filter(
      (i) => i.id !== incidentals.id,
    ),
  }));
}

/**
 * Adds new incidentals to the list of selected ongoing incidentals
 * @param incidentals incidentals that should be added
 */
export function addSelectedOneTimeIncidentals(
  incidentals: OneTimeIncidentals,
): void {
  setRecoil(invoiceGenerationViewState, (state) => ({
    ...state,
    selectedOneTimeIncidentals: [
      ...state.selectedOneTimeIncidentals,
      incidentals,
    ],
  }));
}

/**
 * Removes incidentals from the list of selected ongoing incidentals
 * @param incidentals incidentals that should be removed
 */
export function removeSelectedOneTimeIncidentals(
  incidentals: OneTimeIncidentals,
): void {
  setRecoil(invoiceGenerationViewState, (state) => ({
    ...state,
    selectedOneTimeIncidentals: state.selectedOneTimeIncidentals.filter(
      (i) => i.id !== incidentals.id,
    ),
  }));
}

/**
 * Selector that returns all residents that will be included into the invoice
 */
export const residentsForInvoiceSelector = selector<Resident[]>({
  key: 'invoiceGenerationViewState-residents',
  get: ({ get }) => {
    const formState = get(generateInvoiceFormValidationSelector);
    const residents = get(residentState);

    const invoiceEnd = formState.formInput.invoiceEnd;
    if (!formState.formInput.invoiceStart || !invoiceEnd) {
      return residents;
    }

    return residents.filter((r) => r.invoiceStart <= invoiceEnd);
  },
});

/**
 * Selector that returns whether the current step is finished
 */
export const isCurrentStepFinishedSelector = selector<boolean>({
  key: 'invoiceGenerationViewState-isCurrentStepFinished',
  get: ({ get }) => {
    const isInputValid = (
      keysToValidate: (keyof InvoiceGenerationInput)[],
    ): boolean => {
      const formValidation = get(generateInvoiceFormValidationSelector);
      const errors = formValidation.formValidator.validate(
        _.pick(formValidation.formInput, keysToValidate),
      );
      return Object.keys(_.pick(errors, keysToValidate)).length === 0;
    };

    const step = get(invoiceGenerationViewState).currentStep;
    switch (step) {
      case InvoiceGenerationSteps.Timespan:
        return isInputValid(['invoiceStart', 'invoiceEnd']);
      case InvoiceGenerationSteps.WaterMeterReadings: {
        const residents = get(residentState);
        return residents.every(
          (r) => r.waterMeterReadings.find((w) => !w.wasDeductedInInvoice)
            !== undefined,
        );
      }
      default:
        return true;
    }
  },
});

export default invoiceGenerationViewState;
