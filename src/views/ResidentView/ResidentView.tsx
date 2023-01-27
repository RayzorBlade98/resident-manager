import React, { useState } from 'react';
import ResidentList from '_/components/ResidentList/ResidentList';
import ResidentInformation from '_/components/ResidentInformation/ResidentInformation';
import styles from './styles';
import { useRecoilValue } from 'recoil';
import residentState, {
  ResidentState,
} from '_/states/saveStates/resident_state';
import { Resident } from '_/types/resident';

function ResidentView(): JSX.Element {
  const residents = useRecoilValue<ResidentState>(residentState);
  const [selectedResidentId, setSelectedResidentId] = useState<string>(
    residents[0].id,
  );

  const selectedResident: Resident = residents.find(
    (resident: Resident) => resident.id === selectedResidentId,
  )!;

  return (
    <div {...styles.residentView}>
      <ResidentList
        residents={residents}
        selectedResident={selectedResident}
        onSelectResident={(resident: Resident) => {
          setSelectedResidentId(resident.id);
        }}
        containerStyle={styles.residentListContainer}
      />
      <ResidentInformation
        resident={selectedResident}
        containerStyle={styles.residentInformationContainer}
      />
    </div>
  );
}

export default ResidentView;
