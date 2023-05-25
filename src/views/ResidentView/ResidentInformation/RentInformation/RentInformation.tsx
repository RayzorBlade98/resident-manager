import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { Tooltip } from '@mui/material';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
// eslint-disable-next-line max-len
import { residentViewSelectedResidentState } from '../../states/resident_view_state';
import styles from '../../styles';
import AddRentPaymentModal from './AddRentPaymentModal/AddRentPaymentModal';
import addRentPaymentState from './states/add_rent_payment_state';
import { PaymentStatus, RentInformationUtils } from '_/types/rent';
import { Resident } from '_/types/resident';
import {
  CurrencyInCents,
  convertCurrencyCentsToString,
} from '_/utils/currency';
import { dateToString } from '_/utils/date';

/**
 * Component that displays rent information about a resident
 */
function RentInformation(): JSX.Element {
  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;
  const setRentPaymentState = useSetRecoilState(addRentPaymentState);

  return (
    <>
      <AddRentPaymentModal />
      <MDBTable hover>
        <MDBTableHead>
          <tr>
            <th scope="col">Monat</th>
            <th scope="col">Miete</th>
            <th scope="col">Nebenkosten</th>
            <th scope="col">Bezahlt</th>
            <th scope="col">Aktionen</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {[...selectedResident.rent].reverse().map((rent) => (
            <tr key={uuid()}>
              <td>{`${rent.dueDate.month} ${rent.dueDate.year}`}</td>
              <td>{convertCurrencyCentsToString(rent.rent)}</td>
              <td>{convertCurrencyCentsToString(rent.incidentals)}</td>
              <td>
                {RentInformationUtils.getPaymentStatus(rent)
                  === PaymentStatus.Paid && (
                  <Tooltip
                    // eslint-disable-next-line max-len
                    title={`Bezahlt am ${dateToString(
                      rent.paymentDate as Date,
                    )}`}
                    arrow
                  >
                    <CheckCircleOutlineIcon color="success" />
                  </Tooltip>
                )}
                {RentInformationUtils.getPaymentStatus(rent)
                  === PaymentStatus.Unpaid && (
                  <Tooltip title="Unbezahlt" arrow>
                    <HighlightOffIcon color="error" />
                  </Tooltip>
                )}
                {RentInformationUtils.getPaymentStatus(rent)
                  === PaymentStatus.PaidPartially && (
                  <Tooltip
                    // eslint-disable-next-line max-len
                    title={`Teilweise bezahlt am ${dateToString(
                      rent.paymentDate as Date,
                    )} (${convertCurrencyCentsToString(
                      rent.paymentAmount as CurrencyInCents,
                    )} von ${convertCurrencyCentsToString(
                      RentInformationUtils.getAmountToPay(rent),
                    )})`}
                    arrow
                  >
                    <CheckCircleOutlineIcon color="warning" />
                  </Tooltip>
                )}
              </td>
              <td>
                {RentInformationUtils.getPaymentStatus(rent)
                  === PaymentStatus.Unpaid && (
                  <Tooltip title="Zahlung hinzufügen" arrow>
                    <PaymentsOutlinedIcon
                      {...styles.residentInformation.actionIcon}
                      onClick={() => {
                        setRentPaymentState((state) => ({
                          ...state,
                          selectedRentMonth: rent.dueDate,
                          showModal: true,
                        }));
                      }}
                    />
                  </Tooltip>
                )}
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    </>
  );
}

export default RentInformation;
