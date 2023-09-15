import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import MonthYear from '_/extensions/date/month_year.extension';
import WaterMeterReading from '_/models/resident/water_meter_reading';
import residentState from '_/states/resident/resident.state';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

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
  };
}

export default useResident;
