import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

import "./styles/style.scss";

const container = document.querySelector("#root");
createRoot(container).render((
  <StrictMode>
    <App />
  </StrictMode>
));