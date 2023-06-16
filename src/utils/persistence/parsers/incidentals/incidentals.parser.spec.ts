/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, guard-for-in */

import IncidentalsParser from './incidentals.parser';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';

describe('IncidentalsParser', () => {
  describe('reviver', () => {
    test('should revive ongoing incidentals correctly', () => {
      // Arrange
      const incidentals = new OngoingIncidentalsBuilder().build();
      const fromJson = JSON.parse(JSON.stringify(incidentals));

      // Act
      const revived: any = {};
      for (const k in fromJson) {
        revived[k] = IncidentalsParser.reviver(k, fromJson[k]);
      }

      // Assert
      expect(revived).toEqual(incidentals);
    });

    test('should revive one-time incidentals correctly', () => {
      // Arrange
      const incidentals = new OneTimeIncidentalsBuilder().build();
      const fromJson = JSON.parse(JSON.stringify(incidentals));

      // Act
      const revived: any = {};
      for (const k in fromJson) {
        revived[k] = IncidentalsParser.reviver(k, fromJson[k]);
      }

      // Assert
      expect(revived).toEqual(incidentals);
    });
  });
});
