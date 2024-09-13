import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import View from '../routes';
import propertyState from '_/states/property/property.state';
import IncidentalsView from '_/views/IncidentalsView/IncidentalsView';
import InitializationView from '_/views/InitializationView/InitializationView';
import InvoiceGenerationView from '_/views/InvoiceGenerationView/InvoiceGenerationView';
import InvoiceView from '_/views/InvoiceView/InvoiceView';
import MainView from '_/views/MainView/MainView';
import PropertyView from '_/views/PropertyView/PropertyView';
import ResidentView from '_/views/ResidentView/ResidentView';

function App(): JSX.Element {
  useEffect(() => {
    window.ipcAPI.rendererReady();
  }, []);

  const property = useRecoilValue(propertyState);

  // Init property if it's not defined yet
  if (!property) {
    return <InitializationView />;
  }

  return (
    <div className="app" style={{ overflow: 'hidden' }}>
      <Routes>
        <Route path={View.Main} Component={MainView} />
        <Route path={View.Resident} Component={ResidentView} />
        <Route path={View.Incidentals} Component={IncidentalsView} />
        <Route path={View.Invoice} Component={InvoiceView} />
        <Route
          path={View.InvoiceGeneration}
          Component={InvoiceGenerationView}
        />
        <Route path={View.Property} Component={PropertyView} />
      </Routes>
    </div>
  );
}

export default App;
