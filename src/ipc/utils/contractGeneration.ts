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
  apartmentFloor: 'APARTMENT_FLOOR',
  apartmentLocation: 'APARTMENT_LOCATION',
  apartmentRoomsGeneric: 'APARTMENT_ROOMS_GENERIC',
  apartmentRoomsKitchen: 'APARTMENT_ROOMS_KITCHEN',
  apartmentRoomsBath: 'APARTMENT_ROOMS_BATH',
  apartmentRoomsHallway: 'APARTMENT_ROOMS_HALLWAY',
  apartmentRoomsBasement: 'APARTMENT_ROOMS_BASEMENT',
  apartmentRoomsGarden: 'APARTMENT_ROOMS_GARDEN', // Todo
  parkingSpaceCount: 'PARKING_SPACE_COUNT',
  keysApartment: 'KEYS_APARTMENT',
  keysBasement: 'KEYS_BASEMENT',
  keysAttic: 'KEYS_ATTIC',
  keysFrontdoor: 'KEYS_FRONTDOOR',
  keysMailbox: 'KEYS_MAILBOX',
} satisfies Record<string, string>;

const blockPlaceholderLabels = {
  landlordCompany: 'LANDLORD_COMPANY_BLOCK',
} satisfies Record<string, string>;

/**
 * Generates the contract as markdown string
 * @returns markdown string of the generated contract
 */
export function generateContractMarkdown(args: ContractGenerationArgs): string {
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
    [placeholderLabels.landlordCompany]: args.landlord.company ?? '',
    [placeholderLabels.residentName]: convertNameToString(args.resident.name),
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
    [placeholderLabels.parkingSpaceCount]: args.resident.parkingSpaceId ? '1' : '0',
    [placeholderLabels.keysApartment]: args.resident.keys.apartment.toString(),
    [placeholderLabels.keysBasement]: args.resident.keys.basement.toString(),
    [placeholderLabels.keysAttic]: args.resident.keys.attic.toString(),
    [placeholderLabels.keysFrontdoor]: args.resident.keys.frontDoor.toString(),
    [placeholderLabels.keysMailbox]: args.resident.keys.mailbox.toString(),
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
