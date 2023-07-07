import _ from 'lodash';
import { atom } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { ValidationConstraint } from '../../../utils/validation/constraints';
import MonthYear from '_/extensions/date/month_year.extension';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import {
  CompleteFormValidationState,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';
import Validator from '_/utils/validation/validator';

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
  currentStep: number;

  /**
   * List of all selected ongoing incidentals
   */
  selectedOngoingIncidentals: OngoingIncidentals[];

  /**
   * List of all selected one time incidentals
   */
  selectedOneTimeIncidentals: OneTimeIncidentals[];
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
 * Validates whether the current step is finished
 * @returns true if the current step is finished, else false
 */
export function isCurrentStepFinished(): boolean {
  const step = getRecoil(invoiceGenerationViewState).currentStep;
  let toValidate: (keyof InvoiceGenerationInput)[];
  switch (step) {
    case 0:
      toValidate = ['invoiceStart', 'invoiceEnd'];
      break;
    default:
      toValidate = [];
  }

  const formValidation = getRecoil(generateInvoiceFormValidationSelector);
  const errors = formValidation.formValidator.validate(
    _.pick(formValidation.formInput, toValidate),
  );
  return Object.keys(_.pick(errors, toValidate)).length === 0;
}

export default invoiceGenerationViewState;
