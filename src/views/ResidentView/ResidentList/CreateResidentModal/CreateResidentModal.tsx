import { Grid, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuid } from 'uuid';
import GenericModal from '../../../../components/generic/GenericModal/GenericModal';
import { convertApartmentToDisplayString } from '../../../../utils/apartment/apartment.utils';
import RentInformationUtils from '../../../../utils/rent/rent.utils';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import MonthYearDateField from '_/components/form/MonthYearDateField/MonthYearDateField';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import SalutationSelect from '_/components/form/SalutationSelect/SalutationSelect';
import SelectField from '_/components/form/SelectField/SelectField';
import MonthYear from '_/extensions/date/month_year.extension';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';
import useResidentState from '_/hooks/useResidentState/useResidentState';
import { Salutation } from '_/models/name';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import Validator from '_/utils/validation/validator';

interface CreateResidentModalProps {
  /**
   * Whether to show the modal
   */
  showModal: boolean;

  /**
   * Callback when the modal is closed
   */
  onCloseModal: () => void;
}

/**
 * All values that can be submitted in the form
 */
interface CreateResidentInput {
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
   *
   */
  apartmentId: string;
}

/**
 * Modal that contains an input form to create a new resident.
 */
function CreateResidentModal(props: CreateResidentModalProps): JSX.Element {
  const { addResident } = useResidentState();
  const { emptyApartments } = usePropertyState();
  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<CreateResidentInput>({
    formValidator: new Validator<CreateResidentInput>({
      firstName: ValidationConstraint.NoEmptyString,
      lastName: ValidationConstraint.NoEmptyString,
      rent: ValidationConstraint.Currency,
      incidentals: ValidationConstraint.Currency,
      contractStart: ValidationConstraint.Defined,
      waterMeter: ValidationConstraint.Defined,
      numberOfResidents: ValidationConstraint.Defined,
      apartmentId: ValidationConstraint.Defined,
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
      apartmentId: emptyApartments.at(0)?.id,
    },
    onSubmitSuccess: (values) => {
      addResident({
        id: uuid(),
        name: {
          salutation: values.salutation,
          firstName: values.firstName,
          lastName: values.lastName,
        },
        rentInformation: RentInformationUtils.timespan(
          values.contractStart,
          new MonthYear(),
          values.rent,
          values.incidentals,
        ),
        numberOfResidents: values.numberOfResidents,
        contractStart: values.contractStart,
        waterMeterReadings: [
          {
            waterMeterCount: values.waterMeter,
            readingDate: values.contractStart,
            wasDeductedInInvoice: true,
          },
        ],
        apartmentId: values.apartmentId,
      });
      props.onCloseModal();
    },
    submitButtonLabel: 'Erstellen',
  });

  return (
    <GenericModal
      title="Neuer Mieter"
      show={props.showModal}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <SalutationSelect
            value={formInput.salutation as Salutation}
            onChange={formInputSetters.salutation}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="firstName"
            label="Vorname"
            variant="outlined"
            value={formInput.firstName}
            onChange={(event) => formInputSetters.firstName(event.target.value)}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="lastName"
            label="Nachname"
            variant="outlined"
            value={formInput.lastName}
            onChange={(event) => formInputSetters.lastName(event.target.value)}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
          />
        </Grid>
        <Grid item xs={6}>
          <CurrencyInputField
            required
            id="rent"
            label="Miete"
            value={formInput.rent}
            onChange={formInputSetters.rent}
            errorMessage={formErrors.rent}
          />
        </Grid>
        <Grid item xs={6}>
          <CurrencyInputField
            required
            id="incidentals"
            label="Nebenkosten"
            value={formInput.incidentals}
            onChange={formInputSetters.incidentals}
            errorMessage={formErrors.incidentals}
          />
        </Grid>
        <Grid item xs={6}>
          <NumberTextField
            required
            id="numberOfResidents"
            label="Anzahl der Mieter"
            min={1}
            value={formInput.numberOfResidents}
            onChange={formInputSetters.numberOfResidents}
            errorMessage={formErrors.numberOfResidents}
          />
        </Grid>
        <Grid item xs={6}>
          <NumberTextField
            required
            id="waterMeter"
            label="Wasserzählerstand"
            min={1}
            value={formInput.waterMeter}
            onChange={formInputSetters.waterMeter}
            errorMessage={formErrors.waterMeter}
          />
        </Grid>
        <Grid item xs={6}>
          <MonthYearDateField
            required
            id="contractStart"
            label="Vertragsbeginn"
            value={formInput.contractStart}
            onChange={formInputSetters.contractStart}
            errorMessage={formErrors.contractStart}
          />
        </Grid>
        <Grid item xs={6}>
          <SelectField
            required
            id="apartmentId"
            label="Wohnung"
            value={formInput.apartmentId}
            onChange={formInputSetters.apartmentId}
            errorMessage={formErrors.apartmentId}
            values={Object.fromEntries(
              emptyApartments.map((apartment) => [
                apartment.id,
                convertApartmentToDisplayString(apartment),
              ]),
            )}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateResidentModal;
