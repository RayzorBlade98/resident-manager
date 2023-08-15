import InfoIcon from '@mui/icons-material/Info';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import GeneralInvoiceInformation from './GeneralInvoiceInformation/GeneralInvoiceInformation';
import Invoice from '_/models/invoice/invoice';

/**
 * Enum containing all tabs of this component
 */
enum InvoiceTab {
  General = 0,
}

const styles = {
  tabsBox: { borderBottom: 1, borderColor: 'divider' },
};

interface InvoiceInformationProps {
  /**
   * Invoice for which the information should be displayed
   */
  invoice: Invoice;
}

/**
 * Component that displays information of the invoice in different tabs.
 */
function InvoiceInformation(props: InvoiceInformationProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<InvoiceTab>(InvoiceTab.General);

  return (
    <>
      <Box sx={styles.tabsBox}>
        <Tabs
          variant="fullWidth"
          value={activeTab}
          onChange={(_, tab: InvoiceTab) => setActiveTab(tab)}
        >
          <Tab icon={<InfoIcon />} iconPosition="start" label="Informationen" />
        </Tabs>
      </Box>
      <div hidden={activeTab !== InvoiceTab.General}>
        <GeneralInvoiceInformation invoice={props.invoice} />
      </div>
    </>
  );
}

export default InvoiceInformation;
