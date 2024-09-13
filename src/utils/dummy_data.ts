/* istanbul ignore file */

import { range } from 'lodash';
import { setRecoil } from 'recoil-nexus';
import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import incidentalsState from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import residentState from '_/states/resident/resident.state';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import NameBuilder from '_/test/builders/name.builder';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';

function createDummyData(): void {
  // Dummy residents
  const residents = range(0, 8).map((i) => new ResidentBuilder()
    .addContractResident(
      new ContractResidentBuilder()
        .withName(
          new NameBuilder()
            .withFirstName(`Max ${i + 1}`)
            .withLastName('Mustermann')
            .build(),
        )
        .build(),
    )
    .withNumberOfResidents(2)
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear().addMonths(-2))
        .withRent(100 * (i + 1))
        .withIncidentals(100 - i * 10)
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear().addMonths(-1))
        .withRent(100 * (i + 1))
        .withIncidentals(100 - i * 10)
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear())
        .withRent(100 * (i + 1))
        .withIncidentals(100 - i * 10)
        .build(),
    )
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 6, 1).toUTC())
        .withWaterMeterCount(1234)
        .withWasDeductedInInvoice(true)
        .build(),
    )
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new Date().toUTC())
        .withWaterMeterCount(1235)
        .withWasDeductedInInvoice(false)
        .build(),
    )
    .withContractStart(new MonthYear().addMonths(-2))
    .build());
  setRecoil(residentState, residents);

  // Dummy incidentals
  const ongoingIncidentals = range(0, 8).map((i) => new OngoingIncidentalsBuilder()
    .withName(`Laufende Nebenkosten ${i + 1}`)
    .withDeductionType(
      i % 2 === 0 ? DeductionType.PerApartment : DeductionType.PerResident,
    )
    .withCosts([
      {
        cost: 10000,
        dueDate: new MonthYear(),
        paymentDate: new Date(),
        bankTransferDocumentId: '',
      },
    ])
    .build());
  const oneTimeIncidentals = range(0, 8).map((i) => new OneTimeIncidentalsBuilder()
    .withName(`Einmalige Nebenkosten ${i + 1}`)
    .withDeductionType(
      i % 2 === 0 ? DeductionType.PerApartment : DeductionType.PerResident,
    )
    .withCosts(10000)
    .withBillingDate(new Date().toUTC())
    .build());
  setRecoil(incidentalsState, { ongoingIncidentals, oneTimeIncidentals });

  // Dummy invoices
  InvoiceBuilder.setStart(new MonthYear().addMonths(-4));
  const invoices = range(0, 4).map((_) => new InvoiceBuilder().build());
  setRecoil(invoiceState, invoices);
}

export default createDummyData;
