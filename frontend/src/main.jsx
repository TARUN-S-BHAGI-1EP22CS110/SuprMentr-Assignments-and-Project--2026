import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserContextProvider } from "./context/UserContext";
import { CourseContextProvider } from "./context/CourseContext";
export const server = import.meta.env.VITE_SERVER;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <CourseContextProvider>
      <App />
      </CourseContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);