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
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import { ongoingIncidentalsSelector } from '_/states/incidentals/incidentals.state';
import invoiceGenerationViewState, {
  addSelectedOngoingIncidentals,
  removeSelectedOngoingIncidentals,
} from '_/views/InvoiceGenerationView/states/invoice_generation_view_state';

/**
 * Component so select ongoing incidentals that should be included to the invoice
 */
function OngoingIncidentalsSelection(): JSX.Element {
  const incidentals = useRecoilValue(ongoingIncidentalsSelector);
  const selectedIncidentals = useRecoilValue(invoiceGenerationViewState).selectedOngoingIncidentals; // eslint-disable-line max-len

  const handleToggle = (_incidentals: OngoingIncidentals) => () => {
    if (selectedIncidentals.find((i) => i.id === _incidentals.id)) {
      removeSelectedOngoingIncidentals(_incidentals);
    } else {
      addSelectedOngoingIncidentals(_incidentals);
    }
  };

  return (
    <List>
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

export default OngoingIncidentalsSelection;
