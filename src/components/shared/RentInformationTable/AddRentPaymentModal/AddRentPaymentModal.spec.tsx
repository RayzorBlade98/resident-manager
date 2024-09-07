import { act, fireEvent, render } from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import AddRentPaymentModal from './AddRentPaymentModal';
import MonthYear from '_/extensions/date/month_year.extension';
import useResident from '_/hooks/useResident/useResident';
import * as useResidentModule from '_/hooks/useResident/useResident';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

describe('AddRentPaymentModal', () => {
  let baseElement: HTMLElement;
  let useReisdentSpy: jest.SpyInstance;
  const useResidentMockReturn = mock<ReturnType<typeof useResident>>();
  const onCloseModalMock = jest.fn();

  const resident = new ResidentBuilder().build();
  const rentInformation = new RentInformationBuilder()
    .withDueDate(new MonthYear(8, 2024))
    .withRent(50000)
    .withIncidentals(10000)
    .build();

  const validInputValues = {
    paymentAmount: 10000,
    paymentDate: new Date(2024, 8, 7).toUTC(),
  };

  const invalidInputValues = {
    paymentAmount: undefined,
    paymentDate: undefined,
  };

  function inputToForm(inputValues: {
    paymentAmount: CurrencyInCents | undefined;
    paymentDate: Date | undefined;
  }) {
    function input(element: Element | null, value: string | undefined) {
      if (!element) {
        throw new Error(`Missing element for value ${value}`);
      }
      fireEvent.change(element, {
        target: { value },
      });
    }

    act(() => {
      input(
        baseElement.querySelector('#paymentDate'),
        inputValues.paymentDate?.toPreferredString() ?? '',
      );

      input(
        baseElement.querySelector('#paymentAmount'),
        inputValues.paymentAmount
          ? (inputValues.paymentAmount / 100).toString()
          : '',
      );
    });
  }

  function submitForm() {
    const button = baseElement.querySelector('.MuiButton-contained')!;
    act(() => {
      fireEvent.click(button);
    });
  }

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 8, 1));
  });

  beforeEach(() => {
    baseElement = render(
      <ReactTestWrapper>
        <AddRentPaymentModal
          show
          onCloseModal={onCloseModalMock}
          resident={resident}
          rentInformation={rentInformation}
        />
      </ReactTestWrapper>,
    ).baseElement;

    useReisdentSpy = jest
      .spyOn(useResidentModule, 'default')
      .mockReturnValue(useResidentMockReturn);
  });

  test('should match image snapshot (default values)', async () => {
    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 600 } }),
    ).toMatchImageSnapshot();
  });

  test('should match image snapshot (valid inputs)', async () => {
    // Act
    inputToForm(validInputValues);

    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 600 } }),
    ).toMatchImageSnapshot();
  });

  test('should match image snapshot (invalid inputs)', async () => {
    // Act
    inputToForm(invalidInputValues);
    submitForm();

    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 600 } }),
    ).toMatchImageSnapshot();
  });

  test('should update resident on submit', () => {
    // Arrange
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    expect(useReisdentSpy).toHaveBeenLastCalledWith(resident.id);
    expect(useResidentMockReturn.addRentPayment).toHaveBeenCalledTimes(1);
    expect(useResidentMockReturn.addRentPayment).toHaveBeenCalledWith({
      dueDate: rentInformation.dueDate,
      ...validInputValues,
    });
  });
});
