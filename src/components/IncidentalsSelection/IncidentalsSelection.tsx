import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import styles from './styles';
import { incidentalsState } from '_/states/saveStates/incidentals_state';
import {
  addSelectedIncidentals,
  removeSelectedIncidentals,
  selectedInvoiceIncidentalsState,
} from '_/states/viewStates/invoice_generation_state';
import { Incidentals } from '_/types/incidentals';

/**
 * Component so select incidentals that should be included to the invoice
 */
function IncidentalsSelection(): JSX.Element {
  const incidentals = useRecoilValue(incidentalsState);
  const selectedIncidentals = useRecoilValue(selectedInvoiceIncidentalsState);

  const handleToggle = (_incidentals: Incidentals) => () => {
    if (selectedIncidentals.find((i) => i.id === _incidentals.id)) {
      removeSelectedIncidentals(_incidentals);
    } else {
      addSelectedIncidentals(_incidentals);
    }
  };

  return (
    <List sx={styles.list}>
      {incidentals.map((_incidentals) => {
        const labelId = `checkbox-list-label-${_incidentals.id}`;

        return (
          <ListItem key={_incidentals.id} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(_incidentals)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={
                    !!selectedIncidentals.find((i) => i.id === _incidentals.id)
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={_incidentals.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default IncidentalsSelection;
