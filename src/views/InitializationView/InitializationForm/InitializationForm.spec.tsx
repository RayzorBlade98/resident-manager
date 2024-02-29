/* eslint-disable no-await-in-loop */

import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import * as RecoilModule from 'recoil';
import { resetRecoil } from 'recoil-nexus';
import InitializationForm from './InitializationForm';
import MonthYear from '_/extensions/date/month_year.extension';
import Landlord from '_/models/landlord/landlord';
import { Salutation } from '_/models/name';
import Property from '_/models/property/property';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';
import waterCostsState, {
  WaterCostsState,
} from '_/states/waterCosts/waterCosts.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('InitializationForm', () => {
  let baseElement: HTMLElement;

  const setPropertyStateMock = jest.fn();
  const setWaterCostStateMock = jest.fn();
  const setLandlordStateMock = jest.fn();

  const mockedSystemTime = new MonthYear(1, 2024);

  const validInputValues = {
    companyLandlord: 'Company',
    salutationLandlord: Salutation.Male,
    firstNameLandlord: 'Lola',
    lastNameLandlord: 'Landlord',
    zipCodeLandlord: 12345,
    cityLandlord: 'Landlord-City',
    streetLandlord: 'Landlord-Stret',
    houseNumberLandlord: 42,
    numberOfApartments: 8,
    zipCodeProperty: 54321,
    cityProperty: 'Property-City',
    streetProperty: 'Property-Street',
    houseNumberProperty: 13,
    waterUsageCost: 1000,
    sewageCost: 500,
  };

  const invalidInputValues = {
    companyLandlord: '',
    salutationLandlord: Salutation.Male,
    firstNameLandlord: '',
    lastNameLandlord: '',
    zipCodeLandlord: undefined,
    cityLandlord: '',
    streetLandlord: '',
    houseNumberLandlord: undefined,
    numberOfApartments: undefined,
    zipCodeProperty: undefined,
    cityProperty: '',
    streetProperty: '',
    houseNumberProperty: undefined,
    waterUsageCost: undefined,
    sewageCost: undefined,
  };

  function inputToForm(inputValues: {
    companyLandlord: string;
    firstNameLandlord: string;
    lastNameLandlord: string;
    zipCodeLandlord: number | undefined;
    cityLandlord: string;
    streetLandlord: string;
    houseNumberLandlord: number | undefined;
    numberOfApartments: number | undefined;
    zipCodeProperty: number | undefined;
    cityProperty: string;
    streetProperty: string;
    houseNumberProperty: number | undefined;
    waterUsageCost: number | undefined;
    sewageCost: number | undefined;
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
      input(
        baseElement.querySelector('#numberOfApartments'),
        inputValues.numberOfApartments?.toString(),
      );
      input(
        baseElement.querySelector('#zipCodeProperty'),
        inputValues.zipCodeProperty?.toString(),
      );
      input(
        baseElement.querySelector('#cityProperty'),
        inputValues.cityProperty,
      );
      input(
        baseElement.querySelector('#streetProperty'),
        inputValues.streetProperty,
      );
      input(
        baseElement.querySelector('#houseNumberProperty'),
        inputValues.houseNumberProperty?.toString(),
      );

      fireEvent.click(tabs.item(1));
      input(
        baseElement.querySelector('#companyLandlord'),
        inputValues.companyLandlord,
      );
      input(
        baseElement.querySelector('#firstNameLandlord'),
        inputValues.firstNameLandlord,
      );
      input(
        baseElement.querySelector('#lastNameLandlord'),
        inputValues.lastNameLandlord,
      );
      input(
        baseElement.querySelector('#zipCodeLandlord'),
        inputValues.zipCodeLandlord?.toString(),
      );
      input(
        baseElement.querySelector('#cityLandlord'),
        inputValues.cityLandlord,
      );
      input(
        baseElement.querySelector('#streetLandlord'),
        inputValues.streetLandlord,
      );
      input(
        baseElement.querySelector('#houseNumberLandlord'),
        inputValues.houseNumberLandlord?.toString(),
      );

      fireEvent.click(tabs.item(2));
      input(
        baseElement.querySelector('#waterUsageCost'),
        inputValues.waterUsageCost
          ? (inputValues.waterUsageCost / 100).toString()
          : undefined,
      );
      input(
        baseElement.querySelector('#sewageCost'),
        inputValues.sewageCost
          ? (inputValues.sewageCost / 100).toString()
          : undefined,
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
    jest.setSystemTime(mockedSystemTime);
  });

  beforeEach(() => {
    jest
      .spyOn(RecoilModule, 'useSetRecoilState')
      .mockImplementation((state) => {
        switch (state.key) {
          case propertyState.key:
            return setPropertyStateMock;
          case waterCostsState.key:
            return setWaterCostStateMock;
          case landlordState.key:
            return setLandlordStateMock;
          default:
            throw new Error();
        }
      });

    baseElement = render(
      <ReactTestWrapper
        initializationFunction={() => resetRecoil(propertyState)}
      >
        <InitializationForm />
      </ReactTestWrapper>,
    ).baseElement;

    jest.clearAllMocks();
  });

  test('should match image snapshot (valid inputs)', async () => {
    // Act
    inputToForm(validInputValues);

    // Assert
    const tabs = baseElement.querySelectorAll('.MuiTab-root');

    for (const tab of tabs) {
      fireEvent.click(tab);
      expect(await generateImage()).toMatchImageSnapshot();
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
      expect(await generateImage()).toMatchImageSnapshot();
    }
  });

  test('should initialize states on submit', () => {
    // Arrange
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    expect(setLandlordStateMock).toHaveBeenCalledTimes(1);
    expect(setLandlordStateMock).toHaveBeenLastCalledWith({
      company: validInputValues.companyLandlord,
      representative: {
        salutation: validInputValues.salutationLandlord,
        firstName: validInputValues.firstNameLandlord,
        lastName: validInputValues.lastNameLandlord,
      },
      address: {
        zipCode: validInputValues.zipCodeLandlord,
        city: validInputValues.cityLandlord,
        street: validInputValues.streetLandlord,
        houseNumber: validInputValues.houseNumberLandlord,
      },
    } as Landlord);

    expect(setPropertyStateMock).toHaveBeenCalledTimes(1);
    expect(setPropertyStateMock).toHaveBeenLastCalledWith({
      address: {
        zipCode: validInputValues.zipCodeProperty,
        city: validInputValues.cityProperty,
        street: validInputValues.streetProperty,
        houseNumber: validInputValues.houseNumberProperty,
      },
      numberOfApartments: validInputValues.numberOfApartments,
      apartments: [],
      parkingSpaces: [],
    } as Property);

    expect(setWaterCostStateMock).toHaveBeenCalledTimes(1);
    expect(setWaterCostStateMock).toHaveBeenLastCalledWith({
      waterUsageCosts: [
        {
          costPerCubicMeter: validInputValues.waterUsageCost,
          date: mockedSystemTime,
        },
      ],
      sewageCosts: [
        {
          costPerCubicMeter: validInputValues.sewageCost,
          date: mockedSystemTime,
        },
      ],
    } as WaterCostsState);
  });
});
