import { Button } from '@mui/material';
import React, { useState } from 'react';
import DocumentTable from './DocumentTable/DocumentTable';
import GenerateContractModal from './GenerateContractModal/GenerateContractModal';
import UploadDocumentModal from './UploadDocumentModal/UploadDocumentModal';

/**
 * Component that displays all documents linked to a resident
 */
function DocumentInformation() {
  const [showContractGenerationModal, setShowContractGenerationModal] = useState(false);
  const [showUploadDocumentModal, setShowUploadDocumentModal] = useState(false);

  return (
    <>
      <GenerateContractModal
        show={showContractGenerationModal}
        onClose={() => setShowContractGenerationModal(false)}
      />
      <UploadDocumentModal
        show={showUploadDocumentModal}
        onCloseModal={() => setShowUploadDocumentModal(false)}
      />
      <Button onClick={() => setShowContractGenerationModal(true)}>
        Vertrag generieren
      </Button>
      <Button onClick={() => setShowUploadDocumentModal(true)}>
        Dokument hinzufügen
      </Button>
      <DocumentTable />
    </>
  );
}

export default DocumentInformation;
