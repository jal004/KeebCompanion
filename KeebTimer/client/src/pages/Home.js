import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
// import { toast } from "react-toastify";
// import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

  const addTimePrompt = () => {
    var timeName = prompt("Please enter a name for the item to be timed");
    // checking if input is not empty, and not only whitespace
    if (!!timeName?.trim()) {
      localStorage.setItem("name", timeName);
      navigate("addTime");
    } else {
      alert("Please enter a valid name");
    }
  };

  return (
    <div className="center">
      <div className="home-container">
        <h1 className="home-title">KeebTimer</h1>
        <div className="btn-container">
          <button className="btn btn-item" onClick={addTimePrompt}>
            Start New Timer
          </button>

          <Link to={"viewTimes"}>
            <button className="btn btn-view">View Saved Times</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
