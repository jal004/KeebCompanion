import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Timer.css";

const Timer = () => {
  // used for cleaning up before redirect if needed
  const navigate = useNavigate();
  // go back to home clean up;
  // stops the current timer if it is running when exiting page

  // prepopulating with saved time and count
  const [savedTime, setSavedTime] = useState({});
  const [savedCount, setSavedCount] = useState({});

  // allows us to access the value in the URL following the '/';
  // we have to specify this value with a ':' prepended in the path attr in App.js
  const { name } = useParams();

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

  useEffect(() => {
    // getting saved time
    axios.get(`http://localhost:5000/api/getTimeNew/${name}`).then((resp) => {
      setSavedTime({ ...resp.data[0] });
    });
    // getting saved count
    axios.get(`http://localhost:5000/api/getCountNew/${name}`).then((resp) => {
      setSavedCount({ ...resp.data[0] });
    });
  }, [name]);

  // assigning INITIAL VALUE of counter to most recently saved value for timer
  // (HANDLING RETAINING COUNT WHEN GOING BACK FROM SUBMIT FORM)
  useEffect(() => {
    setCount(savedCount.count_new);
  }, [savedCount]);

  // DEBUG
  // console.log(savedTime);
  // console.log(savedCount);
  // console.log(savedTime.hr_new);
  // console.log(savedTime.min_new);
  // console.log(savedTime.sec_new);
  // console.log(savedCount.count_new);

  // assign INITIAL VALUE of time units to most recently saved value for timer
  // (HANDLING RETAINING TIME WHEN GOING BACK FROM SUBMIT FORM)
  useEffect(() => {
    hours.current = savedTime.hr_new;
    minutes.current = savedTime.min_new;
    seconds.current = savedTime.sec_new;
  }, [savedTime]);

  // processing initial times for display
  // (HANDLING RETAINING TIME WHEN GOING BACK FROM SUBMIT FORM)
  displayHrs.current = hours.current < 10 ? "0" + hours.current : hours.current;
  displayMins.current =
    minutes.current < 10 ? "0" + minutes.current : minutes.current;
  displaySecs.current =
    seconds.current < 10 ? "0" + seconds.current : seconds.current;

  let lapNow = useRef(null);

  // ref storing timer functionality variables
  let timerStatus = useRef("stopped");
  let interval = useRef(null);

  // function to increment times; called in startStop function
  const goBackBtn = () => {
    if (
      window.confirm(
        "This timer will not be saved if you leave this page.\nWould you like to continue?"
      )
    ) {
      // stopping the timer if it is still running before going back
      if (timerStatus.current === "started") {
        window.clearInterval(interval.current);
        timerStatus.current = "stopped";
      }
      // deleting the current timer
      axios.delete(`http://localhost:5000/api/deleteTimeNew/${name}`);
      navigate("/");
    }
  };

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
      document.getElementById("startBtn").innerHTML = "Stop Timer";
    } else {
      window.clearInterval(interval.current);
      timerStatus.current = "stopped";
      document.getElementById("startBtn").innerHTML = "Start Timer";
    }
  };

  // reset function
  const reset = () => {
    if (
      window.confirm(
        "This will reset the counter AND the timer.\nWould you like to continue?"
      )
    ) {
      window.clearInterval(interval.current);

      hours.current = 0;
      minutes.current = 0;
      seconds.current = 0;

      displayHrs.current = "00";
      displayMins.current = "00";
      displaySecs.current = "00";

      document.getElementById("timerHrs").innerHTML = displayHrs.current;
      document.getElementById("timerMins").innerHTML = displayMins.current;
      document.getElementById("timerSecs").innerHTML = displaySecs.current;

      document.getElementById("startBtn").innerHTML = "Start Timer";

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
    const currTime = `${displayHrs.current}:${displayMins.current}:${displaySecs.current}`;
    const timerName = name;
    axios.post("http://localhost:5000/api/incrementNew", {
      timerName,
      currTime,
    });
  };

  const decrementCount = () => {
    setCount((prevCount) => prevCount - 1);
    axios.delete(`http://localhost:5000/api/decrementNew/${name}`);
  };

  const resetCount = () => {
    setCount(0);
    axios.delete(`http://localhost:5000/api/resetNew/${name}`);
  };

  return (
    <div className="wrapper">
      <h1>Start New Timer</h1>
      <div className="body">
        <div className="timerBody">
          <h2 id="nameDisplay">Storing Times For: {name}</h2>
          <div className="display">
            <p className="timerDisplay" id="timerHrs">
              {displayHrs.current}
            </p>
            :
            <p className="timerDisplay" id="timerMins">
              {displayMins.current}
            </p>
            :
            <p className="timerDisplay" id="timerSecs">
              {displaySecs.current}
            </p>
          </div>

          <div className="timerBtns">
            <button className="btn" id="startBtn" onClick={startStop}>
              Start Timer
            </button>
          </div>
        </div>

        <div className="counterBody">
          <h2 id="countDisplay">{count}</h2>
          <div className="counterBtns">
            <button
              className="btn counter-btn"
              id="incBtn"
              onClick={incrementCount}
            >
              Increment
            </button>
            <button
              className="btn counter-btn"
              id="decBtn"
              onClick={decrementCount}
              // disables button if count is 0
              disabled={count === 0}
            >
              Decrement
            </button>
            <button className="btn counter-btn" id="resetBtn" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="navBtns">
        <button className="btn nav-btn" id="backBtn" onClick={goBackBtn}>
          Go Back to Home
        </button>
        <button className="btn nav-btn" id="submitBtn" onClick={goBackBtn}>
          Finish New Timer
        </button>
      </div>
    </div>
  );
};

export default Timer;
