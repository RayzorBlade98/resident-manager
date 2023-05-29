/* eslint-disable @typescript-eslint/no-explicit-any */

import { Validator } from './validation';
import { ERROR_MESSAGES, ValidationConstraint } from './validation_constraints';

describe('createFormValidationStateSelector', () => {
  test.todo('move mock validator to own file and add missing tests here');
});

describe('Validator', () => {
  type TestType = {
    notValidated: any;
    value1: any;
    value2: any;
    value3: any;
    value4: any;
  };
  const validator = new Validator<TestType>({
    value1: ValidationConstraint.Defined,
    value2: ValidationConstraint.Defined,
    value3: ValidationConstraint.Defined,
    value4: ValidationConstraint.Defined,
  });

  describe('validate', () => {
    test('should return right values with invalidOnly = true', () => {
      // Arrange
      const toValidate = {
        notValidated: undefined,
        value1: undefined,
        value2: 'test',
        value3: 'test',
        value4: undefined,
      };
      const expectedResults = {
        value1: ERROR_MESSAGES.EMPTY,
        value4: ERROR_MESSAGES.EMPTY,
      };

      // Act
      const results = validator.validate(toValidate);

      // Assert
      expect(results).toEqual(expectedResults);
    });

    test('should return right values with invalidOnly = false', () => {
      // Arrange
      const toValidate = {
        notValidated: undefined,
        value1: undefined,
        value2: 'test',
        value3: 'test',
        value4: undefined,
      };
      const expectedResults = {
        value1: ERROR_MESSAGES.EMPTY,
        value2: undefined,
        value3: undefined,
        value4: ERROR_MESSAGES.EMPTY,
      };

      // Act
      const results = validator.validate(toValidate, false);

      // Assert
      expect(results).toEqual(expectedResults);
    });
  });

  describe('validateDifference', () => {
    test('should return right values', () => {
      const oldValues = {
        notValidated: 'old',
        value1: undefined,
        value2: 'test',
        value3: 'test',
        value4: undefined,
      };
      const toValidate = {
        notValidated: undefined,
        value1: undefined,
        value2: 'test',
        value3: undefined,
        value4: 'test',
      };
      const expectedResults = {
        value3: ERROR_MESSAGES.EMPTY,
        value4: undefined,
      };

      // Act
      const results = validator.validateDifference(oldValues, toValidate);

      // Assert
      expect(results).toEqual(expectedResults);
    });
  });
});
