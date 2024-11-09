import _ from 'lodash';
import calculateIncidentalsCosts from './incidentals';
import calculateRentPayments from './rent';
import calculateWaterCosts from './water';
import MonthYear from '_/extensions/date/month_year.extension';
import { Resident } from '_/models/resident/resident';

/**
 * Arguments for the total cost calculation
 */
type TotalCostCalulationArguments = {
  /**
   * Results of the the incidentals cost calculation
   */
  incidentalsCalculations: ReturnType<typeof calculateIncidentalsCosts>;

  /**
   * Results of the the water cost calculation
   */
  waterCostCalculations: ReturnType<typeof calculateWaterCosts>;

  /**
   * Results of the the rent payments calculation
   */
  rentPayments: ReturnType<typeof calculateRentPayments>;

  /**
   * List of all residents
   */
  residents: Resident[];
};

/**
 * Calculates the total costs for the invoice
 * @param args arguments for the total cost calculation
 * @returns total cost calculations for all residents
 */
export default function calculateTotalCosts(
  args: TotalCostCalulationArguments,
) {
  return Object.fromEntries(
    args.residents.map((resident) => {
      const rentPayments = args.rentPayments[resident.id];

      const allCosts = {
        ongoingIncidentalsCosts: _.sum(
          Object.values(
            args.incidentalsCalculations.residentInformation[resident.id]
              .ongoingIncidentalsCosts,
          ),
        ),
        oneTimeIncidentalsCosts: _.sum(
          Object.values(
            args.incidentalsCalculations.residentInformation[resident.id]
              .oneTimeIncidentalsCosts,
          ),
        ),
        missingRentPayments: _.sumBy(rentPayments, (r) => r.paymentMissing),
        waterCosts:
          args.waterCostCalculations.residentCosts[resident.id]
            .waterUsageCosts
          + args.waterCostCalculations.residentCosts[resident.id].sewageCosts,
      };

      const totalIncidentalsCosts = allCosts.oneTimeIncidentalsCosts
        + allCosts.ongoingIncidentalsCosts
        + allCosts.waterCosts;
      const newIncidentalsDeduction = Math.ceil(
        totalIncidentalsCosts
          / MonthYear.monthsBetween(
            rentPayments[0].dueDate,
            rentPayments[rentPayments.length - 1].dueDate,
          ),
      );
      const totalCosts = _.sum(Object.values(allCosts));
      const totalPaidIncidentals = _.sumBy(
        args.rentPayments[resident.id],
        (r) => r.incidentals,
      );
      const totalMissingCosts = totalCosts - totalPaidIncidentals;

      return [
        resident.id,
        {
          ...allCosts,
          individualIncidentalsCosts: 0,
          totalCosts,
          totalIncidentalsCosts,
          totalPaidIncidentals,
          totalMissingCosts,
          newIncidentalsDeduction,
        },
      ];
    }),
  );
}
