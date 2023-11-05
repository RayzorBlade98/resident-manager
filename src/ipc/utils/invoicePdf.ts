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
 * Creates an invoice pdf for all residents included in the given invoice
 * @param invoice invoice for which the pdfs should be generated
 * @returns object containing an invoice pdf for every resident
 */
function createInvoicePdfs(invoice: Invoice): { [residentId: string]: jsPDF } {
  return Object.fromEntries(
    Object.keys(invoice.residentInformation).map((id) => [
      id,
      createInvoicePdfForResident(invoice, id),
    ]),
  );
}

function createInvoicePdfForResident(
  invoice: Invoice,
  residentId: string,
): jsPDF {
  const pdf = new jsPDF();

  addAddresses(pdf, invoice, residentId);

  if (
    Object.keys(invoice.residentInformation[residentId].ongoingIncidentalsCosts)
      .length > 0
  ) {
    addOngoingIncidentals(pdf, invoice, residentId);
  }

  if (
    Object.keys(invoice.residentInformation[residentId].oneTimeIncidentalsCosts)
      .length > 0
  ) {
    addOneTimeIncidentals(pdf, invoice, residentId);
  }

  if (invoice.residentInformation[residentId].waterCosts.waterUsage > 0) {
    addWaterCosts(pdf, invoice, residentId);
  }

  if (invoice.residentInformation[residentId].rentPayments.length > 0) {
    addRentPayments(pdf, invoice, residentId);
  }

  return pdf;
}

function addAddresses(pdf: jsPDF, invoice: Invoice, residentId: string) {
  const residentAddress = [
    labels.addresses.residentTitle,
    convertNameToString(invoice.residentInformation[residentId].name),
    convertAddressToStreetString(invoice.property.address),
    convertAddressToCityString(invoice.property.address),
  ].join('\n');

  autoTable(pdf, {
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

function addOngoingIncidentals(
  pdf: jsPDF,
  invoice: Invoice,
  residentId: string,
) {
  addHeadline(pdf, labels.ongoingIncidentals.title);
  addTable(
    pdf,
    labels.ongoingIncidentals.tableHeader,
    Object.entries(
      invoice.residentInformation[residentId].ongoingIncidentalsCosts,
    ).map(([incidentals, costs]) => {
      const incidentalsInformation = invoice.ongoingIncidentalsInformation[incidentals];
      return [
        incidentalsInformation.name,
        incidentalsInformation.deductionType,
        convertCurrencyCentsToString(incidentalsInformation.totalCost),
        convertCurrencyCentsToString(costs),
      ];
    }),
  );
}

function addOneTimeIncidentals(
  pdf: jsPDF,
  invoice: Invoice,
  residentId: string,
) {
  addHeadline(pdf, labels.oneTimeIncidentals.title);
  addTable(
    pdf,
    labels.oneTimeIncidentals.tableHeader,
    Object.entries(
      invoice.residentInformation[residentId].oneTimeIncidentalsCosts,
    ).map(([incidentals, costs]) => {
      const incidentalsInformation = invoice.oneTimeIncidentalsInformation[incidentals];
      return [
        incidentalsInformation.name,
        incidentalsInformation.deductionType,
        convertCurrencyCentsToString(incidentalsInformation.totalCost),
        convertCurrencyCentsToString(costs),
      ];
    }),
  );
}

function addWaterCosts(pdf: jsPDF, invoice: Invoice, residentId: string) {
  const waterCosts = invoice.residentInformation[residentId].waterCosts;

  const waterUsage = [
    `${waterCosts.lastWaterMeterCount} m³`,
    `${waterCosts.currentWaterMeterCount} m³`,
    `${waterCosts.waterUsage} m³`,
  ];

  addHeadline(pdf, labels.waterCosts.title);
  addTable(pdf, labels.waterCosts.tableHeader, [
    [
      labels.waterCosts.waterUsageCostLabel,
      ...waterUsage,
      convertCurrencyCentsToString(
        invoice.waterCosts.waterUsageCostPerCubicMeter,
      ),
      convertCurrencyCentsToString(waterCosts.waterUsageCosts),
    ],
    [
      labels.waterCosts.sewageCostLabel,
      ...waterUsage,
      convertCurrencyCentsToString(invoice.waterCosts.sewageCostPerCubicMeter),
      convertCurrencyCentsToString(waterCosts.sewageCosts),
    ],
  ]);
}

function addRentPayments(pdf: jsPDF, invoice: Invoice, residentId: string) {
  addHeadline(pdf, labels.rentPayments.title);
  addTable(
    pdf,
    labels.rentPayments.tableHeader,
    invoice.residentInformation[residentId].rentPayments.map((r) => [
      MonthYear.fromDate(r.dueDate).toString(),
      convertCurrencyCentsToString(r.rent),
      convertCurrencyCentsToString(r.incidentals),
      convertCurrencyCentsToString(r.paymentAmount),
      convertCurrencyCentsToString(r.paymentMissing),
    ]),
  );
}

function addHeadline(pdf: jsPDF, title: string) {
  autoTable(pdf, {
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

function addTable(pdf: jsPDF, head: string[], body: string[][]) {
  autoTable(pdf, {
    head: [head],
    body,
    theme: 'striped',
    headStyles: {
      fillColor: '#343a40',
    },
  });
}

export default createInvoicePdfs;
