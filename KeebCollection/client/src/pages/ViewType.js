import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

const ViewType = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/api/getByType");
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ marginTop: "160px" }}>
      <h1>Collection By Type</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>No.</th>
            <th style={{ textAlign: "center" }}>Item Name</th>
            <th style={{ textAlign: "center" }}>Quantity</th>
            <th style={{ textAlign: "center" }}>Item Type</th>
            <th style={{ textAlign: "center" }}>Price ($)</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{item.item_type}</td>
                <td>{item.price}</td>
                <td>
                  <Link to={`/view/${item.id}`}>
                    <button className="btn btn-view">View</button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to="/">
        <div
          style={{ marginBottom: "30px" }}
          className="btn btn-edit btn-back-view"
        >
          Go Back To Home
        </div>
      </Link>
    </div>
  );
};

export default ViewType;
