import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import MonthYear from '_/extensions/date/month_year.extension';
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
    },
    [residents, ongoingIncidentals, oneTimeIncidentals, waterCosts, property, landlord, setInvoices],
  );
}
