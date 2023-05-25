/* eslint-disable max-len, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, func-names */

import {
  RenderResult,
  render,
  fireEvent,
  act,
  prettyDOM,
} from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import residentViewState from '../states/resident_view_state';
import ResidentList from './ResidentList';
import residentState from '_/states/saveStates/resident_state';
import { Resident } from '_/types/resident';
import { range } from '_/utils/array';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import ResidentBuilder from '_tests/__test_utils__/builders/resident_builder';

const createResidentModalPropsMock = jest.fn();
jest.mock(
  '_/views/ResidentView/ResidentList/CreateResidentModal/CreateResidentModal',
  () => function (props: any) {
    createResidentModalPropsMock(props);
    return <div className="modalMock" />;
  },
);

describe('ResidentList', () => {
  let renderResult: RenderResult;
  let residents: Resident[];
  let selectedResident: Resident;

  beforeEach(() => {
    residents = range(0, 4).map((i) => new ResidentBuilder()
      .withFirstName(`Max${i}`)
      .withLastName(`Mustermann${i}`)
      .build());
    selectedResident = residents[0];

    renderResult = render(
      <RecoilTestWrapper>
        <ResidentList />
      </RecoilTestWrapper>,
    );

    act(() => {
      setRecoil(residentState, residents);
      setRecoil(residentViewState, (state) => ({
        ...state,
        selectedResident: selectedResident.id,
      }));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function selectResident(index: number): void {
    const listElement = renderResult.container.firstElementChild!.children.item(
      1 + 2 * index + 1,
    )!;
    fireEvent.click(listElement);
  }

  function clickNewResident(): void {
    const newResidentElement = renderResult.container.firstElementChild!.children.item(0)!;
    fireEvent.click(newResidentElement);
  }

  test('should have the right amount of children', () => {
    // Assert
    const expectedChildren = 2 * residents.length + 1;
    const actualChildren = renderResult.container.firstElementChild!.children.length;
    expect(actualChildren).toEqual(expectedChildren);
  });

  test('should set selected resident in state when clicking list element', () => {
    // Act
    const selectedIndex = 1;
    selectResident(selectedIndex);

    // Assert
    const newSelectedResident = getRecoil(residentViewState).selectedResident;
    expect(newSelectedResident).toEqual(residents[selectedIndex].id);
  });

  test('should close modal on callback', () => {
    // Arrange
    const oldDOM = prettyDOM(renderResult.container);

    // Act
    clickNewResident();
    const onCloseCallback = createResidentModalPropsMock.mock.calls[0][0].onClose;
    act(() => {
      onCloseCallback();
    });

    // Assert
    expect(prettyDOM(renderResult.container)).toEqual(oldDOM);
  });

  test('should match snapshot', () => {
    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });

  test('should match snapshot (opened modal)', () => {
    // Act
    clickNewResident();

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });

  test('should match snapshot (new selection)', () => {
    // Act
    selectResident(2);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
