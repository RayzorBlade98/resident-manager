import MonthYear from '_/extensions/date/month_year.extension';
import Landlord from '_/models/landlord/landlord';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import { IncidentalsState } from '_/states/incidentals/incidentals.state';
import { InvoiceState } from '_/states/invoice/invoice.state';
import { ResidentState } from '_/states/resident/resident.state';
import { WaterCostsState } from '_/states/waterCosts/waterCosts.state';
import Imported from '_/types/Imported';

/**
 * Converts the imported incidentals to the right format
 * @param imported incidentals that were imported from a file
 * @returns incidentals converted to the right format
 */
export function convertImportedIncidentals(
  imported: Imported<IncidentalsState>,
): IncidentalsState {
  return {
    ...imported,
    ongoingIncidentals: imported.ongoingIncidentals.map((i) => ({
      ...i,
      costs: i.costs.map((c) => ({ ...c, date: MonthYear.fromString(c.date) })),
    })),
    oneTimeIncidentals: imported.oneTimeIncidentals.map((i) => ({
      ...i,
      billingDate: new Date(i.billingDate),
      paymentDate: i.paymentDate ? new Date(i.paymentDate) : undefined,
    })),
  };
}

/**
 * Converts the imported invoices to the right format
 * @param imported invoices that were imported from a file
 * @returns invoices converted to the right format
 */
export function convertImportedInvoices(
  imported: Imported<InvoiceState>,
): InvoiceState {
  return imported.map((i) => ({
    ...i,
    start: MonthYear.fromString(i.start),
    end: MonthYear.fromString(i.end),
    newDeductionStart: MonthYear.fromString(i.newDeductionStart),
    residentInformation: Object.fromEntries(
      Object.entries(i.residentInformation).map(([id, residentInformation]) => [
        id,
        {
          ...residentInformation,
          rentPayments: residentInformation.rentPayments.map((r) => ({
            ...r,
            dueDate: MonthYear.fromString(r.dueDate),
          })),
        },
      ]),
    ),
  }));
}

/**
 * Converts the imported residents to the right format
 * @param imported residents that were imported from a file
 * @returns residents converted to the right format
 */
export function convertImportedResidents(
  imported: Imported<ResidentState>,
): ResidentState {
  return imported.map((r) => convertImportedResident(r));
}

/**
 * Converts a single imported resident to the right format
 * @param imported resident that was imported from a file
 * @returns resident converted to the right format
 */
export function convertImportedResident(
  imported: Imported<Resident>,
): Resident {
  return {
    ...imported,
    contractStart: MonthYear.fromString(imported.contractStart),
    rentInformation: imported.rentInformation.map((ri) => ({
      ...ri,
      dueDate: MonthYear.fromString(ri.dueDate),
      paymentDate: ri.paymentDate ? new Date(ri.paymentDate) : undefined,
    })),
    waterMeterReadings: imported.waterMeterReadings.map((w) => ({
      ...w,
      readingDate: new Date(w.readingDate),
    })),
    history: imported.history.map((history) => ({
      ...history,
      invalidSince: MonthYear.fromString(history.invalidSince),
    })),
    documents: imported.documents.map((document) => ({
      ...document,
      creationDate: new Date(document.creationDate),
      subjectDate: new Date(document.subjectDate),
    })),
  };
}

/**
 * Converts the imported property to the right format
 * @param imported property that were imported from a file
 * @returns property converted to the right format
 */
export function convertImportedProperty(
  imported: Imported<Property>,
): Property {
  return {
    ...imported,
    parkingSpaces: imported.parkingSpaces.map((p) => ({
      ...p,
      costs: p.costs.map((c) => ({
        ...c,
        date: MonthYear.fromString(c.date),
      })),
    })),
  };
}

/**
 * Converts the imported water costs to the right format
 * @param imported water costs that were imported from a file
 * @returns water costs converted to the right format
 */
export function convertImportedWaterCosts(
  imported: Imported<WaterCostsState>,
): WaterCostsState {
  return {
    waterUsageCosts: imported.waterUsageCosts.map((c) => ({
      ...c,
      date: MonthYear.fromString(c.date),
    })),
    sewageCosts: imported.sewageCosts.map((c) => ({
      ...c,
      date: MonthYear.fromString(c.date),
    })),
  };
}

/**
 * Converts the imported landlord to the right format
 * @param imported landlord that was imported from a file
 * @returns landlord converted to the right format
 */
export function convertImportedLandlord(
  imported: Imported<Landlord>,
): Landlord {
  return imported;
}
