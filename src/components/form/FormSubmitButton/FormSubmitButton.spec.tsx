/* eslint-disable max-len, @typescript-eslint/ban-types, class-methods-use-this */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { atom } from 'recoil';
import { getRecoil, resetRecoil, setRecoil } from 'recoil-nexus';
import viewPorts from '../../../test/screenshotViewports';
import FormSubmitButton from './FormSubmitButton';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import {
  CompleteFormValidationState,
  ValidationErrorMessages,
  createFormValidationStateSelector,
} from '_/utils/validation/validation';
import Validator from '_/utils/validation/validator';

interface TestValidationClass {
  success: boolean;
}

class TestValidator extends Validator<TestValidationClass> {
  public static VALIDATION_SUCCESS = {};

  public static VALIDATION_ERROR = { success: 'Fail' };

  constructor() {
    super({});
  }

  public validate(
    toValidate: Partial<TestValidationClass>,
    _invalidOnly = true,
  ): ValidationErrorMessages<TestValidationClass> {
    return toValidate.success
      ? TestValidator.VALIDATION_SUCCESS
      : TestValidator.VALIDATION_ERROR;
  }
}

describe('FormSubmitButton', () => {
  const testState = atom<CompleteFormValidationState<{}, TestValidationClass>>({
    key: 'FormSubmitButton-teststate',
    default: {
      formValidation: {
        formInput: {
          success: true,
        },
        formErrors: {},
        formValidator: new TestValidator(),
      },
    },
  });
  const testStateValidationSelector = createFormValidationStateSelector<
  {},
  TestValidationClass
  >(testState);

  const onSuccessMock = jest.fn();
  let renderResult: RenderResult;

  function invalidInput(): void {
    act(() => {
      setRecoil(testState, (state) => ({
        ...state,
        formValidation: {
          ...state.formValidation,
          formInput: { success: false },
        },
      }));
    });
  }

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <div style={{ marginLeft: '5px', marginTop: '5px' }}>
          <FormSubmitButton<TestValidationClass>
            buttonText="Testbutton"
            formState={testStateValidationSelector}
            onSuccess={onSuccessMock}
          />
        </div>
      </ReactTestWrapper>,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    act(() => {
      resetRecoil(testState);
    });
  });

  test('should call onSuccess for valid input', () => {
    // Arrange
    const oldState = getRecoil(testState);

    // Act
    const button = renderResult.getByRole('button');
    fireEvent.click(button);

    // Assert
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(getRecoil(testState)).toEqual(oldState);
  });

  test('should call add errors to state for invalid input', () => {
    // Arrange
    invalidInput();
    const oldState = getRecoil(testState);
    const expectedState: CompleteFormValidationState<{}, TestValidationClass> = {
      ...oldState,
      formValidation: {
        ...oldState.formValidation,
        formErrors: TestValidator.VALIDATION_ERROR,
      },
    };

    // Act
    const button = renderResult.getByRole('button');
    fireEvent.click(button);

    // Assert
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(getRecoil(testState)).toEqual(expectedState);
  });

  test('should match image snapshot (valid input)', async () => {
    // Assert
    expect(
      await generateImage({ viewport: viewPorts.button }),
    ).toMatchImageSnapshot();
  });

  test('should match image snapshot (invalid input)', async () => {
    // Arrange
    invalidInput();

    // Assert
    expect(
      await generateImage({ viewport: viewPorts.button }),
    ).toMatchImageSnapshot();
  });
});
