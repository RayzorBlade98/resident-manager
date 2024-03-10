import {
  convertAddressToCityString,
  convertAddressToStreetString,
} from '../../utils/address/address.utils';
import { convertCurrencyCentsToString } from '../../utils/currency/currency.utils';
import { convertNameToString } from '../../utils/name/name.utils';
import contractTemplate from '_/assets/contract/contractTemplate.md';
import landlordCompanyTemplate from '_/assets/contract/landlordCompanyTemplate.md';
import residentTemplate from '_/assets/contract/residentTemplate.md';
import MonthYear from '_/extensions/date/month_year.extension';
import Landlord from '_/models/landlord/landlord';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import Imported from '_/types/Imported';

export type ContractGenerationArgs = {
  landlord: Landlord;
  resident: Resident;
  property: Property;
};

const placeholderLabels = {
  landlordName: 'LANDLORD_NAME',
  landlordStreet: 'LANDLORD_STREET',
  landlordCity: 'LANDLORD_CITY',
  landlordPhone: 'LANDLORD_PHONE',
  landlordEmail: 'LANDLORD_EMAIL',
  landlordCompany: 'LANDLORD_COMPANY',
  landlordBankaccountHolder: 'LANDLORD_BANKACCOUNT_HOLDER',
  landlordBankaccountIBAN: 'LANDLORD_BANKACCOUNT_IBAN',
  residentName: 'RESIDENT_NAME',
  residentStreet: 'RESIDENT_STREET', // Todo
  residentCity: 'RESIDENT_CITY', // Todo
  residentPhone: 'RESIDENT_PHONE', // Todo
  numberOfResidents: 'NUMBER_OF_RESIDENTS',
  propertyStreet: 'PROPERTY_STREET',
  propertyCity: 'PROPERTY_CITY',
  apartmentFloor: 'APARTMENT_FLOOR',
  apartmentLocation: 'APARTMENT_LOCATION',
  apartmentRoomsGeneric: 'APARTMENT_ROOMS_GENERIC',
  apartmentRoomsKitchen: 'APARTMENT_ROOMS_KITCHEN',
  apartmentRoomsBath: 'APARTMENT_ROOMS_BATH',
  apartmentRoomsHallway: 'APARTMENT_ROOMS_HALLWAY',
  apartmentRoomsBasement: 'APARTMENT_ROOMS_BASEMENT',
  apartmentRoomsGarden: 'APARTMENT_ROOMS_GARDEN',
  parkingSpaceCount: 'PARKING_SPACE_COUNT',
  keysApartment: 'KEYS_APARTMENT',
  keysBasement: 'KEYS_BASEMENT',
  keysAttic: 'KEYS_ATTIC',
  keysFrontdoor: 'KEYS_FRONTDOOR',
  keysMailbox: 'KEYS_MAILBOX',
  contractStart: 'CONTRACT_START',
  rentDeposit: 'RENT_DEPOSIT',
} satisfies Record<string, string>;

const blockPlaceholderLabels = {
  landlordCompany: 'LANDLORD_COMPANY_BLOCK',
  residentBlock: 'RESIDENT_BLOCK',
} satisfies Record<string, string>;

/**
 * Generates the contract as markdown string
 * @returns markdown string of the generated contract
 */
export function generateContractMarkdown(
  args: Imported<ContractGenerationArgs>,
): string {
  const apartment = args.property.apartments.find(
    (a) => a.id === args.resident.apartmentId,
  )!;

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
    [placeholderLabels.landlordPhone]: args.landlord.phone,
    [placeholderLabels.landlordEmail]: args.landlord.email,
    [placeholderLabels.landlordCompany]: args.landlord.company ?? '',
    [placeholderLabels.landlordBankaccountHolder]:
      args.landlord.bankAccount.holder,
    [placeholderLabels.landlordBankaccountIBAN]: args.landlord.bankAccount.iban,
    [placeholderLabels.numberOfResidents]:
      args.resident.numberOfResidents.toString(),
    [placeholderLabels.propertyStreet]: convertAddressToStreetString(
      args.property.address,
    ),
    [placeholderLabels.propertyCity]: convertAddressToCityString(
      args.property.address,
    ),
    [placeholderLabels.apartmentFloor]: apartment.floor,
    [placeholderLabels.apartmentLocation]: apartment.location,
    [placeholderLabels.apartmentRoomsGeneric]:
      apartment.rooms.generic.toString(),
    [placeholderLabels.apartmentRoomsKitchen]:
      apartment.rooms.kitchen.toString(),
    [placeholderLabels.apartmentRoomsBath]: apartment.rooms.bath.toString(),
    [placeholderLabels.apartmentRoomsBasement]:
      apartment.rooms.basement.toString(),
    [placeholderLabels.apartmentRoomsHallway]:
      apartment.rooms.hallway.toString(),
    [placeholderLabels.apartmentRoomsGarden]: apartment.rooms.garden.toString(),
    [placeholderLabels.parkingSpaceCount]: args.resident.parkingSpaceId
      ? '1'
      : '0',
    [placeholderLabels.keysApartment]: args.resident.keys.apartment.toString(),
    [placeholderLabels.keysBasement]: args.resident.keys.basement.toString(),
    [placeholderLabels.keysAttic]: args.resident.keys.attic.toString(),
    [placeholderLabels.keysFrontdoor]: args.resident.keys.frontDoor.toString(),
    [placeholderLabels.keysMailbox]: args.resident.keys.mailbox.toString(),
    [placeholderLabels.contractStart]: MonthYear.fromString(
      args.resident.contractStart,
    ).toPreferredString(),
    [placeholderLabels.rentDeposit]: convertCurrencyCentsToString(
      args.resident.rentDeposit,
    ),
  };

  let contract = contractTemplate;

  // Landlord company
  contract = replaceSinglePlacehoder(
    contract,
    blockPlaceholderLabels.landlordCompany,
    args.landlord.company ? landlordCompanyTemplate : '',
  );

  // Residents
  const residents = args.resident.contractResidents
    .map((r) => replaceAllPlaceholders(residentTemplate, {
      [placeholderLabels.residentName]: convertNameToString(r.name),
    }))
    .join('');
  contract = replaceSinglePlacehoder(
    contract,
    blockPlaceholderLabels.residentBlock,
    residents,
  );

  return replaceAllPlaceholders(contract, placeholders);
}

function replaceSinglePlacehoder(
  contract: string,
  placeholderLabel: string,
  replacement: string,
) {
  return contract.replace(getPlaceholder(placeholderLabel), replacement);
}

function replaceAllPlaceholders(
  contract: string,
  replacements: Record<string, string>,
): string {
  Object.entries(replacements).forEach(([label, replacement]) => {
    contract = replaceSinglePlacehoder(contract, label, replacement);
  });
  return contract;
}

function getPlaceholder(label: string): string {
  return `{{${label}}}`;
}
