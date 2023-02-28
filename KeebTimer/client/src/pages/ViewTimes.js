import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ViewTimes.css";
import { toast } from "react-toastify";
import axios from "axios";

const ViewTimes = () => {
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

  return (
    <div style={{ marginTop: "160px" }}>
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
                  <Link to={`/editTimer/${item.id}`}>
                    <button className="crud-btn crud-btn-edit">Edit</button>
                  </Link>
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
