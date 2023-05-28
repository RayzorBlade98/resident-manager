import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { setRecoil } from 'recoil-nexus';
import RentInformationTable from './RentInformationTable';
import residentState from '_/states/saveStates/resident_state';
import { Month } from '_/types/date';
import residentViewState from '_/views/ResidentView/states/resident_view_state';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import RentInformationBuilder from '_tests/__test_utils__/builders/rent_information_builder';
import ResidentBuilder from '_tests/__test_utils__/builders/resident_builder';

describe('RentInformationTable', () => {
  test('should match snapshot', () => {
    // Arrange
    const resident = new ResidentBuilder()
      .addRentInformation(
        new RentInformationBuilder()
          .withRent(10)
          .withIncidentals(5)
          .withMonth(Month.May)
          .build(),
      )
      .addRentInformation(
        new RentInformationBuilder()
          .withRent(20)
          .withIncidentals(15)
          .withMonth(Month.April)
          .withPayment(20, new Date(2023, 3, 1))
          .build(),
      )
      .addRentInformation(
        new RentInformationBuilder()
          .withRent(30)
          .withIncidentals(25)
          .withMonth(Month.March)
          .withPayment(55, new Date(2023, 2, 1))
          .build(),
      )
      .build();

    const renderResult = render(
      <RecoilTestWrapper>
        <RentInformationTable />
      </RecoilTestWrapper>,
    );

    act(() => {
      setRecoil(residentState, [resident]);
      setRecoil(residentViewState, (state) => ({
        ...state,
        selectedResident: resident.id,
      }));
    });

    // Assert
    expect(renderResult.container).toMatchSnapshot();
  });
});
