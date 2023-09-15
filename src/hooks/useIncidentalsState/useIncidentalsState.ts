import { useRecoilState } from 'recoil';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import incidentalsState from '_/states/incidentals/incidentals.state';

/**
 * Hook that returns the incidentals state and utility functions to modify it
 */
function useIncidentalsState() {
  const [incidentals, setIncidentals] = useRecoilState(incidentalsState);
  const ongoingIncidentals = incidentals.ongoingIncidentals;
  const oneTimeIncidentals = incidentals.oneTimeIncidentals;

  function addOngoingIncidentals(_incidentals: OngoingIncidentals): void {
    setIncidentals((state) => ({
      ...state,
      ongoingIncidentals: [...state.ongoingIncidentals, _incidentals],
    }));
  }

  function addOneTimeIncidentals(_incidentals: OneTimeIncidentals): void {
    setIncidentals((state) => ({
      ...state,
      oneTimeIncidentals: [...state.oneTimeIncidentals, _incidentals],
    }));
  }

  return {
    /**
     * All incidentals
     */
    incidentals,

    /**
     * All ongoing incidentals
     */
    ongoingIncidentals,

    /**
     * All one time incidentals
     */
    oneTimeIncidentals,

    /**
     * Adds new ongoing incidentals to the incidentals state
     */
    addOngoingIncidentals,

    /**
     * Adds new one time incidentals to the incidentals state
     */
    addOneTimeIncidentals,
  };
}

export default useIncidentalsState;
