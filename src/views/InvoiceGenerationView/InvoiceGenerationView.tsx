import React, { useState } from 'react';
// eslint-disable-next-line max-len
import GenericStepper from '_/components/GenericComponents/GenericStepper/GenericStepper';

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
          <div>Schritt 2</div>
          <div>Schritt 3</div>
        </GenericStepper>
      )}
      {stepsFinished && <p>Fertig</p>}
    </div>
  );
}

export default InvoiceGenerationView;
