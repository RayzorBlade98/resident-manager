import {
  RenderResult, act, fireEvent, render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import View from '../../routes';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../../styles';
import App from '_/renderer/App';
import propertyState from '_/states/property/property.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import AddressBuilder from '_/test/builders/address.builder';
import PropertyBuilder from '_/test/builders/property.builder';

describe('ResidentView', () => {
  const screenshotSettings = {
    viewport: {
      width: CONTENT_WIDTH,
      height: CONTENT_HEIGHT,
    },
  };
  const property = new PropertyBuilder()
    .withAdress(
      new AddressBuilder()
        .withStreet('Teststraße')
        .withHouseNumber(42)
        .withZipCode(424242)
        .withCity('Teststadt')
        .build(),
    )
    .build();
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(
      <ReactTestWrapper route={View.Property}>
        <App />
      </ReactTestWrapper>,
    );

    act(() => {
      setRecoil(propertyState, property);
    });
  });

  test('should match image snapshot (general information)', async () => {
    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });

  test('should match image snapshot (apartments information)', async () => {
    // Act
    const tabs = renderResult.getAllByRole('tab');
    fireEvent.click(tabs[1]);

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
