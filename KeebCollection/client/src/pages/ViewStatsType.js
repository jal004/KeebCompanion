import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

const ViewStatsType = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/api/getStats");
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ marginTop: "160px" }}>
      <h1>Statistics Of Collection By Type</h1>
      <h2 style={{ marginTop: "30px" }}>Price Statistics</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Item Type</th>
            <th style={{ textAlign: "center" }}>Min. Price ($)</th>
            <th style={{ textAlign: "center" }}>Max. Price ($)</th>
            <th style={{ textAlign: "center" }}>Avg. Price ($)</th>
            <th style={{ textAlign: "center" }}>Total Price ($)</th>
            <th style={{ textAlign: "center" }}>
              Price Percentage of Entire Collection (%)
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.id}>
                <td>{item.item_type}</td>
                <td>{item.min_price}</td>
                <td>{item.max_price}</td>
                <td>{item.avg_price}</td>
                <td>{item.total_price}</td>
                <td>{item.pct_price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px" }}>Quantity Statistics</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Item Type</th>
            <th style={{ textAlign: "center" }}>Min. Quantity</th>
            <th style={{ textAlign: "center" }}>Max. Quantity</th>
            <th style={{ textAlign: "center" }}>Avg. Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.id}>
                <td>{item.item_type}</td>
                <td>{item.min_quantity}</td>
                <td>{item.max_quantity}</td>
                <td>{item.avg_quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to="/">
        <div className="btn btn-edit btn-back-view">Go Back To Home</div>
      </Link>
    </div>
  );
};

export default ViewStatsType;
