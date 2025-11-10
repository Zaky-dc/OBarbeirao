import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SideBarContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SidebarProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </SidebarProvider>
  </React.StrictMode>
);
