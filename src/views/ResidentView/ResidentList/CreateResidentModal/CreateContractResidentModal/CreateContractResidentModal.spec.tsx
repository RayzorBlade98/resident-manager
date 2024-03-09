import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import CreateContractResidentModal from './CreateContractResidentModal';
import { Salutation } from '_/models/name';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateContractResidentModal', () => {
  let baseElement: HTMLElement;
  const onCloseMock = jest.fn();
  const onSubmitMock = jest.fn();

  const validInputValues = {
    salutation: Salutation.Male,
    firstName: 'Max',
    lastName: 'Mustermann',
  };

  const invalidInputValues = {
    salutation: Salutation.Female,
    firstName: '',
    lastName: '',
  };

  function inputToForm(inputValues: { firstName: string; lastName: string }) {
    function input(element: Element | null, value: string | undefined) {
      if (!element) {
        throw new Error(`Missing element for value ${value}`);
      }
      fireEvent.change(element, {
        target: { value },
      });
    }

    act(() => {
      input(baseElement.querySelector('#firstName'), inputValues.firstName);
      input(baseElement.querySelector('#lastName'), inputValues.lastName);
    });
  }

  function submitForm() {
    const button = baseElement.querySelector('.MuiButton-contained')!;
    act(() => {
      fireEvent.click(button);
    });
  }

  beforeEach(() => {
    baseElement = render(
      <ReactTestWrapper>
        <CreateContractResidentModal
          show
          onClose={onCloseMock}
          onSubmit={onSubmitMock}
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
      await generateImage({ viewport: { width: 650, height: 400 } }),
    ).toMatchImageSnapshot();
  });

  test('should submit created resident', () => {
    // Arrange
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith({
      name: {
        salutation: validInputValues.salutation,
        firstName: validInputValues.firstName,
        lastName: validInputValues.lastName,
      },
    });
  });
});
