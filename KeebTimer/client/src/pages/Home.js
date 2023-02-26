import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
// import { toast } from "react-toastify";
// import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

  const addTimePrompt = () => {
    var timeName = prompt(
      "Please enter a name for the item to be timed (50 character limit)."
    );

    // checking if input name is not empty, and not only whitespace
    var nameLen = timeName.trim().length;
    if (nameLen === 0) {
      alert("Please enter a valid name.");
    }
    // checking if input name exceeds character limit
    else if (nameLen > 50) {
      alert(
        `Please enter a name that is at most 50 characters.\nThe current name is ${nameLen} characters`
      );
    }
    // input name is valid
    else {
      // add timer to times table
      axios.post("http://localhost:5000/api/post", { timeName });
      navigate(`addTime/${timeName}`);
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
