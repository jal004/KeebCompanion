import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./View.css";

const View = () => {
  const [item, setItem] = useState({});
  const { id } = useParams();

  // back goes to previous page instead of home;
  // allows users to go back to a table view after viewing one of its rows
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/get/${id}`)
      .then((resp) => setItem({ ...resp.data[0] }));
  }, [id]);

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="card">
        <div className="card-header">
          <p>Item Details</p>
        </div>
        <div className="container">
          <strong>Item ID: </strong>
          <span>{id}</span>
          <br />
          <br />
          <strong>Item Name: </strong>
          <span>{item.item_name}</span>
          <br />
          <br />
          <strong>Quantity: </strong>
          <span>{item.quantity}</span>
          <br />
          <br />
          <strong>Item Type: </strong>
          <span>{item.item_type}</span>
          <br />
          <br />
          <strong>Price: </strong>
          <span>{item.price}</span>
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
          {/* changed to a button that goes back to
           previous page instead of home page; 
           also inline style to make it look like previous Link tag
          */}
          <button
            style={{ paddingTop: "8px" }}
            className="btn btn-edit"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default View;
