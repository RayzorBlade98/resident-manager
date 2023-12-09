import { useRecoilState, useSetRecoilState } from 'recoil';
import RentInformationUtils from '../../utils/rent/rent.utils';
import Invoice from '_/models/invoice/invoice';
import { Resident } from '_/models/resident/resident';
import invoiceState from '_/states/invoice/invoice.state';
import residentState from '_/states/resident/resident.state';

/**
 * Hook that returns the invoice state and utility functions to modify it
 */
function useInvoiceState() {
  const [invoices, setInvoices] = useRecoilState(invoiceState);
  const setResidents = useSetRecoilState(residentState);

  function addInvoice(invoice: Invoice): void {
    setResidents((state) => state.map((resident) => updateResidentWithNewInvoice(invoice, resident)));
    setInvoices((state) => [...state, invoice]);
  }

  return {
    /**
     * All invoices
     */
    invoices,

    /**
     * Function to add a new invoice
     */
    addInvoice,
  };
}

function updateResidentWithNewInvoice(invoice: Invoice, resident: Resident) {
  const residentInvoiceInformation = invoice.residentInformation[resident.id];

  if (!residentInvoiceInformation) {
    return resident;
  }

  // Water meter readings
  const waterMeterReadings = resident.waterMeterReadings.map((r) => ({
    ...r,
    wasDeductedInInvoice: true,
  }));

  // Rent Information
  const newRentInformation = invoice.newDeductionStart > resident.rentInformation[0].dueDate
    ? RentInformationUtils.timespan(
      resident.rentInformation[0].dueDate.addMonths(1),
      invoice.newDeductionStart,
      resident.rentInformation[0].rent,
      resident.rentInformation[0].incidentals,
    )
    : [];
  const rentInformation = resident.rentInformation
    .concat(newRentInformation)
    .map((r) => ({
      ...r,
      wasDeductedInInvoice: !(r.dueDate > invoice.end),
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

export default useInvoiceState;
