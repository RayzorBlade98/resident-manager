import { GenerateRentIncreasePdfArgs } from './GenerateRentIncreasePdfArgs';
import rentIncreaseTemplate from '_/assets/rentIncrease/rentIncreaseTemplate.md';
import { Resident } from '_/models/resident/resident';
import Imported from '_/types/Imported';
import { convertImportedResident } from '_/utils/persistence/converters';

export function generateRentIncreaseMarkdown(
  args: Imported<GenerateRentIncreasePdfArgs>,
): string {
  return new RentIncreaseGenerator(args).generateRentIncrease();
}

const placeholderLabels: Record<string, string> = {};

class RentIncreaseGenerator {
  private rentIncreaseMarkdown = '';

  private readonly resident: Resident;

  constructor(args: Imported<GenerateRentIncreasePdfArgs>) {
    this.resident = convertImportedResident(args.resident);
  }

  public generateRentIncrease(): string {
    this.rentIncreaseMarkdown = rentIncreaseTemplate;

    this.replaceAllBasicPlaceholders();

    return this.rentIncreaseMarkdown;
  }

  private replaceAllBasicPlaceholders() {
    const replacements = {

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
