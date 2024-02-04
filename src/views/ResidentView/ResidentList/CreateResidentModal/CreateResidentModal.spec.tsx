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
        .withRooms(3)
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
  };

  function inputToForm(inputValues: {
    firstName: string;
    lastName: string;
    rent: number | undefined;
    incidentals: number | undefined;
    contractStart: MonthYear | undefined;
    waterMeter: number | undefined;
    numberOfResidents: number | undefined;
  }) {
    const inputFields = baseElement.querySelectorAll('input');
    const inputs = [
      inputValues.firstName,
      inputValues.lastName,
      inputValues.rent ? (inputValues.rent / 100).toString() : undefined,
      inputValues.incidentals
        ? (inputValues.incidentals / 100).toString()
        : undefined,
      inputValues.numberOfResidents?.toString(),
      inputValues.waterMeter?.toString(),
      inputValues.contractStart?.toPreferredString().slice(3) ?? '',
    ];
    act(() => {
      inputs.forEach((input, i) => fireEvent.change(inputFields.item(i + 1), {
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
      await generateImage({ viewport: { width: 650, height: 650 } }),
    ).toMatchImageSnapshot();
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
      }),
    );
  });
});
