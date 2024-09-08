import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import CreateOngoingIncidentalsModal from './CreateOngoingIncidentalsModal';
import * as useIncidentalsStateModule from '_/hooks/useIncidentalsState/useIncidentalsState';
import { DeductionType } from '_/models/incidentals/deduction_type';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateOngoingIncidentalsModal', () => {
  let baseElement: HTMLElement;
  const addIncidentalsSpy = jest.fn();
  const onCloseModalMock = jest.fn();

  const validInputValues = {
    name: 'invoice',
    deductionType: DeductionType.PerApartment,
    invoiceInterval: 1,
  };

  const invalidInputValues = {
    name: '',
    deductionType: DeductionType.PerApartment,
    invoiceInterval: undefined,
  };

  const currentDate = new Date(2023, 11, 2);
  const expectedIncidentals: Omit<OngoingIncidentals, 'id'> = {
    name: validInputValues.name,
    costs: [],
    deductionType: validInputValues.deductionType,
    invoiceInterval: validInputValues.invoiceInterval,
  };

  function inputToForm(inputValues: {
    name: string;
    invoiceInterval: number | undefined;
  }) {
    const inputFields = baseElement.querySelectorAll('input');
    const inputs = [
      inputValues.name,
      inputValues.invoiceInterval?.toString() ?? '',
    ];
    act(() => {
      inputs.forEach((input, i) => fireEvent.change(inputFields.item(i === 0 ? i : i + 1), {
        target: { value: input },
      }));
    });
  }

  function submitForm() {
    const button = baseElement.querySelectorAll('button').item(1);
    act(() => {
      fireEvent.click(button);
    });
  }

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(currentDate);
  });

  beforeEach(() => {
    jest.spyOn(useIncidentalsStateModule, 'default').mockReturnValue({
      incidentals: { ongoingIncidentals: [], oneTimeIncidentals: [] },
      ongoingIncidentals: [],
      oneTimeIncidentals: [],
      addOngoingIncidentals: addIncidentalsSpy,
      addOneTimeIncidentals: jest.fn(),
    });

    baseElement = render(
      <ReactTestWrapper>
        <CreateOngoingIncidentalsModal
          showModal
          onCloseModal={onCloseModalMock}
        />
      </ReactTestWrapper>,
    ).baseElement;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should match image snapshot (valid inputs)', async () => {
    // Arrange
    inputToForm(validInputValues);

    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 400 } }),
    ).toMatchImageSnapshot();
  });

  test('should match image snapshot (invalid inputs)', async () => {
    // Act
    inputToForm(invalidInputValues);
    submitForm();

    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 450 } }),
    ).toMatchImageSnapshot();
  });

  test('should add incidentals on submit', () => {
    // Arrange
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    expect(addIncidentalsSpy).toHaveBeenCalledTimes(1);
    expect(addIncidentalsSpy).toHaveBeenCalledWith(
      expect.objectContaining(expectedIncidentals),
    );
    expect(onCloseModalMock).toHaveBeenCalledTimes(1);
  });
});
