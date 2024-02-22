import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import CreateParkingSpaceModal from './CreateParkingSpaceModal';
import * as usePropertyStateModule from '_/hooks/usePropertyState/usePropertyState';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import PropertyBuilder from '_/test/builders/property.builder';

describe('CreateParkingSpaceModal', () => {
  let baseElement: HTMLElement;
  const addParkingSpaceMock = jest.fn();
  const onCloseModalMock = jest.fn();

  const validInputValues = {
    name: 'Parking Space 1',
  };

  const invalidInputValues = {
    name: '',
  };

  function inputToForm(inputValues: { name: string }) {
    function input(element: Element | null, value: string | undefined) {
      if (!element) {
        throw new Error(`Missing element for value ${value}`);
      }
      fireEvent.change(element, {
        target: { value },
      });
    }

    act(() => {
      input(baseElement.querySelector('#name'), inputValues.name);
    });
  }

  function submitForm() {
    const button = baseElement.querySelector('.MuiButton-contained')!;
    act(() => {
      fireEvent.click(button);
    });
  }

  beforeEach(() => {
    jest.spyOn(usePropertyStateModule, 'default').mockReturnValue({
      property: new PropertyBuilder().build(),
      emptyApartments: [],
      addApartment: jest.fn(),
      addParkingSpace: addParkingSpaceMock,
    });

    baseElement = render(
      <ReactTestWrapper>
        <CreateParkingSpaceModal showModal onCloseModal={onCloseModalMock} />
      </ReactTestWrapper>,
    ).baseElement;
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

  test('should add apartment on submit', () => {
    // Arrange
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    expect(addParkingSpaceMock).toHaveBeenCalledTimes(1);
    expect(addParkingSpaceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        ...validInputValues,
      }),
    );
  });
});
