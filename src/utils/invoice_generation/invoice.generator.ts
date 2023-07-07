import { v4 as uuid } from 'uuid';
import {
  DeductionType,
  OngoingIncidentals,
} from '../../models/incidentals/ongoing_incidentals';
import MonthYear from '_/extensions/date/month_year.extension';
import { Invoice } from '_/models/invoice/invoice';
import Property from '_/models/property/property';
import { Resident } from '_/models/resident/resident';

/**
 * Arguments for the invoice generation
 */
export interface InvoiceGenerationArguments {
  /**
   * Start of the invoice
   */
  start: MonthYear;

  /**
   * End of the invoice
   */
  end: MonthYear;

  /**
   * List of all residents
   */
  residents: Resident[];

  /**
   * Ongoing incidentals that should be included into the invoice
   */
  includedOngoingIncidentals: OngoingIncidentals[];

  /**
   * Property of the incidentals
   */
  property: Property;
}

export default class InvoiceGenerator {
  /**
   * Generated invoice
   */
  private invoice: Invoice;

  /**
   * Timespan of the invoice
   */
  private timespan: MonthYear[];

  /**
   * @param args Arguments for the invoice generation
   */
  constructor(private args: InvoiceGenerationArguments) {
    args.residents = args.residents.filter(
      (r) => args.start <= r.invoiceStart && r.invoiceStart <= args.end,
    );
    this.timespan = MonthYear.timespan(args.start, args.end);

    this.invoice = {
      id: uuid(),
      start: args.start,
      end: args.end,
      ongoingIncidentalsInformation: {},
      residentInformation: {},
    };
    args.residents.forEach((r) => {
      this.invoice.residentInformation[r.id] = {
        residentId: r.id,
        ongoingIncidentalsCosts: {},
      };
    });
  }

  /**
   * Generates the complete invoice
   * @returns generated invoice
   */
  public generateInvoice(): Invoice {
    this.calculateOngoingIncidentals();
    return this.invoice;
  }

  /**
   * Calculates the invoice for the ongoing incidentals
   */
  private calculateOngoingIncidentals(): void {
    for (const incidentals of this.args.includedOngoingIncidentals) {
      let totalCost = 0;
      for (const month of this.timespan) {
        let cost = incidentals.costs.find((c) => c.date <= month)?.cost;
        if (!cost) {
          continue;
        }
        cost /= incidentals.invoiceInterval;

        totalCost += cost;

        const residents = this.args.residents.filter(
          (r) => r.invoiceStart <= month,
        );

        let costPerUnit;
        switch (incidentals.deductionType) {
          case DeductionType.PerApartment:
            costPerUnit = cost / this.args.property.numberOfApartments;
            break;
          case DeductionType.PerResident: {
            const numberOfResidents = residents
              .map((r) => r.numberOfResidents)
              .reduce((all, n) => all + n);
            costPerUnit = cost / numberOfResidents;
            break;
          }
          /* istanbul ignore next */
          default:
            throw new Error(
              `Missing implementation for deduction type ${incidentals.deductionType}`, // eslint-disable-line max-len
            );
        }

        for (const resident of residents) {
          const incidentalsCost = this.invoice.residentInformation[resident.id]
            .ongoingIncidentalsCosts;
          if (!(incidentals.id in incidentalsCost)) {
            incidentalsCost[incidentals.id] = 0;
          }

          let numberOfUnits;
          switch (incidentals.deductionType) {
            case DeductionType.PerApartment:
              numberOfUnits = 1;
              break;
            case DeductionType.PerResident:
              numberOfUnits = resident.numberOfResidents;
              break;
            /* istanbul ignore next */
            default:
              throw new Error(
                `Missing implementation for deduction type ${incidentals.deductionType}`, // eslint-disable-line max-len
              );
          }

          incidentalsCost[incidentals.id] += costPerUnit * numberOfUnits;
        }
      }

      this.invoice.ongoingIncidentalsInformation[incidentals.id] = {
        incidentalsId: incidentals.id,
        name: incidentals.name,
        deductionType: incidentals.deductionType,
        totalCost: Math.ceil(totalCost),
      };
    }

    // Round resident costs
    for (const resident of this.args.residents) {
      const residentInformation = this.invoice.residentInformation[resident.id];
      for (const incidentals of this.args.includedOngoingIncidentals) {
        const incidentalsCosts = residentInformation.ongoingIncidentalsCosts;
        const cost = incidentalsCosts[incidentals.id];
        if (cost !== undefined) {
          incidentalsCosts[incidentals.id] = Math.ceil(cost);
        }
      }
    }
  }
}
