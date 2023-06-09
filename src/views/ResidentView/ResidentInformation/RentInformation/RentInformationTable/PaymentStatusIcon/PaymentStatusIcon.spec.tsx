import { render } from '@testing-library/react';
import React from 'react';
import RentInformationUtils from '../../../../../../utils/rent/rent.utils';
import PaymentStatusIcon from './PaymentStatusIcon';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import { PaymentStatus } from '_/types/rent';

describe('PaymentStatusIcon', () => {
  test.each([
    PaymentStatus.Paid,
    PaymentStatus.Unpaid,
    PaymentStatus.PaidPartially,
  ])('should match snapshot for payment status %s', (status) => {
    // Arrange
    const rentInformation = new RentInformationBuilder()
      .withPayment(1, new Date(2023, 4, 28))
      .build();
    jest
      .spyOn(RentInformationUtils, 'getPaymentStatus')
      .mockReturnValue(status);
    const renderResult = render(
      <ReactTestWrapper>
        <PaymentStatusIcon rentInformation={rentInformation} />
      </ReactTestWrapper>,
    );

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
