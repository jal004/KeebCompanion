import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Timer.css";

const EditTimer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [savedName, setSavedName] = useState({});
  const [savedTime, setSavedTime] = useState({});
  const [savedCount, setSavedCount] = useState({});

  const [count, setCount] = useState(0);

  let hours = useRef(0);
  let minutes = useRef(0);
  let seconds = useRef(0);

  let name = useRef("");
  let displayHrs = useRef("");
  let displayMins = useRef("");
  let displaySecs = useRef("");

  // fetching saved values of existing timer in the database
  useEffect(() => {
    // getting name of existing timer
    axios.get(`http://localhost:5000/api/getNameExists/${id}`).then((resp) => {
      setSavedName({ ...resp.data[0] });
    });

    // getting time of existing timer
    axios.get(`http://localhost:5000/api/getTimeExists/${id}`).then((resp) => {
      setSavedTime({ ...resp.data[0] });
    });
    // getting count of existing timer
    axios.get(`http://localhost:5000/api/getCountExists/${id}`).then((resp) => {
      setSavedCount({ ...resp.data[0] });
    });
  }, [id]);

  // assigning existing values to each of the values to be displayed
  // name
  useEffect(() => {
    name.current = savedName.name;
  }, [savedName]);

  // timer
  useEffect(() => {
    hours.current = savedTime.hr_exists;
    minutes.current = savedTime.min_exists;
    seconds.current = savedTime.sec_exists;
  }, [savedTime]);

  // counter
  useEffect(() => {
    setCount(savedCount.count_exists);
  }, [savedCount]);

  // processing initial times for display
  displayHrs.current = hours.current < 10 ? "0" + hours.current : hours.current;
  displayMins.current =
    minutes.current < 10 ? "0" + minutes.current : minutes.current;
  displaySecs.current =
    seconds.current < 10 ? "0" + seconds.current : seconds.current;

  // ref storing timer functionality variables
  let timerStatus = useRef("stopped");
  let interval = useRef(null);

  // helper function that increments the timer
  // and processes for display on each call; called by startStop()
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

  // counter functions
  // increment counter
  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
    const currTime = `${displayHrs.current}:${displayMins.current}:${displaySecs.current}`;
    const timerName = name.current;
    const timerId = id;
    axios.post("http://localhost:5000/api/incrementExists", {
      timerName,
      timerId,
      currTime,
    });
  };

  // decrement counter
  const decrementCount = () => {
    setCount((prevCount) => prevCount - 1);
    axios.delete(`http://localhost:5000/api/decrementExists/${id}`);
  };

  // helper function called in reset() function
  const resetCount = () => {
    setCount(0);
    axios.delete(`http://localhost:5000/api/resetExists/${id}`);
  };

  // function that cleans up when user finishes the timer
  const finishTimerBtn = () => {
    // stopping the timer if it is still running before redirecting to submission page
    if (timerStatus.current === "started") {
      window.clearInterval(interval.current);
      timerStatus.current = "stopped";
    }
    // redirect to submission page
    navigate(`/updateTimer/${id}`);
  };

  return (
    <div className="wrapper">
      <h1>Edit Existing Timer</h1>
      <div className="body">
        <div className="timerBody">
          <h2 id="nameDisplay">Storing Times For: {name.current}</h2>
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
          <h2 id="countDiplay">{count}</h2>
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
        <button className="btn nav-btn" id="submitBtn" onClick={finishTimerBtn}>
          Finish Existing Timer
        </button>
      </div>
    </div>
  );
};

export default EditTimer;
