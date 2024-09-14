import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { convertNameToString } from '../../../utils/name/name.utils';
import RentInformationUtils from '../../../utils/rent/rent.utils';
import {
  generateInvoiceFormValidationSelector,
  residentsForInvoiceSelector,
} from '../states/invoice_generation_view_state';
import RentInformationTable from '_/components/shared/RentInformationTable/RentInformationTable';
import MonthYear from '_/extensions/date/month_year.extension';
import { PaymentStatus } from '_/models/resident/rent';

const styles = {
  tabsBox: { borderBottom: 1, borderColor: 'divider' },
  tabContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabResidentName: {
    marginBottom: 0,
    textAlign: 'left',
  },
} as const;

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
                label={(
                  <div style={styles.tabContainer}>
                    {resident.contractResidents.map((r) => (
                      <p style={styles.tabResidentName}>
                        {convertNameToString(r.name)}
                      </p>
                    ))}
                  </div>
                )}
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
          />
        </div>
      ))}
    </>
  );
}

export default RentPaymentCheck;
