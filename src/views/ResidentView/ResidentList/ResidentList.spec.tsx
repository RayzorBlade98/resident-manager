/* eslint-disable max-len */

import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import residentViewState, {
  residentViewSelectedResidentState,
} from '../states/resident_view_state';
import ResidentList from './ResidentList';
import createResidentState from './states/create_resident_state';
import residentState from '_/states/resident/resident.state';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import ResidentBuilder from '_tests/__test_utils__/builders/resident_builder';

describe('ResidentList', () => {
  const residents = range(0, 5).map((i) => new ResidentBuilder().withLastName(`Mustermann${i}`).build());
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <RecoilTestWrapper>
        <ResidentList />
      </RecoilTestWrapper>,
    );

    act(() => {
      setRecoil(residentState, residents);
      setRecoil(residentViewState, (state) => ({
        ...state,
        selectedResident: residents[0].id,
      }));
    });
  });

  test('should open modal when clicking create resident button', () => {
    // Arrange
    const expectedState = {
      ...getRecoil(createResidentState),
      showModal: true,
    };

    // Act
    const createButton = renderResult.getAllByRole('button').at(0)!;
    fireEvent.click(createButton);

    // Assert
    const newState = getRecoil(createResidentState);
    expect(newState).toEqual(expectedState);
  });

  test('should select resident when clicking', () => {
    // Arrange
    const newSelectedResidentIndex = 2;

    // Act
    const residentButton = renderResult
      .getAllByRole('button')
      .at(newSelectedResidentIndex + 1)!;
    fireEvent.click(residentButton);

    // Assert
    const newSelectedResident = getRecoil(residentViewSelectedResidentState);
    expect(newSelectedResident).toEqual(residents[newSelectedResidentIndex]);
  });

  test('should match snapshot', () => {
    // Act
    const residentButton = renderResult.getAllByRole('button').at(2)!;
    fireEvent.click(residentButton);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
