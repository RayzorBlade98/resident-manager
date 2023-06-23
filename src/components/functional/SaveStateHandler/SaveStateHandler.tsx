import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import PersistenceUtils from '../../../utils/persistence/persistence.utils';
import incidentalsState from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import { propertyState } from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import createDummyData from '_/utils/dummy_data';
import { dev } from '_/utils/node-env';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SaveStateManagerProps {}

/**
 * Functional component that handles save state management like import and export
 */
export function SaveStateManager(
  props: React.PropsWithChildren<SaveStateManagerProps>,
): JSX.Element | null {
  const [isInitialized, setInitialized] = useState<boolean>(false);
  const incidentals = useRecoilValue(incidentalsState);
  const invoices = useRecoilValue(invoiceState);
  const residents = useRecoilValue(residentState);
  const property = useRecoilValue(propertyState);

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
  useEffect(onSaveChange, [incidentals, invoices, residents, property]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isInitialized) {
    return null;
  }

  return <>{props.children}</>; // eslint-disable-line react/jsx-no-useless-fragment
}

export default SaveStateManager;
