/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import "_public/style.css";
import "_public/variables.css";

import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "_renderer/App";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <RecoilRoot>
    <RecoilNexus />
    <App />
  </RecoilRoot>
);
