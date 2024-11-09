import _ from 'lodash';
import { calculateResidentIncidentals } from './residentIncidentals';
import { calculateResidentIndividualIncidentals } from './residentIndividualIncidentals';
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

      const individualIncidentalsCosts = calculateResidentIndividualIncidentals(r, args);
      const ongoingIncidentalsCosts = calculateResidentIncidentals(r, invoice.ongoingIncidentalsInformation, args);
      const oneTimeIncidentalsCosts = calculateResidentIncidentals(r, invoice.oneTimeIncidentalsInformation, args);

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
            ongoingIncidentalsCosts: _.sum(Object.values(ongoingIncidentalsCosts)),
            oneTimeIncidentalsCosts: _.sum(Object.values(oneTimeIncidentalsCosts)),
            individualIncidentalsCosts: _.sum(Object.values(individualIncidentalsCosts)),
            waterCosts:
              waterCosts.waterUsageCosts
              + waterCosts.sewageCosts
              + waterCosts.monthlyDeductionCosts,
            totalIncidentalsDeductionCosts: -1,
            missingRentPayments: _.sumBy(rentPayments, (p) => p.paymentMissing),
            totalCosts: -1,
            totalPaidIncidentals: -1,
            totalMissingCosts: -1,
            newIncidentalsDeduction: -1,
          },
        },
      ];
    }),
  );
}
