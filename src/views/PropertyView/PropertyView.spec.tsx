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
import ApartmentBuilder from '_/test/builders/apartment.builder';
import ParkingSpaceBuilder from '_/test/builders/parkingSpace.builder';
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
    .addApartment(
      new ApartmentBuilder()
        .withFloor('EG')
        .withLocation('left')
        .withRooms({ generic: 3 })
        .build(),
    )
    .addApartment(
      new ApartmentBuilder()
        .withFloor('EG')
        .withLocation('right')
        .withRooms({ generic: 4 })
        .build(),
    )
    .addParkingSpace(
      new ParkingSpaceBuilder().withName('Parking Space 1').build(),
    )
    .addParkingSpace(
      new ParkingSpaceBuilder().withName('Parking Space 2').build(),
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

  test('should match image snapshot (parking space information)', async () => {
    // Act
    const tabs = renderResult.getAllByRole('tab');
    fireEvent.click(tabs[2]);

    // Assert
    expect(await generateImage(screenshotSettings)).toMatchImageSnapshot();
  });
});
