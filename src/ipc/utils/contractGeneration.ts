import {
  convertAddressToCityString,
  convertAddressToStreetString,
} from '../../utils/address/address.utils';
import { convertNameToString } from '../../utils/name/name.utils';
import contractTemplate from '_/assets/contract/contractTemplate.md';
import landlordCompanyTemplate from '_/assets/contract/landlordCompanyTemplate.md';
import Landlord from '_/models/landlord/landlord';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';

export type ContractGenerationArgs = {
  landlord: Landlord;
  resident: Resident;
  property: Property;
};

const placeholderLabels = {
  landlordName: 'LANDLORD_NAME',
  landlordStreet: 'LANDLORD_STREET',
  landlordCity: 'LANDLORD_CITY',
  landlordPhone: 'LANDLORD_PHONE', // Todo
  landlordEmail: 'LANDLORD_EMAIL', // Todo
  landlordCompany: 'LANDLORD_COMPANY',
  residentName: 'RESIDENT_NAME',
  residentStreet: 'RESIDENT_STREET', // Todo
  residentCity: 'RESIDENT_CITY', // Todo
  residentPhone: 'RESIDENT_PHONE', // Todo
  propertyStreet: 'PROPERTY_STREET',
  propertyCity: 'PROPERTY_CITY',
} satisfies Record<string, string>;

const blockPlaceholderLabels = {
  landlordCompany: 'LANDLORD_COMPANY_BLOCK',
} satisfies Record<string, string>;

/**
 * Generates the contract as markdown string
 * @returns markdown string of the generated contract
 */
export function generateContractMarkdown(args: ContractGenerationArgs): string {
  const placeholders = {
    [placeholderLabels.landlordName]: convertNameToString(
      args.landlord.representative,
    ),
    [placeholderLabels.landlordStreet]: convertAddressToStreetString(
      args.landlord.address,
    ),
    [placeholderLabels.landlordCity]: convertAddressToCityString(
      args.landlord.address,
    ),
    [placeholderLabels.landlordCompany]: args.landlord.company ?? '',
    [placeholderLabels.residentName]: convertNameToString(args.resident.name),
    [placeholderLabels.propertyStreet]: convertAddressToStreetString(
      args.property.address,
    ),
    [placeholderLabels.propertyCity]: convertAddressToCityString(
      args.property.address,
    ),
  };

  let contract = contractTemplate;

  // Landlord company
  contract = contract.replace(
    getPlaceholder(blockPlaceholderLabels.landlordCompany),
    args.landlord.company ? landlordCompanyTemplate : '',
  );

  return replaceAllPlaceholders(contract, placeholders);
}

function replaceAllPlaceholders(
  contract: string,
  replacements: Record<string, string>,
): string {
  Object.entries(replacements).forEach(([label, replacement]) => {
    contract = contract.replace(getPlaceholder(label), replacement);
  });
  return contract;
}

function getPlaceholder(label: string): string {
  return `{{${label}}}`;
}
