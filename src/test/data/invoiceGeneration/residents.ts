import { invoiceEnd, invoiceStart } from './invoiceInformation';
import { parkingSpace1, parkingSpacePartial } from './property';
import { Salutation } from '_/models/name';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import NameBuilder from '_/test/builders/name.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import ResidentHistoryElementBuilder from '_/test/builders/residentHistoryElement.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';

/**
 * Not included in invoice (contract start after invoice)
 */
const residentNotIncluded = new ResidentBuilder()
  .withContractStart(invoiceEnd.addMonths(1))
  .build();

/**
 * - Included in complete invoice period
 * - Rent payments
 *      - rent 100, incidentals 10, paid 110, missing 0
 *      - rent 90, incidentals 5, paid 90, missing 5
 *      - rent 75, incidentals 10, paid 95, missing -10
 *      - Total missing: -5
 *  - Water meter reading
 *      - Current: 10030
 *      - Last: 10000
 *      - Usage: 30
 */
const standardResident1 = new ResidentBuilder()
  .withId('resident1')
  .withContractStart(invoiceStart.addMonths(-2))
  .addContractResident(
    new ContractResidentBuilder()
      .withName(
        new NameBuilder()
          .withSalutation(Salutation.Male)
          .withFirstName('Max 1')
          .withLastName('Mustermann 1')
          .build(),
      )
      .build(),
  )
  .addContractResident(
    new ContractResidentBuilder()
      .withName(
        new NameBuilder()
          .withSalutation(Salutation.Female)
          .withFirstName('Maxine 1')
          .withLastName('Musterfrau 1')
          .build(),
      )
      .build(),
  )
  .withParkingSpace(parkingSpace1.id)
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceEnd.addMonths(1))
      .withRent(100000)
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceEnd)
      .withRent(100)
      .withIncidentals(10)
      .withPayment(110, new Date())
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceStart.addMonths(1))
      .withRent(90)
      .withIncidentals(5)
      .withPayment(90, new Date())
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceStart)
      .withRent(75)
      .withIncidentals(10)
      .withPayment(95, new Date())
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceEnd.addMonths(1))
      .withWaterMeterCount(10000000)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceEnd.addMonths(-1))
      .withWaterMeterCount(10030)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceStart)
      .withWaterMeterCount(10020)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceStart.addMonths(-5))
      .withWaterMeterCount(10000)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceStart.addMonths(-7))
      .withWaterMeterCount(0)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .build();

/**
 * - Included in complete invoice period
 * - Contract residents overwrite in history
 * - Rent payments
 *      - rent 85, incidentals 15, paid 100, missing 0
 *      - rent 100, incidentals 10, paid 100, missing 10
 *      - rent 90, incidentals 20, paid 105, missing 5
 *      - Total missing: 15
 *  - Water meter reading
 *      - Current: 20050
 *      - Last: 20000
 *      - Usage: 50
 */
const standardResident2 = new ResidentBuilder()
  .withId('resident2')
  .withContractStart(invoiceStart.addMonths(-3))
  .addContractResident(
    new ContractResidentBuilder()
      .withName(
        new NameBuilder()
          .withSalutation(Salutation.Male)
          .withFirstName('Max 2')
          .withLastName('Mustermann 2')
          .build(),
      )
      .build(),
  )
  .addContractResident(
    new ContractResidentBuilder()
      .withName(
        new NameBuilder()
          .withFirstName('Resident after invoice period')
          .build(),
      )
      .build(),
  )
  .withParkingSpace(parkingSpace1.id)
  .addHistoryElement(
    new ResidentHistoryElementBuilder()
      .withInvalidSince(invoiceEnd.addMonths(1))
      .addContractResident(
        new ContractResidentBuilder()
          .withName(
            new NameBuilder()
              .withSalutation(Salutation.Male)
              .withFirstName('Max 2')
              .withLastName('Mustermann 2')
              .build(),
          )
          .build(),
      )
      .withParkingSpace(null)
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceEnd.addMonths(1))
      .withRent(100000)
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceEnd)
      .withRent(85)
      .withIncidentals(15)
      .withPayment(100, new Date())
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceStart.addMonths(1))
      .withRent(100)
      .withIncidentals(10)
      .withPayment(100, new Date())
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceStart)
      .withRent(90)
      .withIncidentals(20)
      .withPayment(105, new Date())
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceEnd.addMonths(3))
      .withWaterMeterCount(20000000)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceEnd)
      .withWaterMeterCount(20050)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceStart.addMonths(1))
      .withWaterMeterCount(20045)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceStart.addMonths(-1))
      .withWaterMeterCount(20000)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceStart.addMonths(-3))
      .withWaterMeterCount(0)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .build();

/**
 * - Not included in first invoice month
 * - Rent payments
 *      - rent 100, incidentals 50, paid 290, missing -140
 *      - rent 100, incidentals 40, paid -, missing 140
 *      - Total missing: 0
 *  - Water meter reading
 *      - Current: 30010
 *      - Last: 30000
 *      - Usage: 10
 */
const residentPartial = new ResidentBuilder()
  .withId('residentPartial')
  .withContractStart(invoiceStart.addMonths(1))
  .addContractResident(
    new ContractResidentBuilder()
      .withName(
        new NameBuilder()
          .withSalutation(Salutation.Male)
          .withFirstName('Max 3')
          .withLastName('Mustermann 3')
          .build(),
      )
      .build(),
  )
  .addHistoryElement(
    new ResidentHistoryElementBuilder()
      .withInvalidSince(invoiceEnd)
      .withParkingSpace(parkingSpacePartial.id)
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceEnd.addMonths(1))
      .withRent(100000)
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceEnd)
      .withRent(100)
      .withIncidentals(50)
      .withPayment(290, new Date())
      .build(),
  )
  .addRentInformation(
    new RentInformationBuilder()
      .withDueDate(invoiceStart.addMonths(1))
      .withRent(100)
      .withIncidentals(40)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceEnd.addMonths(1))
      .withWaterMeterCount(10000000)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceEnd.addMonths(-1))
      .withWaterMeterCount(30010)
      .withWasDeductedInInvoice(false)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceStart)
      .withWaterMeterCount(30000)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .addWaterMeterReading(
    new WaterMeterReadingBuilder()
      .withReadingDate(invoiceStart.addMonths(-7))
      .withWaterMeterCount(0)
      .withWasDeductedInInvoice(true)
      .build(),
  )
  .build();

/**
 * List of all residents included in the invoice
 */
export const includedResidents = [
  standardResident1,
  standardResident2,
  residentPartial,
];

/**
 * List of all residents
 */
export const residents = [residentNotIncluded, ...includedResidents];
