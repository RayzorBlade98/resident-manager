import {
  convertAddressToCompleteString,
} from '../../../../utils/address/address.utils';
import {
  convertCurrencyCentsToString,
  CurrencyInCents,
} from '../../../../utils/currency/currency.utils';
import {
  convertImportedProperty,
  convertImportedResident,
} from '../../../../utils/persistence/converters';
import { GenerateRentIncreasePdfArgs } from './GenerateRentIncreasePdfArgs';
import rentIncreaseTemplate from '_/assets/rentIncrease/rentIncreaseTemplate.md';
import MonthYear from '_/extensions/date/month_year.extension';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import Imported from '_/types/Imported';

export function generateRentIncreaseMarkdown(
  args: Imported<GenerateRentIncreasePdfArgs>,
): string {
  return new RentIncreaseGenerator(args).generateRentIncrease();
}

const placeholderLabels = {
  rentIncreasePercentage: 'RENT_INCREASE_PERCENTAGE',
  rentIncreaseMonth: 'RENT_INCREASE_MONTH',
  confirmationDate: 'CONFIRMATION_DATE',
  newRentTotal: 'NEW_RENT_TOTAL',
  incidentals: 'INCIDENTALS',
  newRentCold: 'NEW_RENT_COLD',
  city: 'PROPERTY_CITY',
  rentIndexLink: 'RENT_INDEX_URL',
  cappingLimit: 'CAPPING_LIMIT',
  currentDate: 'CURRENT_DATE',
  propertyAddress: 'PROPERTY_ADDRESS',
} satisfies Record<string, string>;

class RentIncreaseGenerator {
  private rentIncreaseMarkdown = '';

  private readonly resident: Resident;

  private readonly property: Property;

  private readonly newRent: CurrencyInCents;

  private readonly monthForIncrease: MonthYear;

  constructor(args: Imported<GenerateRentIncreasePdfArgs>) {
    this.resident = convertImportedResident(args.resident);
    this.property = convertImportedProperty(args.property);
    this.newRent = args.newRent;
    this.monthForIncrease = MonthYear.fromString(args.monthForIncrease);
  }

  public generateRentIncrease(): string {
    this.rentIncreaseMarkdown = rentIncreaseTemplate;

    this.replaceAllBasicPlaceholders();

    return this.rentIncreaseMarkdown;
  }

  private replaceAllBasicPlaceholders() {
    const lastRentInformation = this.resident.rentInformation.find(
      (r) => r.dueDate <= this.monthForIncrease,
    );

    if (!lastRentInformation) {
      throw new Error(
        `Missing rent information for month before ${this.monthForIncrease.toString()}`,
      );
    }

    const rentIncreasePercentage = (this.newRent - lastRentInformation.rent) / lastRentInformation.rent;
    const newRentTotal = this.newRent + lastRentInformation.incidentals;

    const replacements = {
      [placeholderLabels.rentIncreasePercentage]: (
        rentIncreasePercentage * 100
      ).toFixed(2),
      [placeholderLabels.rentIncreaseMonth]:
        this.monthForIncrease.toPreferredString(),
      [placeholderLabels.confirmationDate]: this.monthForIncrease
        .addMonths(-1)
        .toPreferredString(),
      [placeholderLabels.newRentTotal]:
        convertCurrencyCentsToString(newRentTotal),
      [placeholderLabels.incidentals]: convertCurrencyCentsToString(
        lastRentInformation.incidentals,
      ),
      [placeholderLabels.newRentCold]: convertCurrencyCentsToString(
        this.newRent,
      ),
      [placeholderLabels.city]: this.property.address.city,
      [placeholderLabels.rentIndexLink]: this.property.rentIndexUrl,
      [placeholderLabels.cappingLimit]: this.property.cappingLimit.toString(),
      [placeholderLabels.currentDate]: new Date().toPreferredString(),
      [placeholderLabels.propertyAddress]: convertAddressToCompleteString(
        this.property.address,
      ),
    };

    this.replaceAllPlaceholders(replacements);
  }

  private replaceAllPlaceholders(replacements: Record<string, string>) {
    this.rentIncreaseMarkdown = replaceAllPlaceholders(
      this.rentIncreaseMarkdown,
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
