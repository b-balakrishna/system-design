import React from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./context/AppContext";
import App from "./App";
import "./styles.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

createRoot(container).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
