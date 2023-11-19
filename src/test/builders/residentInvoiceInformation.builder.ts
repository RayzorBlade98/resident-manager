import { v4 as uuid } from 'uuid';
import NameBuilder from './name.builder';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';

class ResidentInvoiceInformationBuilder {
  private residentInformation: ResidentInvoiceInformation;

  constructor() {
    this.residentInformation = {
      residentId: uuid(),
      name: new NameBuilder().build(),
      ongoingIncidentalsCosts: {},
      oneTimeIncidentalsCosts: {},
      rentPayments: [],
      waterCosts: {
        lastWaterMeterCount: 0,
        currentWaterMeterCount: 0,
        waterUsage: 0,
        waterUsageCosts: 0,
        sewageCosts: 0,
      },
      totalCosts: {
        ongoingIncidentalsCosts: 0,
        oneTimeIncidentalsCosts: 0,
        missingRentPayments: 0,
        waterCosts: 0,
        totalCosts: 0,
        totalPaidIncidentals: 0,
        totalMissingCosts: 0,
      },
    };
  }

  public build(): ResidentInvoiceInformation {
    return this.residentInformation;
  }
}

export default ResidentInvoiceInformationBuilder;
