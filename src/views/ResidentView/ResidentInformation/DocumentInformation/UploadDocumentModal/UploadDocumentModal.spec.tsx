/* eslint-disable react/jsx-no-useless-fragment */

import {
  act, fireEvent, render, waitFor,
} from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import UploadDocumentModal from './UploadDocumentModal';
import useResident, * as useResidentModule from '_/hooks/useResident/useResident';
import { LinkedDocument, DocumentType } from '_/models/resident/document';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ResidentBuilder from '_/test/builders/resident.builder';
import { mockedIpcAPIFunctions } from '_/test/ipcApiMock';
import residentViewState from '_/views/ResidentView/states/resident_view_state';

describe('UploadDocumentModal', () => {
  let baseElement: HTMLElement;
  const useResidentMock = mock<ReturnType<typeof useResident>>();
  const onCloseModalMock = jest.fn();

  const resident = new ResidentBuilder().build();
  const documentId = 'uploaded-document-id';

  const validInputValues = {
    name: 'Test Document',
    creationDate: new Date(2024, 5, 10).toUTC(),
    subjectDate: new Date(2024, 9, 3).toUTC(),
    file: 'test/file.txt',
  };

  const invalidInputValues = {
    name: undefined,
    creationDate: undefined,
    subjectDate: undefined,
    file: undefined,
  };

  async function inputToForm(inputValues: {
    name: string | undefined;
    creationDate: Date | undefined;
    subjectDate: Date | undefined;
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

    mockedIpcAPIFunctions.fileSystem.selectFile.mockResolvedValueOnce(
      inputValues.file,
    );

    act(() => {
      input(baseElement.querySelector('#name'), inputValues.name ?? '');
      input(
        baseElement.querySelector('#creationDate'),
        inputValues.creationDate?.toPreferredString() ?? '',
      );
      input(
        baseElement.querySelector('#subjectDate'),
        inputValues.subjectDate?.toPreferredString() ?? '',
      );
      fireEvent.click(baseElement.querySelector('#file')!);
    });

    await waitFor(() => expect(mockedIpcAPIFunctions.fileSystem.selectFile).toHaveBeenCalledTimes(
      1,
    ));
  }

  function submitForm() {
    const button = baseElement.querySelectorAll('.MuiButton-contained').item(1);
    act(() => {
      fireEvent.click(button);
    });
  }

  beforeEach(() => {
    jest.spyOn(useResidentModule, 'default').mockReturnValue(useResidentMock);

    mockedIpcAPIFunctions.persistence.uploadDocument.mockResolvedValue(
      documentId,
    );

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
    const expectedDocument: LinkedDocument = {
      name: validInputValues.name,
      creationDate: validInputValues.creationDate,
      subjectDate: validInputValues.subjectDate,
      type: DocumentType.CoverLetter,
      id: documentId,
    };

    await inputToForm(validInputValues);

    // Act
    submitForm();

    await waitFor(() => expect(useResidentMock.addDocument).toHaveBeenCalledTimes(1));

    // Assert
    expect(
      mockedIpcAPIFunctions.persistence.uploadDocument,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockedIpcAPIFunctions.persistence.uploadDocument,
    ).toHaveBeenLastCalledWith(validInputValues.file, {
      type: 'resident',
      residentId: resident.id,
    });
    expect(useResidentMock.addDocument).toHaveBeenCalledWith(
      expect.objectContaining(expectedDocument),
    );
  });
});
