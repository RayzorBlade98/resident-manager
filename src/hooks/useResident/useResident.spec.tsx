/* eslint-disable react-hooks/rules-of-hooks */

import { act, renderHook } from '@testing-library/react';
import _, { range } from 'lodash';
import { RecoilRoot } from 'recoil';
import useResident from './useResident';
import MonthYear from '_/extensions/date/month_year.extension';
import { DocumentType } from '_/models/resident/document';
import { Resident } from '_/models/resident/resident';
import residentState from '_/states/resident/resident.state';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import LinkedDocumentBuilder from '_/test/builders/linkedDocument.builder';
import NameBuilder from '_/test/builders/name.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';
import { mockedIpcAPIFunctions } from '_/test/ipcApiMock';

describe('useResident', () => {
  const residents = range(0, 3).map((__) => new ResidentBuilder()
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 7, 15))
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withRent(50000)
        .withDueDate(new MonthYear(8, 2023))
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withRent(50000)
        .withDueDate(new MonthYear(7, 2023))
        .build(),
    )
    .withParkingSpace(undefined)
    .withKeys({
      apartment: 1,
      attic: 2,
      basement: 3,
      frontDoor: 4,
      mailbox: 5,
    })
    .addContractResident(
      new ContractResidentBuilder()
        .withName(new NameBuilder().withFirstName('firstname 1').build())
        .build(),
    )
    .addContractResident(
      new ContractResidentBuilder()
        .withName(new NameBuilder().withFirstName('firstname 2').build())
        .build(),
    )
    .withNumberOfResidents(5)
    .addDocument(
      new LinkedDocumentBuilder().withDate(new Date(2023, 5, 9)).build(),
    )
    .addDocument(
      new LinkedDocumentBuilder().withDate(new Date(2023, 5, 8)).build(),
    )
    .build());
  const selectedResident = residents[1];

  describe('residents', () => {
    test('should return right resident', () => {
      // Arrange
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Assert
      expect(result.current.resident).toEqual(selectedResident);
    });
  });

  describe('addWaterMeterReading', () => {
    test('should set state correctly', () => {
      // Arrange
      const waterMeterReading = new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 8, 15))
        .build();
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.addWaterMeterReading(waterMeterReading);
      });

      // Assert
      expect(result.current.resident).toEqual({
        ...selectedResident,
        waterMeterReadings: [
          waterMeterReading,
          ...selectedResident.waterMeterReadings,
        ],
      });
    });
  });

  describe('addRentPayment', () => {
    test('should set state correctly', () => {
      // Arrange
      const rentPayment = {
        dueDate: selectedResident.rentInformation[1].dueDate,
        paymentDate: new Date(),
        paymentAmount: 12345,
      };
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.addRentPayment(rentPayment);
      });

      // Assert
      expect(result.current.resident).toEqual({
        ...selectedResident,
        rentInformation: [
          selectedResident.rentInformation[0],
          { ...selectedResident.rentInformation[1], ...rentPayment },
        ],
      });
    });
  });

  describe('increaseRent', () => {
    test('should generate document and set state correctly', async () => {
      // Arrange
      const rentIncrease = {
        newRent: 600,
        monthForIncrease: new MonthYear(11, 2023),
      };

      const documentId = 'rent increase document id';
      mockedIpcAPIFunctions.documentGeneration.generateRentIncreasePdf.mockResolvedValue(documentId);

      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      await act(async () => {
        await result.current.increaseRent(rentIncrease);
      });

      // Assert
      expect(mockedIpcAPIFunctions.documentGeneration.generateRentIncreasePdf).toHaveBeenCalledTimes(1);
      expect(mockedIpcAPIFunctions.documentGeneration.generateRentIncreasePdf).toHaveBeenLastCalledWith({
        resident: selectedResident,
      });

      expect(result.current.resident).toEqual({
        ...selectedResident,
        rentInformation: [
          {
            ...selectedResident.rentInformation[0],
            dueDate: new MonthYear(11, 2023),
            rent: rentIncrease.newRent,
          },
          {
            ...selectedResident.rentInformation[0],
            dueDate: new MonthYear(10, 2023),
          },
          {
            ...selectedResident.rentInformation[0],
            dueDate: new MonthYear(9, 2023),
          },
          ...selectedResident.rentInformation,
        ],
        documents: [
          {
            id: documentId,
            name: 'Mieterhöhung Dezember 2023',
            type: DocumentType.RentIncrease,
            date: rentIncrease.monthForIncrease,
          },
          ...selectedResident.documents,
        ],
      });
    });

    test('should set state correctly for existing rent info', async () => {
      // Arrange
      const rentIncrease = {
        newRent: 600,
        monthForIncrease: new MonthYear(7, 2023),
      };
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      await act(async () => {
        await result.current.increaseRent(rentIncrease);
      });

      // Assert
      expect(result.current.resident?.rentInformation).toEqual(
        selectedResident.rentInformation.map((r) => ({
          ...r,
          rent: rentIncrease.newRent,
        })),
      );
    });
  });

  describe('addDocument', () => {
    test('should set state correctly', () => {
      // Arrange
      const document = new LinkedDocumentBuilder()
        .withDate(new Date(2022, 5, 7))
        .build();
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.addDocument(document);
      });

      // Assert
      expect(result.current.resident).toEqual({
        ...selectedResident,
        documents: [...selectedResident.documents, document],
      });
    });
  });

  describe('extendRentInformation', () => {
    it('should set the state correctly', async () => {
      // Arrange
      const targetMonth = new MonthYear(10, 2023);
      const expectedResident: Resident = {
        ...selectedResident,
        rentInformation: [
          {
            ...selectedResident.rentInformation[0],
            dueDate: new MonthYear(10, 2023),
          },
          {
            ...selectedResident.rentInformation[0],
            dueDate: new MonthYear(9, 2023),
          },
          ...selectedResident.rentInformation,
        ],
      };

      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      const updatedResident = await act(() => result.current.extendRentInformation(targetMonth));

      // Assert
      expect(updatedResident).toEqual(expectedResident);
      expect(result.current.resident).toEqual(expectedResident);
    });
  });

  describe('editResident', () => {
    test('should set state correctly (complete update)', () => {
      // Arrange
      const newValues = {
        contractResidents: [
          new ContractResidentBuilder()
            .withName(new NameBuilder().withFirstName('new resident').build())
            .build(),
        ],
        numberOfResidents: 8,
        keys: {
          apartment: 5,
          basement: 4,
          attic: 3,
          frontDoor: 2,
          mailbox: 1,
        },
        parkingSpaceId: 'new parking space',
      };
      const validSince = new MonthYear(4, 2024);

      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.editResident(newValues, validSince);
      });

      // Assert
      expect(result.current.resident).toEqual({
        ...selectedResident,
        ...newValues,
        history: [
          {
            invalidSince: validSince,
            ..._.pick(selectedResident, [
              'contractResidents',
              'numberOfResidents',
              'keys',
            ]),
            parkingSpaceId: null,
          },
        ],
      });
    });

    test('should set state correctly (partial update)', () => {
      // Arrange
      const newValues = {
        ..._.pick(selectedResident, ['contractResidents', 'parkingSpaceId']),
        numberOfResidents: 8,
        keys: {
          ...selectedResident.keys,
          apartment: 5,
        },
      };
      const validSince = new MonthYear(4, 2024);

      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.editResident(newValues, validSince);
      });

      // Assert
      expect(result.current.resident).toEqual({
        ...selectedResident,
        numberOfResidents: newValues.numberOfResidents,
        keys: {
          ...selectedResident.keys,
          apartment: newValues.keys.apartment,
        },
        history: [
          {
            invalidSince: validSince,
            numberOfResidents: selectedResident.numberOfResidents,
            keys: {
              apartment: selectedResident.keys.apartment,
            },
          },
        ],
      });
    });

    test('should set state correctly (no keys update)', () => {
      // Arrange
      const newValues = {
        ..._.pick(selectedResident, [
          'contractResidents',
          'parkingSpaceId',
          'keys',
        ]),
        numberOfResidents: 8,
      };
      const validSince = new MonthYear(4, 2024);

      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.editResident(newValues, validSince);
      });

      // Assert
      expect(result.current.resident).toEqual({
        ...selectedResident,
        numberOfResidents: newValues.numberOfResidents,
        keys: {
          ...selectedResident.keys,
          apartment: newValues.keys.apartment,
        },
        history: [
          {
            invalidSince: validSince,
            numberOfResidents: selectedResident.numberOfResidents,
          },
        ],
      });
    });

    test("shouldn't change the state for no update", () => {
      // Arrange
      const newValues = {
        ..._.pick(selectedResident, [
          'contractResidents',
          'parkingSpaceId',
          'keys',
          'numberOfResidents',
        ]),
      };
      const validSince = new MonthYear(4, 2024);

      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.editResident(newValues, validSince);
      });

      // Assert
      expect(result.current.resident).toEqual(selectedResident);
    });
  });
});
