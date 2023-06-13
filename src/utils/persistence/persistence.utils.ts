import fs from 'fs';
import path from 'path';
import { getRecoil, setRecoil } from 'recoil-nexus';
import incidentalsState, {
  IncidentalsState,
} from '../../states/incidentals/incidentals.state';
import invoiceState, { InvoiceState } from '../../states/invoice/invoice.state';
import residentState, {
  ResidentState,
} from '../../states/resident/resident.state';
import RentInformationUtils from '../rent/rent.utils';
import InvoiceParser from './parsers/invoice/invoice.parser';
import StandardParser from './parsers/parser';
import ResidentParser from './parsers/resident/resident.parser';
import { RentInformation } from '_/models/resident/rent';
import { Resident } from '_/models/resident/resident';

/**
 * Class that provides functionality to handle save state persistence
 */
abstract class PersistenceUtils {
  public static OUTPUT_DIRECTORY = path.join(__dirname, 'data');

  public static INCIDENTALS_FILE = path.join(
    PersistenceUtils.OUTPUT_DIRECTORY,
    'incidentals.json',
  );

  public static INVOICES_FILE = path.join(
    PersistenceUtils.OUTPUT_DIRECTORY,
    'invoices.json',
  );

  public static RESIDENTS_FILE = path.join(
    PersistenceUtils.OUTPUT_DIRECTORY,
    'residents.json',
  );

  /**
   * Imports all save states
   */
  public static importSaveStates(): void {
    // Incidentals
    if (fs.existsSync(this.INCIDENTALS_FILE)) {
      const json = fs.readFileSync(this.INCIDENTALS_FILE).toString();
      const loadedIncidentals = JSON.parse(json, StandardParser.reviver) as IncidentalsState; // eslint-disable-line max-len
      setRecoil(incidentalsState, loadedIncidentals);
    }

    // Invoices
    if (fs.existsSync(this.INVOICES_FILE)) {
      const json = fs.readFileSync(this.INVOICES_FILE).toString();
      const loadedInvoices = JSON.parse(json, InvoiceParser.reviver) as InvoiceState; // eslint-disable-line max-len
      setRecoil(invoiceState, loadedInvoices);
    }

    // Residents
    if (fs.existsSync(this.RESIDENTS_FILE)) {
      const json = fs.readFileSync(this.RESIDENTS_FILE).toString();
      const loadedResidents = JSON.parse(json, ResidentParser.reviver) as ResidentState; // eslint-disable-line max-len

      // Add missing months to the rent information
      loadedResidents
        .map<RentInformation[]>((r: Resident) => r.rentInformation)
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

export default PersistenceUtils;
