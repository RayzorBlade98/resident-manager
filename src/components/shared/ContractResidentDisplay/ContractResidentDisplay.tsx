import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Chip, FormHelperText } from '@mui/material';
import React, { useState } from 'react';
import { convertNameToString } from '../../../utils/name/name.utils';
import CreateContractResidentModal from '../CreateContractResidentModal/CreateContractResidentModal';
import { ContractResident } from '_/models/resident/contractResident';

interface ContractResidentDisplayProps {
  /**
   * Residents that should be displayed
   */
  contractResidents: ContractResident[] | undefined;

  /**
   * Callback when a new resident is created
   * @param resident newly created contract resident
   */
  onSubmitContractResident: (resident: ContractResident) => void;

  /**
   * Error message that should be displayed
   */
  error: string | undefined;
}

const styles = {
  contractResidentHeadline: {
    marginBottom: '15px',
  },
  addContractResidentButton: {
    cursor: 'pointer',
  },
  contractResidentChip: {
    marginLeft: '10px',
  },
};

function ContractResidentDisplay(props: ContractResidentDisplayProps) {
  const [showContractResidentModal, setShowContractResidentModal] = useState(false);

  return (
    <>
      <CreateContractResidentModal
        show={showContractResidentModal}
        onClose={() => setShowContractResidentModal(false)}
        onSubmit={props.onSubmitContractResident}
      />
      <h5 style={styles.contractResidentHeadline}>Mieter im Vertrag</h5>
      {props.error && <FormHelperText error>{props.error}</FormHelperText>}
      <AddCircleOutlineIcon
        onClick={() => setShowContractResidentModal(true)}
        sx={styles.addContractResidentButton}
      />
      {props.contractResidents?.map((r) => (
        <Chip
          label={convertNameToString(r.name, { includeSalutation: true })}
          variant="outlined"
          sx={styles.contractResidentChip}
        />
      ))}
    </>
  );
}

export default ContractResidentDisplay;
