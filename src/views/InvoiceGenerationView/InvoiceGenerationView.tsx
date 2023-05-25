import React, { useState } from 'react';
import GenericStepper from '_/components/GenericComponents/GenericStepper/GenericStepper';
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
