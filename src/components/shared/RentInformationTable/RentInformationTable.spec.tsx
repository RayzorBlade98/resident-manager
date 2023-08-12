import { render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import RentInformationTable from './RentInformationTable';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('RentInformationTable', () => {
  test('should match snapshot', async () => {
    // Arrange
    const resident = new ResidentBuilder()
      .addRentInformation(
        new RentInformationBuilder()
          .withDueDate(new MonthYear(2, 2023))
          .build(),
      )
      .addRentInformation(
        new RentInformationBuilder()
          .withDueDate(new MonthYear(3, 2023))
          .withPayment(1, new Date(2023, 5, 11))
          .build(),
      )
      .addRentInformation(
        new RentInformationBuilder()
          .withDueDate(new MonthYear(4, 2023))
          .withPayment(60000, new Date(2023, 5, 11))
          .build(),
      )
      .build();

    // Act
    render(
      <ReactTestWrapper>
        <RentInformationTable resident={resident} />
      </ReactTestWrapper>,
    );

    // Assert
    expect(await generateImage()).toMatchImageSnapshot();
  });
});
