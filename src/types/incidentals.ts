import { v4 as uuid } from "uuid";

export enum DeductionType {
  PerResident = "Pro Bewohner",
  PerApartment = "Pro Wohnung",
}

export interface Incidentals {
  id: string;
  name: string;
  currentPrice: number; // in cents
  deductionType: DeductionType;
  invoiceInterval: number; // in months
}

export function emptyIncidentals(): Incidentals {
  return {
    id: uuid(),
    name: "",
    currentPrice: 0,
    deductionType: DeductionType.PerApartment,
    invoiceInterval: 1,
  };
}
