import { Grid } from '@mui/material';
import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';
import {
  EditResidentGroups,
  EditResidentInput,
  getEditResidentFormConfig,
} from './EditResidentModal.config';
import GroupedForm from '_/components/form/GroupedForm/GroupedForm';
import MonthYearDateField from '_/components/form/MonthYearDateField/MonthYearDateField';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import SelectField from '_/components/form/SelectField/SelectField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import ContractResidentDisplay from '_/components/shared/ContractResidentDisplay/ContractResidentDisplay';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';
import useResident from '_/hooks/useResident/useResident';
import { ContractResident } from '_/models/resident/contractResident';
import { Resident } from '_/models/resident/resident';

interface EditResidentModalProps {
  /**
   * Resident that should be edited
   */
  resident: Resident;

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
 * Modal that contains an input form to edit an existing resident.
 */
function EditResidentModal(props: EditResidentModalProps): JSX.Element {
  const { editResident } = useResident(props.resident.id);
  const { property, emptyParkingSpaces } = usePropertyState();

  const { formValidationConfig, formGroupConfig } = useMemo(
    () => getEditResidentFormConfig(props.resident),
    [props.resident],
  );

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<EditResidentInput>({
    ...formValidationConfig,
    onSubmitSuccess: (values) => {
      editResident(
        {
          ..._.pick(values, [
            'contractResidents',
            'parkingSpaceId',
            'numberOfResidents',
          ]),
          keys: {
            apartment: values.apartmentKeys,
            attic: values.atticKeys,
            basement: values.basementKeys,
            mailbox: values.mailboxKeys,
            frontDoor: values.frontDoorKeys,
          },
        },
        values.validSince,
      );
      props.onCloseModal();
    },
  });

  useEffect(() => resetFormInput(), [resetFormInput]);

  const parkingSpaces = useMemo(() => {
    const residentParkingSpace = property.parkingSpaces.find(
      (p) => p.id === props.resident.parkingSpaceId,
    );

    return residentParkingSpace
      ? [residentParkingSpace, ...emptyParkingSpaces]
      : emptyParkingSpaces;
  }, [
    emptyParkingSpaces,
    property.parkingSpaces,
    props.resident.parkingSpaceId,
  ]);

  return (
    <GenericModal
      title="Mieter bearbeiten"
      show={props.showModal}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
      <GroupedForm<EditResidentInput, EditResidentGroups>
        {...formGroupConfig}
        formErrors={formErrors}
      >
        {({ containers }) => (
          <>
            <containers.resident>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <MonthYearDateField
                    required
                    id="validSince"
                    label="Gültig ab"
                    value={formInput.validSince}
                    onChange={formInputSetters.validSince}
                    errorMessage={formErrors.validSince}
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
                <Grid item xs={12}>
                  <ContractResidentDisplay
                    contractResidents={formInput.contractResidents}
                    onSubmitContractResident={(resident) => formInputSetters.contractResidents([
                      ...(formInput.contractResidents as ContractResident[]),
                      resident,
                    ])}
                    error={formErrors.contractResidents}
                  />
                </Grid>
              </Grid>
            </containers.resident>
            <containers.apartment>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <SelectField
                    required
                    id="parkingSpaceId"
                    label="Stellplatz"
                    value={formInput.parkingSpaceId}
                    onChange={formInputSetters.parkingSpaceId}
                    errorMessage={formErrors.parkingSpaceId}
                    values={Object.fromEntries(
                      parkingSpaces.map((parkingSpace) => [
                        parkingSpace.id,
                        parkingSpace.name,
                      ]),
                    )}
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

export default EditResidentModal;
