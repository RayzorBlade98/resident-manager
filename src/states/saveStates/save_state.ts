import { atom } from "recoil";
import { defaultResidentsState, ResidentState } from "./resident_state";

export interface SaveState {
  residents: ResidentState;
}

const defaultSaveState: SaveState = {
  residents: defaultResidentsState(),
};

export const saveState = atom<SaveState>({
  key: "saveState",
  default: defaultSaveState,
});

export default saveState;
