import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { Tooltip } from '@mui/material';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import AddRentPaymentModal from './AddRentPaymentModal';
import styles from './styles';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { MonthYear, MonthYearUtils } from '_/types/date';
import { PaymentStatus, RentInformationUtils } from '_/types/rent';
import { Resident } from '_/types/resident';
import {
  CurrencyInCents,
  convertCurrencyCentsToString,
} from '_/utils/currency';
import { dateToString } from '_/utils/date';

interface RentInformationProps {
  /**
   * Resident for which the information should be displayed
   */
  resident: Resident;
}

/**
 * Component that displays rent information about a resident
 */
function RentInformation(props: RentInformationProps): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalDueDate, setModalDueDate] = useState<MonthYear>(
    MonthYearUtils.getCurrentMonthYear(),
  );

  return (
    <>
      {showModal && (
        <AddRentPaymentModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={(paymentAmount: CurrencyInCents, paymentDate: Date) => {
            // eslint-disable-next-line max-len
            ResidentStateManager.updateRentInformation(
              props.resident.id,
              modalDueDate,
              {
                paymentAmount,
                paymentDate,
              },
            );
            setShowModal(false);
          }}
        />
      )}
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
          {[...props.resident.rent].reverse().map((rent) => (
            <tr key={uuid()}>
              <td>{`${rent.dueDate.month} ${rent.dueDate.year}`}</td>
              <td>{convertCurrencyCentsToString(rent.rent)}</td>
              <td>{convertCurrencyCentsToString(rent.incidentals)}</td>
              <td>
                {RentInformationUtils.getPaymentStatus(rent)
                  === PaymentStatus.Paid && (
                  <Tooltip
                    // eslint-disable-next-line max-len
                    title={`Bezahlt am ${dateToString(rent.paymentDate as Date)}`}
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
                      {...styles.actionIcon}
                      onClick={() => {
                        setModalDueDate(rent.dueDate);
                        setShowModal(true);
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
