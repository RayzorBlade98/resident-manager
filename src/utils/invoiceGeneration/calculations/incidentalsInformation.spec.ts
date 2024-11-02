import { invoiceGenerationArgs } from '../../../test/data/invoiceGeneration/arguments';
import { expectedInvoice } from '../../../test/data/invoiceGeneration/expected';
import {
  calculateOneTimeIncidentalsInformation,
  calculateOngoingIncidentalsInformation,
} from './incidentalsInformation';

describe('calculateOngoingIncidentalsInformation', () => {
  it('should return correct ongoing incidentals information', () => {
    // Act
    const incidentals = calculateOngoingIncidentalsInformation(
      invoiceGenerationArgs,
    );

    // Assert
    expect(incidentals).toEqual(expectedInvoice.ongoingIncidentalsInformation);
  });
});

describe('calculateOneTimeIncidentalsInformation', () => {
  it('should return correct one time incidentals information', () => {
    // Act
    const incidentals = calculateOneTimeIncidentalsInformation(
      invoiceGenerationArgs,
    );

    // Assert
    expect(incidentals).toEqual(expectedInvoice.oneTimeIncidentalsInformation);
  });
});
