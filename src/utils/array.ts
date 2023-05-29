/**
 * This module provides functionality regarding `Array` objects
 * like creating the cartesian product of multiple arrays.
 */

/* eslint-disable import/prefer-default-export */

/**
 * Creates the cartesian product for any number of given array.
 *
 * Examples:
 * - `cartesianProduct([1, 2], [3, 4]) := [[1, 3], [1, 4], [2, 3], [2, 4]]`
 * - `cartesianProduct([1, 2], [3, 4], [5, 6]) := [[1, 3, 5], [1, 3, 6], [1, 4, 5], [1, 4, 6], [2, 3, 5], [2, 3, 6], [2, 4, 5], [2, 4, 6]]`
 *
 * @param allEntries any number of array that should be combined
 * @returns array containing the cartesian product over all given arrays
 */
export function cartesianProduct<T>(...allEntries: T[][]): T[][] {
  return allEntries.reduce<T[][]>(
    (results, entries) => results
      .map((result) => entries.map((entry) => result.concat([entry])))
      .reduce((subResults, result) => subResults.concat(result), []),
    [[]],
  );
}
