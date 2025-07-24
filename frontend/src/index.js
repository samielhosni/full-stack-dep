import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./Root"; // Root handles routing and auth state
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();
