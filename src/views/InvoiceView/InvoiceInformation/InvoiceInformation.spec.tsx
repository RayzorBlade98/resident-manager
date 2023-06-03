import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import * as GeneralInvoiceInformation from './GeneralInvoiceInformation/GeneralInvoiceInformation';
import InvoiceInformation from './InvoiceInformation';

describe('InvoiceInformation', () => {
  beforeAll(() => {
    jest
      .spyOn(GeneralInvoiceInformation, 'default')
      .mockReturnValue(<div>GeneralInvoiceInformation</div>);
  });

  test.each([['GeneralInvoiceInformation', 0]])(
    'should match snapshot (selected %s tab)',
    (tabName: string, tabId: number) => {
      // Arrange
      const renderResult = render(<InvoiceInformation />);

      // Act
      const tab = renderResult.getAllByRole('tab').at(tabId)!;
      fireEvent.click(tab);

      // Assert
      expect(renderResult.container).toMatchSnapshot();
    },
  );
});
