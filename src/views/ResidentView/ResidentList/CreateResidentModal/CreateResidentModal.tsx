import { Grid, TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import GenericModal from '../../../../components/generic/GenericModal/GenericModal';
import { convertApartmentToDisplayString } from '../../../../utils/apartment/apartment.utils';
import RentInformationUtils from '../../../../utils/rent/rent.utils';
import {
  CreateResidentGroups,
  CreateResidentInput,
  getCreateResidentModalConfig,
} from './CreateResidentModal.config';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import GroupedForm from '_/components/form/GroupedForm/GroupedForm';
import MonthYearDateField from '_/components/form/MonthYearDateField/MonthYearDateField';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import SalutationSelect from '_/components/form/SalutationSelect/SalutationSelect';
import SelectField from '_/components/form/SelectField/SelectField';
import MonthYear from '_/extensions/date/month_year.extension';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';
import useResidentState from '_/hooks/useResidentState/useResidentState';
import { Salutation } from '_/models/name';

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
 * Modal that contains an input form to create a new resident.
 */
function CreateResidentModal(props: CreateResidentModalProps): JSX.Element {
  const { addResident } = useResidentState();
  const { emptyApartments, emptyParkingSpaces } = usePropertyState();

  const { formValidationConfig, formGroupConfig } = useMemo(
    () => getCreateResidentModalConfig({ emptyApartments }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<CreateResidentInput>({
    ...formValidationConfig,
    onSubmitSuccess: (values) => {
      addResident({
        id: uuid(),
        contractResidents: [
          {
            name: {
              salutation: values.salutation,
              firstName: values.firstName,
              lastName: values.lastName,
            },
          },
        ],
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
        parkingSpaceId: values.parkingSpaceId,
        rentDeposit: values.rentDeposit,
        keys: {
          apartment: values.apartmentKeys,
          basement: values.basementKeys,
          attic: values.atticKeys,
          frontDoor: values.frontDoorKeys,
          mailbox: values.mailboxKeys,
        },
      });
      props.onCloseModal();
    },
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
      <GroupedForm<CreateResidentInput, CreateResidentGroups>
        {...formGroupConfig}
        formErrors={formErrors}
      >
        {({ containers }) => (
          <>
            <containers.resident>
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
                  <NumberTextField
                    required
                    id="numberOfResidents"
                    label="Anzahl der Mieter"
                    min={1}
                    value={formInput.numberOfResidents}
                    onChange={formInputSetters.numberOfResidents}
                    errorMessage={formErrors.numberOfResidents}
                    onlyInteger
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
              </Grid>
            </containers.resident>
            <containers.apartment>
              <Grid container columnSpacing={2} rowSpacing={2}>
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
                <Grid item xs={6}>
                  <SelectField
                    required
                    id="parkingSpaceId"
                    label="Stellplatz"
                    value={formInput.parkingSpaceId}
                    onChange={formInputSetters.parkingSpaceId}
                    errorMessage={formErrors.parkingSpaceId}
                    values={Object.fromEntries(
                      emptyParkingSpaces.map((parkingSpace) => [
                        parkingSpace.id,
                        parkingSpace.name,
                      ]),
                    )}
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
                  <CurrencyInputField
                    required
                    id="rentDeposit"
                    label="Kaution"
                    value={formInput.rentDeposit}
                    onChange={formInputSetters.rentDeposit}
                    errorMessage={formErrors.rentDeposit}
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
                    onlyInteger
                  />
                </Grid>
              </Grid>
            </containers.apartment>
            <containers.keys>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="apartmentKeys"
                    label="Wohnungsschlüssel"
                    min={0}
                    value={formInput.apartmentKeys}
                    onChange={formInputSetters.apartmentKeys}
                    errorMessage={formErrors.apartmentKeys}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="basementKeys"
                    label="Kellerschlüssel"
                    min={0}
                    value={formInput.basementKeys}
                    onChange={formInputSetters.basementKeys}
                    errorMessage={formErrors.basementKeys}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="atticKeys"
                    label="Dachbodenschlüssel"
                    min={0}
                    value={formInput.atticKeys}
                    onChange={formInputSetters.atticKeys}
                    errorMessage={formErrors.atticKeys}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="frontDoorKeys"
                    label="Haustürschlüssel"
                    min={0}
                    value={formInput.frontDoorKeys}
                    onChange={formInputSetters.frontDoorKeys}
                    errorMessage={formErrors.frontDoorKeys}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="mailboxKeys"
                    label="Briefkastenschlüssel"
                    min={0}
                    value={formInput.mailboxKeys}
                    onChange={formInputSetters.mailboxKeys}
                    errorMessage={formErrors.mailboxKeys}
                    onlyInteger
                  />
                </Grid>
              </Grid>
            </containers.keys>
          </>
        )}
      </GroupedForm>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateResidentModal;
