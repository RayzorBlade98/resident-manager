import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { setRecoil } from 'recoil-nexus';
import RentInformationTable from './RentInformationTable';
import MonthYear from '_/extensions/date/month_year.extension';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import residentViewState from '_/views/ResidentView/states/resident_view_state';

describe('RentInformationTable', () => {
  test('should match snapshot', () => {
    // Arrange
    const resident = new ResidentBuilder()
      .addRentInformation(
        new RentInformationBuilder()
          .withRent(10)
          .withIncidentals(5)
          .withDueDate(new MonthYear(4, 2023))
          .build(),
      )
      .addRentInformation(
        new RentInformationBuilder()
          .withRent(20)
          .withIncidentals(15)
          .withDueDate(new MonthYear(3, 2023))
          .withPayment(20, new Date(2023, 3, 1))
          .build(),
      )
      .addRentInformation(
        new RentInformationBuilder()
          .withRent(30)
          .withIncidentals(25)
          .withDueDate(new MonthYear(2, 2023))
          .withPayment(55, new Date(2023, 2, 1))
          .build(),
      )
      .build();

    const renderResult = render(
      <ReactTestWrapper>
        <RentInformationTable />
      </ReactTestWrapper>,
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
