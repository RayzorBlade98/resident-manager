/* eslint-disable @typescript-eslint/dot-notation */

import { DeductionType } from '../../models/incidentals/ongoing_incidentals';
import InvoiceGenerator from './invoice.generator';
import MonthYear from '_/extensions/date/month_year.extension';
import { Invoice } from '_/models/invoice/invoice';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('InvoiceGenerator', () => {
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

  const standardResident = new ResidentBuilder()
    .withInvoiceStart(new MonthYear(0, 2023))
    .withNumberOfResidents(2)
    .build();

  /**
   * Resident which is not included in the complete invoice timespan
   */
  const residentLaterInvoiceStart = new ResidentBuilder()
    .withInvoiceStart(new MonthYear(1, 2023))
    .withNumberOfResidents(2)
    .build();
  const includedResidents = [standardResident, residentLaterInvoiceStart];
  const notIncludedResidents = [
    new ResidentBuilder().withInvoiceStart(start.clone().addMonths(-1)).build(),
    new ResidentBuilder().withInvoiceStart(end.clone().addMonths(1)).build(),
  ];
  const residents = [...includedResidents, ...notIncludedResidents];

  const invoiceGenerator = new InvoiceGenerator({
    start,
    end,
    residents,
    includedOngoingIncidentals,
    property,
  });

  describe('constructor', () => {
    test('should filter residents outside of timespan', () => {
      expect(invoiceGenerator['args'].residents).toEqual(includedResidents);
    });
  });

  const expectedInvoice: Invoice = {
    id: invoiceGenerator['invoice'].id,
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
    residentInformation: {
      [standardResident.id]: {
        residentId: standardResident.id,
        ongoingIncidentalsCosts: {
          [ongoingIncidentalsPerApartment.id]: 20,
          [ongoingIncidentalsPerResident.id]: 200,
        },
      },
      [residentLaterInvoiceStart.id]: {
        residentId: residentLaterInvoiceStart.id,
        ongoingIncidentalsCosts: {
          [ongoingIncidentalsPerApartment.id]: 20,
          [ongoingIncidentalsPerResident.id]: 100,
        },
      },
    },
  };

  describe('generateInvoice', () => {
    test('should return right invoice', () => {
      // Act
      const invoice = invoiceGenerator.generateInvoice();

      // Assert
      expect(invoice).toEqual(expectedInvoice);
    });
  });
});
