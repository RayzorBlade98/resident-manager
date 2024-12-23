import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import View from '../../routes';
import OneTimeIncidentalsTable from './OneTimeIncidentalsTable/OneTimeIncidentalsTable';
import WaterCostInformation from './WaterCostInformation/WaterCostInformation';
import AppBar from '_/components/shared/AppBar/AppBar';
import OngoingIncidentalsTable from '_/views/IncidentalsView/OngoingIncidentalsTable/OngoingIncidentalsTable';

/**
 * Enum containing all tabs of this view
 */
enum IncidentalsTab {
  Ongoing = 0,
  OneTime = 1,
  Water = 2,
}

const styles = {
  tabsBox: { borderBottom: 1, borderColor: 'divider' },
  content: {
    height: '90%',
    overflowY: 'auto',
  },
} as const;

function IncidentalsView(): JSX.Element {
  const [activeTab, setActiveTab] = useState<IncidentalsTab>(
    IncidentalsTab.Ongoing,
  );

  return (
    <>
      <AppBar returnRoute={View.Main} />
      <Box sx={styles.tabsBox}>
        <Tabs
          variant="fullWidth"
          value={activeTab}
          onChange={(_, tab: IncidentalsTab) => setActiveTab(tab)}
        >
          <Tab
            icon={<LoopIcon />}
            iconPosition="start"
            label="Laufende Nebenkosten"
          />
          <Tab
            icon={<LooksOneOutlinedIcon />}
            iconPosition="start"
            label="Einmalige Nebenkosten"
          />
          <Tab
            icon={<WaterDropIcon />}
            iconPosition="start"
            label="Wasserkosten"
          />
        </Tabs>
      </Box>
      <div hidden={activeTab !== IncidentalsTab.Ongoing} style={styles.content}>
        <OngoingIncidentalsTable />
      </div>
      <div hidden={activeTab !== IncidentalsTab.OneTime} style={styles.content}>
        <OneTimeIncidentalsTable />
      </div>
      <div hidden={activeTab !== IncidentalsTab.Water} style={styles.content}>
        <WaterCostInformation />
      </div>
    </>
  );
}

export default IncidentalsView;
