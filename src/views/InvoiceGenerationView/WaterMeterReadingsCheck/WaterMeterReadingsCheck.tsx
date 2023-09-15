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
import React from 'react';
import { useRecoilValue } from 'recoil';
import '_/extensions/date/date.extension';
import { residentsForInvoiceSelector } from '../states/invoice_generation_view_state';
import AddWaterMeterReadingIcon from './AddWaterMeterReadingIcon/AddWaterMeterReadingIcon';
import AddWaterMeterReadingModal from '_/components/shared/AddWaterMeterReadingModal/AddWaterMeterReadingModal';
import WaterMeterReading from '_/models/resident/water_meter_reading';

/**
 * Table thats shows alle the water readings that will be included into the invoice generation
 */
function WaterMeterReadingsCheck(): JSX.Element {
  const residents = useRecoilValue(residentsForInvoiceSelector);
  return (
    <>
      <AddWaterMeterReadingModal />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mieter</TableCell>
              <TableCell>Letzter abgerechneter Zählerstand</TableCell>
              <TableCell>Aktueller Zählerstand</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {residents.map((resident) => {
              const lastReading = resident.waterMeterReadings.find(
                (r) => r.wasDeductedInInvoice,
              ) as WaterMeterReading;
              const currentReading = resident.waterMeterReadings.find(
                (r) => !r.wasDeductedInInvoice,
              );
              return (
                <TableRow
                  key={resident.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    {`${resident.firstName} ${resident.lastName}`}
                  </TableCell>
                  <>
                    <TableCell>
                      {`${
                        lastReading.waterMeterCount
                      } (${lastReading.readingDate.toPreferredString()})`}
                    </TableCell>
                    <TableCell>
                      {currentReading
                        && `${currentReading.waterMeterCount} `
                          + `(${currentReading.readingDate.toPreferredString()})`}
                    </TableCell>
                  </>
                  <TableCell>
                    {currentReading ? (
                      <Tooltip title="Wasserzählerstand ist aktuell" arrow>
                        <CheckCircleOutlineIcon color="success" />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title="Letzter Wasserzählerstand wurde bereits abgerechnet" // eslint-disable-line max-len
                        arrow
                      >
                        <HighlightOffIcon color="error" />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <AddWaterMeterReadingIcon residentId={resident.id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default WaterMeterReadingsCheck;