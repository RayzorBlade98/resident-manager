import { RenderResult, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import viewPorts from '../../../test/screenshotViewports';
import StandardDateField from './StandardDateField';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import '_/extensions/date/date.extension';

describe('StandardDateField', () => {
  const onChangeMock = jest.fn();
  const labelText = 'Testlabel';
  let value: Date | undefined;
  let errorMessage: string | undefined;
  let renderResult: RenderResult;

  function renderComponent(): void {
    renderResult = render(
      <ReactTestWrapper>
        <div style={{ marginTop: '10px', marginLeft: '5px' }}>
          <StandardDateField
            id="testField"
            label={labelText}
            value={value}
            onChange={onChangeMock}
            errorMessage={errorMessage}
          />
        </div>
      </ReactTestWrapper>,
    );
  }

  beforeEach(() => {
    errorMessage = 'Testerror';
    value = new Date(2023, 4, 27).toUTC();
    renderComponent();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should display label', () => {
    // Assert
    const label = renderResult.container.querySelector('label');
    expect(label?.textContent).toEqual(labelText);
  });

  test('should display error message', () => {
    // Assert
    const error = renderResult.container.querySelector('p');
    expect(error?.textContent).toEqual(errorMessage);
  });

  test('should display the value', () => {
    // Assert
    const field = renderResult.container.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(field.value).toBe('27.05.2023');
  });

  test('should call onChange for valid input', async () => {
    // Arrange
    const user = userEvent.setup();
    // Act
    const field = renderResult.getByRole('textbox');
    await user.type(field, '25121998');

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(
      new Date(1998, 11, 25).toUTC(),
    );
  });

  test('should call onChange for invalid input', async () => {
    // Arrange
    const user = userEvent.setup();
    // Act
    const field = renderResult.getByRole('textbox');
    await user.click(field);
    await user.keyboard('{Backspace}');

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(undefined);
  });

  test('should match snapshot', async () => {
    // Arrange
    errorMessage = undefined;
    cleanup();
    renderComponent();

    // Assert
    expect(
      await generateImage({ viewport: viewPorts.inputField.normal }),
    ).toMatchImageSnapshot();
  });

  test('should match snapshot (with error)', async () => {
    // Arrange
    value = undefined;
    cleanup();
    renderComponent();

    // Assert
    expect(
      await generateImage({ viewport: viewPorts.inputField.error }),
    ).toMatchImageSnapshot();
  });
});
