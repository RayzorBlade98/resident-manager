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

enum ResidentTab {
  Information = 'information',
  Tab2 = 'tab2',
}

interface ResidentInformationProps {
  resident: Resident;
  containerStyle?: StyleAttribute;
}

function ResidentInformation(props: ResidentInformationProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<ResidentTab>(
    ResidentTab.Information,
  );

  function onClickTab(tab: ResidentTab): void {
    if (tab === activeTab) {
      return;
    }
    setActiveTab(tab);
  }

  return (
    <div {...props.containerStyle}>
      <MDBTabs fill className="mb-3">
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => onClickTab(ResidentTab.Information)}
            active={activeTab === ResidentTab.Information}
          >
            Information
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => onClickTab(ResidentTab.Tab2)}
            active={activeTab === ResidentTab.Tab2}
          >
            Tab 2
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={activeTab === ResidentTab.Information}>
          {`${props.resident.firstName} ${props.resident.lastName}`}
        </MDBTabsPane>
        <MDBTabsPane show={activeTab === ResidentTab.Tab2}>
          Tab 2 content
        </MDBTabsPane>
      </MDBTabsContent>
    </div>
  );
}

export default ResidentInformation;
