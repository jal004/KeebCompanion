import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ViewTimes.css";
import { toast } from "react-toastify";
import axios from "axios";

const ViewTimes = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/api/getSavedTimes");
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteTime = (id) => {
    if (window.confirm("Are you sure you want to delete this timer?")) {
      axios.delete(`http://localhost:5000/api/deleteTimeExists/${id}`);
      toast.success("Timer Deleted Successfully!");
      setTimeout(() => loadData(), 500);
    }
  };

  const deleteAllTimes = () => {
    if (window.confirm("Are you sure you want to delete ALL of the timers?")) {
      axios.delete("http://localhost:5000/api/deleteAllTimes/");
      toast.success("All Of The Timers Deleted Successfully!");
      setTimeout(() => loadData(), 500);
    }
  };

  const editBtnWarning = (id) => {
    if (
      window.confirm(
        `All edits made to an existing timer are permanent and must be submitted by finishing the timer. \nIf you do not make any changes while editing, finish the timer to exit without any updates. \n\nDo not try to use the back button on your browser in an attempt to reverse the changes or cancel the edit. \n\nAfter reading and understanding this, press OK to continue.`
      )
    ) {
      navigate(`/editTimer/${id}`);
    }
  };

  return (
    <div id="timer-crud-wrapper" style={{ marginTop: "160px" }}>
      <h1>View Saved Times</h1>
      <button
        className="crud-btn crud-btn-deleteAll"
        onClick={() => deleteAllTimes()}
      >
        Delete All Times
      </button>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>No.</th>
            <th style={{ textAlign: "center" }}>Name</th>
            <th style={{ textAlign: "center" }}>Total Time</th>
            <th style={{ textAlign: "center" }}>Count</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.total_time}</td>
                <td>{item.count}</td>
                <td>
                  <button
                    className="crud-btn crud-btn-edit"
                    onClick={() => editBtnWarning(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="crud-btn crud-btn-delete"
                    onClick={() => deleteTime(item.id)}
                  >
                    Delete
                  </button>
                  <Link to={`/view/${item.id}`}>
                    <button className="crud-btn crud-btn-view">View</button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to={"/"}>
        <button className="crud-btn crud-btn-back">Go Back to Home</button>
      </Link>
    </div>
  );
};

export default ViewTimes;
