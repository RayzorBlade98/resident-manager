import _ from 'lodash';
import { calculateResidentRentPayments } from './residentRentPayments';
import MonthYear from '_/extensions/date/month_year.extension';
import Invoice from '_/models/invoice/invoice';
import { Resident } from '_/models/resident/resident';
import { applyHistoryToResident } from '_/utils/resident/applyHistoryToResident/applyHistoryToResident';

type ResidentInformationCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
  residents: Resident[];
};

export function calculateResidentInformation(
  invoice: Invoice,
  args: ResidentInformationCalculationArgs,
): Invoice['residentInformation'] {
  // Filter out residents outside of invoice period
  const residents = args.residents.filter((r) => r.contractStart <= args.end);

  // Calculate resident information
  return Object.fromEntries(
    residents.map((r) => {
      const rentPayments = calculateResidentRentPayments(r, args);

      return [
        r.id,
        {
          residentId: r.id,
          // Use residents that are in the contract at the end of the invoice period
          names: applyHistoryToResident(r, args.end).contractResidents.map(
            (cr) => cr.name,
          ),
          ongoingIncidentalsCosts: {},
          oneTimeIncidentalsCosts: {},
          rentPayments,
          waterCosts: {
            lastWaterMeterCount: -1,
            currentWaterMeterCount: -1,
            waterUsage: -1,
            waterUsageCosts: -1,
            sewageCosts: -1,
            monthlyDeductionCosts: -1,
          },
          totalCosts: {
            ongoingIncidentalsCosts: -1,
            oneTimeIncidentalsCosts: -1,
            waterCosts: -1,
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
