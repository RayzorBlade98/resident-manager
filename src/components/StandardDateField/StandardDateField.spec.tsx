import { RenderResult, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import StandardDateField from './StandardDateField';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import { dateToUTC } from '_utils/date';

describe('StandardDateField', () => {
  const onChangeMock = jest.fn();
  const labelText = 'Testlabel';
  let value: Date | undefined;
  let errorMessage: string | undefined;
  let renderResult: RenderResult;

  function renderComponent(): void {
    renderResult = render(
      <RecoilTestWrapper>
        <StandardDateField
          label={labelText}
          value={value}
          onChange={onChangeMock}
          errorMessage={errorMessage}
        />
      </RecoilTestWrapper>,
    );
  }

  beforeEach(() => {
    errorMessage = 'Testerror';
    value = dateToUTC(new Date(2023, 4, 27));
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
      dateToUTC(new Date(1998, 11, 25)),
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

  test('should match snapshot', () => {
    // Arrange
    errorMessage = undefined;
    renderComponent();

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });

  test('should match snapshot (with error)', () => {
    // Arrange
    value = undefined;
    renderComponent();

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
