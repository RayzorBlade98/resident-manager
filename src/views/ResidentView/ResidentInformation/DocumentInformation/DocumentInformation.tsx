import { Button } from '@mui/material';
import React, { useState } from 'react';
import GenerateContractModal from './GenerateContractModal/GenerateContractModal';

/**
 * Component that displays all documents linked to a resident
 */
function DocumentInformation() {
  const [showContractGenerationModal, setShowContractGenerationModal] = useState(false);

  return (
    <>
      <GenerateContractModal
        show={showContractGenerationModal}
        onClose={() => setShowContractGenerationModal(false)}
      />
      <Button onClick={() => setShowContractGenerationModal(true)}>
        Vertrag generieren
      </Button>
    </>
  );
}

export default DocumentInformation;
