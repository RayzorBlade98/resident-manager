import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import ApartmentTable from './ApartmentTable';
import propertyState from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import PropertyBuilder from '_/test/builders/property.builder';

describe('ApartmentTable', () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper>
        <ApartmentTable />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(propertyState, new PropertyBuilder().build());
    });
  });

  test('should open modal when clicking create apartment', () => {
    // Act
    const button = renderResult.container.querySelector('td')!;
    fireEvent.click(button);

    // Assert
    const modal = renderResult.baseElement.querySelector('[role=dialog]');
    expect(modal).toBeDefined();
  });
});
