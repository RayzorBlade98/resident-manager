import { invoiceGenerationArgs } from '../../../test/data/invoiceGeneration/arguments';
import { expectedInvoice } from '../../../test/data/invoiceGeneration/expected';
import { includedResidents } from '../../../test/data/invoiceGeneration/residents';
import { calculateResidentIncidentals } from './residentIncidentals';

describe('calculateResidentIncidentals', () => {
  it.each(
    includedResidents.map((r) => [
      r.id,
      r,
      expectedInvoice.residentInformation[r.id].ongoingIncidentalsCosts,
    ]),
  )(
    'should return correct ongoing incidentals for resident %s',
    (_residentId, resident, expectedIncidentals) => {
      // Act
      const individualIncidentals = calculateResidentIncidentals(
        resident,
        expectedInvoice.ongoingIncidentalsInformation,
        {
          ...invoiceGenerationArgs,
          residents: includedResidents,
        },
      );

      // Assert
      expect(individualIncidentals).toEqual(expectedIncidentals);
    },
  );

  it.each(
    includedResidents.map((r) => [
      r.id,
      r,
      expectedInvoice.residentInformation[r.id].oneTimeIncidentalsCosts,
    ]),
  )(
    'should return correct onetime incidentals for resident %s',
    (_residentId, resident, expectedIncidentals) => {
      // Act
      const individualIncidentals = calculateResidentIncidentals(
        resident,
        expectedInvoice.oneTimeIncidentalsInformation,
        {
          ...invoiceGenerationArgs,
          residents: includedResidents,
        },
      );

      // Assert
      expect(individualIncidentals).toEqual(expectedIncidentals);
    },
  );
});
