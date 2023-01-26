/**
 * Object containing an error message for each key of `T` that had an invalid value or `undefined` if it had a valid value.
 */
export type ValidationErrorMessages<T> = {
  [k in keyof T]?: string;
};

/**
 * Enum containing all available validation errors.
 */
export enum ValidationError {
  /**
   * ValidationError that checks if the tested value is an empty string.
   */
  EmptyString = 'EmptyString',
  /**
   * ValidationError that checks if the tested value is `null`.
   */
  Null = 'Null',
  /**
   * ValidationError that checks if the tested value is less or equal than `0`.
   */
  LessEqualZero = 'LessEqualZero',
  /**
   * ValidationError that checks if the tested value is not an integer.
   */
  NotInteger = 'NotInteger',
  /**
   * ValidationError that checks if the tested value is between `1` and `12`.
   */
  NotMonth = 'NotMonth',
}

/**
 * Object containing an error message for each `ValidationError`
 */
const ERROR_MESSAGES: { [k in ValidationError]: string } = {
  [ValidationError.EmptyString]: 'Darf nicht leer sein!',
  [ValidationError.Null]: 'Darf nicht leer sein!',
  [ValidationError.LessEqualZero]: 'Muss größer als 0 sein!',
  [ValidationError.NotInteger]: 'Muss eine ganze Zahl sein!',
  [ValidationError.NotMonth]: 'Muss zwischen 1 und 12 sein!',
};

/**
 * Object containing a function that checks if a given values is invalid for each `ValidationError`
 */
const ERROR_FUNCTIONS: { [k in ValidationError]: (value: any) => boolean } = {
  [ValidationError.EmptyString]: (value: any) => value === '',
  [ValidationError.Null]: (value: any) => value === null,
  [ValidationError.LessEqualZero]: (value: any) => value <= 0,
  [ValidationError.NotInteger]: (value: any) => value % 1 !== 0,
  [ValidationError.NotMonth]: (value: any) => value < 1 || value > 12,
};

/**
 * Creates a function that validates an object of type `T`.
 * @param errors `ValidationErrors` that should be tested for each key of `T`
 * @returns validation function
 */
export function createValidationFunction<T>(errors: {
  [k in keyof T]?: ValidationError[];
}): (
  object: T,
  key?: keyof T | undefined,
) => ValidationErrorMessages<T> | string | undefined {
  /**
   * Validates each key of an object of type `T`
   * @param object object of type `T` that should be validated
   * @param key optional key of `T`. If provided only the error message for this key is returned
   * @returns error message for each invalid key of `object`
   */
  function validationFunction(
    object: T,
    key: keyof T | undefined = undefined,
  ): ValidationErrorMessages<T> | string | undefined {
    const error_messages: Partial<ValidationErrorMessages<T>> = {};
    for (const key in errors) {
      error_messages[key] = undefined;
      if (errors[key] === undefined) continue;
      for (const error of errors[key] as ValidationError[]) {
        if (ERROR_FUNCTIONS[error](object[key])) {
          error_messages[key] = ERROR_MESSAGES[error];
          break;
        }
      }
    }
    if (key) {
      return error_messages[key];
    }
    return error_messages;
  }
  return validationFunction;
}
