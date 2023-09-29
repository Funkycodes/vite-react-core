import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./app";

import "./styles/style.scss";

const container = document.querySelector("#_app");
createRoot(container).render((
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
));