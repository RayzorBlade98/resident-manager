/* eslint-disable max-len */

import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { setRecoil } from 'recoil-nexus';
import PersistenceUtils from '../../../utils/persistence/persistence.utils';
import SaveStateManager from './SaveStateHandler';
import incidentalsState from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import { propertyState } from '_/states/property/property.state';
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
      .spyOn(PersistenceUtils, 'importSaveStates')
      .mockReturnValue();
    exportSaveStatesSpy = jest
      .spyOn(PersistenceUtils, 'exportSaveStates')
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

  test('should export save data', () => {
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
