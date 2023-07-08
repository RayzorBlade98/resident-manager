import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import GeneralResidentInformation from './GeneralResidentInformation/GeneralResidentInformation';
import RentInformation from './RentInformation/RentInformation';
import WaterReadingInformation from './WaterReadingInformation/WaterReadingInformation';

/**
 * Enum containing all tabs of this component
 */
enum ResidentTab {
  General = 0,
  Rent = 1,
  WaterReading = 2,
}

const styles = {
  tabsBox: { borderBottom: 1, borderColor: 'divider' },
};

/**
 * Component that displays information of the resident in different tabs.
 */
function ResidentInformation(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ResidentTab>(ResidentTab.General);

  return (
    <>
      <Box sx={styles.tabsBox}>
        <Tabs
          variant="fullWidth"
          value={activeTab}
          onChange={(_, tab: ResidentTab) => setActiveTab(tab)}
        >
          <Tab icon={<InfoIcon />} iconPosition="start" label="Informationen" />
          <Tab icon={<HomeIcon />} iconPosition="start" label="Miete" />
          <Tab
            icon={<WaterDropIcon />}
            iconPosition="start"
            label="Wasserzähler"
          />
        </Tabs>
      </Box>
      <div hidden={activeTab !== ResidentTab.General}>
        <GeneralResidentInformation />
      </div>
      <div hidden={activeTab !== ResidentTab.Rent}>
        <RentInformation />
      </div>
      <div hidden={activeTab !== ResidentTab.WaterReading}>
        <WaterReadingInformation />
      </div>
    </>
  );
}

export default ResidentInformation;
