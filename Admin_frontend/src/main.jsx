import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "./components/ui/provider";
import App from "./App";
import "./output.css";
import { BrowserRouter } from "react-router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
