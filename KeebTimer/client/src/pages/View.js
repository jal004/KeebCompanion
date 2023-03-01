import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./View.css";

const View = () => {
  const [item, setItem] = useState({});
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/viewTime/${id}`)
      .then((resp) => setItem({ ...resp.data[0] }));
  }, [id]);

  return (
    <div style={{ marginTop: "160px" }}>
      <div className="card">
        <div className="card-header">
          <p>Timer Information</p>
        </div>
        <div className="container">
          <strong>Timer ID: </strong>
          <span>{id}</span>
          <br />
          <br />
          <strong>Name: </strong>
          <span>{item.name}</span>
          <br />
          <br />
          <strong>Total Time: </strong>
          <span>{item.total_time}</span>
          <br />
          <br />
          <strong>Count: </strong>
          <span>{item.count}</span>
          <br />
          <br />
          <strong>Additional Notes: </strong>
          <span>{item.additional_notes}</span>
          <br />
          <br />
          <strong>Created at: </strong>
          <span>{item.created_at}</span>
          <br />
          <br />
          <strong>Updated at: </strong>
          <span>{item.updated_at}</span>
          <br />
          <br />
          <div className="view-btns-container">
            <button
              style={{ paddingTop: "8px" }}
              id="timer-details-btn"
              className="btn crud-btn-edit"
              onClick={() => navigate(`/viewDetails/${id}`)}
            >
              More Details
            </button>
            <button
              style={{ paddingTop: "8px" }}
              id="timer-back-btn"
              className="btn crud-btn-edit"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
