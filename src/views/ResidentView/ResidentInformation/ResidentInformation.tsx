import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import GeneralResidentInformation from './GeneralResidentInformation/GeneralResidentInformation';
import RentInformation from './RentInformation/RentInformation';

/**
 * Enum containing all tabs of this component
 */
enum ResidentTab {
  General = 0,
  Rent = 1,
}

/**
 * Component that displays information of the resident in different tabs.
 */
function ResidentInformation(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ResidentTab>(ResidentTab.General);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          variant="fullWidth"
          value={activeTab}
          onChange={(_, tab: ResidentTab) => setActiveTab(tab)}
        >
          <Tab icon={<InfoIcon />} iconPosition="start" label="Informationen" />
          <Tab icon={<HomeIcon />} iconPosition="start" label="Miete" />
        </Tabs>
      </Box>
      <div hidden={activeTab !== ResidentTab.General}>
        <GeneralResidentInformation />
      </div>
      <div hidden={activeTab !== ResidentTab.Rent}>
        <RentInformation />
      </div>
    </>
  );
}

export default ResidentInformation;
