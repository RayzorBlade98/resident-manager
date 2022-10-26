import fs from 'fs';
import path from 'path';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import saveState, { SaveState } from '_/states/saveStates/save_state';

const OUTPUT_DIRECTORY = path.join(__dirname, 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIRECTORY, 'save.json');

export function SaveStateManager(): null {
  const [isInitialized, setInitialized] = useState<boolean>(false);
  const [save, setSave] = useRecoilState(saveState);

  useEffect(() => {
    // Load save file
    if (fs.existsSync(OUTPUT_FILE)) {
      const json = fs.readFileSync(OUTPUT_FILE).toString();
      const loadedSave = JSON.parse(json) as SaveState;
      setSave(loadedSave);
    }
    setInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isInitialized) return;
    // Write save file
    if (!fs.existsSync(OUTPUT_DIRECTORY)) {
      fs.mkdirSync(OUTPUT_DIRECTORY);
    }
    const json = JSON.stringify(save, null, 4);
    fs.writeFileSync(OUTPUT_FILE, json);
  }, [save]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default SaveStateManager;
