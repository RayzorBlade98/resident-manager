import { v4 as uuid } from 'uuid';
import NameBuilder from './name.builder';
import ResidentInvoiceInformation from '_/models/invoice/resident.invoice';
import Name from '_/models/name';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

class ResidentInvoiceInformationBuilder {
  private residentInformation: ResidentInvoiceInformation;

  constructor() {
    this.residentInformation = {
      residentId: uuid(),
      names: [new NameBuilder().build()],
      ongoingIncidentalsCosts: {},
      oneTimeIncidentalsCosts: {},
      individualIncidentalsCosts: {},
      rentPayments: [],
      waterCosts: {
        lastWaterMeterCount: 0,
        currentWaterMeterCount: 0,
        waterUsage: 0,
        waterUsageCosts: 0,
        sewageCosts: 0,
        monthlyDeductionCosts: 0,
      },
      totalCosts: {
        ongoingIncidentalsCosts: 0,
        oneTimeIncidentalsCosts: 0,
        individualIncidentalsCosts: 0,
        totalIncidentalsCosts: 0,
        newIncidentalsDeduction: 0,
        missingRentPayments: 0,
        waterCosts: 0,
        totalCosts: 0,
        totalPaidIncidentals: 0,
        totalMissingCosts: 0,
      },
    };
  }

  public withResidentId(residentId: string): ResidentInvoiceInformationBuilder {
    this.residentInformation.residentId = residentId;
    return this;
  }

  public withOngoingIncidentals(
    incidentalsId: string,
    cost: CurrencyInCents,
  ): ResidentInvoiceInformationBuilder {
    this.residentInformation.ongoingIncidentalsCosts[incidentalsId] = cost;
    return this;
  }

  public withOneTimeIncidentals(
    incidentalsId: string,
    cost: CurrencyInCents,
  ): ResidentInvoiceInformationBuilder {
    this.residentInformation.oneTimeIncidentalsCosts[incidentalsId] = cost;
    return this;
  }

  public withIndividualIncidentals(
    incidentalsName: string,
    cost: CurrencyInCents,
  ): ResidentInvoiceInformationBuilder {
    this.residentInformation.individualIncidentalsCosts[incidentalsName] = cost;
    return this;
  }

  public withTotalCosts(
    totalCosts: Partial<ResidentInvoiceInformation['totalCosts']>,
  ): ResidentInvoiceInformationBuilder {
    this.residentInformation.totalCosts = {
      ...this.residentInformation.totalCosts,
      ...totalCosts,
    };
    return this;
  }

  public withWaterCosts(
    waterCosts: Partial<ResidentInvoiceInformation['waterCosts']>,
  ): ResidentInvoiceInformationBuilder {
    this.residentInformation.waterCosts = {
      ...this.residentInformation.waterCosts,
      ...waterCosts,
    };
    return this;
  }

  public withNewIncidentalsDeduction(
    newIncidentalsDeduction: CurrencyInCents,
  ): ResidentInvoiceInformationBuilder {
    this.residentInformation.totalCosts.newIncidentalsDeduction = newIncidentalsDeduction;
    return this;
  }

  public withNames(names: Name[]): ResidentInvoiceInformationBuilder {
    this.residentInformation.names = names;
    return this;
  }

  public build(): ResidentInvoiceInformation {
    return this.residentInformation;
  }
}

export default ResidentInvoiceInformationBuilder;
