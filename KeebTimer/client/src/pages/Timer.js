import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Timer.css";

const Timer = () => {
  const [count, setCount] = useState(0);
  // using references for vars to persist on re-renders
  // refs storing each UNPROCESSED unit of time
  let hours = useRef(0);
  let minutes = useRef(0);
  let seconds = useRef(0);

  // refs storing each PROCESSED unit of time
  let displayHrs = useRef("");
  let displayMins = useRef("");
  let displaySecs = useRef("");
  let lapNow = useRef(null);

  // ref storing timer functionality variables
  let timerStatus = useRef("stopped");
  let interval = useRef(null);

  // name of current item being added
  const timeName = localStorage.getItem("name");

  // function to increment times; called in startStop function
  const start = () => {
    seconds.current++;
    // nested cond to increment other units of time
    if (seconds.current / 60 === 1) {
      minutes.current++;
      seconds.current = 0;
      if (minutes.current / 60 === 1) {
        hours.current++;
        minutes.current = 0;
      }
    }

    // prepending zeroes to single digit units of time for display
    displayHrs.current =
      hours.current < 10 ? "0" + hours.current : hours.current;
    displayMins.current =
      minutes.current < 10 ? "0" + minutes.current : minutes.current;
    displaySecs.current =
      seconds.current < 10 ? "0" + seconds.current : seconds.current;

    // displaying the times
    document.getElementById("timerHrs").innerHTML = displayHrs.current;
    document.getElementById("timerMins").innerHTML = displayMins.current;
    document.getElementById("timerSecs").innerHTML = displaySecs.current;
  };

  // startStop function; the actual function that starts and stops the timer
  const startStop = () => {
    if (timerStatus.current === "stopped") {
      interval.current = window.setInterval(start, 1000);
      timerStatus.current = "started";
      document.getElementById("startBtn").innerHTML = "Stop";
    } else {
      window.clearInterval(interval.current);
      timerStatus.current = "stopped";
      document.getElementById("startBtn").innerHTML = "Start";
    }
  };

  // reset function
  const reset = () => {
    if (
      window.confirm(
        "This will reset the timer and counter. Would you like to continue?"
      )
    ) {
      window.clearInterval(interval.current);

      hours.current = 0;
      minutes.current = 0;
      seconds.current = 0;

      displayHrs.current = 0;
      displayMins.current = 0;
      displaySecs.current = 0;

      document.getElementById("timerHrs").innerHTML = "00";
      document.getElementById("timerMins").innerHTML = "00";
      document.getElementById("timerSecs").innerHTML = "00";

      document.getElementById("startBtn").innerHTML = "Start";

      timerStatus.current = "stopped";

      resetCount();
    }
  };

  // lap function
  const lap = () => {
    // edge case of lapping after reset without start timer
    if (hours === 0 && minutes === 0 && seconds === 0) {
      lapNow = "00 : 00 : 00";
    }
    // standard behavior
    else {
      lapNow = displayHrs + " : " + displayMins + " : " + displaySecs;
    }
    document.getElementById("lapRecord").innerHTML =
      document.getElementById("lapRecord").innerHTML + "<p>" + lapNow + "</p>";
  };

  // counter functions
  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrementCount = () => {
    setCount((prevCount) => prevCount - 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  return (
    <div className="wrapper">
      <h1>Start New Timer</h1>
      <div className="timerBody">
        <h2>Storing Times For: {timeName}</h2>
        <div className="display">
          <p className="timerDisplay" id="timerHrs">
            00
          </p>
          :
          <p className="timerDisplay" id="timerMins">
            00
          </p>
          :
          <p className="timerDisplay" id="timerSecs">
            00
          </p>
        </div>

        <div className="timerBtns">
          <button className="timer-btn" id="startBtn" onClick={startStop}>
            Start
          </button>
        </div>
      </div>

      <div className="counterBody">
        <h2>{count}</h2>
        <div className="counterBtns">
          <button className="btn" onClick={incrementCount}>
            Increment
          </button>
          <button
            className="btn"
            onClick={decrementCount}
            // disables button if count is 0
            disabled={count === 0}
          >
            Decrement
          </button>
          <button className="btn" onClick={reset} disabled={count === 0}>
            Reset
          </button>
        </div>
      </div>
      <Link to="/">
        <button className="btn">Go Back</button>
      </Link>
    </div>
  );
};

export default Timer;