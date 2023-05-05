import { Button } from '@mui/material';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import currentViewState, { View } from '_/states/viewStates/current_view_state';

function MainView(): JSX.Element {
  const setCurrentView = useSetRecoilState(currentViewState);
  return (
    <>
      <Button variant="contained" onClick={() => setCurrentView(View.Resident)}>
        Bewohner
      </Button>
      <Button
        variant="contained"
        onClick={() => setCurrentView(View.Incidentals)}
      >
        Nebenkosten
      </Button>
      <Button variant="contained" onClick={() => setCurrentView(View.Invoice)}>
        Nebenkostenabrechnung
      </Button>
    </>
  );
}

export default MainView;
