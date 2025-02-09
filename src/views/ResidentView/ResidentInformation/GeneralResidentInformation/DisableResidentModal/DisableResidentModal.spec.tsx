import { act, fireEvent, render } from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { DisableResidentModal } from './DisableResidentModal';
import MonthYear from '_/extensions/date/month_year.extension';
import useResident from '_/hooks/useResident/useResident';
import * as useResidentModule from '_/hooks/useResident/useResident';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('DisableResidentModal', () => {
  let baseElement: HTMLElement;
  const useResidentMock = mock<ReturnType<typeof useResident>>();
  const onCloseModalMock = jest.fn();

  const resident = new ResidentBuilder().build();

  const validInputValues = {
    disabledAt: new MonthYear(1, 2025),
  };

  const invalidInputValues = {
    disabledAt: undefined,
  };

  function inputToForm(inputValues: {
    disabledAt: MonthYear | undefined;
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
        baseElement.querySelector('#disabledAt'),
        inputValues.disabledAt?.toPreferredString().slice(3) ?? '',
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
    jest.setSystemTime(new Date(2025, 11, 25));
  });

  beforeEach(() => {
    baseElement = render(
      <ReactTestWrapper>
        <DisableResidentModal
          showModal
          onCloseModal={onCloseModalMock}
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
    expect(useResidentMock.disableResident).toHaveBeenCalledTimes(1);
    expect(useResidentMock.disableResident).toHaveBeenCalledWith(validInputValues.disabledAt);
  });
});
