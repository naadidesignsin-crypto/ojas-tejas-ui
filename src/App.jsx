import React from "react";
import AdminPage from "./components/AdminPage.jsx";
import SketchHomePage from "./components/SketchHomePage.jsx";

function App() {
  const isAdminPage = window.location.pathname === "/admin";

  if (isAdminPage) {
    return <AdminPage />;
  }

  return <SketchHomePage />;
}

export default App;