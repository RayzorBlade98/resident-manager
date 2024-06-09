import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import MonthYear from '_/extensions/date/month_year.extension';
import { LinkedDocument } from '_/models/resident/document';
import { ResidentHistoryElement } from '_/models/resident/history';
import { Resident } from '_/models/resident/resident';
import WaterMeterReading from '_/models/resident/water_meter_reading';
import residentState from '_/states/resident/resident.state';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

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
     * Function to add a document to the selected resident
     */
    addDocument,

    /**
     * Function to update some resident values
     */
    editResident,
  };
}

export default useResident;
