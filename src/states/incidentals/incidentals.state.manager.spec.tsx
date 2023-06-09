/* eslint-disable max-len */
import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import incidentalsState from './incidentals.state';
import IncidentalsStateManager from './incidentals.state.manager';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import IncidentalsBuilder from '_/test/builders/incidentals.builder';

describe('IncidentalsStateManager', () => {
  beforeEach(() => {
    render(<ReactTestWrapper />);
  });

  describe('addIncidentals', () => {
    test('should add new incidentals to state', () => {
      // Arrange
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
