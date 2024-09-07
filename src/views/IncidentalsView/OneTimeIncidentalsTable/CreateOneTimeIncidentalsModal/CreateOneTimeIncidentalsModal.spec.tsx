import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import CreateOneTimeIncidentalsModal from './CreateOneTimeIncidentalsModal';
import * as useIncidentalsStateModule from '_/hooks/useIncidentalsState/useIncidentalsState';
import { DeductionType } from '_/models/incidentals/deduction_type';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateOneTimeIncidentalsModal', () => {
  let baseElement: HTMLElement;
  const addIncidentalsSpy = jest.fn();
  const onCloseModalMock = jest.fn();

  const validInputValues = {
    name: 'Testnebenkosten',
    cost: 10000,
    billingDate: new Date(2023, 5, 16).toUTC(),
    deductionType: DeductionType.PerApartment,
  };

  const invalidInputValues = {
    name: '',
    cost: undefined,
    billingDate: undefined,
    deductionType: DeductionType.PerResident,
  };

  function inputToForm(inputValues: {
    name: string;
    cost: number | undefined;
    billingDate: Date | undefined;
  }) {
    const inputFields = baseElement.querySelectorAll('input');
    const inputs = [
      inputValues.name,
      inputValues.cost ? (inputValues.cost / 100).toString() : undefined,
      inputValues.billingDate?.toPreferredString() ?? '',
    ];
    act(() => {
      inputs.forEach((input, i) => fireEvent.change(inputFields.item(i < 2 ? i : i + 1), {
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

  beforeEach(() => {
    jest.spyOn(useIncidentalsStateModule, 'default').mockReturnValue({
      incidentals: { ongoingIncidentals: [], oneTimeIncidentals: [] },
      ongoingIncidentals: [],
      oneTimeIncidentals: [],
      addOngoingIncidentals: jest.fn(),
      addOneTimeIncidentals: addIncidentalsSpy,
    });

    baseElement = render(
      <ReactTestWrapper>
        <CreateOneTimeIncidentalsModal
          showModal
          onCloseModal={onCloseModalMock}
        />
      </ReactTestWrapper>,
    ).baseElement;
  });

  test('should match image snapshot (valid inputs)', async () => {
    // Act
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
      expect.objectContaining(validInputValues),
    );
  });
});
