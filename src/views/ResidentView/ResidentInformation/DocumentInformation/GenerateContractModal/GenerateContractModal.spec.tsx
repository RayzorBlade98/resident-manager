import {
  act, fireEvent, render, waitFor,
} from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import GenerateContractModal from './GenerateContractModal';
import MonthYear from '_/extensions/date/month_year.extension';
import * as useResidentModule from '_/hooks/useResident/useResident';
import useResident from '_/hooks/useResident/useResident';
import { DocumentType } from '_/models/resident/document';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import { mockedIpcAPIFunctions } from '_/test/ipcApiMock';
import { applyHistoryToResident } from '_/utils/resident/applyHistoryToResident/applyHistoryToResident';
import residentViewState from '_/views/ResidentView/states/resident_view_state';

jest.mock('_/utils/resident/applyHistoryToResident/applyHistoryToResident', () => ({
  applyHistoryToResident: jest.fn(),
}));

describe('GenerateContractModal', () => {
  const resident = new ResidentBuilder().build();
  const landlord = new LandlordBuilder().build();
  const property = new PropertyBuilder().build();

  const onCloseMock = jest.fn();
  const useResidentMock = mock<ReturnType<typeof useResident>>();

  let baseElement: HTMLElement;

  const validInputValues = {
    contractStart: new MonthYear(2, 2024),
  };

  const invalidInputValues = {
    contractStart: undefined,
  };

  function inputToForm(inputValues: { contractStart: MonthYear | undefined }) {
    function input(element: Element | null, value: string | undefined) {
      if (!element) {
        throw new Error(`Missing element for value ${value}`);
      }
      fireEvent.change(element, {
        target: { value },
      });
    }

    act(() => {
      input(
        baseElement.querySelector('#contractStart'),
        inputValues.contractStart?.toPreferredString().slice(3) ?? '',
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
    jest.spyOn(useResidentModule, 'default').mockReturnValue(useResidentMock);

    baseElement = render(
      <ReactTestWrapper
        initializationFunction={() => {
          setRecoil(residentState, [resident]);
          setRecoil(residentViewState, (state) => ({
            ...state,
            selectedResident: resident.id,
          }));
          setRecoil(propertyState, property);
          setRecoil(landlordState, landlord);
        }}
      >
        <GenerateContractModal show onClose={onCloseMock} />
      </ReactTestWrapper>,
    ).baseElement;
  });

  afterEach(() => {
    jest.resetAllMocks();
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

  test('should submit created resident', async () => {
    // Arrange
    const documentId = 'documentId';
    mockedIpcAPIFunctions.generateContractPdf.mockResolvedValue(documentId);

    const historicalResident = new ResidentBuilder().build();
    (applyHistoryToResident as jest.Mock).mockReturnValue(historicalResident);

    inputToForm(validInputValues);

    // Act
    submitForm();

    // Assert
    await waitFor(() => expect(useResidentMock.addDocument).toHaveBeenCalledTimes(1));

    expect(applyHistoryToResident).toHaveBeenCalledTimes(1);
    expect(applyHistoryToResident).toHaveBeenLastCalledWith(resident, validInputValues.contractStart);

    expect(mockedIpcAPIFunctions.generateContractPdf).toHaveBeenCalledTimes(1);
    expect(mockedIpcAPIFunctions.generateContractPdf).toHaveBeenLastCalledWith({
      contractStart: validInputValues.contractStart,
      resident: historicalResident,
      landlord,
      property,
    });

    expect(useResidentMock.addDocument).toHaveBeenLastCalledWith({
      id: documentId,
      type: DocumentType.Contract,
      date: validInputValues.contractStart,
      name: 'Mietvertrag März 2024',
    });
  });
});
