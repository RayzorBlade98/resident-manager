import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import DocumentInformation from './DocumentInformation';
import * as GenerateContractModalModule from './GenerateContractModal/GenerateContractModal';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('DocumentInformation', () => {
  const generateContractModalMock = 'GenerateContractModal';

  let renderResult: RenderResult;

  beforeEach(() => {
    jest
      .spyOn(GenerateContractModalModule, 'default')
      .mockReturnValue(<p>{generateContractModalMock}</p>);

    renderResult = render(
      <ReactTestWrapper>
        <DocumentInformation />
      </ReactTestWrapper>,
    );
  });

  test('should generate contract', () => {
    // Act
    const button = renderResult.getByRole('button');
    fireEvent.click(button);

    // Assert
    const modal = renderResult.getByText(generateContractModalMock);
    expect(modal).toBeDefined();
  });
});
