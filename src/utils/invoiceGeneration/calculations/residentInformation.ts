import _ from 'lodash';
import { calculateResidentIncidentals } from './residentIncidentals';
import { calculateResidentIndividualIncidentals } from './residentIndividualIncidentals';
import { calculateResidentNewIncidentalsDeduction } from './residentNewIncidentalsDeduction';
import { calculateResidentRentPayments } from './residentRentPayments';
import { calculateResidentWaterCosts } from './residentWaterCosts';
import MonthYear from '_/extensions/date/month_year.extension';
import Invoice from '_/models/invoice/invoice';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import { applyHistoryToResident } from '_/utils/resident/applyHistoryToResident/applyHistoryToResident';

type ResidentInformationCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
  residents: Resident[];
  property: Property;
};

export function calculateResidentInformation(
  invoice: Invoice,
  args: ResidentInformationCalculationArgs,
): Invoice['residentInformation'] {
  // Filter out residents outside of invoice period
  args.residents = args.residents.filter((r) => r.contractStart <= args.end);

  // Calculate resident information
  return Object.fromEntries(
    args.residents.map((r) => {
      const rentPayments = calculateResidentRentPayments(r, args);
      const waterCosts = calculateResidentWaterCosts(
        r,
        invoice.waterCosts,
        args,
      );
      const individualIncidentalsCosts = calculateResidentIndividualIncidentals(
        r,
        args,
      );
      const ongoingIncidentalsCosts = calculateResidentIncidentals(
        r,
        invoice.ongoingIncidentalsInformation,
        args,
      );
      const oneTimeIncidentalsCosts = calculateResidentIncidentals(
        r,
        invoice.oneTimeIncidentalsInformation,
        args,
      );

      // Calculate total incidentals costs
      const totalWaterCosts = waterCosts.waterUsageCosts
        + waterCosts.sewageCosts
        + waterCosts.monthlyDeductionCosts;
      const totalOngoingIncidentalsCosts = _.sum(
        Object.values(ongoingIncidentalsCosts),
      );
      const totalOneTimeIncidentalsCosts = _.sum(
        Object.values(oneTimeIncidentalsCosts),
      );
      const totalIndividualIncidentalsCosts = _.sum(
        Object.values(individualIncidentalsCosts),
      );

      // Sum up all incidentals costs
      const totalIncidentalsCosts = totalWaterCosts
        + totalOngoingIncidentalsCosts
        + totalOneTimeIncidentalsCosts
        + totalIndividualIncidentalsCosts;

      // Sum up all missing rent payments
      const missingRentPayments = _.sumBy(
        rentPayments,
        (p) => p.paymentMissing,
      );

      // Sum up all costs
      const totalCosts = totalIncidentalsCosts + missingRentPayments;

      // Sum up all incidentals payments
      const totalPaidIncidentals = _.sumBy(rentPayments, (p) => p.incidentals);

      return [
        r.id,
        {
          residentId: r.id,
          // Use residents that are in the contract at the end of the invoice period
          names: applyHistoryToResident(r, args.end).contractResidents.map(
            (cr) => cr.name,
          ),
          ongoingIncidentalsCosts,
          oneTimeIncidentalsCosts,
          individualIncidentalsCosts,
          rentPayments,
          waterCosts,
          totalCosts: {
            ongoingIncidentalsCosts: totalOngoingIncidentalsCosts,
            oneTimeIncidentalsCosts: totalOneTimeIncidentalsCosts,
            individualIncidentalsCosts: totalIndividualIncidentalsCosts,
            waterCosts: totalWaterCosts,
            totalIncidentalsCosts,
            missingRentPayments,
            totalCosts,
            totalPaidIncidentals,
            totalMissingCosts: totalCosts - totalPaidIncidentals,
            newIncidentalsDeduction: calculateResidentNewIncidentalsDeduction(
              r,
              totalIncidentalsCosts,
              args,
            ),
          },
        },
      ];
    }),
  );
}
