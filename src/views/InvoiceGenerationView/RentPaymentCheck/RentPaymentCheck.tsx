import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import RentInformationUtils from '../../../utils/rent/rent.utils';
import {
  generateInvoiceFormValidationSelector,
  residentsForInvoiceSelector,
} from '../states/invoice_generation_view_state';
import AddRentPaymentModal from '_/components/shared/RentInformationTable/AddRentPaymentModal/AddRentPaymentModal';
import RentInformationTable from '_/components/shared/RentInformationTable/RentInformationTable';
import MonthYear from '_/extensions/date/month_year.extension';
import { PaymentStatus } from '_/models/resident/rent';

const styles = {
  tabsBox: { borderBottom: 1, borderColor: 'divider' },
};

/**
 * Component to check and edit all rent payments included into the invoice
 */
function RentPaymentCheck(): JSX.Element {
  const [activeTab, setActiveTab] = useState<number>(0);
  const residents = useRecoilValue(residentsForInvoiceSelector);
  const invoiceFormState = useRecoilValue(
    generateInvoiceFormValidationSelector,
  );

  const invoiceStart = invoiceFormState.formInput.invoiceStart as MonthYear;
  const invoiceEnd = invoiceFormState.formInput.invoiceEnd as MonthYear;

  return (
    <>
      <AddRentPaymentModal />
      <Box sx={styles.tabsBox}>
        <Tabs
          variant="fullWidth"
          value={activeTab}
          onChange={(_, tab: number) => setActiveTab(tab)}
        >
          {residents.map((resident) => {
            const hasPaidAllRent = resident.rentInformation
              .filter(
                (i) => invoiceStart <= i.dueDate && i.dueDate <= invoiceEnd,
              )
              .every(
                (i) => RentInformationUtils.getPaymentStatus(i)
                  === PaymentStatus.Paid,
              );
            return (
              <Tab
                key={`${resident.id}-tab`}
                icon={
                  hasPaidAllRent ? (
                    <CheckCircleOutlineIcon color="success" />
                  ) : (
                    <HighlightOffIcon color="error" />
                  )
                }
                iconPosition="start"
                label={`${resident.firstName} ${resident.lastName}`}
              />
            );
          })}
        </Tabs>
      </Box>
      {residents.map((resident, i) => (
        <div hidden={activeTab !== i}>
          <RentInformationTable
            resident={resident}
            start={invoiceStart}
            end={invoiceEnd}
            disableRentPaymentModal
          />
        </div>
      ))}
    </>
  );
}

export default RentPaymentCheck;
