/* eslint-disable @typescript-eslint/no-explicit-any, jest/expect-expect */

import { range } from 'lodash';
import {
  CONSTRAINT_FUNCTIONS,
  ERROR_MESSAGES,
  ValidationConstraint,
} from './validation_constraints';

function testValidationConstraint(
  constraint: ValidationConstraint,
  input: any,
  expectedResult: string | undefined,
): void {
  // Act
  const result = CONSTRAINT_FUNCTIONS[constraint](input);

  // Assert
  expect(result).toEqual(expectedResult);
}

describe('ValidationConstraint.NoEmptyString', () => {
  test.each([
    ['', ERROR_MESSAGES.EMPTY],
    ['test', undefined],
  ])(
    'input "%s" should return "%s"',
    (input: string, expectedResult: string | undefined) => {
      testValidationConstraint(
        ValidationConstraint.NoEmptyString,
        input,
        expectedResult,
      );
    },
  );
});

describe('ValidationConstraint.Month', () => {
  test.each([
    [undefined, ERROR_MESSAGES.EMPTY],
    ['', ERROR_MESSAGES.EMPTY],
    ['test', ERROR_MESSAGES.NO_INTEGER],
    ['13.37', ERROR_MESSAGES.NO_INTEGER],
    [4.2, ERROR_MESSAGES.NO_INTEGER],
    [13, ERROR_MESSAGES.NO_MONTH],
  ])(
    'input "%s" should return "%s"',
    (
      input: string | number | undefined,
      expectedResult: string | undefined,
    ) => {
      testValidationConstraint(
        ValidationConstraint.Month,
        input,
        expectedResult,
      );
    },
  );

  test.each(range(1, 13))(
    'input "%s" should return "undefined"',
    (input: string | number | undefined) => {
      testValidationConstraint(ValidationConstraint.Month, input, undefined);
    },
  );
});

describe('ValidationConstraint.Currency', () => {
  test.each([
    [undefined, ERROR_MESSAGES.EMPTY],
    [0, ERROR_MESSAGES.LTE_ZERO],
    [-1.5, ERROR_MESSAGES.LTE_ZERO],
    [100, undefined],
    [200.5, undefined],
  ])(
    'input "%s" should return "%s"',
    (input: number | undefined, expectedResult: string | undefined) => {
      testValidationConstraint(
        ValidationConstraint.Currency,
        input,
        expectedResult,
      );
    },
  );
});

describe('ValidationConstraint.Defined', () => {
  test.each([
    [undefined, ERROR_MESSAGES.EMPTY],
    [null, ERROR_MESSAGES.EMPTY],
    [1, undefined],
    [0, undefined],
    ['test', undefined],
    ['', undefined],
  ])(
    'input "%s" should return "%s"',
    (input: any, expectedResult: string | undefined) => {
      testValidationConstraint(
        ValidationConstraint.Defined,
        input,
        expectedResult,
      );
    },
  );
});
