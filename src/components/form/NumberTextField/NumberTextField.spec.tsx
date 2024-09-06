import { RenderResult, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generateImage } from 'jsdom-screenshot';
import React, { useState } from 'react';
import NumberTextField from './NumberTextField';

describe('NumberTextField', () => {
  const onChangeMock = jest.fn();
  const labelText = 'Testlabel';
  let value: number | undefined;
  let errorMessage: string | undefined;
  let onlyInteger = false;
  let min: number | undefined;
  let max: number | undefined;
  let unit: string | undefined;
  let renderResult: RenderResult;

  function NumberTextFieldWrapper(): JSX.Element {
    const [input, setInput] = useState<number | undefined>(value);

    const onChange = (_value: number | undefined) => {
      onChangeMock(_value);
      setInput(_value);
    };

    return (
      <NumberTextField
        id="testField"
        label={labelText}
        value={input}
        onChange={onChange}
        errorMessage={errorMessage}
        onlyInteger={onlyInteger}
        min={min}
        max={max}
        unit={unit}
      />
    );
  }

  function renderComponent(): void {
    renderResult = render(<NumberTextFieldWrapper />);
  }

  beforeEach(() => {
    errorMessage = 'Testerror';
    value = 5;
    onlyInteger = false;
    min = undefined;
    max = undefined;
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
    expect(field.value).toBe(value!.toString());
  });

  test('should call onChange for valid input', async () => {
    // Arrange
    value = undefined;
    renderComponent();
    const user = userEvent.setup();

    // Act
    const field = renderResult.container.querySelector('input')!;
    await user.type(field, '42.42');

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(42.42);
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

  test('should convert float to integer', async () => {
    // Arrange
    value = undefined;
    onlyInteger = true;
    renderComponent();
    const user = userEvent.setup();

    // Act
    const field = renderResult.container.querySelector('input')!;
    await user.type(field, '42.9');

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(42);
  });

  test('should cap input at max value', async () => {
    // Arrange
    value = undefined;
    max = 42;
    renderComponent();
    const user = userEvent.setup();

    // Act
    const field = renderResult.container.querySelector('input')!;
    await user.type(field, '99');

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(42);
  });

  test('should cap input at min value', async () => {
    // Arrange
    value = undefined;
    min = 42;
    renderComponent();
    const user = userEvent.setup();

    // Act
    const field = renderResult.container.querySelector('input')!;
    await user.type(field, '6');

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(42);
  });

  test('should match image snapshot', async () => {
    // Arrange
    errorMessage = undefined;
    value = 42;
    cleanup();
    renderComponent();

    // Assert
    expect(await generateImage({ viewport: { width: 300, height: 100 } })).toMatchImageSnapshot();
  });

  test('should match image snapshot (with error)', async () => {
    // Arrange
    value = undefined;
    cleanup();
    renderComponent();

    // Assert
    expect(await generateImage({ viewport: { width: 300, height: 100 } })).toMatchImageSnapshot();
  });

  test('should match image snapshot (with unit)', async () => {
    // Arrange
    errorMessage = undefined;
    unit = '%';
    cleanup();
    renderComponent();

    // Assert
    expect(await generateImage({ viewport: { width: 300, height: 100 } })).toMatchImageSnapshot();
  });
});
