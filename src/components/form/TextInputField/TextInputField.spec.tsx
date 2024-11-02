import { RenderResult, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generateImage } from 'jsdom-screenshot';
import React, { useState } from 'react';
import TextInputField from './TextInputField';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('TextInputField', () => {
  const onChangeMock = jest.fn();
  const labelText = 'Testlabel';
  let value: string | undefined;
  let errorMessage: string | undefined;
  let renderResult: RenderResult;

  function NumberTextFieldWrapper(): JSX.Element {
    const [input, setInput] = useState<string | undefined>(value);

    const onChange = (_value: string | undefined) => {
      onChangeMock(_value);
      setInput(_value);
    };

    return (
      <TextInputField
        id="testField"
        label={labelText}
        value={input}
        onChange={onChange}
        errorMessage={errorMessage}
      />
    );
  }

  function renderComponent(): void {
    renderResult = render(
      <ReactTestWrapper>
        <div style={{ padding: 10 }}>
          <NumberTextFieldWrapper />
        </div>
      </ReactTestWrapper>,
    );
  }

  beforeEach(() => {
    errorMessage = 'Testerror';
    value = 'Text';
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
    const error = renderResult.container.querySelector('p.Mui-error');
    expect(error?.textContent).toEqual(errorMessage);
  });

  test('should display the value', () => {
    // Assert
    const field = renderResult.container.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(field.value).toBe(value);
  });

  test('should call onChange for valid input', async () => {
    // Arrange
    value = undefined;
    renderComponent();
    const user = userEvent.setup();
    const input = 'valid text';

    // Act
    const field = renderResult.container.querySelector('input')!;
    await user.type(field, input);

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(input);
  });

  test('should call onChange for empty input', async () => {
    // Arrange
    value = undefined;
    renderComponent();
    const user = userEvent.setup();

    // Act
    const field = renderResult.container.querySelector('input')!;
    await user.click(field);
    await user.keyboard('1{Backspace}');

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(undefined);
  });

  test('should match image snapshot', async () => {
    // Arrange
    errorMessage = undefined;
    value = 'snapshot';
    cleanup();
    renderComponent();

    // Assert
    expect(
      await generateImage({ viewport: { width: 300, height: 100 } }),
    ).toMatchImageSnapshot();
  });

  test('should match image snapshot (with error)', async () => {
    // Arrange
    value = undefined;
    cleanup();
    renderComponent();

    // Assert
    expect(
      await generateImage({ viewport: { width: 300, height: 100 } }),
    ).toMatchImageSnapshot();
  });

  test.todo('Missing tests for multiline');
});
