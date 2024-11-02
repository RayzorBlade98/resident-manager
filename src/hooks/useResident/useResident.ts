import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CurrencyInCents } from '../../utils/currency/currency.utils';
import RentInformationUtils from '../../utils/rent/rent.utils';
import MonthYear from '_/extensions/date/month_year.extension';
import { LinkedDocument, DocumentType } from '_/models/resident/document';

import { ResidentHistoryElement } from '_/models/resident/history';
import { Resident } from '_/models/resident/resident';
import WaterMeterReading from '_/models/resident/water_meter_reading';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';

type EditResidentArgs = {
  contractResidents: Resident['contractResidents'];
  numberOfResidents: Resident['numberOfResidents'];
  parkingSpaceId: Resident['parkingSpaceId'];
  keys: Resident['keys'];
};

/**
 * Hook that returns the resident matching the id and utility functions to modify it
 * @param residentId id of the resident that should be returned
 */
function useResident(residentId: string) {
  const [residents, setResidents] = useRecoilState(residentState);
  const property = useRecoilValue(propertyState);
  const landlord = useRecoilValue(landlordState);
  const resident = useMemo(
    () => residents.find((r) => r.id === residentId),
    [residentId, residents],
  );

  /**
   * Applies the specified changes to the selected resident and updates the state
   */
  const applyChangesToResident = useCallback(
    (changeFunction: (resident: Resident) => Resident) => {
      setResidents((state) => state.map((r) => (r.id === residentId ? changeFunction(r) : r)));
    },
    [residentId, setResidents],
  );

  const addWaterMeterReading = useCallback(
    (reading: WaterMeterReading) => {
      applyChangesToResident((r) => ({
        ...r,
        waterMeterReadings: [...r.waterMeterReadings, reading],
      }));
    },
    [applyChangesToResident],
  );

  const addRentPayment = useCallback(
    (payment: {
      dueDate: MonthYear;
      paymentAmount: CurrencyInCents;
      paymentDate: Date;
      bankTransferDocumentId: string;
      paymentNote: string | undefined;
    }) => {
      applyChangesToResident((r) => ({
        ...r,
        rentInformation: r.rentInformation.map((rent) => (rent.dueDate.equals(payment.dueDate) ? { ...rent, ...payment } : rent)),
      }));
    },
    [applyChangesToResident],
  );

  const addDocument = useCallback(
    (document: LinkedDocument) => {
      applyChangesToResident((r) => ({
        ...r,
        documents: [...r.documents, document],
      }));
    },
    [applyChangesToResident],
  );

  const increaseRent = useCallback(
    async (rentIncrease: {
      newRent: CurrencyInCents;
      monthForIncrease: MonthYear;
    }) => {
      /* istanbul ignore next */
      if (!resident) {
        return;
      }

      applyChangesToResident((r) => ({
        ...r,
        rentInformation: RentInformationUtils.addUntilMonth(
          [...r.rentInformation],
          rentIncrease.monthForIncrease,
        ).map((rentInfo) => (rentInfo.dueDate >= rentIncrease.monthForIncrease
          ? {
            ...rentInfo,
            rent: rentIncrease.newRent,
          }
          : rentInfo)),
      }));
      const documentId = await window.ipcAPI.documentGeneration.generateRentIncreasePdf({
        ...rentIncrease,
        resident,
        property,
        landlord,
      });
      addDocument({
        id: documentId,
        type: DocumentType.RentIncrease,
        name: `Mieterhöhung ${rentIncrease.monthForIncrease.toString()}`,
        creationDate: new Date(),
        subjectDate: rentIncrease.monthForIncrease,
      });
    },
    [applyChangesToResident, resident, addDocument, property, landlord],
  );

  const extendRentInformation = useCallback(
    (targetMonth: MonthYear) => {
      let updatedResident: Resident = resident as Resident;
      applyChangesToResident((r) => {
        updatedResident = {
          ...r,
          rentInformation: RentInformationUtils.addUntilMonth(
            [...r.rentInformation],
            targetMonth,
          ),
        };
        return updatedResident;
      });
      return updatedResident;
    },
    [applyChangesToResident, resident],
  );

  const editResident = useCallback(
    (newValues: EditResidentArgs, validSince: MonthYear) => {
      applyChangesToResident((r) => {
        r = { ...r };
        const newHistoryEntry: ResidentHistoryElement = {
          invalidSince: validSince,
        };

        if (newValues.contractResidents !== r.contractResidents) {
          newHistoryEntry.contractResidents = r.contractResidents;
          r.contractResidents = newValues.contractResidents;
        }
        if (newValues.numberOfResidents !== r.numberOfResidents) {
          newHistoryEntry.numberOfResidents = r.numberOfResidents;
          r.numberOfResidents = newValues.numberOfResidents;
        }
        if (newValues.keys) {
          newHistoryEntry.keys = {};
          r.keys = { ...r.keys };

          if (newValues.keys.apartment !== r.keys.apartment) {
            newHistoryEntry.keys.apartment = r.keys.apartment;
            r.keys.apartment = newValues.keys.apartment;
          }
          if (newValues.keys.basement !== r.keys.basement) {
            newHistoryEntry.keys.basement = r.keys.basement;
            r.keys.basement = newValues.keys.basement;
          }
          if (newValues.keys.attic !== r.keys.attic) {
            newHistoryEntry.keys.attic = r.keys.attic;
            r.keys.attic = newValues.keys.attic;
          }
          if (newValues.keys.frontDoor !== r.keys.frontDoor) {
            newHistoryEntry.keys.frontDoor = r.keys.frontDoor;
            r.keys.frontDoor = newValues.keys.frontDoor;
          }
          if (newValues.keys.mailbox !== r.keys.mailbox) {
            newHistoryEntry.keys.mailbox = r.keys.mailbox;
            r.keys.mailbox = newValues.keys.mailbox;
          }

          if (_.isEmpty(newHistoryEntry.keys)) {
            delete newHistoryEntry.keys;
          }
        }

        if (newValues.parkingSpaceId !== r.parkingSpaceId) {
          newHistoryEntry.parkingSpaceId = r.parkingSpaceId ?? null;
          r.parkingSpaceId = newValues.parkingSpaceId;
        }

        if (Object.keys(newHistoryEntry).length > 1) {
          r.history = [newHistoryEntry, ...r.history];
        }

        return r;
      });
    },
    [applyChangesToResident],
  );

  return {
    /**
     * Resident with the matching id
     */
    resident,

    /**
     * Function to add a water meter reading to the selected resident
     */
    addWaterMeterReading,

    /**
     * Function to add a rent payment to the selcted resident
     */
    addRentPayment,

    /**
     * Function to increase the rent of the selected resident
     */
    increaseRent,

    /**
     * Function to add a document to the selected resident
     */
    addDocument,

    /**
     * Function to extend the rent information of the selected resident up to the specified month
     * @param targetMonth Target month until the rent information should be filled
     * @returns Updated resident
     */
    extendRentInformation,

    /**
     * Function to update some resident values
     */
    editResident,
  };
}

export default useResident;
