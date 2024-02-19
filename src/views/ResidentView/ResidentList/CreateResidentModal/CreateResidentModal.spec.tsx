/* eslint-disable no-await-in-loop */

import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import CreateResidentModal from './CreateResidentModal';
import MonthYear from '_/extensions/date/month_year.extension';
import * as useResidentStateModule from '_/hooks/useResidentState/useResidentState';
import { Salutation } from '_/models/name';
import propertyState from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ApartmentBuilder from '_/test/builders/apartment.builder';
import PropertyBuilder from '_/test/builders/property.builder';

describe('CreateResidentModal', () => {
  let baseElement: HTMLElement;
  const addResidentSpy = jest.fn();
  const onCloseModalMock = jest.fn();
  const property = new PropertyBuilder()
    .addApartment(
      new ApartmentBuilder()
        .withFloor('1 OG')
        .withLocation('left')
        .withRooms({ generic: 3 })
        .build(),
    )
    .build();

  const validInputValues = {
    salutation: Salutation.Male,
    firstName: 'Max',
    lastName: 'Mustermann',
    rent: 50000,
    incidentals: 10000,
    contractStart: new MonthYear(0, 2024),
    waterMeter: 12345,
    numberOfResidents: 5,
    apartmentKeys: 1,
    basementKeys: 2,
    atticKeys: 3,
    frontDoorKeys: 4,
    mailboxKeys: 5,
  };

  const invalidInputValues = {
    salutation: Salutation.Female,
    firstName: '',
    lastName: '',
    rent: undefined,
    incidentals: undefined,
    contractStart: undefined,
    waterMeter: undefined,
    numberOfResidents: undefined,
    apartmentKeys: undefined,
    basementKeys: undefined,
    atticKeys: undefined,
    frontDoorKeys: undefined,
    mailboxKeys: undefined,
  };

  function inputToForm(inputValues: {
    firstName: string;
    lastName: string;
    rent: number | undefined;
    incidentals: number | undefined;
    contractStart: MonthYear | undefined;
    waterMeter: number | undefined;
    numberOfResidents: number | undefined;
    apartmentKeys: number | undefined;
    basementKeys: number | undefined;
    atticKeys: number | undefined;
    frontDoorKeys: number | undefined;
    mailboxKeys: number | undefined;
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
      input(baseElement.querySelector('#firstName'), inputValues.firstName);
      input(baseElement.querySelector('#lastName'), inputValues.lastName);
      input(
        baseElement.querySelector('#numberOfResidents'),
        inputValues.numberOfResidents?.toString(),
      );
      input(
        baseElement.querySelector('#contractStart'),
        inputValues.contractStart?.toPreferredString().slice(3) ?? '',
      );

      fireEvent.click(tabs.item(1));
      input(
        baseElement.querySelector('#rent'),
        inputValues.rent ? (inputValues.rent / 100).toString() : undefined,
      );
      input(
        baseElement.querySelector('#incidentals'),
        inputValues.incidentals
          ? (inputValues.incidentals / 100).toString()
          : undefined,
      );
      input(
        baseElement.querySelector('#waterMeter'),
        inputValues.waterMeter?.toString(),
      );

      fireEvent.click(tabs.item(2));
      input(
        baseElement.querySelector('#apartmentKeys'),
        inputValues.apartmentKeys?.toString(),
      );
      input(
        baseElement.querySelector('#basementKeys'),
        inputValues.basementKeys?.toString(),
      );
      input(
        baseElement.querySelector('#atticKeys'),
        inputValues.atticKeys?.toString(),
      );
      input(
        baseElement.querySelector('#frontDoorKeys'),
        inputValues.frontDoorKeys?.toString(),
      );
      input(
        baseElement.querySelector('#mailboxKeys'),
        inputValues.mailboxKeys?.toString(),
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
    jest.setSystemTime(validInputValues.contractStart.addMonths(1));
  });

  beforeEach(() => {
    jest.spyOn(useResidentStateModule, 'default').mockReturnValue({
      residents: [],
      addResident: addResidentSpy,
    });

    baseElement = render(
      <ReactTestWrapper
        initializationFunction={() => setRecoil(propertyState, property)}
      >
        <CreateResidentModal showModal onCloseModal={onCloseModalMock} />
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

  test('should add incidentals on submit', () => {
    // Arrange
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    expect(addResidentSpy).toHaveBeenCalledTimes(1);
    expect(addResidentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: {
          salutation: validInputValues.salutation,
          firstName: validInputValues.firstName,
          lastName: validInputValues.lastName,
        },
        rentInformation: [
          {
            dueDate: validInputValues.contractStart,
            rent: validInputValues.rent,
            incidentals: validInputValues.incidentals,
            paymentDate: undefined,
            paymentAmount: undefined,
            wasDeductedInInvoice: false,
          },
          {
            dueDate: validInputValues.contractStart.addMonths(1),
            rent: validInputValues.rent,
            incidentals: validInputValues.incidentals,
            paymentDate: undefined,
            paymentAmount: undefined,
            wasDeductedInInvoice: false,
          },
        ],
        numberOfResidents: validInputValues.numberOfResidents,
        contractStart: validInputValues.contractStart,
        waterMeterReadings: [
          {
            waterMeterCount: validInputValues.waterMeter,
            readingDate: validInputValues.contractStart,
            wasDeductedInInvoice: true,
          },
        ],
        apartmentId: property.apartments[0].id,
        keys: {
          apartment: validInputValues.apartmentKeys,
          basement: validInputValues.basementKeys,
          attic: validInputValues.atticKeys,
          frontDoor: validInputValues.frontDoorKeys,
          mailbox: validInputValues.mailboxKeys,
        },
      }),
    );
  });
});
