import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./View.css";

const View = () => {
  const [item, setItem] = useState({});
  const { id } = useParams();

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
          <strong>ID: </strong>
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
          <Link to="/">
            <div className="btn btn-edit">Go Back</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default View;
