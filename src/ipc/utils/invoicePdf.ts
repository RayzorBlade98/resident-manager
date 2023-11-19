import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  convertAddressToCityString,
  convertAddressToStreetString,
} from '../../utils/address/address.utils';
import { convertCurrencyCentsToString } from '../../utils/currency/currency.utils';
import { convertNameToString } from '../../utils/name/name.utils';
import MonthYear from '_/extensions/date/month_year.extension';
import Invoice from '_/models/invoice/invoice';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';

const labels = {
  addresses: {
    residentTitle: 'Mieter:',
  },
  ongoingIncidentals: {
    title: 'Laufende Nebenkosten',
    tableHeader: [
      'Nebenkosten',
      'Abrechnungsart',
      'Gesamtkosten',
      'Mieteranteil',
    ],
  },
  oneTimeIncidentals: {
    title: 'Einmalige Nebenkosten',
    tableHeader: [
      'Nebenkosten',
      'Abrechnungsart',
      'Gesamtkosten',
      'Mieteranteil',
    ],
  },
  waterCosts: {
    title: 'Wasserkosten',
    tableHeader: [
      'Kostenart',
      'Alter Zählerstand',
      'Neuer Zählerstand',
      'Wasserverbrauch',
      'Kosten pro m³',
      'Gesamtkosten',
    ],
    waterUsageCostLabel: 'Wasser',
    sewageCostLabel: 'Abwasser',
  },
  rentPayments: {
    title: 'Mietzahlungen',
    tableHeader: [
      'Monat',
      'Miete',
      'Nebenkosten',
      'Gezahlte Miete',
      'Fehlende Miete',
    ],
  },
};

/**
 * Class that provides functionality to create a pdf invoice for a resident
 */
class InvoicePdfGenerator {
  private readonly invoice: Invoice;

  private readonly residentInformation: ResidentInvoiceInformation;

  private readonly pdf: jsPDF;

  /**
   * @param invoice invoice for which the pdf should be generated
   * @param residentId id of the resident for which the pdf should be generated
   */
  public constructor(invoice: Invoice, residentId: string) {
    this.invoice = invoice;
    this.residentInformation = invoice.residentInformation[residentId];
    this.pdf = new jsPDF();
  }

  /**
   * Generates a `jsPDF` for the provided invoice and resident
   * @returns generated pdf
   */
  public generatePdf(): jsPDF {
    this.addAddresses();

    if (
      Object.keys(this.residentInformation.ongoingIncidentalsCosts).length > 0
    ) {
      this.addOngoingIncidentals();
    }

    if (
      Object.keys(this.residentInformation.oneTimeIncidentalsCosts).length > 0
    ) {
      this.addOneTimeIncidentals();
    }

    if (this.residentInformation.waterCosts.waterUsage > 0) {
      this.addWaterCosts();
    }

    if (this.residentInformation.rentPayments.length > 0) {
      this.addRentPayments();
    }

    return this.pdf;
  }

  private addAddresses(): void {
    const residentAddress = [
      labels.addresses.residentTitle,
      convertNameToString(this.residentInformation.name),
      convertAddressToStreetString(this.invoice.property.address),
      convertAddressToCityString(this.invoice.property.address),
    ].join('\n');

    autoTable(this.pdf, {
      body: [
        [
          {
            content: residentAddress,
            styles: {
              halign: 'left',
            },
          },
          // Todo: Add land lord address
          {
            content: '',
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });
  }

  private addOngoingIncidentals() {
    this.addHeadline(labels.ongoingIncidentals.title);
    this.addTable(
      labels.ongoingIncidentals.tableHeader,
      Object.entries(this.residentInformation.ongoingIncidentalsCosts).map(
        ([incidentals, costs]) => {
          const incidentalsInformation = this.invoice.ongoingIncidentalsInformation[incidentals];
          return [
            incidentalsInformation.name,
            incidentalsInformation.deductionType,
            convertCurrencyCentsToString(incidentalsInformation.totalCost),
            convertCurrencyCentsToString(costs),
          ];
        },
      ),
    );
  }

  private addOneTimeIncidentals() {
    this.addHeadline(labels.oneTimeIncidentals.title);
    this.addTable(
      labels.oneTimeIncidentals.tableHeader,
      Object.entries(this.residentInformation.oneTimeIncidentalsCosts).map(
        ([incidentals, costs]) => {
          const incidentalsInformation = this.invoice.oneTimeIncidentalsInformation[incidentals];
          return [
            incidentalsInformation.name,
            incidentalsInformation.deductionType,
            convertCurrencyCentsToString(incidentalsInformation.totalCost),
            convertCurrencyCentsToString(costs),
          ];
        },
      ),
    );
  }

  private addWaterCosts() {
    const waterCosts = this.residentInformation.waterCosts;

    const waterUsage = [
      `${waterCosts.lastWaterMeterCount} m³`,
      `${waterCosts.currentWaterMeterCount} m³`,
      `${waterCosts.waterUsage} m³`,
    ];

    this.addHeadline(labels.waterCosts.title);
    this.addTable(labels.waterCosts.tableHeader, [
      [
        labels.waterCosts.waterUsageCostLabel,
        ...waterUsage,
        convertCurrencyCentsToString(
          this.invoice.waterCosts.waterUsageCostPerCubicMeter,
        ),
        convertCurrencyCentsToString(waterCosts.waterUsageCosts),
      ],
      [
        labels.waterCosts.sewageCostLabel,
        ...waterUsage,
        convertCurrencyCentsToString(
          this.invoice.waterCosts.sewageCostPerCubicMeter,
        ),
        convertCurrencyCentsToString(waterCosts.sewageCosts),
      ],
    ]);
  }

  private addRentPayments() {
    this.addHeadline(labels.rentPayments.title);
    this.addTable(
      labels.rentPayments.tableHeader,
      this.residentInformation.rentPayments.map((r) => [
        MonthYear.fromDate(r.dueDate).toString(),
        convertCurrencyCentsToString(r.rent),
        convertCurrencyCentsToString(r.incidentals),
        convertCurrencyCentsToString(r.paymentAmount),
        convertCurrencyCentsToString(r.paymentMissing),
      ]),
    );
  }

  private addHeadline(title: string) {
    autoTable(this.pdf, {
      body: [
        [
          {
            content: title,
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
      ],
      theme: 'plain',
    });
  }

  private addTable(head: string[], body: string[][]) {
    autoTable(this.pdf, {
      head: [head],
      body,
      theme: 'striped',
      headStyles: {
        fillColor: '#343a40',
      },
    });
  }
}

export default InvoicePdfGenerator;
