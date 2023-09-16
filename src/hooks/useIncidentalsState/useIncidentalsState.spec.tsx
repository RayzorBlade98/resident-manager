/* eslint-disable react-hooks/rules-of-hooks */

import { act, renderHook } from '@testing-library/react';
import { range } from 'lodash';
import { RecoilRoot } from 'recoil';
import useIncidentalsState from './useIncidentalsState';
import incidentalsState from '_/states/incidentals/incidentals.state';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';

describe('useIncidentalsState', () => {
  const incidentals = {
    ongoingIncidentals: range(0, 3).map((_) => new OngoingIncidentalsBuilder().build()),
    oneTimeIncidentals: range(0, 3).map((_) => new OneTimeIncidentalsBuilder().build()),
  };

  describe('incidentals, ongoingIncidentals, oneTimeIncidentals', () => {
    test('should return right incidentals', () => {
      // Arrange
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: incidentalsState,
          stateValue: incidentals,
          hook: () => useIncidentalsState(),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Assert
      expect(result.current.incidentals).toEqual(incidentals);
      expect(result.current.ongoingIncidentals).toEqual(
        incidentals.ongoingIncidentals,
      );
      expect(result.current.oneTimeIncidentals).toEqual(
        incidentals.oneTimeIncidentals,
      );
    });
  });

  describe('addOngoingIncidentals', () => {
    test('should set state correctly', () => {
      // Arrange
      const { result } = renderHook(useIncidentalsState, {
        wrapper: RecoilRoot,
      });

      // Act
      act(() => {
        incidentals.ongoingIncidentals.forEach(
          result.current.addOngoingIncidentals,
        );
      });

      // Assert
      expect(result.current.ongoingIncidentals).toEqual(
        incidentals.ongoingIncidentals,
      );
    });
  });

  describe('addOneTimeIncidentals', () => {
    test('should set state correctly', () => {
      // Arrange
      const { result } = renderHook(useIncidentalsState, {
        wrapper: RecoilRoot,
      });

      // Act
      act(() => {
        incidentals.oneTimeIncidentals.forEach(
          result.current.addOneTimeIncidentals,
        );
      });

      // Assert
      expect(result.current.oneTimeIncidentals).toEqual(
        incidentals.oneTimeIncidentals,
      );
    });
  });
});
