import React from 'react';
import WaterMeterReadingTable from './WaterMeterReadingTable/WaterMeterReadingTable';
import AddWaterMeterReadingModal from '_/components/shared/AddWaterMeterReadingModal/AddWaterMeterReadingModal';

/**
 * Component that displays water reading information about a resident
 */
function WaterMeterReadingInformation(): JSX.Element {
  return (
    <>
      <AddWaterMeterReadingModal />
      <WaterMeterReadingTable />
    </>
  );
}

export default WaterMeterReadingInformation;
