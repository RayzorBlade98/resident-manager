/* eslint-disable max-len */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import FormSubmitButton from './FormSubmitButton';
import { Validator } from '_/utils/validation';

describe('FormSubmitButton', () => {
  type Test = { success: boolean };
  const validator = new Validator<Test>({});
  const onSuccessMock = jest.fn();
  const onErrorMock = jest.fn();
  let validateSpy: jest.SpyInstance;

  function renderComponent(success: boolean): RenderResult {
    return render(
      <FormSubmitButton<Test>
        buttonText="Testbutton"
        formInput={{ success }}
        validator={validator}
        onSuccess={onSuccessMock}
        onError={onErrorMock}
      />,
    );
  }

  beforeEach(() => {
    validateSpy = jest
      .spyOn(validator, 'validate')
      .mockImplementation((toValidate: Partial<Test>) => (toValidate.success ? {} : { success: 'fail' }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call onSuccess for valid input', () => {
    // Arrange
    const renderResult = renderComponent(true);

    // Act
    const button = renderResult.getByRole('button');
    fireEvent.click(button);

    // Assert
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledTimes(0);
  });

  test('should call onError for invalid input', () => {
    // Arrange
    const renderResult = renderComponent(false);

    // Act
    const button = renderResult.getByRole('button');
    fireEvent.click(button);

    // Assert
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledWith({ success: 'fail' });
  });

  test('should match snapshot (valid input)', () => {
    // Arrange
    const renderResult = renderComponent(true);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });

  test('should match snapshot (invalid input)', () => {
    // Arrange
    const renderResult = renderComponent(false);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
