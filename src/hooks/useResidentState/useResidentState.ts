import { useRecoilState } from 'recoil';
import { Resident } from '_/models/resident/resident';
import residentState from '_/states/resident/resident.state';

/**
 * Hook that returns the resident state and utility functions to modify it
 */
function useResidentState() {
  const [residents, setResidents] = useRecoilState(residentState);

  function addResident(resident: Resident): void {
    setResidents((state) => [...state, resident]);
  }

  return {
    /**
     * List of all residents
     */
    residents,

    /**
     * Adds a new resident to the resident state
     */
    addResident,
  };
}

export default useResidentState;
