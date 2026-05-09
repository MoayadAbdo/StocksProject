import React from "react";
import ReactDOM from "react-dom/client";
<<<<<<< HEAD
import RootApp from "./RootApp";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootApp />
=======
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
>>>>>>> f31afd343b5a1bc92cd50e1c5d73da5d87b5bd46
  </React.StrictMode>
);
