import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import styles from './styles';
// eslint-disable-next-line max-len
import ResidentInformation from '_/components/ResidentInformation/ResidentInformation';
import ResidentList from '_/components/ResidentList/ResidentList';
import residentState, {
  ResidentState,
} from '_/states/saveStates/resident_state';
import { Resident } from '_/types/resident';

function ResidentView(): JSX.Element {
  const residents = useRecoilValue<ResidentState>(residentState);
  const [selectedResidentId, setSelectedResidentId] = useState<string>(
    residents[0].id,
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
        style={styles.residentListContainer}
      />
      <ResidentInformation
        resident={selectedResident}
        containerStyle={styles.residentInformationContainer}
      />
    </div>
  );
}

export default ResidentView;
