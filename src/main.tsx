import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- ایمپورت روتر
import App from "./App.tsx";
import "./index.css";
import { store } from "./app/store";
import { Provider } from "react-redux";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../public/sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch((err) => console.log("SW registration failed:", err));
  });
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {" "}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);