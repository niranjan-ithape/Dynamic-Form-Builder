import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import FormPage from "../pages/FormPage";
import AdminDashboard from "../pages/AdminDashboard";


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
      id="3"
      path="/form/:id" 
      element={<FormPage />} />


      <Route 
      id="4"
      path="/adminDashboard" 
      element={<AdminDashboard/>} />

     
      <Route 
      path="/*" 
      element={<Signup />} />

      
    </Routes>

    
  );
};

export default UserRoutes;
