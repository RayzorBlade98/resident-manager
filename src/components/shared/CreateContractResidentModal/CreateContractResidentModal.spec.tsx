/* eslint-disable react/jsx-no-useless-fragment */

import { act, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import _ from 'lodash';
import React from 'react';
import CreateContractResidentModal from './CreateContractResidentModal';
import { Salutation } from '_/models/name';
import { ContractResident } from '_/models/resident/contractResident';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateContractResidentModal', () => {
  let baseElement: HTMLElement;
  const onCloseMock = jest.fn();
  const onSubmitMock = jest.fn();

  const validInputValues = {
    salutation: Salutation.Male,
    firstName: 'Max',
    lastName: 'Mustermann',
    phone: '0151 12345',
    zipCode: 12345,
    city: 'Resident City',
    street: 'Resident Street',
    houseNumber: 31,
    email: 'email@example.com',
  };

  const invalidInputValues = {
    salutation: Salutation.Female,
    firstName: '',
    lastName: '',
    phone: '',
    zipCode: undefined,
    city: '',
    street: '',
    houseNumber: undefined,
    email: undefined,
  };

  function inputToForm(inputValues: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string | undefined;
    zipCode: number | undefined;
    city: string;
    street: string;
    houseNumber: number | undefined;
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
      input(baseElement.querySelector('#phone'), inputValues.phone);
      input(baseElement.querySelector('#email'), inputValues.email);

      fireEvent.click(tabs.item(1));
      input(
        baseElement.querySelector('#zipCode'),
        inputValues.zipCode?.toString(),
      );
      input(baseElement.querySelector('#city'), inputValues.city);
      input(baseElement.querySelector('#street'), inputValues.street);
      input(
        baseElement.querySelector('#houseNumber'),
        inputValues.houseNumber?.toString(),
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

  test('should submit created resident', () => {
    // Arrange
    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    const expectedResident: ContractResident = {
      ..._.pick(validInputValues, ['phone', 'email']),
      name: {
        ..._.pick(validInputValues, ['salutation', 'firstName', 'lastName']),
      },
      oldAddress: {
        ..._.pick(validInputValues, [
          'zipCode',
          'city',
          'street',
          'houseNumber',
        ]),
      },
    };
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith(expectedResident);
  });
});
