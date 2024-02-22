import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import ParkingSpaceTable from './ParkingSpaceTable';
import propertyState from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import PropertyBuilder from '_/test/builders/property.builder';

describe('ParkingSpaceTable', () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <ParkingSpaceTable />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(propertyState, new PropertyBuilder().build());
    });
  });

  test('should open modal when clicking create parking space', () => {
    // Act
    const button = renderResult.container.querySelector('td')!;
    fireEvent.click(button);

    // Assert
    const modal = renderResult.baseElement.querySelector('[role=dialog]');
    expect(modal).toBeDefined();
  });
});
