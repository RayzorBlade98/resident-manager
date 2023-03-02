import fs from 'fs';
import path from 'path';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import saveState, { SaveState } from '_/states/saveStates/save_state';
import { RentInformation, RentInformationUtils } from '_/types/rent';
import { Resident } from '_/types/resident';

const OUTPUT_DIRECTORY = path.join(__dirname, 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIRECTORY, 'save.json');

export function SaveStateManager(): null {
  const [isInitialized, setInitialized] = useState<boolean>(false);
  const [save, setSave] = useRecoilState(saveState);

  /**
   * Handles the save state when starting the program
   * - Loads the save file
   * - Adds missing months to the rent information of each resident
   */
  function onStart(): void {
    if (!fs.existsSync(OUTPUT_FILE)) {
      setInitialized(true);
      return;
    }

    // Load save file
    const json = fs.readFileSync(OUTPUT_FILE).toString();
    const loadedSave = JSON.parse(json) as SaveState;

    // Add missing months to the rent information
    loadedSave.residents
      .map<RentInformation[]>((r: Resident) => r.rent)
      .forEach((r: RentInformation[]) => {
        RentInformationUtils.addMissingMonths(r);
      });

    // Adjust state
    setSave(loadedSave);
    setInitialized(true);
  }

  /**
   * Handles save state changes
   * - saves the new state to the save file
   */
  function onSaveChange(): void {
    if (!isInitialized) return;
    // Write save file
    if (!fs.existsSync(OUTPUT_DIRECTORY)) {
      fs.mkdirSync(OUTPUT_DIRECTORY);
    }
    const json = JSON.stringify(save, null, 4);
    fs.writeFileSync(OUTPUT_FILE, json);
  }

  useEffect(onStart, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(onSaveChange, [save]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default SaveStateManager;
