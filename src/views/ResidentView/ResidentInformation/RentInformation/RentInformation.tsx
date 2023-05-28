import React from 'react';
import AddRentPaymentModal from './AddRentPaymentModal/AddRentPaymentModal';
import RentInformationTable from './RentInformationTable/RentInformationTable';

/**
 * Component that displays rent information about a resident
 */
function RentInformation(): JSX.Element {
  return (
    <>
      <AddRentPaymentModal />
      <RentInformationTable />
    </>
  );
}

export default RentInformation;
