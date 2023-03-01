import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewTimes.css";
import axios from "axios";

const ViewDetails = () => {
  // data for laps table
  const [lapData, setLapData] = useState([]);
  // data for stats of laps table
  const [stats, setStats] = useState([]);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const loadLaps = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/viewLaps/${id}`
      );
      setLapData(response.data);
    };
    const loadStats = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/viewStats/${id}`
      );
      setStats(response.data);
    };
    loadLaps();
    loadStats();
  }, [id]);

  return (
    <div id="timer-details-wrapper" style={{ marginTop: "160px" }}>
      <h1>More Details</h1>
      <h2 style={{ marginTop: "30px" }}>Timer Statistics Per Lap</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Min. Time</th>
            <th style={{ textAlign: "center" }}>Max. Time</th>
            <th style={{ textAlign: "center" }}>Avg. Time</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item, index) => {
            return (
              <tr key={item.id}>
                <td>{item.min_diff}</td>
                <td>{item.max_diff}</td>
                <td>{item.avg_diff}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px" }}>Timer Laps</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>No.</th>
            <th style={{ textAlign: "center" }}>Name</th>
            <th style={{ textAlign: "center" }}>Current Time</th>
            <th style={{ textAlign: "center" }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {lapData.map((item, index) => {
            return (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.curr_time}</td>
                <td>{item.created_at}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        style={{ paddingTop: "8px", marginTop: "30px", marginBottom: "30px" }}
        id="timer-details-btn"
        className="btn crud-btn-edit"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};

export default ViewDetails;
