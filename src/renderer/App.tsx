import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import currentViewState, { View } from "_/states/viewStates/current_view_state";
import { defaultColors } from "_/types/styles";
import IncidentalsView from "_/views/IncidentalsView/IncidentalsView";
import MainView from "_/views/MainView/MainView";
import ResidentView from "_/views/ResidentView/ResidentView";

function App(): JSX.Element {
  useEffect(() => {
    window.ipcAPI?.rendererReady();
  }, []);

  const view: View = useRecoilValue(currentViewState);

  return (
    <div className="app" style={{ backgroundColor: defaultColors.mainLight1 }}>
      {view == View.Main && <MainView />}
      {view == View.Resident && <ResidentView />}
      {view == View.Incidentals && <IncidentalsView />}
    </div>
  );
}

export default App;
