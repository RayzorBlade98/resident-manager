import { convertMonthYearToString } from '_/types/date';
import { Resident } from '_/types/resident';
import { convertCurrencyCentsToString } from '_/utils/currency';
import { StyleAttribute } from 'glamor';
import {
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
} from 'mdb-react-ui-kit';
import React, { useState } from 'react';

/**
 * Enum containing all tabs of this component
 */
enum ResidentTab {
  Information = 'information',
  Tab2 = 'tab2',
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
  const [activeTab, setActiveTab] = useState<ResidentTab>(
    ResidentTab.Information,
  );

  /**
   * Handles the tab selection
   * @param tab selected tab
   */
  function onClickTab(tab: ResidentTab): void {
    if (tab === activeTab) return;
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
          <p>{`${props.resident.firstName} ${props.resident.lastName}`}</p>
          <p>{`${convertCurrencyCentsToString(props.resident.rent)}`}</p>
          <p>{`${convertMonthYearToString(props.resident.invoiceStart)}`}</p>
        </MDBTabsPane>
        <MDBTabsPane show={activeTab === ResidentTab.Tab2}>
          Tab 2 content
        </MDBTabsPane>
      </MDBTabsContent>
    </div>
  );
}

export default ResidentInformation;
