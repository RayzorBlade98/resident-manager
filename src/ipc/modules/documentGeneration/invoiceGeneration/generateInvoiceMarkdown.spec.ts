import { generateInvoiceMarkdown } from './generateInvoiceMarkdown';
import MonthYear from '_/extensions/date/month_year.extension';
import { generateAddressHeaderMarkdown } from '_/ipc/utils/documentGeneration/generateAddressHeaderMarkdown/generateAddressHeaderMarkdown';
import { generateDateHeaderMarkdown } from '_/ipc/utils/documentGeneration/generateDateHeaderMarkdown/generateDateHeaderMarkdown';
import { DeductionType } from '_/models/incidentals/deduction_type';
import Invoice from '_/models/invoice/invoice';
import AddressBuilder from '_/test/builders/address.builder';
import IncidentalsInvoiceInformationBuilder from '_/test/builders/incidentals_invoice_information.builder';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import NameBuilder from '_/test/builders/name.builder';
import ResidentInvoiceInformationBuilder from '_/test/builders/residentInvoiceInformation.builder';
import expectedInvoice from '_/test/data/invoiceMarkdownGeneration/expectedInvoice.md';
import Imported from '_/types/Imported';

jest.mock('../../../../assets/templates/invoice/invoiceTemplate.md');
jest.mock(
  '../../../../assets/templates/invoice/incidentalsTableRowTemplate.md',
);
jest.mock(
  '../../../../assets/templates/invoice/individualIncidentalsTableRowTemplate.md',
);
jest.mock(
  '../../../../assets/templates/invoice/individualIncidentalsTemplate.md',
);

jest.mock(
  '../../../utils/documentGeneration/generateDateHeaderMarkdown/generateDateHeaderMarkdown',
  () => ({
    generateDateHeaderMarkdown: jest.fn(),
  }),
);

jest.mock(
  '../../../utils/documentGeneration/generateAddressHeaderMarkdown/generateAddressHeaderMarkdown',
  () => ({
    generateAddressHeaderMarkdown: jest.fn(),
  }),
);

describe('generateInvoiceMarkdown', () => {
  it('should correctly generate the invoice markdown', () => {
    // Arrange
    const residentId = 'resident1';
    const residentNames = [
      new NameBuilder().withFirstName('resident 1 firstname').build(),
      new NameBuilder().withFirstName('resident 2 firstname').build(),
    ];

    const landlordAddress = new AddressBuilder()
      .withCity('Landlord city')
      .build();
    const landlordName = new NameBuilder()
      .withFirstName('Landlord firstname')
      .build();
    const landlord = new LandlordBuilder()
      .withAddress(landlordAddress)
      .withRepresentative(landlordName)
      .build();

    const propertyAddress = new AddressBuilder()
      .withCity('Property city')
      .build();

    const invoice = new InvoiceBuilder()
      .withResident(
        new ResidentInvoiceInformationBuilder()
          .withResidentId(residentId)
          .withNames(residentNames)
          .withOngoingIncidentals('ongoing 1', 1000)
          .withOngoingIncidentals('ongoing 2', 2000)
          .withOneTimeIncidentals('onetime 1', 3000)
          .withOneTimeIncidentals('onetime 2', 4000)
          .withIndividualIncidentals('Individual 1', 5000)
          .withIndividualIncidentals('Individual 2', 6000)
          .withWaterCosts({
            lastWaterMeterCount: 123,
            currentWaterMeterCount: 456,
            waterUsage: 789,
            waterUsageCosts: 33333,
            sewageCosts: 44444,
            monthlyDeductionCosts: 55555,
          })
          .withTotalCosts({
            oneTimeIncidentalsCosts: 10000,
            ongoingIncidentalsCosts: 1111,
            individualIncidentalsCosts: 22222,
            waterCosts: 66666,
            totalIncidentalsCosts: 77777,
            newIncidentalsDeduction: 88888,
            missingRentPayments: 99999,
            totalPaidIncidentals: 111111,
            totalMissingCosts: 222222,
          })
          .build(),
      )
      .withOngoingIncidentals(
        new IncidentalsInvoiceInformationBuilder()
          .withId('ongoing 1')
          .withName('Ongoing 1')
          .withTotalCost(1111)
          .withDeductionType(DeductionType.PerApartment)
          .build(),
      )
      .withOngoingIncidentals(
        new IncidentalsInvoiceInformationBuilder()
          .withId('ongoing 2')
          .withName('Ongoing 2')
          .withTotalCost(2222)
          .withDeductionType(DeductionType.PerResident)
          .build(),
      )
      .withOneTimeIncidentals(
        new IncidentalsInvoiceInformationBuilder()
          .withId('onetime 1')
          .withName('Onetime 1')
          .withTotalCost(3333)
          .withDeductionType(DeductionType.PerApartment)
          .build(),
      )
      .withOneTimeIncidentals(
        new IncidentalsInvoiceInformationBuilder()
          .withId('onetime 2')
          .withName('Onetime 2')
          .withTotalCost(4444)
          .withDeductionType(DeductionType.PerResident)
          .build(),
      )
      .withLandlord(landlord)
      .withPropertyAddress(propertyAddress)
      .withWaterCosts({
        waterUsageCostPerCubicMeter: 111,
        sewageCostPerCubicMeter: 222,
      })
      .withStartAndEnd(new MonthYear(0, 2024), new MonthYear(11, 2024))
      .withNewDeductionStart(new MonthYear(2, 2025))
      .build();

    (generateAddressHeaderMarkdown as jest.Mock).mockReturnValue(
      'My address header',
    );
    (generateDateHeaderMarkdown as jest.Mock).mockReturnValue('My date header');

    // Act
    const invoiceMarkdown = generateInvoiceMarkdown(
      JSON.parse(JSON.stringify(invoice)) as Imported<Invoice>,
      residentId,
    );

    // Assert
    expect(invoiceMarkdown).toBe(expectedInvoice);

    expect(generateAddressHeaderMarkdown).toHaveBeenLastCalledWith(
      {
        names: [landlordName],
        address: landlordAddress,
      },
      { names: residentNames, address: propertyAddress },
    );
    expect(generateAddressHeaderMarkdown).toHaveBeenCalledTimes(1);

    expect(generateDateHeaderMarkdown).toHaveBeenCalledTimes(1);
  });

  it("shouldn't include individual incidentals if they don't exist", () => {
    // Arrange
    const residentId = 'resident1';
    const invoice = new InvoiceBuilder()
      .withResident(
        new ResidentInvoiceInformationBuilder()
          .withResidentId(residentId)
          .build(),
      )
      .build();
    invoice.residentInformation[residentId].individualIncidentalsCosts = {};

    // Act
    const invoiceMarkdown = generateInvoiceMarkdown(
      JSON.parse(JSON.stringify(invoice)) as Imported<Invoice>,
      residentId,
    );

    // Assert
    expect(
      invoiceMarkdown.includes('[individualIncidentalsTemplate]'),
    ).toBeFalsy();
  });
});
