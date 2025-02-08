import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import EditResidentModal from '../EditResidentModal/EditResidentModal';
import { Resident } from '_/models/resident/resident';

type ResidentMenuProps = {
  resident: Resident;
};

/**
 * Menu that provides context action for the resident
 */
export function ResidentMenu(props: ResidentMenuProps): JSX.Element {
  const [menuAnchor, setMenuAnchor] = useState<SVGSVGElement | null>();
  const [showEditModal, setShowEditModal] = useState(false);

  function onMenuItemClicked(callback: () => void) {
    setMenuAnchor(null);
    callback();
  }

  return (
    <>
      <MoreHorizIcon
        fontSize="large"
        sx={{ cursor: 'pointer' }}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
      />
      <Menu
        anchorEl={menuAnchor}
        open={menuAnchor !== null}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => onMenuItemClicked(() => setShowEditModal(true))}
        >
          <EditIcon sx={{ marginRight: '15px' }} />
          Bearbeiten
        </MenuItem>
      </Menu>
      <EditResidentModal
        resident={props.resident}
        showModal={showEditModal}
        onCloseModal={() => setShowEditModal(false)}
      />
    </>
  );
}
