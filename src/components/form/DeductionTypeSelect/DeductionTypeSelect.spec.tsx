import { render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import DeductionTypeSelect from './DeductionTypeSelect';
import { DeductionType } from '_/models/incidentals/deduction_type';

describe('DeductionTypeSelect', () => {
  test('should match snapshot', async () => {
    // Arrange
    render(
      <DeductionTypeSelect
        value={DeductionType.PerResident}
        onChange={(_) => {}}
      />,
    );

    // Assert
    expect(await generateImage({ viewport: { width: 200, height: 75 } })).toMatchImageSnapshot();
  });
});
