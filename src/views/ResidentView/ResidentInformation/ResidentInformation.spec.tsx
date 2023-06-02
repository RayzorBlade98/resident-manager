import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import * as GeneralResidentInformation from './GeneralResidentInformation/GeneralResidentInformation';
import * as RentInformation from './RentInformation/RentInformation';
import ResidentInformation from './ResidentInformation';

describe('ResidentInformation', () => {
  beforeAll(() => {
    jest
      .spyOn(GeneralResidentInformation, 'default')
      .mockReturnValue(<div>GeneralResidentInformation</div>);

    jest
      .spyOn(RentInformation, 'default')
      .mockReturnValue(<div>RentInformation</div>);
  });

  test.each([
    ['GeneralResidentInformation', 0],
    ['RentInformation', 1],
  ])(
    'should match snapshot (selected %s tab)',
    (tabName: string, tabId: number) => {
      // Arrange
      const renderResult = render(<ResidentInformation />);

      // Act
      const tab = renderResult.getAllByRole('tab').at(tabId)!;
      fireEvent.click(tab);

      // Assert
      expect(renderResult.container).toMatchSnapshot();
    },
  );
});
