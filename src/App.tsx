import React from "react";
import { Route, Routes } from 'react-router-dom';

import { DebotPage } from "./pages/debot-page";
import { GeneratePage } from "./pages/generate-page";
import { UserPage } from "./pages/user-page";

const App = () => {
  return <Routes>
    <Route path = "/wallets" element = { <UserPage/> }/>
    <Route path = "/generate" element = { <GeneratePage/> }/>
    <Route path = "/" element = { <DebotPage/> }/>
  </Routes>
};

export default App;
