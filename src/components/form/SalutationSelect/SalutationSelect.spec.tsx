import { render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import SalutationSelect from './SalutationSelect';
import { Salutation } from '_/models/name';

describe('SalutationSelect', () => {
  test('should match snapshot', async () => {
    // Arrange
    render(
      <SalutationSelect
        value={Salutation.Female}
        onChange={(_) => {}}
      />,
    );

    // Assert
    expect(
      await generateImage({ viewport: { width: 200, height: 75 } }),
    ).toMatchImageSnapshot();
  });
});
