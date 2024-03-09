/* eslint-disable no-await-in-loop, react/jsx-no-useless-fragment */

import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React, { useEffect } from 'react';
import { setRecoil } from 'recoil-nexus';
import * as createContractResidentModalModule from './CreateContractResidentModal/CreateContractResidentModal';
import CreateResidentModal from './CreateResidentModal';
import MonthYear from '_/extensions/date/month_year.extension';
import * as useResidentStateModule from '_/hooks/useResidentState/useResidentState';
import { Salutation } from '_/models/name';
import { ContractResident } from '_/models/resident/contractResident';
import propertyState from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ApartmentBuilder from '_/test/builders/apartment.builder';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import NameBuilder from '_/test/builders/name.builder';
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

  const contractResident = new ContractResidentBuilder()
    .withName(
      new NameBuilder()
        .withSalutation(Salutation.Male)
        .withFirstName('Max')
        .withLastName('Mustermann')
        .build(),
    )
    .build();

  const validInputValues = {
    rent: 50000,
    incidentals: 10000,
    rentDeposit: 150000,
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
    rentDeposit: undefined,
    contractStart: undefined,
    waterMeter: undefined,
    numberOfResidents: undefined,
    apartmentKeys: undefined,
    basementKeys: undefined,
    atticKeys: undefined,
    frontDoorKeys: undefined,
    mailboxKeys: undefined,
  };

  function inputToForm(
    inputValues: {
      rent: number | undefined;
      incidentals: number | undefined;
      rentDeposit: number | undefined;
      contractStart: MonthYear | undefined;
      waterMeter: number | undefined;
      numberOfResidents: number | undefined;
      apartmentKeys: number | undefined;
      basementKeys: number | undefined;
      atticKeys: number | undefined;
      frontDoorKeys: number | undefined;
      mailboxKeys: number | undefined;
    },
    createContractResident?: boolean,
  ) {
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
        baseElement.querySelector('#numberOfResidents'),
        inputValues.numberOfResidents?.toString(),
      );
      input(
        baseElement.querySelector('#contractStart'),
        inputValues.contractStart?.toPreferredString().slice(3) ?? '',
      );

      if (createContractResident) {
        fireEvent.click(
          baseElement.querySelector("[data-testid='AddCircleOutlineIcon']")!,
        );
      }

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
        baseElement.querySelector('#rentDeposit'),
        inputValues.rentDeposit
          ? (inputValues.rentDeposit / 100).toString()
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

  function CreateContractResidentModalMock(props: {
    show: boolean;
    onClose: () => void;
    onSubmit: (resident: ContractResident) => void;
  }) {
    useEffect(() => {
      if (props.show) {
        props.onSubmit(contractResident);
        props.onClose();
      }
    }, [props]);

    return props.show ? <p>CreateContractResidentModalMock</p> : <></>;
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
    jest
      .spyOn(createContractResidentModalModule, 'default')
      .mockImplementation(CreateContractResidentModalMock);

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
    inputToForm(validInputValues, true);

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
    inputToForm(validInputValues, true);

    // Act
    submitForm();

    // Assert
    expect(addResidentSpy).toHaveBeenCalledTimes(1);
    expect(addResidentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractResidents: [contractResident],
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
        rentDeposit: validInputValues.rentDeposit,
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
