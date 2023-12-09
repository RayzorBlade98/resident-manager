import MonthYear from '_/extensions/date/month_year.extension';
import { Salutation } from '_/models/name';
import NameBuilder from '_/test/builders/name.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';

export const standardResident = new ResidentBuilder()
  .withName(
    new NameBuilder()
      .withSalutation(Salutation.Male)
      .withFirstName('Max')
      .withLastName('Mustermann')
      .build(),
  )
  .withContractStart(new MonthYear(11, 2022))
  .withNumberOfResidents(2)
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(new MonthYear(0, 2023))
      .withRent(500)
      .withIncidentals(100)
      .withPayment(600, new Date(2023, 0, 31))
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(new MonthYear(1, 2023))
      .withRent(600)
      .withIncidentals(200)
      .withPayment(600, new Date(2023, 1, 31))
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(new MonthYear(2, 2023))
      .withRent(700)
      .withIncidentals(300)
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(new MonthYear(3, 2023))
      .withRent(700)
      .withIncidentals(300)
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(new MonthYear(4, 2023))
      .withRent(700)
      .withIncidentals(300)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(new MonthYear(10, 2022))
      .withWaterMeterCount(1)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(new MonthYear(11, 2022))
      .withWaterMeterCount(1000)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(new MonthYear(0, 2023))
      .withWaterMeterCount(1100)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(new MonthYear(2, 2023))
      .withWaterMeterCount(1200)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(new MonthYear(3, 2023))
      .withWaterMeterCount(1300)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .build();

/**
 * Resident which is not included in the complete invoice timespan
 */
export const residentLaterInvoiceStart = new ResidentBuilder()
  .withName(
    new NameBuilder()
      .withSalutation(Salutation.Female)
      .withFirstName('Maxine')
      .withLastName('Musterfrau')
      .build(),
  )
  .withContractStart(new MonthYear(1, 2023))
  .withNumberOfResidents(2)
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(new MonthYear(1, 2023))
      .withRent(700)
      .withIncidentals(100)
      .withPayment(1000, new Date(2023, 1, 31))
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(new MonthYear(2, 2023))
      .withRent(800)
      .withIncidentals(200)
      .withPayment(0, new Date(2023, 2, 31))
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(new MonthYear(3, 2023))
      .withRent(700)
      .withIncidentals(300)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(new MonthYear(10, 2022))
      .withWaterMeterCount(1)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(new MonthYear(11, 2022))
      .withWaterMeterCount(2000)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .build();

export const includedResidents = [standardResident, residentLaterInvoiceStart];
export const notIncludedResidents = [
  new ResidentBuilder()
    .withContractStart(new MonthYear(3, 2023))
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new MonthYear(3, 2023))
        .withWaterMeterCount(1300)
        .withWasDeductedInInvoice(false)
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(2, 2023))
        .withRent(700)
        .withIncidentals(300)
        .build(),
    )
    .build(),
];

export const residents = [...includedResidents, ...notIncludedResidents];
