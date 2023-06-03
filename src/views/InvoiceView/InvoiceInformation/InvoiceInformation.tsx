import InfoIcon from '@mui/icons-material/Info';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import GeneralInvoiceInformation from './GeneralInvoiceInformation/GeneralInvoiceInformation';

/**
 * Enum containing all tabs of this component
 */
enum InvoiceTab {
  General = 0,
}

const styles = {
  tabsBox: { borderBottom: 1, borderColor: 'divider' },
};

/**
 * Component that displays information of the invoice in different tabs.
 */
function InvoiceInformation(): JSX.Element {
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
        <GeneralInvoiceInformation />
      </div>
    </>
  );
}

export default InvoiceInformation;
