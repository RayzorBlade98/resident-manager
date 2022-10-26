import React from 'react';
import { useRecoilValue } from 'recoil';
import IncidentalsTable from '_/components/IncidentalsTable/IncidentalsTable';
import IncidentalsState, {
  incidentalsState,
} from '_/states/saveStates/incidentals_state';

function IncidentalsView(): JSX.Element {
  const incidentals = useRecoilValue<IncidentalsState>(incidentalsState);

  return (
    <IncidentalsTable incidentals={incidentals.mandatoryIncidentals} />
  );
}

export default IncidentalsView;
