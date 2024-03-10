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
import Apartment from '_/models/property/apartment';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import Imported from '_/types/Imported';

export type ContractGenerationArgs = {
  landlord: Landlord;
  resident: Resident;
  property: Property;
};

/**
 * Generates the contract as markdown string
 * @returns markdown string of the generated contract
 */
export function generateContractMarkdown(
  args: Imported<ContractGenerationArgs>,
): string {
  return new ContractGenerator(args).generateContract();
}

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
  residentStreet: 'RESIDENT_STREET',
  residentCity: 'RESIDENT_CITY',
  residentPhone: 'RESIDENT_PHONE',
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
 *
 */
class ContractGenerator {
  private contract = '';

  private apartment: Apartment;

  public constructor(private args: Imported<ContractGenerationArgs>) {
    const apartment = args.property.apartments.find(
      (a) => a.id === args.resident.apartmentId,
    );

    if (!apartment) {
      throw new Error(
        `Apartment with id ${args.resident.apartmentId} wasn't found in the property!`,
      );
    }

    this.apartment = apartment;
  }

  public generateContract(): string {
    this.contract = contractTemplate;

    this.replaceAllBasicPlaceholders();
    this.replaceLandlordCompanyBlock();
    this.replaceResidentBlock();

    return this.contract;
  }

  private replaceSinglePlacehoder(
    placeholderLabel: string,
    replacement: string,
  ) {
    this.contract = replaceSinglePlacehoder(
      this.contract,
      placeholderLabel,
      replacement,
    );
  }

  private replaceAllPlaceholders(replacements: Record<string, string>) {
    this.contract = replaceAllPlaceholders(this.contract, replacements);
  }

  private replaceAllBasicPlaceholders() {
    const replacements = {
      [placeholderLabels.landlordName]: convertNameToString(
        this.args.landlord.representative,
      ),
      [placeholderLabels.landlordStreet]: convertAddressToStreetString(
        this.args.landlord.address,
      ),
      [placeholderLabels.landlordCity]: convertAddressToCityString(
        this.args.landlord.address,
      ),
      [placeholderLabels.landlordPhone]: this.args.landlord.phone,
      [placeholderLabels.landlordEmail]: this.args.landlord.email,
      [placeholderLabels.landlordCompany]: this.args.landlord.company ?? '',
      [placeholderLabels.landlordBankaccountHolder]:
        this.args.landlord.bankAccount.holder,
      [placeholderLabels.landlordBankaccountIBAN]:
        this.args.landlord.bankAccount.iban,
      [placeholderLabels.numberOfResidents]:
        this.args.resident.numberOfResidents.toString(),
      [placeholderLabels.propertyStreet]: convertAddressToStreetString(
        this.args.property.address,
      ),
      [placeholderLabels.propertyCity]: convertAddressToCityString(
        this.args.property.address,
      ),
      [placeholderLabels.apartmentFloor]: this.apartment.floor,
      [placeholderLabels.apartmentLocation]: this.apartment.location,
      [placeholderLabels.apartmentRoomsGeneric]:
        this.apartment.rooms.generic.toString(),
      [placeholderLabels.apartmentRoomsKitchen]:
        this.apartment.rooms.kitchen.toString(),
      [placeholderLabels.apartmentRoomsBath]:
        this.apartment.rooms.bath.toString(),
      [placeholderLabels.apartmentRoomsBasement]:
        this.apartment.rooms.basement.toString(),
      [placeholderLabels.apartmentRoomsHallway]:
        this.apartment.rooms.hallway.toString(),
      [placeholderLabels.apartmentRoomsGarden]:
        this.apartment.rooms.garden.toString(),
      [placeholderLabels.parkingSpaceCount]: this.args.resident.parkingSpaceId
        ? '1'
        : '0',
      [placeholderLabels.keysApartment]:
        this.args.resident.keys.apartment.toString(),
      [placeholderLabels.keysBasement]:
        this.args.resident.keys.basement.toString(),
      [placeholderLabels.keysAttic]: this.args.resident.keys.attic.toString(),
      [placeholderLabels.keysFrontdoor]:
        this.args.resident.keys.frontDoor.toString(),
      [placeholderLabels.keysMailbox]:
        this.args.resident.keys.mailbox.toString(),
      [placeholderLabels.contractStart]: MonthYear.fromString(
        this.args.resident.contractStart,
      ).toPreferredString(),
      [placeholderLabels.rentDeposit]: convertCurrencyCentsToString(
        this.args.resident.rentDeposit,
      ),
    };

    this.replaceAllPlaceholders(replacements);
  }

  private replaceLandlordCompanyBlock() {
    this.replaceSinglePlacehoder(
      blockPlaceholderLabels.landlordCompany,
      this.args.landlord.company ? landlordCompanyTemplate : '',
    );
  }

  private replaceResidentBlock() {
    const residents = this.args.resident.contractResidents
      .map((r) => replaceAllPlaceholders(residentTemplate, {
        [placeholderLabels.residentName]: convertNameToString(r.name),
        [placeholderLabels.residentStreet]: convertAddressToStreetString(
          r.oldAddress,
        ),
        [placeholderLabels.residentCity]: convertAddressToCityString(
          r.oldAddress,
        ),
        [placeholderLabels.residentPhone]: r.phone,
      }))
      .join('');
    this.replaceSinglePlacehoder(
      blockPlaceholderLabels.residentBlock,
      residents,
    );
  }
}

function replaceSinglePlacehoder(
  contract: string,
  placeholderLabel: string,
  replacement: string,
) {
  return contract.replace(`{{${placeholderLabel}}}`, replacement);
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
