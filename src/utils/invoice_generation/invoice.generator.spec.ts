/* eslint-disable @typescript-eslint/dot-notation */

import _ from 'lodash';
import generateInvoice from './invoice.generator';
import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import Invoice from '_/models/invoice/invoice';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('generateInvoice', () => {
  const start = new MonthYear(0, 2023);
  const end = new MonthYear(2, 2023);
  const property = new PropertyBuilder().withNumberOfApartments(10).build();

  /**
   * Deduction type: Per Apartment
   * TotalCost: costs[0].id
   */
  const ongoingIncidentalsPerApartment = new OngoingIncidentalsBuilder()
    .withDeductionType(DeductionType.PerApartment)
    .withInvoiceInterval(2)
    .withCosts([{ date: start.clone().addMonths(1), cost: 200 }])
    .build();

  /**
   * Deduction type: Per Resident
   * TotalCost: costs[0].id
   * Not available in first month
   */
  const ongoingIncidentalsPerResident = new OngoingIncidentalsBuilder()
    .withDeductionType(DeductionType.PerResident)
    .withInvoiceInterval(3)
    .withCosts([
      { date: start, cost: 300 },
      { date: start.clone().addMonths(-1), cost: 0 },
    ])
    .build();
  const includedOngoingIncidentals = [
    ongoingIncidentalsPerApartment,
    ongoingIncidentalsPerResident,
  ];

  const oneTimeIncidentalsPerApartment = new OneTimeIncidentalsBuilder()
    .withDeductionType(DeductionType.PerApartment)
    .withCosts(500)
    .withBillingDate(new Date(2023, 2, 1).toUTC())
    .build();

  const oneTimeIncidentalsPerResident = new OneTimeIncidentalsBuilder()
    .withDeductionType(DeductionType.PerResident)
    .withCosts(1000)
    .withBillingDate(new Date(2023, 2, 1).toUTC())
    .build();

  const includedOneTimeIncidentals = [
    oneTimeIncidentalsPerApartment,
    oneTimeIncidentalsPerResident,
  ];

  const standardResident = new ResidentBuilder()
    .withInvoiceStart(new MonthYear(0, 2023))
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
    .build();

  /**
   * Resident which is not included in the complete invoice timespan
   */
  const residentLaterInvoiceStart = new ResidentBuilder()
    .withInvoiceStart(new MonthYear(1, 2023))
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
    .build();

  const includedResidents = [standardResident, residentLaterInvoiceStart];
  const notIncludedResidents = [
    new ResidentBuilder().withInvoiceStart(start.clone().addMonths(-1)).build(),
    new ResidentBuilder().withInvoiceStart(end.clone().addMonths(1)).build(),
  ];
  const residents = [...includedResidents, ...notIncludedResidents];

  const expectedInvoice: Partial<Invoice> = {
    start,
    end,
    ongoingIncidentalsInformation: {
      [ongoingIncidentalsPerApartment.id]: {
        incidentalsId: ongoingIncidentalsPerApartment.id,
        name: ongoingIncidentalsPerApartment.name,
        totalCost: ongoingIncidentalsPerApartment.costs[0].cost,
        deductionType: ongoingIncidentalsPerApartment.deductionType,
      },
      [ongoingIncidentalsPerResident.id]: {
        incidentalsId: ongoingIncidentalsPerResident.id,
        name: ongoingIncidentalsPerResident.name,
        totalCost: ongoingIncidentalsPerResident.costs[0].cost,
        deductionType: ongoingIncidentalsPerResident.deductionType,
      },
    },
    oneTimeIncidentalsInformation: {
      [oneTimeIncidentalsPerApartment.id]: {
        incidentalsId: oneTimeIncidentalsPerApartment.id,
        name: oneTimeIncidentalsPerApartment.name,
        totalCost: oneTimeIncidentalsPerApartment.cost,
        deductionType: oneTimeIncidentalsPerApartment.deductionType,
      },
      [oneTimeIncidentalsPerResident.id]: {
        incidentalsId: oneTimeIncidentalsPerResident.id,
        name: oneTimeIncidentalsPerResident.name,
        totalCost: oneTimeIncidentalsPerResident.cost,
        deductionType: oneTimeIncidentalsPerResident.deductionType,
      },
    },
    residentInformation: {
      [standardResident.id]: {
        residentId: standardResident.id,
        ongoingIncidentalsCosts: {
          [ongoingIncidentalsPerApartment.id]: 20,
          [ongoingIncidentalsPerResident.id]: 200,
        },
        oneTimeIncidentalsCosts: {
          [oneTimeIncidentalsPerApartment.id]:
            oneTimeIncidentalsPerApartment.cost / property.numberOfApartments,
          [oneTimeIncidentalsPerResident.id]:
            oneTimeIncidentalsPerResident.cost / 2,
        },
        rentPayments: [
          {
            dueDate: new MonthYear(0, 2023),
            rent: 500,
            incidentals: 100,
            paymentAmount: 600,
            paymentMissing: 0,
          },
          {
            dueDate: new MonthYear(1, 2023),
            rent: 600,
            incidentals: 200,
            paymentAmount: 600,
            paymentMissing: 200,
          },
          {
            dueDate: new MonthYear(2, 2023),
            rent: 700,
            incidentals: 300,
            paymentAmount: 0,
            paymentMissing: 1000,
          },
        ],
      },
      [residentLaterInvoiceStart.id]: {
        residentId: residentLaterInvoiceStart.id,
        ongoingIncidentalsCosts: {
          [ongoingIncidentalsPerApartment.id]: 20,
          [ongoingIncidentalsPerResident.id]: 100,
        },
        oneTimeIncidentalsCosts: {
          [oneTimeIncidentalsPerApartment.id]:
            oneTimeIncidentalsPerApartment.cost / property.numberOfApartments,
          [oneTimeIncidentalsPerResident.id]:
            oneTimeIncidentalsPerResident.cost / 2,
        },
        rentPayments: [
          {
            dueDate: new MonthYear(1, 2023),
            rent: 700,
            incidentals: 100,
            paymentAmount: 1000,
            paymentMissing: -200,
          },
          {
            dueDate: new MonthYear(2, 2023),
            rent: 800,
            incidentals: 200,
            paymentAmount: 0,
            paymentMissing: 1000,
          },
        ],
      },
    },
  };

  test('should return right invoice', () => {
    // Act
    const invoice = generateInvoice({
      start,
      end,
      residents,
      includedOngoingIncidentals,
      includedOneTimeIncidentals,
      property,
    });
    _.unset(invoice, 'id');

    // Assert
    expect(invoice).toEqual(expectedInvoice);
  });
});
