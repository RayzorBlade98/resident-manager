/* eslint-disable max-len */

import { act, render } from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import incidentalsState from './incidentals.state';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

beforeEach(() => {
  render(<ReactTestWrapper />);
});

const ongoingIncidentals = range(0, 5).map((_) => new OngoingIncidentalsBuilder()
  .withCosts(
    range(0, 5).map((i) => ({
      cost: 1000,
      date: new MonthYear(i, 2023),
    })),
  )
  .build());
const expectedOngoingIncidentals = ongoingIncidentals.map((i) => ({
  ...i,
  costs: [...i.costs].reverse(),
}));

const oneTimeIncidentals = range(0, 5).map((i) => new OneTimeIncidentalsBuilder().withBillingDate(new Date(2023, i, 1)).build());
const expectedOneTimeIncidentals = [...oneTimeIncidentals].reverse();

const incidentals = {
  ongoingIncidentals,
  oneTimeIncidentals,
};

test('incidentalsState effects should set the state correctly', () => {
  // Arrange
  const expectedState = {
    ...incidentals,
    ongoingIncidentals: expectedOngoingIncidentals,
    oneTimeIncidentals: expectedOneTimeIncidentals,
  };

  // Act
  act(() => {
    setRecoil(incidentalsState, incidentals);
  });

  // Assert
  expect(getRecoil(incidentalsState)).toStrictEqual(expectedState);
});

describe('sortOngoingIncidentalsCostEffect', () => {
  test('should sort ongoing incidental costs on set recoil', () => {
    // Act
    act(() => {
      setRecoil(incidentalsState, {
        oneTimeIncidentals: [],
        ongoingIncidentals,
      });
    });

    // Assert
    expect(getRecoil(incidentalsState).ongoingIncidentals).toStrictEqual(
      expectedOngoingIncidentals,
    );
  });
});

describe('sortOneTimeIncidentalsEffect', () => {
  test('should sort one time incidentals on set recoil', () => {
    // Act
    act(() => {
      setRecoil(incidentalsState, {
        ongoingIncidentals: [],
        oneTimeIncidentals,
      });
    });

    // Assert
    expect(getRecoil(incidentalsState).oneTimeIncidentals).toStrictEqual(
      expectedOneTimeIncidentals,
    );
  });
});
