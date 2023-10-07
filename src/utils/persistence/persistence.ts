import { RecoilState } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import incidentalsState, {
  IncidentalsState,
} from '../../states/incidentals/incidentals.state';
import invoiceState, { InvoiceState } from '../../states/invoice/invoice.state';
import residentState, {
  ResidentState,
} from '../../states/resident/resident.state';
import RentInformationUtils from '../rent/rent.utils';
import {
  convertImportedIncidentals,
  convertImportedInvoices,
  convertImportedProperty,
  convertImportedResidents,
  convertImportedWaterCosts,
} from './converters';
import Property from '_/models/property/property';
import propertyState from '_/states/property/property.state';
import waterCostsState, {
  WaterCostsState,
} from '_/states/waterCosts/waterCosts.state';
import Imported from '_/types/Imported';

export const persistenceFilenames = {
  incidentals: 'incidentals.json',
  invoices: 'invoices.json',
  residents: 'residents.json',
  property: 'property.json',
  waterCosts: 'waterCosts.json',
};

/**
 * Imports all save states
 */
export async function importSaveStates(): Promise<void> {
  // Incidentals
  await importSaveState<IncidentalsState>(
    persistenceFilenames.incidentals,
    incidentalsState,
    convertImportedIncidentals,
  );

  // Invoices
  await importSaveState<InvoiceState>(
    persistenceFilenames.invoices,
    invoiceState,
    convertImportedInvoices,
  );

  // Residents
  await importSaveState<ResidentState>(
    persistenceFilenames.residents,
    residentState,
    (r) => {
      const residents = convertImportedResidents(r);
      residents
        .map((resident) => resident.rentInformation)
        .forEach((rent) => {
          RentInformationUtils.addMissingMonths(rent);
        });
      return residents;
    },
  );

  // Property
  await importSaveState<Property>(
    persistenceFilenames.property,
    propertyState,
    convertImportedProperty,
  );

  // Water costs
  await importSaveState<WaterCostsState>(
    persistenceFilenames.waterCosts,
    waterCostsState,
    convertImportedWaterCosts,
  );
}

/**
 * Exports all save states
 */
export function exportSaveStates(): void {
  // Incidentals
  const incidentals = getRecoil(incidentalsState);
  void window.ipcAPI.exportObject(incidentals, persistenceFilenames.incidentals);

  // Invoices
  const invoices = getRecoil(invoiceState);
  void window.ipcAPI.exportObject(invoices, persistenceFilenames.invoices);

  // Residents
  const residents = getRecoil(residentState);
  void window.ipcAPI.exportObject(residents, persistenceFilenames.residents);

  // Property
  const property = getRecoil(propertyState);
  if (property) {
    void window.ipcAPI.exportObject(property, persistenceFilenames.property);
  }

  // Water costs
  const waterCosts = getRecoil(waterCostsState);
  void window.ipcAPI.exportObject(waterCosts, persistenceFilenames.waterCosts);
}

/**
 * Imports an object from a file and saves it to the state
 * @param filename file that should be imported
 * @param recoilState state to which the imported object should be saved
 * @param converter function that converts the imported object to the right format
 */
async function importSaveState<TState extends object>(
  filename: string,
  recoilState: RecoilState<TState>,
  converter: (imported: Imported<TState>) => TState,
) {
  const imported = await window.ipcAPI.importObject<Imported<TState>>(filename);
  if (imported) {
    setRecoil(recoilState, converter(imported));
  }
}
