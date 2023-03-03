import {
  Button, Grid, InputAdornment, TextField,
} from '@mui/material';
import React, { useState } from 'react';
import GenericModal from '../../GenericComponents/GenericModal/GenericModal';
import { DateInputString, DateString, DateUtils } from '_/types/date';
import { CurrencyInCents, convertCurrencyEurosToCents } from '_/utils/currency';
import {
  ValidationError,
  ValidationErrorMessages,
  createValidationFunction,
} from '_/utils/validation';

export interface AddRentPaymentModalProps {
  show: boolean;

  /**
   * Callback when the modal is closed
   */
  onClose: () => void;

  /**
   * Callback when the payment input gets submitted
   * @param paymentAmount Amount that was paid
   * @param paymentDate Date on which the payment was received
   */
  onSave: (paymentAmount: CurrencyInCents, paymentDate: DateString) => void;
}

interface RentPaymentInput {
  paymentAmount: CurrencyInCents | null;
  paymentDate: DateString;
}

/**
 * Modal that provides functionality to insert payment information
 */
function AddRentPaymentModal(props: AddRentPaymentModalProps): JSX.Element {
  const [payment, setPayment] = useState<RentPaymentInput>({
    paymentAmount: null,
    paymentDate: DateUtils.getCurrentDate(),
  });
  const [errors, setErrors] = useState<
  ValidationErrorMessages<RentPaymentInput>
  >({});

  const validatePayment = createValidationFunction<RentPaymentInput>({
    paymentAmount: [ValidationError.Null, ValidationError.LessEqualZero],
  });

  function paymentUpdater(field: string) {
    function updatePayment(event: React.ChangeEvent<HTMLInputElement>): void {
      let value: number | string = event.target.value;
      if (field === 'paymentAmount') {
        value = Number(value);
        value = convertCurrencyEurosToCents(value);
      } else if (field === 'paymentDate') {
        value = DateUtils.convertDateInputString(value as DateInputString);
      }
      const newPayment = {
        ...payment,
        [field]: value,
      };
      setPayment(newPayment);
      setErrors({
        ...errors,
        [field]: validatePayment(
          newPayment,
          field as keyof ValidationErrorMessages<RentPaymentInput>,
        ),
      });
    }
    return updatePayment;
  }

  function onSave(): void {
    const newErrors = validatePayment(
      payment,
    ) as ValidationErrorMessages<RentPaymentInput>;
    const numberOfErrors = Object.keys(newErrors).filter(
      (k) => !!newErrors[k as keyof ValidationErrorMessages<RentPaymentInput>],
    ).length;
    if (numberOfErrors > 0) {
      setErrors(newErrors);
      return;
    }
    props.onSave(payment.paymentAmount as CurrencyInCents, payment.paymentDate);
  }

  return (
    <GenericModal
      title="Neue Zahlung"
      show={props.show}
      onClose={props.onClose}
      size="sm"
    >
      {/* Body */}
      <form>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12}>
            <TextField
              id="paymentAmount"
              label="Zahlungssumme"
              type="number"
              required
              onChange={paymentUpdater('paymentAmount')}
              InputProps={{
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
              error={!!errors.paymentAmount}
              helperText={errors.paymentAmount || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="paymentDate"
              label="Zahlungsempfang"
              type="date"
              required
              defaultValue={DateUtils.convertToDateInputString(
                payment.paymentDate,
              )}
              onChange={paymentUpdater('paymentDate')}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.paymentDate}
              helperText={errors.paymentDate || ''}
            />
          </Grid>
        </Grid>
      </form>
      {/* Footer */}
      <Button variant="contained" onClick={() => onSave()}>
        Hinzufügen
      </Button>
    </GenericModal>
  );
}

export default AddRentPaymentModal;
