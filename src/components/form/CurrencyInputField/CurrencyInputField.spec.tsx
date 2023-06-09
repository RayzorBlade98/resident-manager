import { RenderResult, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import {
  CurrencyInCents,
  convertCurrencyCentsToEuros,
} from '../../../utils/currency/currency.utils';
import CurrencyInputField from './CurrencyInputField';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CurrencyInputField', () => {
  const onChangeMock = jest.fn();
  const labelText = 'Testlabel';
  let value: CurrencyInCents | undefined;
  let errorMessage: string | undefined;
  let renderResult: RenderResult;

  function CurrencyInputFieldWrapper(): JSX.Element {
    const [input, setInput] = useState<number | undefined>(value);

    const onChange = (_value: number | undefined) => {
      onChangeMock(_value);
      setInput(_value);
    };

    return (
      <CurrencyInputField
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
        <CurrencyInputFieldWrapper />
      </ReactTestWrapper>,
    );
  }

  beforeEach(() => {
    errorMessage = 'Testerror';
    value = 12345;
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
    expect(field.value).toBe(convertCurrencyCentsToEuros(value!).toString());
  });

  test('should call onChange for valid input', async () => {
    // Arrange
    value = undefined;
    renderComponent();
    const user = userEvent.setup();

    // Act
    const field = renderResult.container.querySelector('input')!;
    await user.type(field, '13.37');

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(1337);
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

  test('should match snapshot', () => {
    // Arrange
    errorMessage = undefined;
    value = 12345;
    renderComponent();

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });

  test('should match snapshot (with error)', () => {
    // Arrange
    renderComponent();

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
