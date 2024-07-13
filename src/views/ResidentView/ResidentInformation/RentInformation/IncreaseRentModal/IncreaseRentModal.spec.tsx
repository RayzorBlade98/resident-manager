import { act, fireEvent, render } from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import IncreaseRentModal from './IncreaseRentModal';
import MonthYear from '_/extensions/date/month_year.extension';
import useResident from '_/hooks/useResident/useResident';
import * as useResidentModule from '_/hooks/useResident/useResident';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ResidentBuilder from '_/test/builders/resident.builder';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

describe('IncreaseRentModal', () => {
  let baseElement: HTMLElement;
  const useResidentMock = mock<ReturnType<typeof useResident>>();
  const onCloseModalMock = jest.fn();

  const resident = new ResidentBuilder().build();

  const validInputValues = {
    newRent: 10000,
    firstMonth: new MonthYear(8, 2024),
  };

  const invalidInputValues = {
    newRent: undefined,
    firstMonth: undefined,
  };

  function inputToForm(inputValues: {
    newRent: CurrencyInCents | undefined;
    firstMonth: MonthYear | undefined;
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
        baseElement.querySelector('#firstMonth'),
        inputValues.firstMonth?.toPreferredString().slice(3) ?? '',
      );

      input(
        baseElement.querySelector('#newRent'),
        inputValues.newRent ? (inputValues.newRent / 100).toString() : '',
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
    jest.setSystemTime(new MonthYear(6, 2024));
  });

  beforeEach(() => {
    baseElement = render(
      <ReactTestWrapper>
        <IncreaseRentModal
          show
          onClose={onCloseModalMock}
          resident={resident}
        />
      </ReactTestWrapper>,
    ).baseElement;

    jest.spyOn(useResidentModule, 'default').mockReturnValue(useResidentMock);
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
    expect(useResidentMock.increaseRent).toHaveBeenCalledTimes(1);
    expect(useResidentMock.increaseRent).toHaveBeenCalledWith({
      newRent: validInputValues.newRent,
      monthForIncrease: validInputValues.firstMonth,
    });
  });
});
