import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { incidentalsState } from '_/states/saveStates/incidentals_state';
import { invoiceState } from '_/states/saveStates/invoice_state';
import SaveStatePersistenceManager from '_/states/saveStates/persistence';
import residentState from '_/states/saveStates/resident_state';
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
    SaveStatePersistenceManager.importSaveStates();
    setInitialized(true);
  }

  /**
   * Handles save state changes
   * - saves the states to the save files
   */
  function onSaveChange(): void {
    if (!isInitialized) return;
    SaveStatePersistenceManager.exportSaveStates();
  }

  useEffect(onStart, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(onSaveChange, [incidentals, invoices, residents]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default SaveStateManager;
