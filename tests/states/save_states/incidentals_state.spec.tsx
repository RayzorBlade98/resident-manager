/* eslint-disable max-len */
import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import {
  IncidentalsStateManager,
  incidentalsState,
} from '_/states/saveStates/incidentals_state';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import IncidentalsBuilder from '_tests/__test_utils__/builders/incidentals_builder';

describe('IncidentalsStateManager', () => {
  describe('addIncidentals', () => {
    test('should add new incidentals to state', () => {
      // Arrange
      render(<RecoilTestWrapper />);
      const newIncidentals1 = new IncidentalsBuilder().build();
      const newIncidentals2 = new IncidentalsBuilder().build();
      const expectedState = [
        ...getRecoil(incidentalsState),
        newIncidentals1,
        newIncidentals2,
      ];
      // Act
      act(() => {
        IncidentalsStateManager.addIncidentals(newIncidentals1);
        IncidentalsStateManager.addIncidentals(newIncidentals2);
      });

      // Assert
      const newState = getRecoil(incidentalsState);
      expect(newState).toEqual(expectedState);
    });
  });
});
