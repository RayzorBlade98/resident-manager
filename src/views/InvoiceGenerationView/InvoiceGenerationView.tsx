import React, { useState } from 'react';
// eslint-disable-next-line max-len
import GenericStepper from '_/components/GenericComponents/GenericStepper/GenericStepper';
// eslint-disable-next-line max-len
import IncidentalsSelection from '_/components/IncidentalsSelection/IncidentalsSelection';

function InvoiceGenerationView() {
  const [stepsFinished, setStepsFinished] = useState<boolean>(false);

  return (
    <div>
      {!stepsFinished && (
        <GenericStepper
          steps={['Schritt 1', 'Schritt 2', 'Schritt 3']}
          onFinished={() => {
            setStepsFinished(true);
          }}
        >
          <div>Schritt 1</div>
          <div>
            <IncidentalsSelection />
          </div>
          <div>Schritt 3</div>
        </GenericStepper>
      )}
      {stepsFinished && <p>Fertig</p>}
    </div>
  );
}

export default InvoiceGenerationView;
