import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import { OngoingIncidentalsCostBuilder } from '_/test/builders/ongoingIncidentalsCost.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

/**
 * Deduction type: Per Apartment
 * TotalCost: 200
 * Cost per apartment (per month): 10
 * Not available in first month
 */
export const ongoingIncidentalsPerApartment = new OngoingIncidentalsBuilder()
  .withDeductionType(DeductionType.PerApartment)
  .withInvoiceInterval(2)
  .withCosts([
    new OngoingIncidentalsCostBuilder()
      .withDueDate(new MonthYear(1, 2023))
      .withCost(200)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(new MonthYear(3, 2023))
      .withCost(0)
      .build(),
  ])
  .build();

/**
 * Deduction type: Per Resident
 * TotalCost: 300
 */
export const ongoingIncidentalsPerResident = new OngoingIncidentalsBuilder()
  .withDeductionType(DeductionType.PerResident)
  .withInvoiceInterval(3)
  .withCosts([
    new OngoingIncidentalsCostBuilder()
      .withDueDate(new MonthYear(11, 2022))
      .withCost(0)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(new MonthYear(0, 2023))
      .withCost(0)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(new MonthYear(1, 2023))
      .withCost(300)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(new MonthYear(3, 2023))
      .withCost(0)
      .build(),
  ])
  .build();
export const includedOngoingIncidentals = [
  ongoingIncidentalsPerApartment,
  ongoingIncidentalsPerResident,
];

export const oneTimeIncidentalsPerApartment = new OneTimeIncidentalsBuilder()
  .withDeductionType(DeductionType.PerApartment)
  .withCosts(500)
  .withBillingDate(new Date(2023, 0, 1).toUTC())
  .build();

export const oneTimeIncidentalsPerResident = new OneTimeIncidentalsBuilder()
  .withDeductionType(DeductionType.PerResident)
  .withCosts(1000)
  .withBillingDate(new Date(2023, 2, 1).toUTC())
  .build();

export const includedOneTimeIncidentals = [
  oneTimeIncidentalsPerApartment,
  oneTimeIncidentalsPerResident,
];
