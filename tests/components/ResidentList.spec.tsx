/* eslint-disable max-len, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, func-names */

import {
  RenderResult,
  render,
  fireEvent,
  act,
  prettyDOM,
} from '@testing-library/react';
import { css } from 'glamor';
import React from 'react';
import ResidentList from '_/components/ResidentList/ResidentList';
import { Resident } from '_/types/resident';
import { range } from '_/utils/array';
import ResidentBuilder from '_tests/__test_utils__/builders/resident_builder';

const createResidentModalPropsMock = jest.fn();
jest.mock(
  '_/components/CreateResidentModal/CreateResidentModal',
  () => function (props: any) {
    createResidentModalPropsMock(props);
    return <div className="modalMock" />;
  },
);

describe('ResidentList', () => {
  let renderResult: RenderResult;
  let residents: Resident[];
  let selectedResident: Resident;
  let onSelectResidentMock: jest.Mock;

  beforeEach(() => {
    residents = range(0, 4).map((i) => new ResidentBuilder()
      .withFirstName(`Max${i}`)
      .withLastName(`Mustermann${i}`)
      .build());
    selectedResident = residents[0];
    onSelectResidentMock = jest.fn();

    renderResult = render(
      <ResidentList
        residents={residents}
        selectedResident={selectedResident}
        onSelectResident={onSelectResidentMock}
        style={css({ backgroundColor: 'red' })}
      />,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should have the right amount of children', () => {
    // Assert
    const expectedChildren = 2 * residents.length + 1;
    const actualChildren = renderResult.container.firstElementChild!.children.length;
    expect(actualChildren).toEqual(expectedChildren);
  });

  test('should call onSelectResident callback', () => {
    // Act
    const selectedIndex = 1;
    const listElement = renderResult.container.firstElementChild!.children.item(
      1 + 2 * selectedIndex + 1,
    )!;
    fireEvent.click(listElement);

    // Assert
    expect(onSelectResidentMock).toHaveBeenCalledTimes(1);
    expect(onSelectResidentMock).toHaveBeenCalledWith(residents[selectedIndex]);
  });

  test('should close modal on callback', () => {
    // Arrange
    const oldDOM = prettyDOM(renderResult.container);

    // Act
    const newResidentElement = renderResult.container.firstElementChild!.children.item(0)!;
    fireEvent.click(newResidentElement);

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
    const newResidentElement = renderResult.container.firstElementChild!.children.item(0)!;
    fireEvent.click(newResidentElement);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
