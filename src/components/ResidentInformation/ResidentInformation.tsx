import { Resident } from '_/types/resident';
import { StyleAttribute } from 'glamor';
import {
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
} from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import GeneralResidentInformation from './GeneralResidentInformation';
import RentInformation from './RentInformation';

/**
 * Enum containing all tabs of this component
 */
enum ResidentTab {
  General = 'Information',
  Rent = 'Miete',
}

interface ResidentInformationProps {
  /**
   * Resident for which the information should be displayed
   */
  resident: Resident;

  /**
   * Style that should be applied to the container of the component. (Optional)
   */
  containerStyle: StyleAttribute;
}

/**
 * Component that displays information of the resident in different tabs.
 */
function ResidentInformation(props: ResidentInformationProps): JSX.Element {
  // Currently selected tab
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
        return <GeneralResidentInformation resident={props.resident} />;
      case ResidentTab.Rent:
        return <RentInformation resident={props.resident} />;
    }
  }

  return (
    <div {...props.containerStyle}>
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
        <MDBTabsPane show={true}>
          <div>{getTabContent()}</div>
        </MDBTabsPane>
      </MDBTabsContent>
    </div>
  );
}

export default ResidentInformation;
