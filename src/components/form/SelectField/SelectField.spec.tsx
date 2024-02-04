import { render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import { range } from 'lodash';
import React from 'react';
import SelectField from './SelectField';

describe('SelectField', () => {
  const values = Object.fromEntries(
    range(1, 5).map((i) => [i, `Value ${i}`]),
  ) as Record<1 | 2 | 3 | 4, string>;
  const onChangeMock = jest.fn();

  test('should match snapshot', async () => {
    // Act
    render(
      <SelectField
        label="Test Select"
        id="testSelect"
        value={2}
        values={values}
        onChange={onChangeMock}
      />,
    );

    // Assert
    expect(
      await generateImage({ viewport: { width: 200, height: 75 } }),
    ).toMatchImageSnapshot();
  });
});
