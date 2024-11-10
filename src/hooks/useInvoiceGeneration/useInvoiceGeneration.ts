import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import RentInformationUtils from '../../utils/rent/rent.utils';
import MonthYear from '_/extensions/date/month_year.extension';
import Invoice from '_/models/invoice/invoice';
import { Resident } from '_/models/resident/resident';
import incidentalsState from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import { generateInvoice } from '_/utils/invoiceGeneration/generateInvoice';

/**
 * Hook that returns a function to generate a new invoice
 */
export function useInvoiceGeneration() {
  const [residents, setResidents] = useRecoilState(residentState);
  const waterCosts = useRecoilValue(waterCostsState);
  const { ongoingIncidentals, oneTimeIncidentals } = useRecoilValue(incidentalsState);
  const property = useRecoilValue(propertyState);
  const landlord = useRecoilValue(landlordState);
  const setInvoices = useSetRecoilState(invoiceState);

  return useCallback(
    (start: MonthYear, end: MonthYear, newDeductionStart: MonthYear) => {
      // Generate invoice
      const invoice = generateInvoice({
        start,
        end,
        newDeductionStart,
        residents,
        ongoingIncidentals,
        oneTimeIncidentals,
        waterCosts,
        property,
        landlord,
      });
      setInvoices((invoices) => [...invoices, invoice]);

      // Apply invoice to residents
      setResidents((_residents) => _residents.map((r) => applyInvoiceToResident(r, invoice)));
    },
    [
      residents,
      ongoingIncidentals,
      oneTimeIncidentals,
      waterCosts,
      property,
      landlord,
      setInvoices,
      setResidents,
    ],
  );
}

function applyInvoiceToResident(
  resident: Resident,
  invoice: Invoice,
): Resident {
  const residentInvoiceInformation = invoice.residentInformation[resident.id];

  if (!residentInvoiceInformation) {
    return resident;
  }

  // Water meter readings
  const waterMeterReadings = resident.waterMeterReadings.map((r) => ({
    ...r,
    wasDeductedInInvoice: r.readingDate <= invoice.end,
  }));

  // Rent information
  const lastRentInformation = resident.rentInformation[0];
  const newRentInformation = invoice.newDeductionStart > lastRentInformation.dueDate
    ? RentInformationUtils.timespan(
      lastRentInformation.dueDate.addMonths(1),
      invoice.newDeductionStart,
      lastRentInformation.rent,
      lastRentInformation.incidentals,
    )
    : [];
  const rentInformation = resident.rentInformation
    .concat(newRentInformation)
    .map((r) => ({
      ...r,
      wasDeductedInInvoice: r.dueDate <= invoice.end,
      incidentals:
        r.dueDate < invoice.newDeductionStart
          ? r.incidentals
          : residentInvoiceInformation.totalCosts.newIncidentalsDeduction,
    }));

  return {
    ...resident,
    waterMeterReadings,
    rentInformation,
  };
}
