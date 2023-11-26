import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
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

  beforeEach(() => {
    formValidationHook = renderHook(() => useFormValidation({
      defaultFormInput,
      formValidator,
      onSubmitSuccess,
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

  describe('submitForm', () => {
    test('should handle valid input correctly', () => {
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
        formValidationHook.current.submitForm();
      });

      // Assert
      expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
      expect(onSubmitSuccess).toHaveBeenLastCalledWith(input);
    });

    test('should handle invalid input correctly', () => {
      // Act
      act(() => {
        formValidationHook.current.submitForm();
      });

      // Assert
      expect(onSubmitSuccess).toHaveBeenCalledTimes(0);
      expect(formValidationHook.current.formErrors.formNumber).toBeDefined();
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

  describe('isFormInputValid', () => {
    test('should return true for valid input', () => {
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

      // Assert
      expect(formValidationHook.current.isFormInputValid).toBeTruthy();
    });

    test('should return false for invalid input', () => {
      // Assert
      expect(formValidationHook.current.isFormInputValid).toBeFalsy();
    });
  });
});
