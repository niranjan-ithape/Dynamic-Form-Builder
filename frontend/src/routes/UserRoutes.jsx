import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const UserRoutes = () => {
  return (
    <Routes>
     
      <Route 
      id="1"
      path="/login" 
      element={<Login />} />

      <Route 
      id="2"
      path="/signup" 
      element={<Signup />} />

      <Route 
      id="2"
      path="/*" 
      element={<Signup />} />

      
    </Routes>

    
  );
};

export default UserRoutes;
