import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import '_/extensions/date/date.extension';
import AddWaterMeterReadingModal from '_/components/shared/AddWaterMeterReadingModal/AddWaterMeterReadingModal';
import { Resident } from '_/models/resident/resident';
import { residentViewSelectedResidentState } from '_/views/ResidentView/states/resident_view_state';

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
  const [showModal, setShowModal] = useState(false);
  const resident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;

  return (
    <>
      <AddWaterMeterReadingModal
        show={showModal}
        onCloseModal={() => setShowModal(false)}
        residentId={resident.id}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ablesedatum</TableCell>
              <TableCell>Zählerstand</TableCell>
              <TableCell>Abrechnungsstatus</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={5}
                onClick={() => setShowModal(true)}
                align="center"
                sx={styles.addWaterMeterReadingCell}
              >
                Neuer Wasserzählerstand
              </TableCell>
            </TableRow>
            {resident.waterMeterReadings.map((reading) => (
              <TableRow
                key={reading.readingDate.toPreferredString()}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{reading.readingDate.toPreferredString()}</TableCell>
                <TableCell>{reading.waterMeterCount}</TableCell>
                <TableCell>
                  {reading.wasDeductedInInvoice ? (
                    <Tooltip title="Wasserzählerstand wurde abgerechnet" arrow>
                      <CheckCircleOutlineIcon color="success" />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Wasserzählerstand wurde noch nicht abgerechnet"
                      arrow
                    >
                      <HighlightOffIcon color="error" />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default WaterMeterReadingTable;
