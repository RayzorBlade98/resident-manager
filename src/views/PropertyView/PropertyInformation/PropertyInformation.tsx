import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';
import ApartmentsInformation from './ApartmentsInformation/ApartmentsInformation';
import GeneralPropertyInformation from './GeneralPropertyInformation/GeneralPropertyInformation';
import ParkingSpaceInformation from './ParkingSpaceInformation/ParkingSpaceInformation';

/**
 * Enum containing all tabs of this component
 */
enum PropertyTab {
  General = 0,
  Apartments = 1,
  ParkingSpace = 2,
}

const styles = {
  tabsBox: { borderBottom: 1, borderColor: 'divider' },
};

/**
 * Component that displays information of the property in different tabs.
 */
function PropertyInformation() {
  const [activeTab, setActiveTab] = useState<PropertyTab>(PropertyTab.General);

  return (
    <>
      <Box sx={styles.tabsBox}>
        <Tabs
          variant="fullWidth"
          value={activeTab}
          onChange={(_, tab: PropertyTab) => setActiveTab(tab)}
        >
          <Tab icon={<InfoIcon />} iconPosition="start" label="Informationen" />
          <Tab icon={<HomeIcon />} iconPosition="start" label="Wohnungen" />
          <Tab
            icon={<DirectionsCarIcon />}
            iconPosition="start"
            label="Garagen / Stellplätze"
          />
        </Tabs>
      </Box>
      <div hidden={activeTab !== PropertyTab.General}>
        <GeneralPropertyInformation />
      </div>
      <div hidden={activeTab !== PropertyTab.Apartments}>
        <ApartmentsInformation />
      </div>
      <div hidden={activeTab !== PropertyTab.ParkingSpace}>
        <ParkingSpaceInformation />
      </div>
    </>
  );
}

export default PropertyInformation;
