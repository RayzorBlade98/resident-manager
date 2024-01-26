import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import CreateApartmentModal from './CreateApartmentModal';
import * as usePropertyStateModule from '_/hooks/usePropertyState/usePropertyState';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import PropertyBuilder from '_/test/builders/property.builder';

describe('CreateApartmentModal', () => {
  let baseElement: HTMLElement;
  const addApartmentMock = jest.fn();
  const onCloseModalMock = jest.fn();

  const validInputValues = {
    floor: 'EG',
    location: 'middle',
    rooms: 4,
  };

  const invalidInputValues = {
    floor: '',
    location: '',
    rooms: undefined,
  };

  function inputToForm(inputValues: {
    floor: string;
    location: string;
    rooms: number | undefined;
  }) {
    const inputFields = baseElement.querySelectorAll('input');
    const inputs = [inputValues.floor, inputValues.location, inputValues.rooms];
    act(() => {
      inputs.forEach((input, i) => fireEvent.change(inputFields.item(i), {
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
    jest.spyOn(usePropertyStateModule, 'default').mockReturnValue({
      property: new PropertyBuilder().build(),
      addApartment: addApartmentMock,
    });

    baseElement = render(
      <ReactTestWrapper>
        <CreateApartmentModal
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

  test('should add apartment on submit', () => {
    // Arrange
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    expect(addApartmentMock).toHaveBeenCalledTimes(1);
    expect(addApartmentMock).toHaveBeenCalledWith(
      expect.objectContaining(validInputValues),
    );
  });
});
