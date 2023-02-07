/**
 * This module provides functionality regarding `Array` objects
 * like creating the cartesian product of multiple arrays.
 */

/**
 * Creates an array containing a sequence of numbers for a given range.
 *
 * Examples:
 * - `range(0, 4) := [0, 1, 2, 3, 4]`
 * - `range (0, 4, 2) := [0, 2, 4]`
 * - `range (0, 5, 2) := [0, 2, 4]`
 *
 * @param start start value of the sequence
 * @param stop end value of the sequence
 * @param step space between each element of the sequence (default: 1)
 * @returns sequence of numbers for the given range
 */
export function range(start: number, stop: number, step: number = 1): number[] {
  return [...Array(Math.floor((stop - start) / step) + 1)].map(
    (_, i) => start + i * step,
  );
}

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
    (results, entries) =>
      results
        .map((result) => entries.map((entry) => result.concat([entry])))
        .reduce((subResults, result) => subResults.concat(result), []),
    [[]],
  );
}
