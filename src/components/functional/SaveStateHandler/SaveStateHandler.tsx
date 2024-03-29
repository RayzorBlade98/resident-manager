import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import incidentalsState from '_/states/incidentals/incidentals.state';
import invoiceState from '_/states/invoice/invoice.state';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import createDummyData from '_/utils/dummy_data';
import { dev } from '_/utils/node-env';
import {
  importSaveStates,
  exportSaveStates,
} from '_/utils/persistence/persistence';

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
  const waterCosts = useRecoilValue(waterCostsState);

  /**
   * Handles save state changes
   * - saves the states to the save files
   */
  function onSaveChange(): void {
    if (!isInitialized) return;
    exportSaveStates();
  }

  /**
   * Handles the save state when starting the program
   * - Loads the save file
   * - Creates dummy data when in dev mode
   */
  useEffect(() => {
    /* istanbul ignore next */
    if (dev) {
      createDummyData();
    }

    const asyncImport = async () => {
      await importSaveStates();
      setInitialized(true);
    };

    void asyncImport();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onSaveChange, [
    incidentals,
    invoices,
    residents,
    property,
    waterCosts,
  ]);

  if (!isInitialized) {
    return null;
  }

  return <>{props.children}</>; // eslint-disable-line react/jsx-no-useless-fragment
}

export default SaveStateManager;
