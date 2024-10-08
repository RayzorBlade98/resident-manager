import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import FileSelect from './FileSelect';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import { mockedIpcAPIFunctions } from '_/test/ipcApiMock';

describe('FileSelect', () => {
  let renderResult: RenderResult;

  const file = 'test/file.pdf';
  const errorMessage = 'Invalid file!';
  const onChangeMock = jest.fn();

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <div style={{ padding: 10 }}>
          <FileSelect
            label="Document"
            value={file}
            onChange={onChangeMock}
            errorMessage={errorMessage}
          />
        </div>
      </ReactTestWrapper>,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should match image snapshot', async () => {
    // Assert
    expect(
      await generateImage({ viewport: { width: 210, height: 130 } }),
    ).toMatchImageSnapshot();
  });

  it('should handle onClick correctly', async () => {
    // Arrange
    const fileMock = 'mock/file.pdf';
    mockedIpcAPIFunctions.fileSystem.selectFile.mockResolvedValue(fileMock);

    // Act
    const button = renderResult.getByRole('button');
    fireEvent.click(button);

    // Assert
    await waitFor(() => expect(onChangeMock).toHaveBeenCalledTimes(1));
    expect(onChangeMock).toHaveBeenLastCalledWith(fileMock);
  });
});
