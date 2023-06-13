import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { defaultColors } from '../styles';
import currentViewState, { View } from '_/states/current_view.state';
import IncidentalsView from '_/views/IncidentalsView/IncidentalsView';
import InvoiceGenerationView from '_/views/InvoiceGenerationView/InvoiceGenerationView';
import InvoiceView from '_/views/InvoiceView/InvoiceView';
import MainView from '_/views/MainView/MainView';
import ResidentView from '_/views/ResidentView/ResidentView';

function App(): JSX.Element {
  useEffect(() => {
    window.ipcAPI?.rendererReady();
  }, []);

  const view: View = useRecoilValue(currentViewState);

  return (
    <div className="app" style={{ backgroundColor: defaultColors.mainLight1 }}>
      {view === View.Main && <MainView />}
      {view === View.Resident && <ResidentView />}
      {view === View.Incidentals && <IncidentalsView />}
      {view === View.Invoice && <InvoiceView />}
      {view === View.InvoiceGeneration && <InvoiceGenerationView />}
    </div>
  );
}

export default App;
