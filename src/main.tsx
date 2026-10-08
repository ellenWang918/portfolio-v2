import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./portfolio.css";

const root = document.getElementById("root");
if (!root) throw new Error('The portfolio root element is missing.');

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
