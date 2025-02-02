/* eslint-disable react-hooks/rules-of-hooks */

import { act, renderHook } from '@testing-library/react';
import { range } from 'lodash';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { useInvoiceGeneration } from './useInvoiceGeneration';
import MonthYear from '_/extensions/date/month_year.extension';
import { DocumentType } from '_/models/resident/document';
import incidentalsState, {
  IncidentalsState,
} from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import ResidentInvoiceInformationBuilder from '_/test/builders/residentInvoiceInformation.builder';
import WaterCostsBuilder from '_/test/builders/waterCosts.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';
import useMergedHook from '_/test/hooks/useMergedHook';
import mockedIpcAPI from '_/test/ipcApiMock';
import { generateInvoice } from '_/utils/invoiceGeneration/generateInvoice';

jest.mock('_/utils/invoiceGeneration/generateInvoice', () => ({
  generateInvoice: jest.fn(),
}));

describe('useInvoiceGeneration', () => {
  const invoices = range(0, 5)
    .map(() => new InvoiceBuilder().build())
    .reverse();
  const waterCosts = new WaterCostsBuilder().build();
  const incidentals: IncidentalsState = {
    ongoingIncidentals: range(0, 5).map(() => new OngoingIncidentalsBuilder().build()),
    oneTimeIncidentals: range(0, 5).map(() => new OneTimeIncidentalsBuilder().build()),
  };
  const property = new PropertyBuilder().build();
  const landlord = new LandlordBuilder().build();

  const invoiceStart = new MonthYear(9, 2024);
  const invoiceEnd = new MonthYear(11, 2024);
  const newDeductionStart = new MonthYear(2, 2025);
  const newDeduction = 12345;

  const residentIncluded = new ResidentBuilder()
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(invoiceEnd.addMonths(1))
        .withWasDeductedInInvoice(false)
        .build(),
    )
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(invoiceEnd.addMonths(-1))
        .withWasDeductedInInvoice(false)
        .build(),
    )
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(invoiceStart)
        .withWasDeductedInInvoice(false)
        .build(),
    )
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(invoiceStart.addMonths(-5))
        .withWasDeductedInInvoice(true)
        .build(),
    )
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(invoiceStart.addMonths(-10))
        .withWasDeductedInInvoice(true)
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(invoiceEnd.addMonths(1))
        .withRent(11)
        .withIncidentals(1)
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(invoiceEnd)
        .withIncidentals(1)
        .withRent(6666)
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(invoiceStart.addMonths(1))
        .withIncidentals(1)
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(invoiceStart)
        .withIncidentals(1)
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(invoiceStart.addMonths(-1))
        .withIncidentals(1)
        .withWasDeductedInInvoice(true)
        .build(),
    )
    .build();
  const residentNotIncluded = new ResidentBuilder().build();
  const residents = [residentIncluded, residentNotIncluded];

  const generatedInvoice = new InvoiceBuilder()
    .withStartAndEnd(invoiceStart, invoiceEnd)
    .withNewDeductionStart(newDeductionStart)
    .withResident(
      new ResidentInvoiceInformationBuilder()
        .withResidentId(residentIncluded.id)
        .withNewIncidentalsDeduction(newDeduction)
        .build(),
    )
    .build();

  const systemTime = new Date(2025, 1, 2);
  const invoiceDocumentId = 'invoice-document-id';

  beforeEach(() => {
    (generateInvoice as jest.Mock).mockReturnValue(generatedInvoice);

    (
      mockedIpcAPI.documentGeneration.generateInvoicePdfs as jest.Mock
    ).mockReturnValue({
      [residentIncluded.id]: invoiceDocumentId,
    });

    jest.useFakeTimers();
    jest.setSystemTime(systemTime);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should add new invoice to state', async () => {
    // Act
    const result = await useInvoiceGenerationHook();

    // Assert
    expect(result.current.invoices).toEqual([generatedInvoice, ...invoices]);
    expect(generateInvoice).toHaveBeenLastCalledWith({
      start: invoiceStart,
      end: invoiceEnd,
      newDeductionStart,
      residents,
      ongoingIncidentals: incidentals.ongoingIncidentals,
      oneTimeIncidentals: incidentals.oneTimeIncidentals,
      waterCosts,
      property,
      landlord,
    });
    expect(generateInvoice).toHaveBeenCalledTimes(1);
  });

  it('should apply invoice to resident correctly', async () => {
    // Act
    const result = await useInvoiceGenerationHook();

    // Assert
    const expectedWaterMeterReadings = [
      residentIncluded.waterMeterReadings[0],
      {
        ...residentIncluded.waterMeterReadings[1],
        wasDeductedInInvoice: true,
      },
      {
        ...residentIncluded.waterMeterReadings[2],
        wasDeductedInInvoice: true,
      },
      residentIncluded.waterMeterReadings[3],
      residentIncluded.waterMeterReadings[4],
    ];

    const expectedRentInformation = [
      {
        ...residentIncluded.rentInformation[0],
        dueDate: newDeductionStart,
        incidentals: newDeduction,
      },
      {
        ...residentIncluded.rentInformation[0],
        dueDate: newDeductionStart.addMonths(-1),
      },
      residentIncluded.rentInformation[0],
      {
        ...residentIncluded.rentInformation[1],
        wasDeductedInInvoice: true,
      },
      {
        ...residentIncluded.rentInformation[2],
        wasDeductedInInvoice: true,
      },
      {
        ...residentIncluded.rentInformation[3],
        wasDeductedInInvoice: true,
      },
      residentIncluded.rentInformation[4],
    ];

    const expectedDocuments = [
      {
        id: invoiceDocumentId,
        name: 'Nebenkostenabrechnung Oktober 2024 - Dezember 2024',
        type: DocumentType.Invoice,
        creationDate: systemTime.toUTC(),
        subjectDate: newDeductionStart,
      },
      ...residentIncluded.documents,
    ];

    const expectedResidents = [
      {
        ...residentIncluded,
        waterMeterReadings: expectedWaterMeterReadings,
        rentInformation: expectedRentInformation,
        documents: expectedDocuments,
      },
      residentNotIncluded,
    ];
    expect(result.current.residents).toEqual(expectedResidents);

    expect(
      mockedIpcAPI.documentGeneration.generateInvoicePdfs,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockedIpcAPI.documentGeneration.generateInvoicePdfs,
    ).toHaveBeenLastCalledWith(generatedInvoice);
  });

  async function useInvoiceGenerationHook() {
    const { result } = renderHook(
      () => useInitializedRecoilState({
        state: invoiceState,
        stateValue: invoices,
        hook: () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useInitializedRecoilState({
            state: waterCostsState,
            stateValue: waterCosts,
            hook: () => useInitializedRecoilState({
              state: incidentalsState,
              stateValue: incidentals,
              hook: () => useInitializedRecoilState({
                state: propertyState,
                stateValue: property,
                hook: () => useInitializedRecoilState({
                  state: landlordState,
                  stateValue: landlord,
                  hook: () => useMergedHook(
                    () => ({
                      generateInvoice: useInvoiceGeneration(),
                    }),
                    () => useMergedHook(
                      () => ({
                        invoices: useRecoilValue(invoiceState),
                      }),
                      () => ({
                        residents:
                                          useRecoilValue(residentState),
                      }),
                    ),
                  ),
                }),
              }),
            }),
          }),
        }),
      }),
      {
        wrapper: RecoilRoot,
      },
    );

    await act(() => result.current.generateInvoice(
      invoiceStart,
      invoiceEnd,
      newDeductionStart,
    ));

    return result;
  }
});
