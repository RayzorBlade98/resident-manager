import React from 'react';
import CreateIncidentalsModal from './CreateIncidentalsModal/CreateIncidentalsModal';
import IncidentalsTable from '_/views/IncidentalsView/IncidentalsTable/IncidentalsTable';

function IncidentalsView(): JSX.Element {
  return (
    <>
      <CreateIncidentalsModal />
      <IncidentalsTable />
    </>
  );
}

export default IncidentalsView;
