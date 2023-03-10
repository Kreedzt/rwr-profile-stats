// SPDX-License-Identifier: GPL-3.0-only
import { Router } from "@reach/router";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "antd/dist/antd.css";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./App.css";
import * as localforage from "localforage";
import Rank from "./pages/rank/Rank";

dayjs.extend(duration);

localforage.config({
  name: "rwr-profile-stats-storage",
  version: 1,
});

function App() {
  return (
    <div className="App">
      <Router>
        <Profile path="/profile/:id" />
        <Rank path="/rank" />
        <Home path="/" />
      </Router>
    </div>
  );
}

export default App;
