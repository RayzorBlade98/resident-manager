import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import MainView from "_/views/MainView/MainView";

function App(): JSX.Element {
  useEffect(() => {
    window.ipcAPI?.rendererReady();
  }, []);

  return (
    <RecoilRoot>
      <div className="app">
        <MainView />
      </div>
    </RecoilRoot>
  );
}

export default App;
