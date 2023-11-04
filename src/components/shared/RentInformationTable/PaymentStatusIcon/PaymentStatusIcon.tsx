import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Tooltip } from '@mui/material';
import React from 'react';
import '_/extensions/date/date.extension';
import { convertCurrencyCentsToString, CurrencyInCents } from '../../../../utils/currency/currency.utils';
import RentInformationUtils from '../../../../utils/rent/rent.utils';
import { PaymentStatus, RentInformation } from '_/models/resident/rent';

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
        return `Bezahlt am ${(
          props.rentInformation.paymentDate as Date
        ).toPreferredString()}`;
      case PaymentStatus.Unpaid:
        return 'Unbezahlt';
      case PaymentStatus.PaidPartially:
        return `Teilweise bezahlt am ${(
          props.rentInformation.paymentDate as Date
        ).toPreferredString()} (${convertCurrencyCentsToString(
          props.rentInformation.paymentAmount as CurrencyInCents,
        )} von ${convertCurrencyCentsToString(
          RentInformationUtils.getAmountToPay(props.rentInformation),
        )})`;
      case PaymentStatus.DeductedInInvoice:
        return 'In Nebenkostenrechnung abgerechnet';
      /* istanbul ignore next */
      default:
        throw new Error(`Tooltip for status ${paymentStatus} not implemted`);
    }
  };

  const icon = (): JSX.Element => {
    switch (paymentStatus) {
      case PaymentStatus.Paid:
      case PaymentStatus.DeductedInInvoice:
        return <CheckCircleOutlineIcon color="success" />;
      case PaymentStatus.Unpaid:
        return <HighlightOffIcon color="error" />;
      case PaymentStatus.PaidPartially:
        return <CheckCircleOutlineIcon color="warning" />;
      /* istanbul ignore next */
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
