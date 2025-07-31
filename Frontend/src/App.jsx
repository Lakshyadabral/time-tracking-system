
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/loginpage"; 
import DashboardPage from "./pages/DashboardPage.";
import SupervisorDashboardPage from "./pages/SuperVisorDashboard";
import EditTimesheetPage from "./pages/editTimesheet"; 
import AdminDashboardPage from "./pages/adminDashboard";





const App = () => {
  
    const [loggedInUser, setLoggedInUser] = useState(
      JSON.parse(localStorage.getItem("loggedInUser")) || null
  );
        // Load the user from localStorage when the app initializes
        useEffect(() => {
          const storedUser = localStorage.getItem("loggedInUser");
          if (storedUser) {
              setLoggedInUser(JSON.parse(storedUser));
          }
      }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="/dashboard/:employeeId"
          element={<DashboardPage loggedInUser={loggedInUser} />}
        />
        <Route
          path="/supervisor-dashboard"
          element={<SupervisorDashboardPage loggedInUser={loggedInUser} />}
        />
         <Route
        path="/edit-timesheet"
        element={<EditTimesheetPage loggedInUser={loggedInUser} />}
    />

    <Route
        path="/admin-dashboard"
        element={<AdminDashboardPage loggedInUser={loggedInUser} />}
    />
      </Routes>
    </Router>
  );
};

export default App;
