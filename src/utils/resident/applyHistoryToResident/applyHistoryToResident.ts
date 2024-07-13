import _ from 'lodash';
import type { PartialDeep } from 'type-fest';
import MonthYear from '_/extensions/date/month_year.extension';
import { ResidentHistoryElement } from '_/models/resident/history';
import { Resident } from '_/models/resident/resident';
import { cloneDeep } from '_/utils/cloneDeep/cloneDeep';

/**
 * Applies the history to the resident up to the specified month
 * @param resident Resident to whome the history should be applied
 * @param month Month up to which the history should be applied
 * @returns historical snapshot of the resident during the specified month
 */
export function applyHistoryToResident(
  resident: Resident,
  month: MonthYear,
): Resident {
  const historicalResident = cloneDeep(resident);

  resident.history
    .filter((historyElement) => shouldApplyHistoryElement(historyElement, month))
    .forEach((historyElement) => {
      const overwrite: PartialDeep<Resident> = {
        ..._.omit(historyElement, ['invalidSince', 'parkingSpaceId']),
      };

      // Handle parkingSpaceId
      const parkingSpaceId = historyElement.parkingSpaceId;
      if (parkingSpaceId !== undefined) {
        historicalResident.parkingSpaceId = historyElement.parkingSpaceId ?? undefined;
      }

      _.mergeWith(historicalResident, overwrite, (a, b) => (_.isArray(b) ? b : undefined));
    });

  historicalResident.history = resident.history.filter(
    (historyElement) => !shouldApplyHistoryElement(historyElement, month),
  );

  return historicalResident;
}

function shouldApplyHistoryElement(
  historyElement: ResidentHistoryElement,
  month: MonthYear,
): boolean {
  return historyElement.invalidSince > month;
}
