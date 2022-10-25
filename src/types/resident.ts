import { v4 as uuid } from "uuid";

export interface Resident {
  id: string;
  first_name: string;
  last_name: string;
}

export function emptyResident(): Resident {
  return {
    id: uuid(),
    first_name: "",
    last_name: "",
  };
}
