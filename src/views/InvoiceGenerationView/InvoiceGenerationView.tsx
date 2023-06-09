import { Box } from '@mui/material';
import React, { useState } from 'react';
import GenericStepper from '_/components/generic/GenericStepper/GenericStepper';
import IncidentalsSelection from '_/views/InvoiceGenerationView/IncidentalsSelection/IncidentalsSelection';

const styles = {
  view: {
    height: '100%',
  },
};

function InvoiceGenerationView() {
  const [stepsFinished, setStepsFinished] = useState<boolean>(false);

  return (
    <Box sx={styles.view}>
      {!stepsFinished && (
        <GenericStepper
          steps={['Schritt 1', 'Schritt 2', 'Schritt 3']}
          onFinished={() => {
            setStepsFinished(true);
          }}
        >
          <div>Schritt 1</div>
          <IncidentalsSelection />
          <div>Schritt 3</div>
        </GenericStepper>
      )}
      {stepsFinished && <p>Fertig</p>}
    </Box>
  );
}

export default InvoiceGenerationView;
