import { act, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import App from '_/renderer/App';
import { propertyState } from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('PropertyInitializationView', () => {
  const screenshotSettings = {
    viewport: {
      width: CONTENT_WIDTH,
      height: CONTENT_HEIGHT,
    },
  };

  beforeEach(() => {
    render(
      <ReactTestWrapper>
        <App />
      </ReactTestWrapper>,
    );
    act(() => {
      setRecoil(propertyState, undefined);
    });
  });

  test('should match image snapshot', async () => {
    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
