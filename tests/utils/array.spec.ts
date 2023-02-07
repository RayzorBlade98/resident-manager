import { cartesianProduct, range } from '_utils/array';

describe('range', () => {
  test.each([
    [1, 5, 1, [1, 2, 3, 4, 5]],
    [1, 5, 2, [1, 3, 5]],
    [1, 6, 2, [1, 3, 5]],
    [1, 2, 2, [1]],
  ])('range(%p, %p, %p) should return %p', (start, stop, step, expected) => {
    // Act
    const output = range(start, stop, step);

    // Assert
    expect(output).toEqual(expected);
  });

  test('should use step = 1 if no step is provided', () => {
    // Arrange
    const start = 1;
    const stop = 5;
    const expected = [1, 2, 3, 4, 5];

    // Act
    const output = range(start, stop);

    // Assert
    expect(output).toEqual(expected);
  });
});

describe('cartesianProduct', () => {
  test.each([
    [[[1, 2]], [[1], [2]]],
    [
      [
        [1, 2],
        [3, 4],
      ],
      [
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
      ],
    ],
    [
      [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
      [
        [1, 3, 5],
        [1, 3, 6],
        [1, 4, 5],
        [1, 4, 6],
        [2, 3, 5],
        [2, 3, 6],
        [2, 4, 5],
        [2, 4, 6],
      ],
    ],
  ])('cartesianProduct(%p) should return right array', (input, expected) => {
    // Act
    const output = cartesianProduct(...input);

    // Assert
    expect(output).toEqual(expected);
  });
});
