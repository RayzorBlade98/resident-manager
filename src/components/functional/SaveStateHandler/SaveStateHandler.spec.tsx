/* eslint-disable max-len */

import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { setRecoil } from 'recoil-nexus';
import PersistenceUtils from '../../../utils/persistence/persistence.utils';
import SaveStateManager from './SaveStateHandler';
import incidentalsState from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import residentState from '_/states/resident/resident.state';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import IncidentalsBuilder from '_tests/__test_utils__/builders/incidentals_builder';
import InvoiceBuilder from '_tests/__test_utils__/builders/invoice_builder';
import ResidentBuilder from '_tests/__test_utils__/builders/resident_builder';

describe('SaveStateManager', () => {
  let importSaveStatesSpy: jest.SpyInstance;
  let exportSaveStatesSpy: jest.SpyInstance;

  beforeEach(() => {
    importSaveStatesSpy = jest
      .spyOn(PersistenceUtils, 'importSaveStates')
      .mockReturnValue();
    exportSaveStatesSpy = jest
      .spyOn(PersistenceUtils, 'exportSaveStates')
      .mockReturnValue();

    render(
      <RecoilTestWrapper>
        <SaveStateManager />
      </RecoilTestWrapper>,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should import save data', () => {
    // Assert
    expect(importSaveStatesSpy).toHaveBeenCalledTimes(1);
    expect(exportSaveStatesSpy).toHaveBeenCalledTimes(0);
  });

  test('should export save data', () => {
    // Arrange
    const updates = [
      () => {
        setRecoil(incidentalsState, [new IncidentalsBuilder().build()]);
      },
      () => {
        setRecoil(invoiceState, [new InvoiceBuilder().build()]);
      },
      () => {
        setRecoil(residentState, [new ResidentBuilder().build()]);
      },
    ];

    for (let i = 0; i < updates.length; i += 1) {
      // Act
      act(() => {
        updates[i]();
      });

      // Assert
      expect(importSaveStatesSpy).toHaveBeenCalledTimes(1);
      expect(exportSaveStatesSpy).toHaveBeenCalledTimes(i + 1);
    }
  });
});
