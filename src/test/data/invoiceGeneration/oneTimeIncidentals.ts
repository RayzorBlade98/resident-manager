import { invoiceEnd, invoiceStart } from './invoiceInformation';
import { DeductionType } from '_/models/incidentals/deduction_type';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';

/**
 * Deduction Type: Per Month
 * Total Costs: 100
 */
const oneTimeIncidentalsPerApartment = new OneTimeIncidentalsBuilder()
  .withId('apartment')
  .withName('OneTime Incidentals per Apartment')
  .withDeductionType(DeductionType.PerApartment)
  .withBillingDate(invoiceStart)
  .withCosts(100)
  .build();

/**
 * Deduction Type: Per Resident
 * Total Costs: 200
 */
const oneTimeIncidentalsPerResident = new OneTimeIncidentalsBuilder()
  .withId('resident')
  .withName('OneTime Incidentals per Resident')
  .withDeductionType(DeductionType.PerResident)
  .withBillingDate(invoiceStart.addMonths(1))
  .withCosts(200)
  .build();

const notIncludedIncidentals = [
  // Not deductable
  new OneTimeIncidentalsBuilder()
    .withDeductionType(DeductionType.NotDeductable)
    .withBillingDate(invoiceStart)
    .withCosts(10000)
    .build(),
  new OneTimeIncidentalsBuilder()
    .withDeductionType(DeductionType.NotDeductable)
    .withBillingDate(invoiceStart.addMonths(1))
    .withCosts(10000)
    .build(),
  // Outside of invoice period
  new OneTimeIncidentalsBuilder()
    .withDeductionType(DeductionType.PerApartment)
    .withBillingDate(invoiceStart.addMonths(-1))
    .withCosts(10000)
    .build(),
  new OneTimeIncidentalsBuilder()
    .withDeductionType(DeductionType.PerResident)
    .withBillingDate(invoiceStart.addMonths(-2))
    .withCosts(10000)
    .build(),
  new OneTimeIncidentalsBuilder()
    .withDeductionType(DeductionType.PerApartment)
    .withBillingDate(invoiceEnd.addMonths(1))
    .withCosts(10000)
    .build(),
  new OneTimeIncidentalsBuilder()
    .withDeductionType(DeductionType.PerResident)
    .withBillingDate(invoiceEnd.addMonths(2))
    .withCosts(10000)
    .build(),
];

/**
 * List of all one time incidentals
 */
export const oneTimeIncidentals = [
  ...notIncludedIncidentals,
  oneTimeIncidentalsPerApartment,
  oneTimeIncidentalsPerResident,
];
