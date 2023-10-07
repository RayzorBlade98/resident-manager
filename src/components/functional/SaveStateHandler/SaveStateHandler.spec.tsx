/* eslint-disable max-len */

import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { setRecoil } from 'recoil-nexus';
import * as persistenceModule from '../../../utils/persistence/persistence';
import SaveStateManager from './SaveStateHandler';
import incidentalsState from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterCostsBuilder from '_/test/builders/waterCosts.builder';

describe('SaveStateManager', () => {
  let importSaveStatesSpy: jest.SpyInstance;
  let exportSaveStatesSpy: jest.SpyInstance;

  beforeEach(() => {
    importSaveStatesSpy = jest
      .spyOn(persistenceModule, 'importSaveStates')
      .mockReturnValue(Promise.resolve());
    exportSaveStatesSpy = jest
      .spyOn(persistenceModule, 'exportSaveStates')
      .mockReturnValue();

    render(
      <ReactTestWrapper>
        <SaveStateManager>
          <div>Testcontent</div>
        </SaveStateManager>
      </ReactTestWrapper>,
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

  test('should export save data', async () => {
    // Arrange
    const updates = [
      () => {
        setRecoil(incidentalsState, {
          ongoingIncidentals: [new OngoingIncidentalsBuilder().build()],
          oneTimeIncidentals: [new OneTimeIncidentalsBuilder().build()],
        });
      },
      () => {
        setRecoil(invoiceState, [new InvoiceBuilder().build()]);
      },
      () => {
        setRecoil(residentState, [new ResidentBuilder().build()]);
      },
      () => {
        setRecoil(propertyState, new PropertyBuilder().build());
      },
      () => {
        setRecoil(waterCostsState, new WaterCostsBuilder().build());
      },
    ];

    await waitFor(() => {
      expect(importSaveStatesSpy).toHaveBeenCalledTimes(1);
    });

    for (let i = 0; i < updates.length; i += 1) {
      // Act
      act(() => {
        updates[i]();
      });

      // Assert
      expect(exportSaveStatesSpy).toHaveBeenCalledTimes(i + 1);
    }
  });
});
