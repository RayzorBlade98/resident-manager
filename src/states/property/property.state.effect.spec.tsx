import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import propertyState, { PropertyState } from './property.state';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import ParkingSpaceBuilder from '_/test/builders/parkingSpace.builder';
import PropertyBuilder from '_/test/builders/property.builder';

describe('propertyState effects', () => {
  beforeEach(() => {
    render(<ReactTestWrapper />);
  });

  const newState = new PropertyBuilder()
    .addParkingSpace(
      new ParkingSpaceBuilder()
        .withName('PS 1')
        .addCosts({
          cost: 1,
          date: new MonthYear(1, 2024),
        })
        .addCosts({
          cost: 2,
          date: new MonthYear(2, 2024),
        })
        .addCosts({
          cost: 3,
          date: new MonthYear(3, 2024),
        })
        .build(),
    )
    .build();

  const expectedState: PropertyState = {
    ...newState,
    parkingSpaces: newState.parkingSpaces.map((p) => ({
      ...p,
      costs: [...p.costs].reverse(),
    })),
  };

  test('propertyState effects should set the state correctly', () => {
    // Act
    act(() => {
      setRecoil(propertyState, newState);
    });

    // Assert
    expect(getRecoil(propertyState)).toStrictEqual(expectedState);
  });
});
