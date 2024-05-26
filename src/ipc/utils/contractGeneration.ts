import {
  convertAddressToCityString,
  convertAddressToStreetString,
} from '../../utils/address/address.utils';
import { convertCurrencyCentsToString } from '../../utils/currency/currency.utils';
import { convertNameToString } from '../../utils/name/name.utils';
import { getCostForParkingSpace } from '../../utils/parkingSpace/parkingSpace.utils';
import {
  convertImportedLandlord,
  convertImportedProperty,
  convertImportedResident,
} from '../../utils/persistence/converters';
import contractTemplate from '_/assets/contract/contractTemplate.md';
import landlordCompanyTemplate from '_/assets/contract/landlordCompanyTemplate.md';
import residentSignatureTemplate from '_/assets/contract/residentSignatureTemplate.md';
import residentTemplate from '_/assets/contract/residentTemplate.md';
import signatureTemplate from '_/assets/contract/signatureTemplate.md';
import MonthYear from '_/extensions/date/month_year.extension';
import Landlord from '_/models/landlord/landlord';
import Apartment from '_/models/property/apartment';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';
import Imported from '_/types/Imported';

export type ContractGenerationArgs = {
  contractStart: MonthYear;
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
  residentEmail: 'RESIDENT_EMAIL',
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
  rent: 'RENT',
  incidentals: 'INCIDENTALS',
  parkingSpaceCost: 'PARKING_SPACE_COST',
  rentTotal: 'RENT_TOTAL',
  rentDeposit: 'RENT_DEPOSIT',
} satisfies Record<string, string>;

const blockPlaceholderLabels = {
  landlordCompany: 'LANDLORD_COMPANY_BLOCK',
  residentBlock: 'RESIDENT_BLOCK',
  signatureBlock: 'SIGNATURE_BLOCK',
  residentSignatureBlock: 'RESIDENT_SIGNATURE_BLOCK',
} satisfies Record<string, string>;

/**
 *
 */
class ContractGenerator {
  private contract = '';

  private contractStart: MonthYear;

  private apartment: Apartment;

  private resident: Resident;

  private landlord: Landlord;

  private property: Property;

  public constructor(args: Imported<ContractGenerationArgs>) {
    const apartment = args.property.apartments.find(
      (a) => a.id === args.resident.apartmentId,
    );

    if (!apartment) {
      throw new Error(
        `Apartment with id ${args.resident.apartmentId} wasn't found in the property!`,
      );
    }

    this.apartment = apartment;
    this.contractStart = MonthYear.fromString(args.contractStart);
    this.landlord = convertImportedLandlord(args.landlord);
    this.property = convertImportedProperty(args.property);
    this.resident = convertImportedResident(args.resident);
  }

  public generateContract(): string {
    this.contract = contractTemplate;

    this.replaceAllBasicPlaceholders();
    this.replaceLandlordCompanyBlock();
    this.replaceResidentBlock();
    this.replaceResidentSignatureBlock();

    this.replaceSignatureBlock();

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
    const rentInformation = this.resident.rentInformation.find((r) => r.dueDate.equals(this.contractStart));

    if (!rentInformation) {
      throw new Error(
        `Missing rent informatin for month ${this.contractStart}`,
      );
    }

    const parkingSpace = this.property.parkingSpaces.find(
      (p) => p.id === this.resident.parkingSpaceId,
    );
    const parkingSpaceCost = parkingSpace
      ? getCostForParkingSpace(parkingSpace, this.contractStart)
      : 0;
    const totalRent = rentInformation.rent + rentInformation.incidentals + parkingSpaceCost;

    const replacements = {
      [placeholderLabels.landlordName]: convertNameToString(
        this.landlord.representative,
      ),
      [placeholderLabels.landlordStreet]: convertAddressToStreetString(
        this.landlord.address,
      ),
      [placeholderLabels.landlordCity]: convertAddressToCityString(
        this.landlord.address,
      ),
      [placeholderLabels.landlordPhone]: this.landlord.phone,
      [placeholderLabels.landlordEmail]: this.landlord.email,
      [placeholderLabels.landlordCompany]: this.landlord.company ?? '',
      [placeholderLabels.landlordBankaccountHolder]:
        this.landlord.bankAccount.holder,
      [placeholderLabels.landlordBankaccountIBAN]:
        this.landlord.bankAccount.iban,
      [placeholderLabels.numberOfResidents]:
        this.resident.numberOfResidents.toString(),
      [placeholderLabels.propertyStreet]: convertAddressToStreetString(
        this.property.address,
      ),
      [placeholderLabels.propertyCity]: convertAddressToCityString(
        this.property.address,
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
      [placeholderLabels.parkingSpaceCount]: this.resident.parkingSpaceId
        ? '1'
        : '0',
      [placeholderLabels.keysApartment]:
        this.resident.keys.apartment.toString(),
      [placeholderLabels.keysBasement]: this.resident.keys.basement.toString(),
      [placeholderLabels.keysAttic]: this.resident.keys.attic.toString(),
      [placeholderLabels.keysFrontdoor]:
        this.resident.keys.frontDoor.toString(),
      [placeholderLabels.keysMailbox]: this.resident.keys.mailbox.toString(),
      [placeholderLabels.contractStart]: this.contractStart.toPreferredString(),
      [placeholderLabels.rent]: convertCurrencyCentsToString(
        rentInformation.rent,
      ),
      [placeholderLabels.incidentals]: convertCurrencyCentsToString(
        rentInformation.incidentals,
      ),
      [placeholderLabels.parkingSpaceCost]:
        convertCurrencyCentsToString(parkingSpaceCost),
      [placeholderLabels.rentTotal]: convertCurrencyCentsToString(totalRent),
      [placeholderLabels.rentDeposit]: convertCurrencyCentsToString(
        this.resident.rentDeposit,
      ),
    };

    this.replaceAllPlaceholders(replacements);
  }

  private replaceLandlordCompanyBlock() {
    this.replaceSinglePlacehoder(
      blockPlaceholderLabels.landlordCompany,
      this.landlord.company ? landlordCompanyTemplate : '',
    );
  }

  private replaceResidentBlock() {
    const residents = this.resident.contractResidents
      .map((r) => replaceAllPlaceholders(residentTemplate, {
        [placeholderLabels.residentName]: convertNameToString(r.name),
        [placeholderLabels.residentStreet]: convertAddressToStreetString(
          r.oldAddress,
        ),
        [placeholderLabels.residentCity]: convertAddressToCityString(
          r.oldAddress,
        ),
        [placeholderLabels.residentPhone]: r.phone ?? '-',
        [placeholderLabels.residentEmail]: r.email ?? '-',
      }))
      .join('');
    this.replaceSinglePlacehoder(
      blockPlaceholderLabels.residentBlock,
      residents,
    );
  }

  private replaceResidentSignatureBlock() {
    const residentSignatures = this.resident.contractResidents
      .map((_) => residentSignatureTemplate)
      .join('');
    this.replaceSinglePlacehoder(
      blockPlaceholderLabels.residentSignatureBlock,
      residentSignatures,
    );
  }

  private replaceSignatureBlock() {
    this.replaceSinglePlacehoder(
      blockPlaceholderLabels.signatureBlock,
      signatureTemplate,
    );
  }
}

function replaceSinglePlacehoder(
  contract: string,
  placeholderLabel: string,
  replacement: string,
) {
  return contract.replaceAll(`{{${placeholderLabel}}}`, replacement);
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
