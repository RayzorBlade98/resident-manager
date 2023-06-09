import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import ResidentInformation from './ResidentInformation/ResidentInformation';
import ResidentList from './ResidentList/ResidentList';
import { residentViewSelectedResidentState } from './states/resident_view_state';
import residentState from '_/states/resident/resident.state';

const styles = {
  grid: {
    height: '100%',
  },
};

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
    <Grid container sx={styles.grid}>
      <Grid item xs={2} sx={styles.grid}>
        <ResidentList />
      </Grid>
      <Grid item xs={10} sx={styles.grid}>
        {selectedResident && <ResidentInformation />}
      </Grid>
    </Grid>
  );
}

export default ResidentView;
