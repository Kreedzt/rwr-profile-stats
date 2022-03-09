import { useState } from "react";
import "./App.css";
import { Router } from "@reach/router";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Profile path="/profile/:id" />
        <Home path="/" />
      </Router>
    </div>
  );
}

export default App;
