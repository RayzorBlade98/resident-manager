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
import IncidentalsParser from './parsers/incidentals/incidentals.parser';
import InvoiceParser from './parsers/invoice/invoice.parser';
import StandardParser from './parsers/parser';
import ResidentParser from './parsers/resident/resident.parser';
import WaterCostsParser from './parsers/waterCosts.parser';
import WaterCosts from '_/models/incidentals/WaterCosts';
import Property from '_/models/property/property';
import { RentInformation } from '_/models/resident/rent';
import { Resident } from '_/models/resident/resident';
import { propertyState } from '_/states/property/property.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';

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

  public static PROPERTY_FILE = path.join(
    PersistenceUtils.OUTPUT_DIRECTORY,
    'property.json',
  );

  public static WATER_COSTS_FILE = path.join(
    PersistenceUtils.OUTPUT_DIRECTORY,
    'waterCosts.json',
  );

  /**
   * Imports all save states
   */
  public static importSaveStates(): void {
    // Incidentals
    if (fs.existsSync(this.INCIDENTALS_FILE)) {
      const json = fs.readFileSync(this.INCIDENTALS_FILE).toString();
      const loadedIncidentals = JSON.parse(
        json,
        IncidentalsParser.reviver,
      ) as IncidentalsState; // eslint-disable-line max-len
      setRecoil(incidentalsState, loadedIncidentals);
    }

    // Invoices
    if (fs.existsSync(this.INVOICES_FILE)) {
      const json = fs.readFileSync(this.INVOICES_FILE).toString();
      const loadedInvoices = JSON.parse(
        json,
        InvoiceParser.reviver,
      ) as InvoiceState; // eslint-disable-line max-len
      setRecoil(invoiceState, loadedInvoices);
    }

    // Residents
    if (fs.existsSync(this.RESIDENTS_FILE)) {
      const json = fs.readFileSync(this.RESIDENTS_FILE).toString();
      const loadedResidents = JSON.parse(
        json,
        ResidentParser.reviver,
      ) as ResidentState; // eslint-disable-line max-len

      // Add missing months to the rent information
      loadedResidents
        .map<RentInformation[]>((r: Resident) => r.rentInformation)
        .forEach((r: RentInformation[]) => {
          RentInformationUtils.addMissingMonths(r);
        });

      setRecoil(residentState, loadedResidents);
    }

    // Property
    if (fs.existsSync(this.PROPERTY_FILE)) {
      const json = fs.readFileSync(this.PROPERTY_FILE).toString();
      const loadedProperty = JSON.parse(
        json,
        StandardParser.reviver,
      ) as Property; // eslint-disable-line max-len
      setRecoil(propertyState, loadedProperty);
    }

    // Water costs
    if (fs.existsSync(this.WATER_COSTS_FILE)) {
      const json = fs.readFileSync(this.WATER_COSTS_FILE).toString();
      const loadedWaterCosts = JSON.parse(
        json,
        WaterCostsParser.reviver,
      ) as WaterCosts; // eslint-disable-line max-len
      setRecoil(waterCostsState, loadedWaterCosts);
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

    // Property
    const property = getRecoil(propertyState);
    if (property) {
      const propertyJson = JSON.stringify(property, null, 4);
      fs.writeFileSync(this.PROPERTY_FILE, propertyJson);
    }

    // Water costs
    const waterCosts = getRecoil(waterCostsState);
    const waterCostsJson = JSON.stringify(waterCosts, null, 4);
    fs.writeFileSync(this.WATER_COSTS_FILE, waterCostsJson);
  }
}

export default PersistenceUtils;
