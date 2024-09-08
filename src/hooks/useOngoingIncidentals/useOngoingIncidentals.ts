import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { OngoingIncidentals, OngoingIncidentalsCost } from '_/models/incidentals/ongoing_incidentals';
import { ongoingIncidentalsState } from '_/states/incidentals/incidentals.state';

/**
 * Hook that returns the ongoing incidenals matching the id and utility functions to modify it
 * @param incidentalsId id of the ongoing incidentals that should be returned
 */
export function useOngoingIncidentals(incidentalsId: string) {
  const setIncidentals = useSetRecoilState(ongoingIncidentalsState);

  /**
   * Applies the specified changes to the selected incidentals and updates the state
   */
  const applyChangesToIncidentals = useCallback(
    (
      changeFunction: (incidentals: OngoingIncidentals) => OngoingIncidentals,
    ) => {
      setIncidentals((state) => state.map((i) => (i.id === incidentalsId ? changeFunction(i) : i)));
    },
    [incidentalsId, setIncidentals],
  );

  const addPayment = useCallback(
    (payment: OngoingIncidentalsCost) => {
      applyChangesToIncidentals((i) => ({
        ...i,
        costs: [...i.costs, payment],
      }));
    },
    [applyChangesToIncidentals],
  );

  return {
    /**
     * Function to add a payment to the selcted incidentals
     */
    addPayment,
  };
}
