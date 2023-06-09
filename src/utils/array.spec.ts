import { cartesianProduct } from '_utils/array';

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
