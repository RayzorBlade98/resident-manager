import { act, render } from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import waterCostsState, { WaterCostsState } from './waterCosts.state';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('waterCostsState effects', () => {
  beforeEach(() => {
    render(<ReactTestWrapper />);
  });

  const waterUsageCosts = range(0, 5).map((i) => ({
    costPerCubicMeter: 1000,
    date: new MonthYear(i, 2023),
  }));

  const sewageCosts = range(0, 5).map((i) => ({
    costPerCubicMeter: 2000,
    date: new MonthYear(i, 2023),
  }));

  const newState = {
    waterUsageCosts,
    sewageCosts,
  } as WaterCostsState;

  const expectedState = {
    waterUsageCosts: waterUsageCosts.reverse(),
    sewageCosts: sewageCosts.reverse(),
  } as WaterCostsState;

  test('waterCostsState effects should set the state correctly', () => {
    // Act
    act(() => {
      setRecoil(waterCostsState, newState);
    });

    // Assert
    expect(getRecoil(waterCostsState)).toStrictEqual(expectedState);
  });
});
