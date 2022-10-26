import { Resident } from "_/types/resident";
import { v4 as uuid } from "uuid";
import { selector } from "recoil";
import saveState, { SaveState } from "./save_state";
import { setRecoil } from "recoil-nexus";

export type ResidentState = Resident[];
export function defaultResidentsState(): ResidentState {
  //return [];
  const dummyResidents: ResidentState = [];
  for (let i = 0; i < 8; i++) {
    dummyResidents.push({
      id: uuid(),
      firstName: "Max",
      lastName: "Mustermann",
    });
  }
  return dummyResidents;
}

export const residentState = selector<ResidentState>({
  key: "residentState",
  get: ({ get }) => {
    const state = get(saveState);
    return state.residents;
  },
});

export function addResident(resident: Resident): void {
  setRecoil(saveState, (state: SaveState) => {
    return {
      ...state,
      residents: [...state.residents, resident],
    };
  });
}

export default residentState;
