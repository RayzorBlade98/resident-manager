import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt1';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { convertNameToString } from '../../../utils/name/name.utils';
import { residentViewSelectedResidentState } from '../states/resident_view_state';
import { Resident } from '_/models/resident/resident';
import residentState from '_/states/resident/resident.state';
import CreateResidentModal from '_/views/ResidentView/ResidentList/CreateResidentModal/CreateResidentModal';

const styles = {
  box: {
    height: '100%',
  },
  list: {
    height: '100%',
    overflowY: 'auto',
    padding: 0,
    borderRight: 1,
    borderColor: 'divider',
  },
  listItemButton: {
    height: '11.028%',
  },
};

/**
 * Component that displays a list of provided residents
 */
function ResidentList(): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const residents = useRecoilValue(residentState);
  const [selectedResident, setSelectedResident] = useRecoilState(
    residentViewSelectedResidentState,
  );

  return (
    <>
      <CreateResidentModal
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
      />
      <Box sx={styles.box}>
        <List sx={styles.list}>
          <ListItemButton
            onClick={() => setShowModal(true)}
            sx={styles.listItemButton}
          >
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Neuer Mieter" />
          </ListItemButton>
          <Divider />
          {residents.map((resident: Resident, i) => (
            <>
              <ListItemButton
                selected={resident === selectedResident}
                onClick={() => setSelectedResident(resident)}
                sx={styles.listItemButton}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={convertNameToString(resident.name)} />
              </ListItemButton>
              {i !== residents.length - 1 && <Divider />}
            </>
          ))}
        </List>
      </Box>
    </>
  );
}

export default ResidentList;
