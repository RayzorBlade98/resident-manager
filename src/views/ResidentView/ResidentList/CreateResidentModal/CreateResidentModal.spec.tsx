/* eslint-disable max-len */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import CreateResidentModal from './CreateResidentModal';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { Month } from '_/types/date';
import { convertCurrencyEurosToCents } from '_/utils/currency/currency';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import * as ResidentModule from '_types/resident';

describe('CreateResidentModal', () => {
  const FIRST_NAME_FIELD = 'firstName';
  const LAST_NAME_FIELD = 'lastName';
  const RENT_FIELD = 'rent';
  const INCIDENTALS_FIELD = 'incidentals';

  let renderResult: RenderResult;
  let onModalCloseCallback: jest.Mock;
  let addResidentSpy: jest.SpyInstance;

  function setupRendering(show = true): void {
    onModalCloseCallback = jest.fn();
    renderResult = render(
      <RecoilTestWrapper>
        <CreateResidentModal show={show} onClose={onModalCloseCallback} />
      </RecoilTestWrapper>,
    );
  }

  function addInput(field: string, value: string | number | null): void {
    const inputField = renderResult.container.querySelector(`#${field}`)!;
    expect(inputField).toBeDefined();
    fireEvent.change(inputField, { target: { value } });
  }

  function getErrorMessage(field: string): Element | null {
    return renderResult.container.querySelector(`#${field}-helper-text`);
  }

  function clickSubmit(): void {
    const submitButton = renderResult.container.querySelector(
      '.modal-footer button',
    )!;
    fireEvent.click(submitButton);
  }

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 2, 6));
    setupRendering();
    addResidentSpy = jest.spyOn(ResidentStateManager, 'addResident');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should render modal if show is true', () => {
    // Assert
    const modal = renderResult.container.querySelector('.modal');
    expect(modal).toBeDefined();
  });

  test("Shouldn't render modal if show is false", () => {
    // Arrange
    setupRendering(false);

    // Assert
    const modal = renderResult.container.querySelector('.modal');
    expect(modal).toBeNull();
  });

  test.each([
    [FIRST_NAME_FIELD, ''],
    [LAST_NAME_FIELD, ''],
    [RENT_FIELD, null],
    [RENT_FIELD, 0],
    [RENT_FIELD, -1],
    [INCIDENTALS_FIELD, null],
    [INCIDENTALS_FIELD, 0],
    [INCIDENTALS_FIELD, -1],
  ])('should show error message for field %s with input %s', (field, input) => {
    // Act
    addInput(field, input);

    // Assert
    const errorMessage = getErrorMessage(field);
    expect(errorMessage).toBeDefined();
  });

  test.each([
    [FIRST_NAME_FIELD, 'Max'],
    [LAST_NAME_FIELD, 'Mustermann'],
    [RENT_FIELD, 500],
    [INCIDENTALS_FIELD, 100],
  ])(
    'should show no error message for field %s with input %s',
    (field, input) => {
      // Act
      addInput(field, input);

      // Assert
      const errorMessage = getErrorMessage(field);
      expect(errorMessage).toBeDefined();
    },
  );

  test('should call onClose when closing with the X', () => {
    // Arrange
    const exitButton = renderResult.container.querySelector(
      '.modal-header button',
    )!;

    // Act
    fireEvent.click(exitButton);

    // Assert
    expect(onModalCloseCallback).toHaveBeenCalledTimes(1);
  });

  test('should handle submit with wrong inputs right', () => {
    // Act
    clickSubmit();

    // Assert
    expect(onModalCloseCallback).toHaveBeenCalledTimes(0);
    expect(addResidentSpy).toHaveBeenCalledTimes(0);
  });

  test('should handle submit with right inputs right', () => {
    // Arrange
    const createResidentSpy = jest.spyOn(ResidentModule, 'createResident');
    const inputArgs: ResidentModule.CreateResidentArguments = {
      firstName: 'Max',
      lastName: 'Mustermann',
      rent: 500,
      incidentals: 100,
      contractStart: {
        month: Month.March,
        year: 2023,
      },
    };

    // Act
    addInput(FIRST_NAME_FIELD, inputArgs.firstName);
    addInput(LAST_NAME_FIELD, inputArgs.lastName);
    addInput(RENT_FIELD, inputArgs.rent);
    addInput(INCIDENTALS_FIELD, inputArgs.incidentals);
    clickSubmit();

    // Assert
    expect(createResidentSpy).toHaveBeenCalled();
    expect(createResidentSpy).toHaveBeenCalledWith({
      ...inputArgs,
      rent: convertCurrencyEurosToCents(inputArgs.rent!),
      incidentals: convertCurrencyEurosToCents(inputArgs.incidentals!),
    });
    expect(addResidentSpy).toHaveBeenCalledTimes(1);
    expect(onModalCloseCallback).toHaveBeenCalledTimes(1);
  });
});
