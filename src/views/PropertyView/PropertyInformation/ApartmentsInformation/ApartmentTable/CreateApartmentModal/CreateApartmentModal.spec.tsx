/* eslint-disable no-await-in-loop */

import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import _ from 'lodash';
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
    genericRooms: 4,
    kitchenRooms: 1,
    bathRooms: 2,
    hallwayRooms: 1,
    basementRooms: 0,
    gardenRooms: 5,
  };

  const invalidInputValues = {
    floor: '',
    location: '',
    genericRooms: undefined,
    kitchenRooms: undefined,
    bathRooms: undefined,
    hallwayRooms: undefined,
    basementRooms: undefined,
    gardenRooms: undefined,
  };

  function inputToForm(inputValues: {
    floor: string;
    location: string;
    genericRooms: number | undefined;
    kitchenRooms: number | undefined;
    bathRooms: number | undefined;
    hallwayRooms: number | undefined;
    basementRooms: number | undefined;
    gardenRooms: number | undefined;
  }) {
    function input(element: Element | null, value: string | undefined) {
      if (!element) {
        throw new Error(`Missing element for value ${value}`);
      }
      fireEvent.change(element, {
        target: { value },
      });
    }

    const tabs = baseElement.querySelectorAll('.MuiTab-root');
    act(() => {
      fireEvent.click(tabs.item(0));
      input(baseElement.querySelector('#floor'), inputValues.floor);
      input(baseElement.querySelector('#location'), inputValues.location);

      fireEvent.click(tabs.item(1));
      input(
        baseElement.querySelector('#genericRooms'),
        inputValues.genericRooms?.toString(),
      );
      input(
        baseElement.querySelector('#kitchenRooms'),
        inputValues.kitchenRooms?.toString(),
      );
      input(
        baseElement.querySelector('#bathRooms'),
        inputValues.bathRooms?.toString(),
      );
      input(
        baseElement.querySelector('#basementRooms'),
        inputValues.basementRooms?.toString(),
      );
      input(
        baseElement.querySelector('#hallwayRooms'),
        inputValues.hallwayRooms?.toString(),
      );
      input(
        baseElement.querySelector('#gardenRooms'),
        inputValues.gardenRooms?.toString(),
      );
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
      emptyParkingSpaces: [],
      addApartment: addApartmentMock,
      addParkingSpace: jest.fn(),
    });

    baseElement = render(
      <ReactTestWrapper>
        <CreateApartmentModal showModal onCloseModal={onCloseModalMock} />
      </ReactTestWrapper>,
    ).baseElement;
  });

  test('should match image snapshot (valid inputs)', async () => {
    // Act
    inputToForm(validInputValues);

    // Assert
    const tabs = baseElement.querySelectorAll('.MuiTab-root');

    for (const tab of tabs) {
      fireEvent.click(tab);
      expect(
        await generateImage({ viewport: { width: 650, height: 600 } }),
      ).toMatchImageSnapshot();
    }
  });

  test('should match image snapshot (invalid inputs)', async () => {
    // Act
    inputToForm(invalidInputValues);
    submitForm();

    // Assert
    const tabs = baseElement.querySelectorAll('.MuiTab-root');

    for (const tab of tabs) {
      fireEvent.click(tab);
      expect(
        await generateImage({ viewport: { width: 650, height: 600 } }),
      ).toMatchImageSnapshot();
    }
  });

  test('should add apartment on submit', () => {
    // Arrange
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    expect(addApartmentMock).toHaveBeenCalledTimes(1);
    expect(addApartmentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        ..._.pick(validInputValues, ['floor', 'location']),
        rooms: {
          generic: validInputValues.genericRooms,
          kitchen: validInputValues.kitchenRooms,
          basement: validInputValues.basementRooms,
          bath: validInputValues.bathRooms,
          hallway: validInputValues.hallwayRooms,
          garden: validInputValues.gardenRooms,
        },
      }),
    );
  });
});
