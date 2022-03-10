import { Router } from "@reach/router";
import "antd/dist/antd.css";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./App.css";

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
