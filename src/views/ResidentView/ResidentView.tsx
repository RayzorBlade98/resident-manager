import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import ResidentInformation from './ResidentInformation/ResidentInformation';
import ResidentList from './ResidentList/ResidentList';
// eslint-disable-next-line max-len
import { residentViewSelectedResidentState } from './states/resident_view_state';
import styles from './styles';
import residentState from '_/states/saveStates/resident_state';

function ResidentView(): JSX.Element {
  const residents = useRecoilValue(residentState);
  const [selectedResident, setSelectedResident] = useRecoilState(
    residentViewSelectedResidentState,
  );

  useEffect(() => {
    // Select first resident on start
    if (residents.length > 0) {
      setSelectedResident(residents[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div {...styles.residentView}>
      <ResidentList />
      {selectedResident && <ResidentInformation />}
    </div>
  );
}

export default ResidentView;
