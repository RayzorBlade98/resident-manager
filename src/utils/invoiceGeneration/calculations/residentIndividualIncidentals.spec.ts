import { invoiceGenerationArgs } from '../../../test/data/invoiceGeneration/arguments';
import { expectedInvoice } from '../../../test/data/invoiceGeneration/expected';
import { includedResidents } from '../../../test/data/invoiceGeneration/residents';
import { calculateResidentIndividualIncidentals } from './residentIndividualIncidentals';

describe('calculateResidentIndividualIncidentals', () => {
  it.each(
    includedResidents.map((r) => [
      r.id,
      r,
      expectedInvoice.residentInformation[r.id].individualIncidentalsCosts,
    ]),
  )(
    'should return correct individual incidentals for resident %s',
    (_residentId, resident, expectedIndividualIncidentals) => {
      // Act
      const individualIncidentals = calculateResidentIndividualIncidentals(
        resident,
        invoiceGenerationArgs,
      );

      // Assert
      expect(individualIncidentals).toEqual(expectedIndividualIncidentals);
    },
  );
});
