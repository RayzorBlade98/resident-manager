/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, guard-for-in */

import ResidentParser from './resident.parser';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';

describe('ResidentParser', () => {
  describe('reviver', () => {
    test('should revive resident correctly', () => {
      // Arrange
      const resident = new ResidentBuilder()
        .addRentInformation(
          new RentInformationBuilder().withPayment(1, new Date()).build(),
        )
        .addRentInformation(new RentInformationBuilder().build())
        .addWaterMeterReading(new WaterMeterReadingBuilder().build())
        .build();
      const fromJson = JSON.parse(JSON.stringify(resident));

      // Act
      const revived: any = {};
      for (const k in fromJson) {
        revived[k] = ResidentParser.reviver(k, fromJson[k]);
      }

      // Assert
      expect(revived).toEqual(resident);
    });
  });
});
