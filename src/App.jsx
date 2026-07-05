import React from "react";
import AdminPage from "./components/AdminPage.jsx";
import StudentPortalPage from "./components/StudentPortalPage.jsx";
import SketchHomePage from "./components/SketchHomePage.jsx";

function App() {
  const pathName = window.location.pathname;

  if (pathName === "/admin") {
    return <AdminPage />;
  }

  if (pathName === "/student") {
    return <StudentPortalPage />;
  }

  return <SketchHomePage />;
}

export default App;