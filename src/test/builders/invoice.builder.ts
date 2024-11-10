import { v4 as uuid } from 'uuid';
import AddressBuilder from './address.builder';
import LandlordBuilder from './landlord.builder';
import MonthYear from '_/extensions/date/month_year.extension';
import { IncidentalsInvoiceInformation } from '_/models/invoice/incidentals_invoice';
import Invoice from '_/models/invoice/invoice';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';

class InvoiceBuilder {
  private static nextStart = new MonthYear(1, 2023);

  private invoice: Invoice;

  constructor() {
    this.invoice = {
      id: uuid(),
      start: InvoiceBuilder.nextStart,
      end: InvoiceBuilder.nextStart.addMonths(1),
      newDeductionStart: InvoiceBuilder.nextStart.addMonths(2),
      residentInformation: {},
      ongoingIncidentalsInformation: {},
      oneTimeIncidentalsInformation: {},
      waterCosts: {
        waterUsageCostPerCubicMeter: 1,
        sewageCostPerCubicMeter: 1,
        totalMonthlyDeductions: 1,
      },
      property: {
        address: new AddressBuilder().build(),
      },
      landlord: new LandlordBuilder().build(),
    };
    InvoiceBuilder.nextStart = this.invoice.end;
  }

  public withId(id: string): InvoiceBuilder {
    this.invoice.id = id;
    return this;
  }

  public withStartAndEnd(start: MonthYear, end: MonthYear): InvoiceBuilder {
    this.invoice.start = start;
    this.invoice.end = end;
    return this;
  }

  public withNewDeductionStart(newDeductionStart: MonthYear): InvoiceBuilder {
    this.invoice.newDeductionStart = newDeductionStart;
    return this;
  }

  public withOngoingIncidentals(
    incidentals: IncidentalsInvoiceInformation,
  ): InvoiceBuilder {
    this.invoice.ongoingIncidentalsInformation[incidentals.incidentalsId] = incidentals;
    return this;
  }

  public withResident(resident: ResidentInvoiceInformation): InvoiceBuilder {
    this.invoice.residentInformation[resident.residentId] = resident;
    return this;
  }

  public build(): Invoice {
    return this.invoice;
  }

  public static setStart(start: MonthYear): void {
    InvoiceBuilder.nextStart = start;
  }
}

export default InvoiceBuilder;
