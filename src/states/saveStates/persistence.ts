import fs from 'fs';
import path from 'path';
import { getRecoil, setRecoil } from 'recoil-nexus';
import IncidentalsState, { incidentalsState } from './incidentals_state';
import { InvoiceState, invoiceState } from './invoice_state';
import residentState, { ResidentState } from './resident_state';
import { RentInformation, RentInformationUtils } from '_/types/rent';
import { Resident } from '_/types/resident';

/**
 * Class that provides functionality to handle save state persistence
 */
abstract class SaveStatePersistenceManager {
  public static OUTPUT_DIRECTORY = path.join(__dirname, 'data');

  public static INCIDENTALS_FILE = path.join(
    SaveStatePersistenceManager.OUTPUT_DIRECTORY,
    'incidentals.json',
  );

  public static INVOICES_FILE = path.join(
    SaveStatePersistenceManager.OUTPUT_DIRECTORY,
    'invoices.json',
  );

  public static RESIDENTS_FILE = path.join(
    SaveStatePersistenceManager.OUTPUT_DIRECTORY,
    'residents.json',
  );

  /**
   * Imports all save states
   */
  public static importSaveStates(): void {
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function reviver(_key: string, value: any): any {
      if (typeof value === 'string' && dateFormat.test(value)) {
        return new Date(value);
      }
      return value;
    }

    // Incidentals
    if (fs.existsSync(this.INCIDENTALS_FILE)) {
      const json = fs.readFileSync(this.INCIDENTALS_FILE).toString();
      const loadedIncidentals = JSON.parse(json, reviver) as IncidentalsState;
      setRecoil(incidentalsState, loadedIncidentals);
    }

    // Invoices
    if (fs.existsSync(this.INVOICES_FILE)) {
      const json = fs.readFileSync(this.INVOICES_FILE).toString();
      const loadedInvoices = JSON.parse(json, reviver) as InvoiceState;
      setRecoil(invoiceState, loadedInvoices);
    }

    // Residents
    if (fs.existsSync(this.RESIDENTS_FILE)) {
      const json = fs.readFileSync(this.RESIDENTS_FILE).toString();
      const loadedResidents = JSON.parse(json, reviver) as ResidentState;

      // Add missing months to the rent information
      loadedResidents
        .map<RentInformation[]>((r: Resident) => r.rent)
        .forEach((r: RentInformation[]) => {
          RentInformationUtils.addMissingMonths(r);
        });

      setRecoil(residentState, loadedResidents);
    }
  }

  /**
   * Exports all save states
   */
  public static exportSaveStates(): void {
    if (!fs.existsSync(this.OUTPUT_DIRECTORY)) {
      fs.mkdirSync(this.OUTPUT_DIRECTORY);
    }

    // Incidentals
    const incidentals = getRecoil(incidentalsState);
    const incidentalsJson = JSON.stringify(incidentals, null, 4);
    fs.writeFileSync(this.INCIDENTALS_FILE, incidentalsJson);

    // Invoices
    const invoices = getRecoil(invoiceState);
    const invoicesJson = JSON.stringify(invoices, null, 4);
    fs.writeFileSync(this.INVOICES_FILE, invoicesJson);

    // Residents
    const residents = getRecoil(residentState);
    const residentsJson = JSON.stringify(residents, null, 4);
    fs.writeFileSync(this.RESIDENTS_FILE, residentsJson);
  }
}

export default SaveStatePersistenceManager;
