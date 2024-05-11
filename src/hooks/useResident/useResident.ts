import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import MonthYear from '_/extensions/date/month_year.extension';
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

  function addWaterMeterReading(reading: WaterMeterReading) {
    setResidents((state) => state.map((r) => (r.id === residentId
      ? { ...r, waterMeterReadings: [...r.waterMeterReadings, reading] }
      : r)));
  }

  function addRentPayment(payment: {
    dueDate: MonthYear;
    paymentAmount: CurrencyInCents;
    paymentDate: Date;
  }) {
    setResidents((state) => state.map((r) => (r.id === residentId
      ? {
        ...r,
        rentInformation: r.rentInformation.map((rent) => (rent.dueDate.equals(payment.dueDate)
          ? { ...rent, ...payment }
          : rent)),
      }
      : r)));
  }

  const editResident = useCallback(
    (newValues: EditResidentArgs, validSince: MonthYear) => {
      function applyChangesToResident(_resident: Resident) {
        _resident = { ..._resident };
        const newHistoryEntry: ResidentHistoryElement = {
          invalidSince: validSince,
        };

        if (newValues.contractResidents !== _resident.contractResidents) {
          newHistoryEntry.contractResidents = _resident.contractResidents;
          _resident.contractResidents = newValues.contractResidents;
        }
        if (newValues.numberOfResidents !== _resident.numberOfResidents) {
          newHistoryEntry.numberOfResidents = _resident.numberOfResidents;
          _resident.numberOfResidents = newValues.numberOfResidents;
        }
        if (newValues.keys) {
          newHistoryEntry.keys = {};
          _resident.keys = { ..._resident.keys };

          if (newValues.keys.apartment !== _resident.keys.apartment) {
            newHistoryEntry.keys.apartment = _resident.keys.apartment;
            _resident.keys.apartment = newValues.keys.apartment;
          }
          if (newValues.keys.basement !== _resident.keys.basement) {
            newHistoryEntry.keys.basement = _resident.keys.basement;
            _resident.keys.basement = newValues.keys.basement;
          }
          if (newValues.keys.attic !== _resident.keys.attic) {
            newHistoryEntry.keys.attic = _resident.keys.attic;
            _resident.keys.attic = newValues.keys.attic;
          }
          if (newValues.keys.frontDoor !== _resident.keys.frontDoor) {
            newHistoryEntry.keys.frontDoor = _resident.keys.frontDoor;
            _resident.keys.frontDoor = newValues.keys.frontDoor;
          }
          if (newValues.keys.mailbox !== _resident.keys.mailbox) {
            newHistoryEntry.keys.mailbox = _resident.keys.mailbox;
            _resident.keys.mailbox = newValues.keys.mailbox;
          }

          if (_.isEmpty(newHistoryEntry.keys)) {
            delete newHistoryEntry.keys;
          }
        }

        if (newValues.parkingSpaceId !== _resident.parkingSpaceId) {
          newHistoryEntry.parkingSpaceId = _resident.parkingSpaceId ?? null;
          _resident.parkingSpaceId = newValues.parkingSpaceId;
        }

        if (Object.keys(newHistoryEntry).length > 1) {
          _resident.history = [newHistoryEntry, ..._resident.history];
        }

        return _resident;
      }

      setResidents((state) => state.map((r) => (r.id === residentId ? applyChangesToResident(r) : r)));
    },
    [residentId, setResidents],
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
     * Function to update some resident values
     */
    editResident,
  };
}

export default useResident;
