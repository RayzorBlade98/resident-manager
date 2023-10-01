import MonthYear from '_/extensions/date/month_year.extension';
import { DeductionType } from '_/models/incidentals/deduction_type';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

/**
 * Deduction type: Per Apartment
 * TotalCost: costs[0].id
 */
export const ongoingIncidentalsPerApartment = new OngoingIncidentalsBuilder()
  .withDeductionType(DeductionType.PerApartment)
  .withInvoiceInterval(2)
  .withCosts([{ date: new MonthYear(1, 2023), cost: 200 }])
  .build();

/**
 * Deduction type: Per Resident
 * TotalCost: costs[0].id
 * Not available in first month
 */
export const ongoingIncidentalsPerResident = new OngoingIncidentalsBuilder()
  .withDeductionType(DeductionType.PerResident)
  .withInvoiceInterval(3)
  .withCosts([
    { date: new MonthYear(0, 2023), cost: 300 },
    { date: new MonthYear(11, 2022), cost: 0 },
  ])
  .build();
export const includedOngoingIncidentals = [
  ongoingIncidentalsPerApartment,
  ongoingIncidentalsPerResident,
];

export const oneTimeIncidentalsPerApartment = new OneTimeIncidentalsBuilder()
  .withDeductionType(DeductionType.PerApartment)
  .withCosts(500)
  .withBillingDate(new Date(2023, 2, 1).toUTC())
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
