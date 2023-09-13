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
import useIncidentalsState from '_/hooks/useIncidentalsState/useIncidentalsState';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import invoiceGenerationViewState, {
  addSelectedOneTimeIncidentals,
  removeSelectedOneTimeIncidentals,
} from '_/views/InvoiceGenerationView/states/invoice_generation_view_state';

/**
 * Component so select ongoing incidentals that should be included to the invoice
 */
function OneTimeIncidentalsSelection(): JSX.Element {
  const { oneTimeIncidentals } = useIncidentalsState();
  const selectedIncidentals = useRecoilValue(
    invoiceGenerationViewState,
  ).selectedOneTimeIncidentals; // eslint-disable-line max-len

  const handleToggle = (_incidentals: OneTimeIncidentals) => () => {
    if (selectedIncidentals.find((i) => i.id === _incidentals.id)) {
      removeSelectedOneTimeIncidentals(_incidentals);
    } else {
      addSelectedOneTimeIncidentals(_incidentals);
    }
  };

  return (
    <List>
      {oneTimeIncidentals.map((_incidentals) => {
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

export default OneTimeIncidentalsSelection;
