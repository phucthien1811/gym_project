import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Import CSS global của bạn (trong src/styles)
import "./styles/globals.css";
import "./styles/components.css";

const rootEl = document.getElementById("root");
createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
