/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument  */

import {
  convertImportedIncidentals,
  convertImportedInvoices,
  convertImportedLandlord,
  convertImportedProperty,
  convertImportedResidents,
  convertImportedWaterCosts,
} from './converters';
import MonthYear from '_/extensions/date/month_year.extension';
import { DocumentType } from '_/models/document';
import { DeductionType } from '_/models/incidentals/deduction_type';
import Invoice from '_/models/invoice/invoice';
import Landlord from '_/models/landlord/landlord';
import { Salutation } from '_/models/name';
import { IncidentalsState } from '_/states/incidentals/incidentals.state';
import { InvoiceState } from '_/states/invoice/invoice.state';
import { PropertyState } from '_/states/property/property.state';
import { ResidentState } from '_/states/resident/resident.state';
import { WaterCostsState } from '_/states/waterCosts/waterCosts.state';

describe('convertImportedIncidentals', () => {
  test('should convert incidentals correctly', () => {
    // Arrange
    const incidentals: IncidentalsState = {
      ongoingIncidentals: [
        {
          id: 'id',
          name: 'ongoing incidentals',
          deductionType: DeductionType.PerApartment,
          invoiceInterval: 1,
          costs: [
            {
              cost: 500,
              dueDate: new MonthYear(9, 2023),
              paymentDate: new Date(2023, 9, 13),
              bankTransferDocumentId: 'bankTransferDocumentId',
              billDocumentId: 'billDocumentId',
            },
          ],
        },
      ],
      oneTimeIncidentals: [
        {
          id: 'id',
          name: 'ongoing incidentals',
          cost: 300,
          deductionType: DeductionType.PerResident,
          billingDate: new Date(2023, 9, 7),
          paymentDate: new Date(2023, 9, 8),
        },
        {
          id: 'id2',
          name: 'ongoing incidentals2',
          cost: 333,
          deductionType: DeductionType.PerResident,
          billingDate: new Date(2023, 9, 16),
          paymentDate: undefined,
        },
      ],
    };
    const incidentalsJson = JSON.parse(JSON.stringify(incidentals));

    // Act
    const converted = convertImportedIncidentals(incidentalsJson);

    // Assert
    expect(converted).toEqual(incidentals);
  });
});

describe('convertImportedInvoices', () => {
  test('should convert invoices correctly', () => {
    // Arrange
    const invoices: InvoiceState = [
      {
        id: 'id',
        start: new MonthYear(9, 2023),
        end: new MonthYear(11, 2023),
        newDeductionStart: new MonthYear(0, 2024),
        ongoingIncidentalsInformation: {
          'ongoing id': {
            incidentalsId: 'ongoing id',
            name: 'ongoing',
            totalCost: 123,
            deductionType: DeductionType.PerApartment,
          },
        },
        oneTimeIncidentalsInformation: {
          'onetime id': {
            incidentalsId: 'onetime id',
            name: 'onetime',
            totalCost: 321,
            deductionType: DeductionType.PerResident,
          },
        },
        waterCosts: {
          waterUsageCostPerCubicMeter: 100,
          sewageCostPerCubicMeter: 200,
        },
        residentInformation: {
          resident: {
            residentId: 'resident',
            name: {
              salutation: Salutation.Male,
              firstName: 'Max',
              lastName: 'Mustermann',
            },
            ongoingIncidentalsCosts: {
              'ongoing id': 111,
            },
            oneTimeIncidentalsCosts: {
              'onetime id': 333,
            },
            rentPayments: [
              {
                dueDate: new MonthYear(9, 2023),
                rent: 500,
                incidentals: 100,
                paymentAmount: 400,
                paymentMissing: 200,
              },
            ],
            waterCosts: {
              lastWaterMeterCount: 1234,
              currentWaterMeterCount: 1236,
              waterUsage: 2,
              waterUsageCosts: 7,
              sewageCosts: 16,
            },
            totalCosts: {
              ongoingIncidentalsCosts: 456,
              oneTimeIncidentalsCosts: 987,
              totalIncidentalsDeductionCosts: 1200,
              newIncidentalsDeduction: 120,
              missingRentPayments: 6000,
              waterCosts: 23,
              totalCosts: 10000,
              totalPaidIncidentals: 9000,
              totalMissingCosts: 1000,
            },
          },
        },
        property: {
          address: {
            zipCode: 54321,
            city: 'myCity',
            street: 'invoice street',
            houseNumber: 42,
          },
        },
        landlord: {
          company: 'company',
          representative: {
            salutation: Salutation.Male,
            firstName: 'Max',
            lastName: 'Mustermann',
          },
          address: {
            zipCode: 12345,
            city: 'city',
            street: 'street',
            houseNumber: 42,
          },
          email: 'landlord@example.org',
          phone: '0152 544444',
          bankAccount: {
            holder: 'holder',
            iban: 'DE 1234 56789 00000',
          },
        },
      } as Invoice,
    ];
    const invoicesJson = JSON.parse(JSON.stringify(invoices));

    // Act
    const converted = convertImportedInvoices(invoicesJson);

    // Assert
    expect(converted).toEqual(invoices);
  });
});

describe('convertImportedResidents', () => {
  test('should convert residents correctly', () => {
    // Arrange
    const residents: ResidentState = [
      {
        id: 'id',
        contractResidents: [
          {
            name: {
              salutation: Salutation.Male,
              firstName: 'first',
              lastName: 'last',
            },
            oldAddress: {
              zipCode: 1337,
              city: 'resident city',
              street: 'resident street',
              houseNumber: 15,
            },
            phone: '0152 12345',
            email: 'email@example.com',
          },
          {
            name: {
              salutation: Salutation.Female,
              firstName: 'first second',
              lastName: 'last second',
            },
            oldAddress: {
              zipCode: 1338,
              city: 'resident 2 city',
              street: 'resident 2 street',
              houseNumber: 51,
            },
            phone: '0152 54321',
            email: undefined,
          },
        ],
        numberOfResidents: 8,
        rentInformation: [
          {
            dueDate: new MonthYear(9, 2023),
            rent: 500,
            incidentals: 100,
            paymentDate: new Date(2023, 9, 15),
            paymentAmount: 600,
            wasDeductedInInvoice: true,
          },
          {
            dueDate: new MonthYear(10, 2023),
            rent: 500,
            incidentals: 100,
            paymentDate: undefined,
            paymentAmount: undefined,
            wasDeductedInInvoice: false,
          },
        ],
        waterMeterReadings: [
          {
            readingDate: new Date(2023, 8, 27),
            waterMeterCount: 6666,
            wasDeductedInInvoice: false,
          },
        ],
        contractStart: new MonthYear(9, 2023),
        apartmentId: 'apartment1',
        parkingSpaceId: 'parkingSpace1',
        rentDeposit: 12345,
        keys: {
          apartment: 1,
          basement: 2,
          attic: 3,
          frontDoor: 4,
          mailbox: 5,
        },
        history: [
          {
            invalidSince: new MonthYear(4, 2024),
            contractResidents: [
              {
                name: {
                  salutation: Salutation.Male,
                  firstName: 'first old',
                  lastName: 'last old',
                },
                oldAddress: {
                  zipCode: 13371,
                  city: 'resident city old',
                  street: 'resident street old',
                  houseNumber: 151,
                },
                phone: '0152 12345 old',
                email: 'email@example.com',
              },
            ],
            numberOfResidents: 51,
            parkingSpaceId: '11-11-11 old',
          },
          {
            invalidSince: new MonthYear(1, 2024),
            contractResidents: [
              {
                name: {
                  salutation: Salutation.Male,
                  firstName: 'first older',
                  lastName: 'last older',
                },
                oldAddress: {
                  zipCode: 13372,
                  city: 'resident city older',
                  street: 'resident street older',
                  houseNumber: 152,
                },
                phone: '0152 12345 older',
                email: undefined,
              },
            ],
            numberOfResidents: 5,
            parkingSpaceId: '11-11-11 older',
          },
        ],
        documents: [
          {
            id: 'document1',
            type: DocumentType.Contract,
            name: 'Document 1',
            creationDate: new Date(2023, 4, 10),
            subjectDate: new Date(2023, 5, 8),
          },
          {
            id: 'document2',
            type: DocumentType.Contract,
            name: 'Document 2',
            creationDate: new Date(2023, 4, 11),
            subjectDate: new Date(2023, 5, 7),
          },
        ],
      },
    ];
    const residentsJson = JSON.parse(JSON.stringify(residents));

    // Act
    const converted = convertImportedResidents(residentsJson);

    // Assert
    expect(converted).toEqual(residents);
  });
});

describe('convertImportedProperty', () => {
  test('should convert property correctly', () => {
    // Arrange
    const property: PropertyState = {
      numberOfApartments: 8,
      address: {
        zipCode: 54321,
        city: 'converter city',
        street: 'conv str.',
        houseNumber: 31,
      },
      apartments: [
        {
          id: 'id1',
          floor: 'EG',
          location: 'left',
          rooms: {
            generic: 3,
            kitchen: 1,
            bath: 2,
            basement: 1,
            hallway: 2,
            garden: 1,
          },
        },
        {
          id: 'id2',
          floor: 'EG',
          location: 'right',
          rooms: {
            generic: 2,
            kitchen: 2,
            bath: 1,
            basement: 2,
            hallway: 1,
            garden: 0,
          },
        },
      ],
      parkingSpaces: [
        {
          id: 'id1',
          name: 'Parkingspace 1',
          costs: [
            {
              cost: 2,
              date: new MonthYear(3, 2024),
            },
            {
              cost: 1,
              date: new MonthYear(1, 2024),
            },
          ],
        },
        {
          id: 'id2',
          name: 'Parkingspace 2',
          costs: [
            {
              cost: 3,
              date: new MonthYear(11, 2023),
            },
          ],
        },
      ],
      rentIndexUrl: 'example.org/rentIndex',
      cappingLimit: 20,
    };
    const propertyJson = JSON.parse(JSON.stringify(property));

    // Act
    const converted = convertImportedProperty(propertyJson);

    // Assert
    expect(converted).toEqual(property);
  });
});

describe('convertImportedWaterCosts', () => {
  test('should convert water costs correctly', () => {
    // Arrange
    const waterCosts: WaterCostsState = {
      waterUsageCosts: [
        {
          costPerCubicMeter: 3,
          date: new MonthYear(6, 2023),
        },
      ],
      sewageCosts: [
        {
          costPerCubicMeter: 2,
          date: new MonthYear(5, 2023),
        },
      ],
    };
    const waterCostsJson = JSON.parse(JSON.stringify(waterCosts));

    // Act
    const converted = convertImportedWaterCosts(waterCostsJson);

    // Assert
    expect(converted).toEqual(waterCosts);
  });
});

describe('convertImportedLandlord', () => {
  test('should convert landlord correctly', () => {
    // Arrange
    const landlord: Landlord = {
      company: 'company',
      representative: {
        salutation: Salutation.Male,
        firstName: 'Max',
        lastName: 'Mustermann',
      },
      address: {
        zipCode: 12345,
        city: 'city',
        street: 'street',
        houseNumber: 42,
      },
      email: 'landlord@example.org',
      phone: '0152 3333333',
      bankAccount: {
        holder: 'holder',
        iban: 'DE 1234 5678 9000',
      },
    };
    const landlordJson = JSON.parse(JSON.stringify(landlord));

    // Act
    const converted = convertImportedLandlord(landlordJson);

    // Assert
    expect(converted).toEqual(landlord);
  });
});
