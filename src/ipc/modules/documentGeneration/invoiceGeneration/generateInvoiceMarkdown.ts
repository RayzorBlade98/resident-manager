import {
  convertCurrencyCentsToString,
  CurrencyInCents,
} from '../../../../utils/currency/currency.utils';
import { convertImportedInvoice } from '../../../../utils/persistence/converters';
import incidentalsTableRowTemplate from '_/assets/templates/invoice/incidentalsTableRowTemplate.md';
import individualIncidentalsTableRowTemplate from '_/assets/templates/invoice/individualIncidentalsTableRowTemplate.md';
import individualIncidentalsTemplate from '_/assets/templates/invoice/individualIncidentalsTemplate.md';
import invoiceTemplate from '_/assets/templates/invoice/invoiceTemplate.md';
import MonthYear from '_/extensions/date/month_year.extension';
import { generateAddressHeaderMarkdown } from '_/ipc/utils/documentGeneration/generateAddressHeaderMarkdown/generateAddressHeaderMarkdown';
import { generateDateHeaderMarkdown } from '_/ipc/utils/documentGeneration/generateDateHeaderMarkdown/generateDateHeaderMarkdown';
import { IncidentalsInvoiceInformation } from '_/models/invoice/incidentals_invoice';
import Invoice from '_/models/invoice/invoice';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';
import Imported from '_/types/Imported';

export function generateInvoiceMarkdown(
  invoice: Imported<Invoice>,
  residentId: string,
): string {
  return new InvoiceGenerator(invoice, residentId).generateInvoiceMarkdown();
}

const placeholderLabels = {
  addressHeader: 'ADDRES_HEADER',
  dateHeader: 'DATE_HEADER',
  incidentalsTableBody: 'INCIDENTALS_TABLE_BODY',
  totalIncidentalsCost: 'TOTAL_INCIDENTALS_COST',
  individualIncidentalsTableBody: 'INDIVIDUAKL_INCIDENTALS_TABLE_BODY',
  totalIndividualIncidentalsCost: 'TOTAL_INDIVIDUAL_INCIDENTALS_COST',
  lastWaterMeterCount: 'LAST_WATER_METER_COUNT',
  currentWaterMeterCount: 'CURRENT_WATER_METER_COUNT',
  waterUsage: 'WATER_USAGE',
  waterUsageCostPerCubicMeter: 'WATER_USAGE_COST_PER_CUBIC_METER',
  waterUsageCost: 'WATER_USAGE_COST',
  sewageCostPerCubicMeter: 'SEWAGE_COST_PER_CUBIC_METER',
  sewageCost: 'SEWAGE_COST',
  monthlyWaterDeductionCost: 'MONTHLY_WATER_DEDUCTION_COST',
  totalWaterCost: 'TOTAL_WATER_COST',
  incidentalsSum: 'SUM_INCIDENTALS',
  numberOfMonths: 'NUMBER_MONTH',
  newDeduction: 'NEW_DEDUCTION',
  newDeductionStart: 'NEW_DEDUCTION_DATE',
  missingRent: 'MISSING_RENT',
  paidIncidentals: 'TOTAL_PAID_INCIDENTALS',
  missingCost: 'MISSING_COST',
} as const satisfies Record<string, string>;

const blockPlaceholderLabels = {
  individualIncidentals: 'INDIVIDUAL_INCIDENTALS',
} as const satisfies Record<string, string>;

const incidentalsTableRowLabels = {
  name: 'NAME',
  totalCost: 'TOTAL_COST',
  deductionType: 'DEDUCTION_TYPE',
  residentCost: 'RESIDENT_COST',
} as const satisfies Record<string, string>;

const individualIncidentalsTableRowLabels = {
  name: 'NAME',
  totalCost: 'TOTAL_COST',
} as const satisfies Record<string, string>;

class InvoiceGenerator {
  private invoiceMarkdown = '';

  private readonly invoice: Invoice;

  private readonly residentInvoice: ResidentInvoiceInformation;

  private readonly residentId: string;

  constructor(invoice: Imported<Invoice>, residentId: string) {
    this.invoice = convertImportedInvoice(invoice);
    this.residentInvoice = this.invoice.residentInformation[residentId];
    this.residentId = residentId;
  }

  public generateInvoiceMarkdown(): string {
    this.invoiceMarkdown = invoiceTemplate;

    this.replaceIndividualIncidentalsBlock();

    this.replaceAllBasicPlaceholders();

    return this.invoiceMarkdown;
  }

  private replaceAllBasicPlaceholders(): void {
    const replacements = {
      [placeholderLabels.addressHeader]: generateAddressHeaderMarkdown(
        {
          names: [this.invoice.landlord.representative],
          address: this.invoice.landlord.address,
        },
        {
          names: this.residentInvoice.names,
          address: this.invoice.property.address,
        },
      ),
      [placeholderLabels.dateHeader]: generateDateHeaderMarkdown(),
      [placeholderLabels.incidentalsTableBody]: [
        ...generateIncidentalsTableRowMarkdown(
          this.residentInvoice.ongoingIncidentalsCosts,
          this.invoice.ongoingIncidentalsInformation,
        ),
        ...generateIncidentalsTableRowMarkdown(
          this.residentInvoice.oneTimeIncidentalsCosts,
          this.invoice.oneTimeIncidentalsInformation,
        ),
      ].join(''),
      [placeholderLabels.totalIncidentalsCost]: convertCurrencyCentsToString(
        this.residentInvoice.totalCosts.ongoingIncidentalsCosts
          + this.residentInvoice.totalCosts.oneTimeIncidentalsCosts,
      ),
      [placeholderLabels.individualIncidentalsTableBody]:
        generateIndividualIncidentalsTableRowMarkdown(this.residentInvoice),
      [placeholderLabels.totalIndividualIncidentalsCost]:
        convertCurrencyCentsToString(
          this.residentInvoice.totalCosts.individualIncidentalsCosts,
        ),
      [placeholderLabels.lastWaterMeterCount]:
        this.residentInvoice.waterCosts.lastWaterMeterCount.toString(),
      [placeholderLabels.currentWaterMeterCount]:
        this.residentInvoice.waterCosts.currentWaterMeterCount.toString(),
      [placeholderLabels.waterUsage]:
        this.residentInvoice.waterCosts.waterUsage.toString(),
      [placeholderLabels.waterUsageCostPerCubicMeter]:
        convertCurrencyCentsToString(
          this.invoice.waterCosts.waterUsageCostPerCubicMeter,
        ),
      [placeholderLabels.waterUsageCost]: convertCurrencyCentsToString(
        this.residentInvoice.waterCosts.waterUsageCosts,
      ),
      [placeholderLabels.sewageCostPerCubicMeter]: convertCurrencyCentsToString(
        this.invoice.waterCosts.sewageCostPerCubicMeter,
      ),
      [placeholderLabels.sewageCost]: convertCurrencyCentsToString(
        this.residentInvoice.waterCosts.sewageCosts,
      ),
      [placeholderLabels.monthlyWaterDeductionCost]:
        convertCurrencyCentsToString(
          this.residentInvoice.waterCosts.monthlyDeductionCosts,
        ),
      [placeholderLabels.totalWaterCost]: convertCurrencyCentsToString(
        this.residentInvoice.totalCosts.waterCosts,
      ),
      [placeholderLabels.incidentalsSum]: convertCurrencyCentsToString(
        this.residentInvoice.totalCosts.totalIncidentalsCosts,
      ),
      [placeholderLabels.numberOfMonths]: MonthYear.monthsBetween(
        this.invoice.start,
        this.invoice.end,
      ).toString(),
      [placeholderLabels.newDeduction]: convertCurrencyCentsToString(
        this.residentInvoice.totalCosts.newIncidentalsDeduction,
      ),
      [placeholderLabels.newDeductionStart]:
        this.invoice.newDeductionStart.toPreferredString(),
      [placeholderLabels.missingRent]: convertCurrencyCentsToString(
        this.residentInvoice.totalCosts.missingRentPayments,
      ),
      [placeholderLabels.paidIncidentals]: convertCurrencyCentsToString(
        this.residentInvoice.totalCosts.totalPaidIncidentals,
      ),
      [placeholderLabels.missingCost]: convertCurrencyCentsToString(
        this.residentInvoice.totalCosts.totalMissingCosts,
      ),
    } satisfies Record<
    (typeof placeholderLabels)[keyof typeof placeholderLabels],
    string
    >;

    this.replaceAllPlaceholders(replacements);
  }

  private replaceIndividualIncidentalsBlock() {
    const individualIncidentalsBlock = Object.keys(this.residentInvoice.individualIncidentalsCosts).length > 0
      ? individualIncidentalsTemplate
      : '';

    this.replaceAllPlaceholders({
      [blockPlaceholderLabels.individualIncidentals]:
        individualIncidentalsBlock,
    });
  }

  private replaceAllPlaceholders(replacements: Record<string, string>) {
    this.invoiceMarkdown = replaceAllPlaceholders(
      this.invoiceMarkdown,
      replacements,
    );
  }
}

function replaceSinglePlacehoder(
  template: string,
  placeholderLabel: string,
  replacement: string,
) {
  return template.replaceAll(`{{${placeholderLabel}}}`, replacement);
}

function replaceAllPlaceholders(
  template: string,
  replacements: Record<string, string>,
): string {
  Object.entries(replacements).forEach(([label, replacement]) => {
    template = replaceSinglePlacehoder(template, label, replacement);
  });
  return template;
}

function generateIncidentalsTableRowMarkdown(
  residentIncidentals: Record<string, CurrencyInCents>,
  invoiceIncidentals: Record<string, IncidentalsInvoiceInformation>,
) {
  return Object.entries(residentIncidentals).map(
    ([incidentalsId, residentCost]) => {
      const incidentals = invoiceIncidentals[incidentalsId];
      return replaceAllPlaceholders(incidentalsTableRowTemplate, {
        [incidentalsTableRowLabels.name]: incidentals.name,
        [incidentalsTableRowLabels.totalCost]: convertCurrencyCentsToString(
          incidentals.totalCost,
        ),
        [incidentalsTableRowLabels.deductionType]: incidentals.deductionType,
        [incidentalsTableRowLabels.residentCost]:
          convertCurrencyCentsToString(residentCost),
      } satisfies Record<
      (typeof incidentalsTableRowLabels)[keyof typeof incidentalsTableRowLabels],
      string
      >);
    },
  );
}

function generateIndividualIncidentalsTableRowMarkdown(
  residentInvoice: ResidentInvoiceInformation,
): string {
  return Object.entries(residentInvoice.individualIncidentalsCosts)
    .map(([incidentalsName, residentCost]) => replaceAllPlaceholders(individualIncidentalsTableRowTemplate, {
      [individualIncidentalsTableRowLabels.name]: incidentalsName,
      [individualIncidentalsTableRowLabels.totalCost]:
          convertCurrencyCentsToString(residentCost),
    } satisfies Record<
    (typeof individualIncidentalsTableRowLabels)[keyof typeof individualIncidentalsTableRowLabels],
    string
    >))
    .join('');
}
