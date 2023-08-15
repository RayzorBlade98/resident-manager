import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import View from '../routes';
import { defaultColors } from '../styles';
import { propertyState } from '_/states/property/property.state';
import IncidentalsView from '_/views/IncidentalsView/IncidentalsView';
import InvoiceGenerationView from '_/views/InvoiceGenerationView/InvoiceGenerationView';
import InvoiceView from '_/views/InvoiceView/InvoiceView';
import MainView from '_/views/MainView/MainView';
import PropertyInitializationView from '_/views/PropertyInitializationView/PropertyInitializationView';
import ResidentView from '_/views/ResidentView/ResidentView';

function App(): JSX.Element {
  useEffect(() => {
    window.ipcAPI?.rendererReady();
  }, []);

  const property = useRecoilValue(propertyState);

  // Init property if it's not defined yet
  if (!property) {
    return <PropertyInitializationView />;
  }

  return (
    <div className="app" style={{ backgroundColor: defaultColors.mainLight1 }}>
      <Routes>
        <Route path={View.Main} Component={MainView} />
        <Route path={View.Resident} Component={ResidentView} />
        <Route path={View.Incidentals} Component={IncidentalsView} />
        <Route path={View.Invoice} Component={InvoiceView} />
        <Route
          path={View.InvoiceGeneration}
          Component={InvoiceGenerationView}
        />
      </Routes>
    </div>
  );
}

export default App;
