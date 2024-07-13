import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import DocumentInformation from './DocumentInformation';
import * as GenerateContractModalModule from './GenerateContractModal/GenerateContractModal';
import * as UploadFileModalModule from './UploadDocumentModal/UploadDocumentModal';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('DocumentInformation', () => {
  const generateContractModalMock = 'GenerateContractModal';
  const uploadFileModalMock = 'UploadDocumentModal';

  let renderResult: RenderResult;

  beforeEach(() => {
    jest
      .spyOn(GenerateContractModalModule, 'default')
      .mockImplementation(({ show }: { show: boolean }) => (show ? <p>{generateContractModalMock}</p> : <p />));

    jest
      .spyOn(UploadFileModalModule, 'default')
      .mockImplementation(({ show }: { show: boolean }) => (show ? <p>{uploadFileModalMock}</p> : <p />));

    renderResult = render(
      <ReactTestWrapper>
        <DocumentInformation />
      </ReactTestWrapper>,
    );
  });

  test('should generate contract', () => {
    // Act
    const button = renderResult.getAllByRole('button')[0];
    fireEvent.click(button);

    // Assert
    const modal = renderResult.getByText(generateContractModalMock);
    expect(modal).toBeDefined();
  });

  test('should upload document', () => {
    // Act
    const button = renderResult.getAllByRole('button')[1];
    fireEvent.click(button);

    // Assert
    const modal = renderResult.getByText(uploadFileModalMock);
    expect(modal).toBeDefined();
  });
});
