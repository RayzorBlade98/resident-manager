import { atom } from "recoil";
import { Resident } from "_/types/resident";
import { v4 as uuid } from "uuid";
import { setRecoil } from "recoil-nexus";

const dummyResidents: Resident[] = [];
for (let i = 0; i < 8; i++) {
  dummyResidents.push({
    id: uuid(),
    first_name: "Max",
    last_name: "Mustermann",
  });
}

export const allResidentsState = atom<Resident[]>({
  key: "allResidentsState",
  default: dummyResidents,
});

export function addResident(resident: Resident): void {
  setRecoil(allResidentsState, (allResidents: Resident[]) => [
    ...allResidents,
    resident,
  ]);
}

export default allResidentsState;
