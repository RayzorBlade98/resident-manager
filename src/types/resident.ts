import { v4 as uuid } from 'uuid';

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
}

export function emptyResident(): Resident {
  return {
    id: uuid(),
    firstName: '',
    lastName: '',
  };
}
