/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import SaveStateManager from '_/components/functional/SaveStateHandler/SaveStateHandler';
import StandardLocalizationProvider from '_/components/functional/StandardLocalizationProvider/StandardLocalizationProvider';
import App from '_renderer/App';

const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <RecoilRoot>
    <RecoilNexus />
    <SaveStateManager />
    <StandardLocalizationProvider>
      <App />
    </StandardLocalizationProvider>
  </RecoilRoot>,
);
