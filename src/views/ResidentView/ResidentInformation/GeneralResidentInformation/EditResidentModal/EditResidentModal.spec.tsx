/* eslint-disable react/jsx-no-useless-fragment */

import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { setRecoil } from 'recoil-nexus';
import EditResidentModal from './EditResidentModal';
import ContractResidentDisplay, * as contractResidentDisplayModule from '_/components/shared/ContractResidentDisplay/ContractResidentDisplay';
import MonthYear from '_/extensions/date/month_year.extension';
import * as useResidentModule from '_/hooks/useResident/useResident';
import { Salutation } from '_/models/name';
import { ContractResident } from '_/models/resident/contractResident';
import propertyState from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ApartmentBuilder from '_/test/builders/apartment.builder';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import NameBuilder from '_/test/builders/name.builder';
import ParkingSpaceBuilder from '_/test/builders/parkingSpace.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const ActualContractResidentDisplay = jest.requireActual(
  '_/components/shared/ContractResidentDisplay/ContractResidentDisplay',
).default as typeof ContractResidentDisplay;

describe('EditResidentModal', () => {
  let baseElement: HTMLElement;
  const editResidentSpy = jest.fn();
  const onCloseModalMock = jest.fn();
  const property = new PropertyBuilder()
    .addApartment(
      new ApartmentBuilder()
        .withFloor('1 OG')
        .withLocation('left')
        .withRooms({ generic: 3 })
        .build(),
    )
    .addParkingSpace(
      new ParkingSpaceBuilder()
        .withId('parking space')
        .withName('Parking Space')
        .build(),
    )
    .build();

  const resident = new ResidentBuilder()
    .withParkingSpace('parking space')
    .withNumberOfResidents(3)
    .addContractResident(
      new ContractResidentBuilder()
        .withName(
          new NameBuilder()
            .withFirstName('Max')
            .withLastName('Mustermann')
            .build(),
        )
        .build(),
    )
    .withKeys({
      apartment: 5,
      basement: 4,
      attic: 3,
      frontDoor: 2,
      mailbox: 1,
    })
    .build();

  const contractResident = new ContractResidentBuilder()
    .withName(
      new NameBuilder()
        .withSalutation(Salutation.Male)
        .withFirstName('Max 2')
        .withLastName('Mustermann 2')
        .build(),
    )
    .build();

  const validInputValues = {
    validSince: new MonthYear(5, 2024),
    numberOfResidents: 5,
    apartmentKeys: 1,
    basementKeys: 2,
    atticKeys: 3,
    frontDoorKeys: 4,
    mailboxKeys: 5,
  };

  const invalidInputValues = {
    validSince: undefined,
    numberOfResidents: undefined,
    apartmentKeys: undefined,
    basementKeys: undefined,
    atticKeys: undefined,
    frontDoorKeys: undefined,
    mailboxKeys: undefined,
  };

  function inputToForm(inputValues: {
    validSince: MonthYear | undefined;
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
      input(
        baseElement.querySelector('#validSince'),
        inputValues.validSince?.toPreferredString().slice(3) ?? '',
      );

      input(
        baseElement.querySelector('#numberOfResidents'),
        inputValues.numberOfResidents?.toString() ?? '',
      );

      fireEvent.click(tabs.item(2));
      input(
        baseElement.querySelector('#apartmentKeys'),
        inputValues.apartmentKeys?.toString() ?? '',
      );
      input(
        baseElement.querySelector('#basementKeys'),
        inputValues.basementKeys?.toString() ?? '',
      );
      input(
        baseElement.querySelector('#atticKeys'),
        inputValues.atticKeys?.toString() ?? '',
      );
      input(
        baseElement.querySelector('#frontDoorKeys'),
        inputValues.frontDoorKeys?.toString() ?? '',
      );
      input(
        baseElement.querySelector('#mailboxKeys'),
        inputValues.mailboxKeys?.toString() ?? '',
      );
    });
  }

  function submitForm() {
    const button = baseElement.querySelector('.MuiButton-contained')!;
    act(() => {
      fireEvent.click(button);
    });
  }

  function generateContractResidentDisplayMock(
    generateContractResident: boolean,
  ) {
    function ContractResidentDisplayMock(props: {
      contractResidents: ContractResident[] | undefined;
      onSubmitContractResident: (resident: ContractResident) => void;
      error: string | undefined;
    }) {
      useEffect(() => {
        if (generateContractResident) {
          props.onSubmitContractResident(contractResident);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return <ActualContractResidentDisplay {...props} />;
    }

    return ContractResidentDisplayMock;
  }

  function renderModal(generateContractResident: boolean) {
    jest
      .spyOn(contractResidentDisplayModule, 'default')
      .mockImplementation(
        generateContractResidentDisplayMock(generateContractResident),
      );

    baseElement = render(
      <ReactTestWrapper
        initializationFunction={() => setRecoil(propertyState, property)}
      >
        <EditResidentModal
          showModal
          onCloseModal={onCloseModalMock}
          resident={resident}
        />
      </ReactTestWrapper>,
    ).baseElement;
  }

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(validInputValues.validSince.addMonths(-1));
  });

  beforeEach(() => {
    jest.spyOn(useResidentModule, 'default').mockReturnValue({
      resident,
      editResident: editResidentSpy,
      addRentPayment: jest.fn(),
      addWaterMeterReading: jest.fn(),
    });
  });

  test('should match image snapshot (default values)', async () => {
    // Arrange
    renderModal(true);

    // Assert
    const tabs = baseElement.querySelectorAll('.MuiTab-root');

    for (const tab of tabs) {
      fireEvent.click(tab);
      expect(
        await generateImage({ viewport: { width: 650, height: 600 } }),
      ).toMatchImageSnapshot();
    }
  });

  test('should match image snapshot (valid inputs)', async () => {
    // Arrange
    renderModal(true);

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
    // Arrange
    renderModal(false);

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

  test('should update resident on submit', () => {
    // Arrange
    renderModal(true);
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    expect(editResidentSpy).toHaveBeenCalledTimes(1);
    expect(editResidentSpy).toHaveBeenCalledWith(
      {
        ..._.pick(validInputValues, ['numberOfResidents']),
        contractResidents: [...resident.contractResidents, contractResident],
        parkingSpaceId: resident.parkingSpaceId,
        keys: {
          apartment: validInputValues.apartmentKeys,
          basement: validInputValues.basementKeys,
          attic: validInputValues.atticKeys,
          frontDoor: validInputValues.frontDoorKeys,
          mailbox: validInputValues.mailboxKeys,
        },
      },
      validInputValues.validSince,
    );
  });
});
