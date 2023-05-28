import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Tooltip } from '@mui/material';
import React from 'react';
import {
  PaymentStatus,
  RentInformation,
  RentInformationUtils,
} from '_/types/rent';
import {
  CurrencyInCents,
  convertCurrencyCentsToString,
} from '_/utils/currency/currency';
import { dateToString } from '_/utils/date';

interface PaymentStatusIconProps {
  /**
   * Rentinformation for which the status should be dispayed
   */
  rentInformation: RentInformation;
}

/**
 * Icon that displays the payment status of a rent information
 */
function PaymentStatusIcon(props: PaymentStatusIconProps): JSX.Element {
  const paymentStatus = RentInformationUtils.getPaymentStatus(
    props.rentInformation,
  );

  const tooltip = (): string => {
    switch (paymentStatus) {
      case PaymentStatus.Paid:
        return `Bezahlt am ${dateToString(
          props.rentInformation.paymentDate as Date,
        )}`;
      case PaymentStatus.Unpaid:
        return 'Unbezahlt';
      case PaymentStatus.PaidPartially:
        return `Teilweise bezahlt am ${dateToString(
          props.rentInformation.paymentDate as Date,
        )} (${convertCurrencyCentsToString(
          props.rentInformation.paymentAmount as CurrencyInCents,
        )} von ${convertCurrencyCentsToString(
          RentInformationUtils.getAmountToPay(props.rentInformation),
        )})`;
      default:
        throw new Error(`Tooltip for status ${paymentStatus} not implemted`);
    }
  };

  const icon = (): JSX.Element => {
    switch (paymentStatus) {
      case PaymentStatus.Paid:
        return <CheckCircleOutlineIcon color="success" />;
      case PaymentStatus.Unpaid:
        return <HighlightOffIcon color="error" />;
      case PaymentStatus.PaidPartially:
        return <CheckCircleOutlineIcon color="warning" />;
      default:
        throw new Error(`Icon for status ${paymentStatus} not implemted`);
    }
  };

  return (
    <Tooltip title={tooltip()} arrow>
      {icon()}
    </Tooltip>
  );
}

export default PaymentStatusIcon;