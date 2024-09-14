import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { oneTimeIncidentalsState } from '_/states/incidentals/incidentals.state';

/**
 * Hook that returns the one time incidenals matching the id and utility functions to modify it
 * @param incidentalsId id of the one time incidentals that should be returned
 */
export function useOneTimeIncidentals(incidentalsId: string) {
  const setIncidentals = useSetRecoilState(oneTimeIncidentalsState);

  /**
   * Applies the specified changes to the selected incidentals and updates the state
   */
  const applyChangesToIncidentals = useCallback(
    (
      changeFunction: (incidentals: OneTimeIncidentals) => OneTimeIncidentals,
    ) => {
      setIncidentals((state) => state.map((i) => (i.id === incidentalsId ? changeFunction(i) : i)));
    },
    [incidentalsId, setIncidentals],
  );

  const addPayment = useCallback(
    (payment: {
      paymentDate: Date;
      bankTransferDocumentId: string | undefined;
    }) => {
      applyChangesToIncidentals((i) => ({
        ...i,
        ...payment,
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
