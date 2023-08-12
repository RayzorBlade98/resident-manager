import React from 'react';
import { useRecoilValue } from 'recoil';
import { residentViewSelectedResidentState } from '../../states/resident_view_state';
import RentInformationTable from '_/components/shared/RentInformationTable/RentInformationTable';

/**
 * Component that displays rent information about a resident
 */
function RentInformation(): JSX.Element | null {
  const resident = useRecoilValue(residentViewSelectedResidentState);
  return resident ? <RentInformationTable resident={resident} /> : null;
}

export default RentInformation;
