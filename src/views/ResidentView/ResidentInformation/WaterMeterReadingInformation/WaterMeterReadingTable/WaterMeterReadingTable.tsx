import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import addWaterMeterReadingState from '_/components/shared/AddWaterMeterReadingModal/states/add_water_reading_state';
import { residentViewSelectedResidentState } from '_/views/ResidentView/states/resident_view_state';
import '_/extensions/date/date.extension';

const styles = {
  addWaterMeterReadingCell: {
    ':hover': {
      cursor: 'pointer',
    },
  },
};

/**
 * Table that displays all water reading informations
 */
function WaterMeterReadingTable(): JSX.Element {
  const resident = useRecoilValue(residentViewSelectedResidentState);
  const setAddWaterMeterReadingStateState = useSetRecoilState(
    addWaterMeterReadingState,
  );

  const onAddWaterMeterReading = () => {
    setAddWaterMeterReadingStateState((state) => ({
      ...state,
      showModal: true,
      residentId: resident?.id,
    }));
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ablesedatum</TableCell>
            <TableCell>Zählerstand</TableCell>
            <TableCell>Aktionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={5}
              onClick={onAddWaterMeterReading}
              align="center"
              sx={styles.addWaterMeterReadingCell}
            >
              Neuer Wasserzählerstand
            </TableCell>
          </TableRow>
          {resident?.waterMeterReadings?.map((reading) => (
            <TableRow
              key={reading.readingDate.toPreferredString()}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{reading.readingDate.toPreferredString()}</TableCell>
              <TableCell>{reading.waterMeterCount}</TableCell>
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WaterMeterReadingTable;
