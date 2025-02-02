import { getInvoiceMonthsForResident } from '../utils/getInvoiceMonthsForResident';
import MonthYear from '_/extensions/date/month_year.extension';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';
import ParkingSpace from '_/models/property/parkingSpace';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import { applyHistoryToResident } from '_/utils/resident/applyHistoryToResident/applyHistoryToResident';

type ResidentIndividualIncidentalsCalculationArgs = {
  start: MonthYear;
  end: MonthYear;
  property: Property;
};

export function calculateResidentIndividualIncidentals(
  resident: Resident,
  args: ResidentIndividualIncidentalsCalculationArgs,
): ResidentInvoiceInformation['individualIncidentalsCosts'] {
  const individualIncidentals: Record<string, CurrencyInCents> = {};

  // Calculate parking space costs
  const parkingSpaceCosts = calculateParkingSpaceCosts(resident, args);
  if (parkingSpaceCosts > 0) {
    individualIncidentals.Stellplatz = parkingSpaceCosts;
  }

  return individualIncidentals;
}

function calculateParkingSpaceCosts(
  resident: Resident,
  args: ResidentIndividualIncidentalsCalculationArgs,
): CurrencyInCents {
  // Calculate months included in the invoice for the resident
  const months = getInvoiceMonthsForResident(resident, args.start, args.end);

  let totalCosts = 0;
  for (const month of months) {
    // Apply history to resident
    const historicalResident = applyHistoryToResident(resident, month);

    // Check if resident had a parking space during the month
    if (!historicalResident.parkingSpaceId) {
      continue;
    }

    // Find the parking space of the resident
    const parkingSpace = args.property.parkingSpaces.find(
      (p) => p.id === historicalResident.parkingSpaceId,
    ) as ParkingSpace;

    // Find the costs of the parking space for the month
    const cost = parkingSpace.costs.find((c) => c.date <= month)
      ?.cost as CurrencyInCents;

    // Add the costs to the total costs
    totalCosts += cost;
  }

  return totalCosts;
}
