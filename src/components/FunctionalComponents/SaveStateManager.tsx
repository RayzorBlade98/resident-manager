import React, { useEffect, useState } from "react";
import fs from "fs";
import path from "path";
import { useRecoilState } from "recoil";
import saveState from "_/states/saveStates/save_state";

const OUTPUT_DIRECTORY = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIRECTORY, "save.json");

export function SaveStateManager(): JSX.Element {
  const [isInitialized, setInitialized] = useState<boolean>(false);
  const [save, setSave] = useRecoilState(saveState);

  useEffect(() => {
    // Load save file
    if (fs.existsSync(OUTPUT_FILE)) {
      const json = fs.readFileSync(OUTPUT_FILE).toString();
      const save = JSON.parse(json);
      setSave(save);
      console.log("Loaded save file");
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    // Write save file
    if (!fs.existsSync(OUTPUT_DIRECTORY)) {
      fs.mkdirSync(OUTPUT_DIRECTORY);
    }
    const json = JSON.stringify(save, null, 4);
    fs.writeFileSync(OUTPUT_FILE, json);
    console.log("Wrote save file");
  }, [save]);

  return <></>;
}

export default SaveStateManager;
