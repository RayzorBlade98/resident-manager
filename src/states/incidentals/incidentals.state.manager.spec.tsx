/* eslint-disable max-len */
import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import {
  oneTimeIncidentalsSelector,
  ongoingIncidentalsSelector,
} from './incidentals.state';
import IncidentalsStateManager from './incidentals.state.manager';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

describe('IncidentalsStateManager', () => {
  beforeEach(() => {
    render(<ReactTestWrapper />);
  });

  describe('addOngoingIncidentals', () => {
    test('should add new incidentals to state', () => {
      // Arrange
      const newIncidentals1 = new OngoingIncidentalsBuilder().build();
      const newIncidentals2 = new OngoingIncidentalsBuilder().build();
      const expectedState = [
        ...getRecoil(ongoingIncidentalsSelector),
        newIncidentals1,
        newIncidentals2,
      ];

      // Act
      act(() => {
        IncidentalsStateManager.addOngoingIncidentals(newIncidentals1);
        IncidentalsStateManager.addOngoingIncidentals(newIncidentals2);
      });

      // Assert
      const newState = getRecoil(ongoingIncidentalsSelector);
      expect(newState).toEqual(expectedState);
    });
  });

  describe('addOneTimeIncidentals', () => {
    test('should add new incidentals to state', () => {
      // Arrange
      const newIncidentals1 = new OneTimeIncidentalsBuilder().build();
      const newIncidentals2 = new OneTimeIncidentalsBuilder().build();
      const expectedState = [
        ...getRecoil(oneTimeIncidentalsSelector),
        newIncidentals1,
        newIncidentals2,
      ];

      // Act
      act(() => {
        IncidentalsStateManager.addOneTimeIncidentals(newIncidentals1);
        IncidentalsStateManager.addOneTimeIncidentals(newIncidentals2);
      });

      // Assert
      const newState = getRecoil(oneTimeIncidentalsSelector);
      expect(newState).toEqual(expectedState);
    });
  });
});
