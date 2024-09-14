import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import View from '../../routes';

function MainView(): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      <Button variant="contained" onClick={() => navigate(View.Resident)}>
        Bewohner
      </Button>
      <Button variant="contained" onClick={() => navigate(View.Incidentals)}>
        Nebenkosten
      </Button>
      <Button variant="contained" onClick={() => navigate(View.Invoice)} hidden>
        Nebenkostenabrechnung
      </Button>
      <Button variant="contained" onClick={() => navigate(View.Property)}>
        Immobilie
      </Button>
    </>
  );
}

export default MainView;
