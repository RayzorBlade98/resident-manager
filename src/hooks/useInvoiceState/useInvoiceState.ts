import { useRecoilState, useSetRecoilState } from 'recoil';
import Invoice from '_/models/invoice/invoice';
import invoiceState from '_/states/invoice/invoice.state';
import residentState from '_/states/resident/resident.state';

/**
 * Hook that returns the invoice state and utility functions to modify it
 */
function useInvoiceState() {
  const [invoices, setInvoices] = useRecoilState(invoiceState);
  const setResidents = useSetRecoilState(residentState);

  function addInvoice(invoice: Invoice): void {
    const includedResidents = Object.keys(invoice.residentInformation);

    // Adjust water meter readings and rent payments
    setResidents((state) => state.map((resident) => {
      if (!includedResidents.includes(resident.id)) {
        return resident;
      }

      const includedRentMonths = invoice.residentInformation[
        resident.id
      ].rentPayments.map((r) => r.dueDate);

      return {
        ...resident,
        waterMeterReadings: resident.waterMeterReadings.map((reading) => ({
          ...reading,
          wasDeductedInInvoice: true,
        })),
        rentInformation: resident.rentInformation.map((rent) => ({
          ...rent,
          wasDeductedInInvoice: includedRentMonths.find((m) => m.equals(rent.dueDate))
            ? true
            : rent.wasDeductedInInvoice,
        })),
      };
    }));

    // Add invoice to state
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

export default useInvoiceState;
