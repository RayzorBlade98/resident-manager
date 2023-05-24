import {
  Button, Grid, InputAdornment, TextField,
} from '@mui/material';
import React, { useState } from 'react';
import GenericModal from '../../GenericComponents/GenericModal/GenericModal';
// eslint-disable-next-line max-len
import GenericDatePicker from '_/components/GenericComponents/GenericDatePicker/GenericDatePicker';
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
  onSave: (paymentAmount: CurrencyInCents, paymentDate: Date) => void;
}

interface RentPaymentInput {
  paymentAmount: CurrencyInCents | null;
  paymentDate: Date;
}

/**
 * Modal that provides functionality to insert payment information
 */
function AddRentPaymentModal(props: AddRentPaymentModalProps): JSX.Element {
  const [payment, setPayment] = useState<RentPaymentInput>({
    paymentAmount: null,
    paymentDate: new Date(),
  });
  const [errors, setErrors] = useState<
  ValidationErrorMessages<RentPaymentInput>
  >({});

  const validatePayment = createValidationFunction<RentPaymentInput>({
    paymentAmount: [ValidationError.Null, ValidationError.LessEqualZero],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setPaymentField(field: string, value: any): void {
    const newPayment = {
      ...payment,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  function paymentUpdater(field: string) {
    function updatePayment(event: React.ChangeEvent<HTMLInputElement>): void {
      let value: number | string = event.target.value;
      if (field === 'paymentAmount') {
        value = Number(value);
        value = convertCurrencyEurosToCents(value);
      }
      setPaymentField(field, value);
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
            <GenericDatePicker
              id="paymentDate"
              label="Zahlungsempfang"
              onChange={(date: Date) => setPaymentField('paymentDate', date)}
              errorMessage={errors.paymentDate}
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
