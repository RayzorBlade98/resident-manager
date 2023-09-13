/* eslint-disable max-len, react-hooks/exhaustive-deps */

import { render } from '@testing-library/react';
import { range } from 'lodash';
import React, { useEffect } from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import useIncidentalsState from './useIncidentalsState';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import incidentalsState, {
  IncidentalsState,
} from '_/states/incidentals/incidentals.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

describe('useIncidentalsState', () => {
  function setup(Component: () => null) {
    render(<ReactTestWrapper><Component /></ReactTestWrapper>);
  }

  describe('incidentals, ongoingIncidentals, oneTimeIncidentals', () => {
    test('should return right incidentals', () => {
      // Arrange
      const expectedIncidentals = {
        ongoingIncidentals: range(0, 3).map((_) => new OngoingIncidentalsBuilder().build()),
        oneTimeIncidentals: range(0, 3).map((_) => new OneTimeIncidentalsBuilder().build()),
      };

      let returnedIncidentals: IncidentalsState | null = null;
      let returnedOngoingIncidentals: OngoingIncidentals[] | null = null;
      let returnedOneTimeIncidentals: OneTimeIncidentals[] | null = null;
      function TestComponent() {
        const { incidentals, ongoingIncidentals, oneTimeIncidentals } = useIncidentalsState();

        useEffect(() => {
          returnedIncidentals = incidentals;
        }, [incidentals]);

        useEffect(() => {
          returnedOngoingIncidentals = ongoingIncidentals;
        }, [ongoingIncidentals]);

        useEffect(() => {
          returnedOneTimeIncidentals = oneTimeIncidentals;
        }, [oneTimeIncidentals]);

        useEffect(() => {
          setRecoil(incidentalsState, expectedIncidentals);
        }, []);
        return null;
      }
      setup(TestComponent);

      // Assert
      expect(returnedIncidentals).toEqual(expectedIncidentals);
      expect(returnedOngoingIncidentals).toEqual(
        expectedIncidentals.ongoingIncidentals,
      );
      expect(returnedOneTimeIncidentals).toEqual(
        expectedIncidentals.oneTimeIncidentals,
      );
    });
  });

  describe('addOngoingIncidentals', () => {
    test('should set state correctly', () => {
      // Arrange
      const expectedIncidentals = range(0, 3).map((_) => new OngoingIncidentalsBuilder().build());
      let oldState: IncidentalsState | null = null;
      function TestComponent() {
        const { addOngoingIncidentals } = useIncidentalsState();

        useEffect(() => {
          oldState = getRecoil(incidentalsState);
          expectedIncidentals.forEach((i) => addOngoingIncidentals(i));
        }, []);
        return null;
      }
      setup(TestComponent);

      // Assert
      const newState = getRecoil(incidentalsState);
      expect(newState).toEqual({
        ...oldState!,
        ongoingIncidentals: expectedIncidentals,
      });
    });
  });

  describe('addOneTimeIncidentals', () => {
    test('should set state correctly', () => {
      // Arrange
      const expectedIncidentals = range(0, 3).map((_) => new OneTimeIncidentalsBuilder().build());
      let oldState: IncidentalsState | null = null;
      function TestComponent() {
        const { addOneTimeIncidentals } = useIncidentalsState();

        useEffect(() => {
          oldState = getRecoil(incidentalsState);
          expectedIncidentals.forEach((i) => addOneTimeIncidentals(i));
        }, []);
        return null;
      }
      setup(TestComponent);

      // Assert
      const newState = getRecoil(incidentalsState);
      expect(newState).toEqual({
        ...oldState!,
        oneTimeIncidentals: expectedIncidentals,
      });
    });
  });
});
