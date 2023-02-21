import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
// import { toast } from "react-toastify";
// import axios from "axios";

const Home = () => {
  return (
    <div className="center">
      <div className="home-container">
        <h1 className="home-title">KeebTimer</h1>
        <div className="btn-container">
          <button className="btn btn-item">Start New Timer</button>
          <button className="btn btn-view">View Saved Times</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
