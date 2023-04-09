/* eslint-disable max-len */

import { RenderResult, render } from '@testing-library/react';
import { css } from 'glamor';
import React from 'react';
import GenericList from '_/components/GenericComponents/GenericList/GenericList';

describe('GenericList', () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <GenericList style={css({ backgroundColor: 'red' })} className="testList">
        <div>Element 1</div>
        <div>Element 2</div>
        <div>Element 3</div>
      </GenericList>,
    );
  });

  test('should render children and seperation lines correctly', () => {
    // Assert
    const children = renderResult.container.firstElementChild!.children;
    expect(children).toHaveLength(5);
    for (let index = 0; index < children.length; index += 1) {
      const child = children.item(index)!;
      const expectedTag = index % 2 === 0 ? 'DIV' : 'HR';
      expect(child.tagName).toBe(expectedTag);
    }
  });

  test('should match snapshot', () => {
    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
