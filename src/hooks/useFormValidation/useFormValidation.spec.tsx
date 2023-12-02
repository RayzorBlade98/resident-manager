import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
  renderHook,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { act } from 'react-dom/test-utils';
import viewPorts from '../../test/screenshotViewports';
import { ValidationConstraint } from '../../utils/validation/constraints';
import useFormValidation from './useFormValidation';
import Validator from '_/utils/validation/validator';

describe('useFormValidation', () => {
  let formValidationHook: {
    current: ReturnType<typeof useFormValidation<FormType>>;
  };

  type FormType = {
    formString: string;
    formNumber: number;
    formOptional: number | undefined;
  };

  const formValidator = new Validator<FormType>({
    formString: ValidationConstraint.NoEmptyString,
    formNumber: ValidationConstraint.Defined,
  });
  const defaultFormInput = {
    formString: 'a',
    formNumber: undefined,
    formOptional: 0,
  };
  const onSubmitSuccess = jest.fn();
  const submitButtonLabel = 'Submit';

  const validInputValues: FormType = {
    formString: 'b',
    formNumber: 2,
    formOptional: undefined,
  };

  function validInput() {
    act(() => {
      formValidationHook.current.formInputSetters.formString(
        validInputValues.formString,
      );
      formValidationHook.current.formInputSetters.formNumber(
        validInputValues.formNumber,
      );
      formValidationHook.current.formInputSetters.formOptional(
        validInputValues.formOptional,
      );
    });
  }

  beforeEach(() => {
    formValidationHook = renderHook(() => useFormValidation({
      defaultFormInput,
      formValidator,
      onSubmitSuccess,
      submitButtonLabel,
    })).result;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('formInput', () => {
    test('should set default value correctly', () => {
      // Assert
      expect(formValidationHook.current.formInput).toEqual(defaultFormInput);
    });
  });

  describe('formInputSetters', () => {
    test('should set the form input correcty', () => {
      // Arrange
      const expected: FormType = {
        formString: 'b',
        formNumber: 2,
        formOptional: undefined,
      };

      // Act
      act(() => {
        formValidationHook.current.formInputSetters.formString(
          expected.formString,
        );
        formValidationHook.current.formInputSetters.formNumber(
          expected.formNumber,
        );
        formValidationHook.current.formInputSetters.formOptional(
          expected.formOptional,
        );
      });

      // Assert
      expect(formValidationHook.current.formInput).toEqual(expected);
    });

    test('should validate the new input', () => {
      // Act
      act(() => {
        formValidationHook.current.formInputSetters.formString('');
      });

      // Assert
      expect(formValidationHook.current.formErrors.formString).toBeDefined();
      expect(formValidationHook.current.formErrors.formNumber).toBeUndefined();
      expect(
        formValidationHook.current.formErrors.formOptional,
      ).toBeUndefined();
    });
  });

  describe('resetFormInput', () => {
    test('should set form input to default value', () => {
      // Arrange
      const input: FormType = {
        formString: 'b',
        formNumber: 2,
        formOptional: undefined,
      };
      act(() => {
        formValidationHook.current.formInputSetters.formString(
          input.formString,
        );
        formValidationHook.current.formInputSetters.formNumber(
          input.formNumber,
        );
        formValidationHook.current.formInputSetters.formOptional(
          input.formOptional,
        );
      });

      // Act
      act(() => {
        formValidationHook.current.resetFormInput();
      });

      // Assert
      expect(formValidationHook.current.formInput).toEqual(defaultFormInput);
    });
  });

  describe('FormSubmitButton', () => {
    let renderResult: RenderResult;

    function renderButton() {
      const FormSubmitButton = formValidationHook.current.FormSubmitButton;
      renderResult = render(<FormSubmitButton />);
    }

    function clickButton() {
      const button = renderResult.container.querySelector('button')!;
      fireEvent.click(button);
    }

    beforeEach(() => {
      renderButton();
    });

    test('should handle submit of valid input correctly', () => {
      // Arrange
      validInput();
      cleanup();
      renderButton();

      // Act
      clickButton();

      // Assert
      expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
      expect(onSubmitSuccess).toHaveBeenLastCalledWith(validInputValues);
    });

    test('should handle invalid input correctly', () => {
      // Act
      clickButton();

      // Assert
      expect(onSubmitSuccess).toHaveBeenCalledTimes(0);
      expect(formValidationHook.current.formErrors.formNumber).toBeDefined();
    });

    test('should match image snapshot (invalid input)', async () => {
      // Assert
      expect(
        await generateImage({ viewport: viewPorts.button }),
      ).toMatchImageSnapshot();
    });

    test('should match image snapshot (valid input)', async () => {
      // Arrange
      validInput();

      // Act
      cleanup();
      renderButton();

      // Assert
      expect(
        await generateImage({ viewport: viewPorts.button }),
      ).toMatchImageSnapshot();
    });
  });
});
