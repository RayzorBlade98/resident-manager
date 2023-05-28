import { StyleAttribute } from 'glamor';
import {
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
} from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import GeneralInvoiceInformation from './GeneralInvoiceInformation';
import { Invoice } from '_/types/invoice';

/**
 * Enum containing all tabs of this component
 */
enum InvoiceTab {
  General = 'Information',
}

interface InvoiceInformationProps {
  /**
   * Invoice for which the information should be displayed
   */
  invoice: Invoice;

  /**
   * Style that should be applied to the container of the component. (Optional)
   */
  containerStyle: StyleAttribute;
}

/**
 * Component that displays information of the invoice in different tabs.
 */
function InvoiceInformation(props: InvoiceInformationProps): JSX.Element {
  // Currently selected tab
  const [activeTab, setActiveTab] = useState<InvoiceTab>(InvoiceTab.General);

  /**
   * Handles the tab selection
   * @param tab selected tab
   */
  function onClickTab(tab: InvoiceTab): void {
    if (tab === activeTab) return;
    setActiveTab(tab);
  }

  /**
   * Returns the content of the currently active tab
   */
  function getTabContent(): JSX.Element {
    switch (activeTab) {
      case InvoiceTab.General:
        return <GeneralInvoiceInformation invoice={props.invoice} />;
      default:
        throw new Error(`Tab ${activeTab} is not implemented`);
    }
  }

  return (
    <div {...props.containerStyle}>
      <MDBTabs fill className="mb-3">
        {Object.values(InvoiceTab).map((tab: InvoiceTab) => (
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

export default InvoiceInformation;
