import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { residentViewSelectedResidentState } from '_/views/ResidentView/states/resident_view_state';
import '_/extensions/date/date.extension';

/**
 * Table that displays all water reading informations
 */
function WaterReadingTable(): JSX.Element {
  const waterReadings = useRecoilValue(
    residentViewSelectedResidentState,
  )?.waterMeterReadings;

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
          {waterReadings?.map((reading) => (
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

export default WaterReadingTable;
