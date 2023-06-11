/* eslint-disable max-len */

import { RenderResult, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import MonthYearDateField from './MonthYearDateField';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('MonthYearDateField', () => {
  const onChangeMock = jest.fn();
  const labelText = 'Testlabel';
  let value: MonthYear | undefined;
  let errorMessage: string | undefined;
  let renderResult: RenderResult;

  function renderComponent(): void {
    renderResult = render(
      <ReactTestWrapper>
        <MonthYearDateField
          id="testField"
          label={labelText}
          value={value}
          onChange={onChangeMock}
          errorMessage={errorMessage}
        />
      </ReactTestWrapper>,
    );
  }

  beforeEach(() => {
    errorMessage = 'Testerror';
    value = new MonthYear(4, 2023);
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
    expect(field.value).toBe('05.2023');
  });

  test('should call onChange for valid input', async () => {
    // Arrange
    const user = userEvent.setup();
    // Act
    const field = renderResult.getByRole('textbox');
    await user.type(field, '121998');

    // Assert
    expect(onChangeMock).toHaveBeenLastCalledWith(
      new MonthYear(11, 1998).toUTC(),
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

  test('should match image snapshot', async () => {
    // Arrange
    errorMessage = undefined;
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
});
