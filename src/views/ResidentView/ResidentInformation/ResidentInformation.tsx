import {
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
} from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import styles from '../styles';
// eslint-disable-next-line max-len
import GeneralResidentInformation from './GeneralResidentInformation/GeneralResidentInformation';
import RentInformation from './RentInformation/RentInformation';

/**
 * Enum containing all tabs of this component
 */
enum ResidentTab {
  General = 'Information',
  Rent = 'Miete',
}

/**
 * Component that displays information of the resident in different tabs.
 */
function ResidentInformation(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ResidentTab>(ResidentTab.General);

  /**
   * Handles the tab selection
   * @param tab selected tab
   */
  function onClickTab(tab: ResidentTab): void {
    if (tab === activeTab) return;
    setActiveTab(tab);
  }

  /**
   * Returns the content of the currently active tab
   */
  function getTabContent(): JSX.Element {
    switch (activeTab) {
      case ResidentTab.General:
        return <GeneralResidentInformation />;
      case ResidentTab.Rent:
        return <RentInformation />;
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Tab ${activeTab} is not implemented`);
    }
  }

  return (
    <div {...styles.residentInformation.container}>
      <MDBTabs fill className="mb-3">
        {Object.values(ResidentTab).map((tab: ResidentTab) => (
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => onClickTab(tab)}
              active={activeTab === tab}
            >
              {tab}
            </MDBTabsLink>
          </MDBTabsItem>
        ))}
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show>
          <div>{getTabContent()}</div>
        </MDBTabsPane>
      </MDBTabsContent>
    </div>
  );
}

export default ResidentInformation;
