import React from "react";
import { BrowserRouter } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";

function App() {
  return (
    <BrowserRouter>
      <UserRoutes />
    </BrowserRouter>
  );
}

export default App;
