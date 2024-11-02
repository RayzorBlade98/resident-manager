import { invoiceEnd, invoiceStart } from './invoiceInformation';
import { DeductionType } from '_/models/incidentals/deduction_type';
import { OngoingIncidentalsCostBuilder } from '_/test/builders/ongoingIncidentalsCost.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

/**
 * Deduction Type: Per Month
 * Total Costs: 150
 */
const ongoingIncidentalsPerApartment = new OngoingIncidentalsBuilder()
  .withId('apartment')
  .withName('Ongoing Incidentals per Apartment')
  .withDeductionType(DeductionType.PerApartment)
  .withCosts([
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceStart.addMonths(-2))
      .withCost(100000)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceStart.addMonths(-1))
      .withCost(100000)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceStart)
      .withCost(100)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceStart.addMonths(1))
      .withCost(50)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceEnd.addMonths(1))
      .withCost(100000)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceEnd.addMonths(2))
      .withCost(100000)
      .build(),
  ])
  .build();

/**
 * Deduction Type: Per Resident
 * Total Costs: 100
 */
const ongoingIncidentalsPerResident = new OngoingIncidentalsBuilder()
  .withId('resident')
  .withName('Ongoing Incidentals per Resident')
  .withDeductionType(DeductionType.PerResident)
  .withCosts([
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceStart.addMonths(-2))
      .withCost(100000)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceStart.addMonths(-1))
      .withCost(100000)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceEnd)
      .withCost(75)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceStart.addMonths(1))
      .withCost(25)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceEnd.addMonths(1))
      .withCost(100000)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceEnd.addMonths(2))
      .withCost(100000)
      .build(),
  ])
  .build();

/**
 * Deduction Type: Not deductable
 */
const ongoingIncidentalsNotDeductable = new OngoingIncidentalsBuilder()
  .withId('notDeductable')
  .withName('Ongoing Incidentals not deductable')
  .withDeductionType(DeductionType.NotDeductable)
  .withCosts([
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceStart)
      .withCost(100000)
      .build(),
    new OngoingIncidentalsCostBuilder()
      .withDueDate(invoiceStart.addMonths(1))
      .withCost(100000)
      .build(),
  ])
  .build();

/**
 * List of all ongoing incidentals
 */
export const ongoingIncidentals = [
  ongoingIncidentalsPerApartment,
  ongoingIncidentalsPerResident,
  ongoingIncidentalsNotDeductable,
];
