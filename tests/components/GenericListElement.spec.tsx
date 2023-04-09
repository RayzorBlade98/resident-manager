/* eslint-disable max-len */

import {
  RenderResult, render, prettyDOM, fireEvent,
} from '@testing-library/react';
import { css } from 'glamor';
import React from 'react';
import GenericListElement from '_/components/GenericComponents/GenericList/GenericListElement';

describe('GenericListElement', () => {
  let renderResult: RenderResult;
  let onClickMock: jest.Mock;
  let elementContent: JSX.Element;

  function setupRendering(selected = false): void {
    onClickMock = jest.fn();
    elementContent = <div>Element Content</div>;
    renderResult = render(
      <GenericListElement
        style={css({ color: 'red' })}
        onClick={onClickMock}
        selected={selected}
      >
        {elementContent}
      </GenericListElement>,
    );
  }

  beforeEach(() => {
    setupRendering();
  });

  test('should render children correctly', () => {
    // Arrange
    const expectedElementContent = render(elementContent).container.firstElementChild!;

    // Assert
    const actualElementContent = renderResult.container.firstElementChild!.firstElementChild!;
    expect(prettyDOM(actualElementContent)).toEqual(
      prettyDOM(expectedElementContent),
    );
  });

  test('should call onClick callback', () => {
    // Act
    fireEvent.click(renderResult.container.firstElementChild!);

    // Assert
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test('should match snapshot', () => {
    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });

  test('should match snapshot (selected)', () => {
    // Arrange
    setupRendering(true);

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
