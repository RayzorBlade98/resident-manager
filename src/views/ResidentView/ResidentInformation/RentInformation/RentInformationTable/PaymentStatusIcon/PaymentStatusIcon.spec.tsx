import { render } from '@testing-library/react';
import React from 'react';
import PaymentStatusIcon from './PaymentStatusIcon';
import { PaymentStatus, RentInformationUtils } from '_/types/rent';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import RentInformationBuilder from '_tests/__test_utils__/builders/rent_information_builder';

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
      <RecoilTestWrapper>
        <PaymentStatusIcon rentInformation={rentInformation} />
      </RecoilTestWrapper>,
    );

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
