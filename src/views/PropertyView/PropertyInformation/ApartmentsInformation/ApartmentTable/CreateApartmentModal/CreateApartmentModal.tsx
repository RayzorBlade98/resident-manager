import { Grid, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  CreateApartmentGroups,
  CreateApartmentInput,
  createApartmentModalConfig,
} from './CreateApartmentModal.config';
import GroupedForm from '_/components/form/GroupedForm/GroupedForm';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';

interface CreateApartmentModalProps {
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
 * Modal that contains an input form to create new apartment.
 */
function CreateApartmentModal(props: CreateApartmentModalProps) {
  const { addApartment } = usePropertyState();
  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<CreateApartmentInput>({
    ...createApartmentModalConfig.formValidationConfig,
    onSubmitSuccess: (values) => {
      addApartment({
        id: uuid(),
        floor: values.floor,
        location: values.location,
        rooms: {
          generic: values.genericRooms,
          kitchen: values.kitchenRooms,
          basement: values.basementRooms,
          bath: values.bathRooms,
          hallway: values.hallwayRooms,
        },
      });
      props.onCloseModal();
    },
  });

  return (
    <GenericModal
      title="Neue Wohnung"
      show={props.showModal}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
      <GroupedForm<CreateApartmentInput, CreateApartmentGroups>
        {...createApartmentModalConfig.formGroupConfig}
        formErrors={formErrors}
      >
        {({ containers }) => (
          <>
            <containers.location>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    id="floor"
                    label="Geschoss"
                    variant="outlined"
                    value={formInput.floor}
                    onChange={(event) => {
                      formInputSetters.floor(event.target.value);
                    }}
                    error={!!formErrors.floor}
                    helperText={formErrors.floor}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    id="location"
                    label="Lage"
                    variant="outlined"
                    value={formInput.location}
                    onChange={(event) => {
                      formInputSetters.location(event.target.value);
                    }}
                    error={!!formErrors.location}
                    helperText={formErrors.location}
                  />
                </Grid>
              </Grid>
            </containers.location>
            <containers.rooms>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="genericRooms"
                    label="Zimmer"
                    min={1}
                    value={formInput.genericRooms}
                    onChange={formInputSetters.genericRooms}
                    errorMessage={formErrors.genericRooms}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="kitchenRooms"
                    label="Küchen"
                    min={1}
                    value={formInput.kitchenRooms}
                    onChange={formInputSetters.kitchenRooms}
                    errorMessage={formErrors.kitchenRooms}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="bathRooms"
                    label="Badezimmer / Toiletten"
                    min={1}
                    value={formInput.bathRooms}
                    onChange={formInputSetters.bathRooms}
                    errorMessage={formErrors.bathRooms}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="hallwayRooms"
                    label="Flure / Dielen"
                    min={0}
                    value={formInput.hallwayRooms}
                    onChange={formInputSetters.hallwayRooms}
                    errorMessage={formErrors.hallwayRooms}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="basementRooms"
                    label="Kellerräume"
                    min={0}
                    value={formInput.basementRooms}
                    onChange={formInputSetters.basementRooms}
                    errorMessage={formErrors.basementRooms}
                    onlyInteger
                  />
                </Grid>
              </Grid>
            </containers.rooms>
          </>
        )}
      </GroupedForm>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateApartmentModal;
