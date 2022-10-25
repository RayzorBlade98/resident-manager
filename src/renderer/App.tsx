import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import currentViewState, { View } from "_/states/viewStates/current_view_state";
import { defaultColors } from "_/types/styles";
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
    </div>
  );
}

export default App;
