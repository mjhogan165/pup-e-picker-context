import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import DogProvider from "./providers/dog-provider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DogProvider>
      <App />
    </DogProvider>
  </React.StrictMode>
);
