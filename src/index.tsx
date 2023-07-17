import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const root = document.getElementById("root") as HTMLElement;

if (root) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root
  );
} else {
  throw new Error("Could not find root element to mount to!");
}
