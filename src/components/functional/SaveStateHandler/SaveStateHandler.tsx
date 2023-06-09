import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import PersistenceUtils from '../../../utils/persistence/persistence.utils';
import incidentalsState from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import residentState from '_/states/resident/resident.state';
import createDummyData from '_/utils/dummy_data';
import { dev } from '_/utils/node-env';

/**
 * Functional component that handles save state management like import and export
 */
export function SaveStateManager(): null {
  const [isInitialized, setInitialized] = useState<boolean>(false);
  const incidentals = useRecoilValue(incidentalsState);
  const invoices = useRecoilValue(invoiceState);
  const residents = useRecoilValue(residentState);

  /**
   * Handles the save state when starting the program
   * - Loads the save file
   * - Creates dummy data when in dev mode
   */
  function onStart(): void {
    /* istanbul ignore next */
    if (dev) {
      createDummyData();
    }
    PersistenceUtils.importSaveStates();
    setInitialized(true);
  }

  /**
   * Handles save state changes
   * - saves the states to the save files
   */
  function onSaveChange(): void {
    if (!isInitialized) return;
    PersistenceUtils.exportSaveStates();
  }

  useEffect(onStart, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(onSaveChange, [incidentals, invoices, residents]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default SaveStateManager;
