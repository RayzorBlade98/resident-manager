/* eslint-disable react/jsx-no-useless-fragment */

import {
  act, fireEvent, render, waitFor,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import UploadDocumentModal from './UploadDocumentModal';
import * as useResidentModule from '_/hooks/useResident/useResident';
import { DocumentType, LinkedDocument } from '_/models/resident/document';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ResidentBuilder from '_/test/builders/resident.builder';
import { mockedIpcAPIFunctions } from '_/test/ipcApiMock';
import residentViewState from '_/views/ResidentView/states/resident_view_state';

describe('UploadDocumentModal', () => {
  let baseElement: HTMLElement;
  const addDocumentSpy = jest.fn();
  const onCloseModalMock = jest.fn();

  const resident = new ResidentBuilder().build();

  const validInputValues = {
    name: 'Test Document',
    date: new Date(2024, 5, 10).toUTC(),
    file: 'test/file.txt',
  };

  const invalidInputValues = {
    name: undefined,
    date: undefined,
    file: undefined,
  };

  async function inputToForm(inputValues: {
    name: string | undefined;
    date: Date | undefined;
    file: string | undefined;
  }) {
    function input(element: Element | null, value: string | undefined) {
      if (!element) {
        throw new Error(`Missing element for value ${value}`);
      }
      fireEvent.change(element, {
        target: { value },
      });
    }

    mockedIpcAPIFunctions.selectFile.mockResolvedValueOnce(inputValues.file);

    act(() => {
      input(baseElement.querySelector('#name'), inputValues.name ?? '');
      input(
        baseElement.querySelector('#date'),
        inputValues.date?.toPreferredString() ?? '',
      );
      fireEvent.click(baseElement.querySelector('#file')!);
    });

    await waitFor(() => expect(mockedIpcAPIFunctions.selectFile).toHaveBeenCalledTimes(1));
  }

  function submitForm() {
    const button = baseElement.querySelectorAll('.MuiButton-contained').item(1);
    act(() => {
      fireEvent.click(button);
    });
  }

  beforeEach(() => {
    jest.spyOn(useResidentModule, 'default').mockReturnValue({
      resident,
      editResident: jest.fn(),
      addRentPayment: jest.fn(),
      addWaterMeterReading: jest.fn(),
      addDocument: addDocumentSpy,
    });

    baseElement = render(
      <ReactTestWrapper
        initializationFunction={() => {
          setRecoil(residentState, [resident]);
          setRecoil(residentViewState, { selectedResident: resident.id });
        }}
      >
        <UploadDocumentModal show onCloseModal={onCloseModalMock} />
      </ReactTestWrapper>,
    ).baseElement;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should match image snapshot (valid inputs)', async () => {
    // Act
    await inputToForm(validInputValues);

    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 600 } }),
    ).toMatchImageSnapshot();
  });

  test('should match image snapshot (invalid inputs)', async () => {
    // Act
    await inputToForm(invalidInputValues);
    submitForm();

    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 600 } }),
    ).toMatchImageSnapshot();
  });

  test('should update resident on submit', async () => {
    // Arrange
    const expectedDocument: Omit<LinkedDocument, 'id'> = {
      name: validInputValues.name,
      date: validInputValues.date,
      type: DocumentType.Contract,
    };
    mockedIpcAPIFunctions.uploadDocument.mockResolvedValue(undefined);

    await inputToForm(validInputValues);

    // Act
    submitForm();

    await waitFor(() => expect(addDocumentSpy).toHaveBeenCalledTimes(1));

    // Assert
    expect(mockedIpcAPIFunctions.uploadDocument).toHaveBeenCalledTimes(1);
    expect(mockedIpcAPIFunctions.uploadDocument).toHaveBeenLastCalledWith(
      validInputValues.file,
      expect.stringMatching(/^.*\.txt$/),
      {
        type: 'resident',
        residentId: resident.id,
      },
    );
    expect(addDocumentSpy).toHaveBeenCalledWith(
      expect.objectContaining(expectedDocument),
    );
  });
});
