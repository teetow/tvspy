import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./Global.scss";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <BrowserRouter
      basename={import.meta.url.indexOf("localhost") > -1 ? "/" : "/tvspy"}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
