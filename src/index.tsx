import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const container: any = document.getElementById("root");

// Create a root.
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const root = ReactDOMClient.createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
