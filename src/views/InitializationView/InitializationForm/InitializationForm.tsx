import { Grid, TextField } from '@mui/material';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import {
  InitializationInput,
  InitializationGroups,
  initializationFormConfig,
} from './InitializationForm.config';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import GroupedForm from '_/components/form/GroupedForm/GroupedForm';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import SalutationSelect from '_/components/form/SalutationSelect/SalutationSelect';
import TextInputField from '_/components/form/TextInputField/TextInputField';
import MonthYear from '_/extensions/date/month_year.extension';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import { Salutation } from '_/models/name';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';

const styles = {
  container: {
    width: '100%',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
};

/**
 *
 */
function InitializationForm() {
  const setPropertyState = useSetRecoilState(propertyState);
  const setWaterCostState = useSetRecoilState(waterCostsState);
  const setLandlordState = useSetRecoilState(landlordState);
  const {
    formInput, formErrors, formInputSetters, FormSubmitButton,
  } = useFormValidation<InitializationInput>({
    ...initializationFormConfig.formValidationConfig,
    onSubmitSuccess: (values) => {
      setLandlordState({
        company: values.companyLandlord || undefined,
        representative: {
          salutation: values.salutationLandlord,
          firstName: values.firstNameLandlord,
          lastName: values.lastNameLandlord,
        },
        address: {
          zipCode: values.zipCodeLandlord,
          city: values.cityLandlord,
          street: values.streetLandlord,
          houseNumber: values.houseNumberLandlord,
        },
        email: values.emailLandlord,
        phone: values.phoneLandlord,
        bankAccount: {
          holder: values.bankaccountHolderLandlord,
          iban: values.bankaccountIBANLandlord,
        },
      });
      setPropertyState({
        numberOfApartments: values.numberOfApartments,
        address: {
          zipCode: values.zipCodeProperty,
          city: values.cityProperty,
          street: values.streetProperty,
          houseNumber: values.houseNumberProperty,
        },
        apartments: [],
        parkingSpaces: [],
        rentIndexUrl: values.rentIndexUrl,
        cappingLimit: values.cappingLimit,
      });
      setWaterCostState({
        waterUsageCosts: [
          {
            costPerCubicMeter: values.waterUsageCost,
            date: new MonthYear(),
          },
        ],
        sewageCosts: [
          {
            costPerCubicMeter: values.sewageCost,
            date: new MonthYear(),
          },
        ],
        monthlyDeductions: [
          {
            deductionCost: values.waterMonthyDeduction,
            date: new MonthYear(),
          },
        ],
      });
    },
  });

  return (
    <>
      <GroupedForm<InitializationInput, InitializationGroups>
        {...initializationFormConfig.formGroupConfig}
        formErrors={formErrors}
      >
        {({ containers }) => (
          <>
            <containers.property>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={3}>
                  <NumberTextField
                    required
                    id="numberOfApartments"
                    label="Anzahl der Wohnungen"
                    value={formInput.numberOfApartments}
                    onChange={formInputSetters.numberOfApartments}
                    errorMessage={formErrors.numberOfApartments}
                    min={1}
                    onlyInteger
                  />
                </Grid>
              </Grid>
              <Grid
                container
                columnSpacing={2}
                rowSpacing={2}
                sx={styles.container}
              >
                <Grid item xs={3}>
                  <NumberTextField
                    required
                    id="zipCodeProperty"
                    label="Postleitzahl"
                    value={formInput.zipCodeProperty}
                    onChange={formInputSetters.zipCodeProperty}
                    errorMessage={formErrors.zipCodeProperty}
                    min={1}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="cityProperty"
                    label="Stadt"
                    value={formInput.cityProperty}
                    onChange={(event) => formInputSetters.cityProperty(event.target.value)}
                    error={!!formErrors.cityProperty}
                    helperText={formErrors.cityProperty}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="streetProperty"
                    label="Straße"
                    value={formInput.streetProperty}
                    onChange={(event) => formInputSetters.streetProperty(event.target.value)}
                    error={!!formErrors.streetProperty}
                    helperText={formErrors.streetProperty}
                  />
                </Grid>
                <Grid item xs={3}>
                  <NumberTextField
                    required
                    id="houseNumberProperty"
                    label="Hausnummer"
                    value={formInput.houseNumberProperty}
                    onChange={formInputSetters.houseNumberProperty}
                    errorMessage={formErrors.houseNumberProperty}
                    min={1}
                    onlyInteger
                  />
                </Grid>
              </Grid>
            </containers.property>
            <containers.landlord>
              <Grid
                container
                columnSpacing={2}
                rowSpacing={2}
                sx={styles.container}
              >
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    id="companyLandlord"
                    label="Vermietungsunternehmen / Gemeinschaft"
                    value={formInput.companyLandlord}
                    onChange={(event) => formInputSetters.companyLandlord(event.target.value)}
                    error={!!formErrors.companyLandlord}
                    helperText={formErrors.companyLandlord}
                  />
                </Grid>
                <Grid item xs={3}>
                  <SalutationSelect
                    value={formInput.salutationLandlord as Salutation}
                    onChange={formInputSetters.salutationLandlord}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="firstNameLandlord"
                    label="Vorname"
                    value={formInput.firstNameLandlord}
                    onChange={(event) => formInputSetters.firstNameLandlord(event.target.value)}
                    error={!!formErrors.firstNameLandlord}
                    helperText={formErrors.firstNameLandlord}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="lastNameLandlord"
                    label="Nachname"
                    value={formInput.lastNameLandlord}
                    onChange={(event) => formInputSetters.lastNameLandlord(event.target.value)}
                    error={!!formErrors.lastNameLandlord}
                    helperText={formErrors.lastNameLandlord}
                  />
                </Grid>
                <Grid item xs={3}>
                  <NumberTextField
                    required
                    id="zipCodeLandlord"
                    label="Postleitzahl"
                    value={formInput.zipCodeLandlord}
                    onChange={formInputSetters.zipCodeLandlord}
                    errorMessage={formErrors.zipCodeLandlord}
                    min={1}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="cityLandlord"
                    label="Stadt"
                    value={formInput.cityLandlord}
                    onChange={(event) => formInputSetters.cityLandlord(event.target.value)}
                    error={!!formErrors.cityLandlord}
                    helperText={formErrors.cityLandlord}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="streetLandlord"
                    label="Straße"
                    value={formInput.streetLandlord}
                    onChange={(event) => formInputSetters.streetLandlord(event.target.value)}
                    error={!!formErrors.streetLandlord}
                    helperText={formErrors.streetLandlord}
                  />
                </Grid>
                <Grid item xs={3}>
                  <NumberTextField
                    required
                    id="houseNumberLandlord"
                    label="Hausnummer"
                    value={formInput.houseNumberLandlord}
                    onChange={formInputSetters.houseNumberLandlord}
                    errorMessage={formErrors.houseNumberLandlord}
                    min={1}
                    onlyInteger
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="emailLandlord"
                    label="Email"
                    value={formInput.emailLandlord}
                    onChange={(event) => formInputSetters.emailLandlord(event.target.value)}
                    error={!!formErrors.emailLandlord}
                    helperText={formErrors.emailLandlord}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="phoneLandlord"
                    label="Telefonnummer"
                    value={formInput.phoneLandlord}
                    onChange={(event) => formInputSetters.phoneLandlord(event.target.value)}
                    error={!!formErrors.phoneLandlord}
                    helperText={formErrors.phoneLandlord}
                  />
                </Grid>
              </Grid>
              <h3>Kontoinformation</h3>
              <Grid
                container
                columnSpacing={2}
                rowSpacing={2}
                sx={styles.container}
              >
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="bankaccountHolderLandlord"
                    label="Kontoinhaber"
                    value={formInput.bankaccountHolderLandlord}
                    onChange={(event) => formInputSetters.bankaccountHolderLandlord(
                      event.target.value,
                    )}
                    error={!!formErrors.bankaccountHolderLandlord}
                    helperText={formErrors.bankaccountHolderLandlord}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="bankaccountIBANLandlord"
                    label="IBAN"
                    value={formInput.bankaccountIBANLandlord}
                    onChange={(event) => formInputSetters.bankaccountIBANLandlord(
                      event.target.value,
                    )}
                    error={!!formErrors.bankaccountIBANLandlord}
                    helperText={formErrors.bankaccountIBANLandlord}
                  />
                </Grid>
              </Grid>
            </containers.landlord>
            <containers.other>
              <h3>Wasserkosten</h3>
              <Grid
                container
                columnSpacing={2}
                rowSpacing={2}
                sx={styles.container}
              >
                <Grid item xs={6}>
                  <CurrencyInputField
                    required
                    id="waterUsageCost"
                    label="Wasserkosten (pro m³)"
                    value={formInput.waterUsageCost}
                    onChange={formInputSetters.waterUsageCost}
                    errorMessage={formErrors.waterUsageCost}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CurrencyInputField
                    required
                    id="sewageCost"
                    label="Abwasserkosten (pro m³)"
                    value={formInput.sewageCost}
                    onChange={formInputSetters.sewageCost}
                    errorMessage={formErrors.sewageCost}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CurrencyInputField
                    required
                    id="waterMonthyDeduction"
                    label="Monatlicher Abschlag"
                    value={formInput.waterMonthyDeduction}
                    onChange={formInputSetters.waterMonthyDeduction}
                    errorMessage={formErrors.waterMonthyDeduction}
                  />
                </Grid>
              </Grid>
              <h3>Mieterhöhung</h3>
              <Grid
                container
                columnSpacing={2}
                rowSpacing={2}
                sx={styles.container}
              >
                <Grid item xs={6}>
                  <TextInputField
                    required
                    id="rentIndexUrl"
                    label="Mietspiegel Url"
                    value={formInput.rentIndexUrl}
                    onChange={formInputSetters.rentIndexUrl}
                    errorMessage={formErrors.rentIndexUrl}
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumberTextField
                    required
                    id="cappingLimit"
                    label="Kappungsgrenze"
                    value={formInput.cappingLimit}
                    onChange={formInputSetters.cappingLimit}
                    errorMessage={formErrors.cappingLimit}
                    unit="%"
                    min={1}
                    max={20}
                    onlyInteger
                  />
                </Grid>
              </Grid>
            </containers.other>
          </>
        )}
      </GroupedForm>
      <FormSubmitButton />
    </>
  );
}

export default InitializationForm;
