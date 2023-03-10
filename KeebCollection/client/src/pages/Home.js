import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { toast } from "react-toastify";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/api/get");
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios.delete(`http://localhost:5000/api/remove/${id}`);
      toast.success("Item Deleted Successfully!");
      setTimeout(() => loadData(), 500);
    }
  };

  const deleteAllItems = () => {
    if (window.confirm("Are you sure you want to delete ALL of the items?")) {
      axios.delete("http://localhost:5000/api/removeAll/");
      toast.success("All Of The Items Deleted Successfully!");
      setTimeout(() => loadData(), 500);
    }
  };

  return (
    <div style={{ marginTop: "160px" }}>
      <h1>KeebCollection</h1>
      <Link to={"/addItem"}>
        <button className="btn btn-item">Add Item</button>
      </Link>
      <button className="btn btn-deleteAll" onClick={() => deleteAllItems()}>
        Delete All Items
      </button>
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
                  <Link to={`/update/${item.id}`}>
                    <button className="btn btn-edit">Edit</button>
                  </Link>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
                  <Link to={`/view/${item.id}`}>
                    <button className="btn btn-view">View</button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div id="additional-btns-container" style={{ marginBottom: "30px" }}>
        <Link to={"/view/byType"}>
          <button className="btn btn-stats">View By Type</button>
        </Link>
        <Link to={"/view/statsByType"}>
          <button className="btn btn-stats">View Stats By Type</button>
        </Link>
        <Link to={"/view/byPrice"}>
          <button className="btn btn-stats">View By Price</button>
        </Link>
        <Link to={"/view/byQuantity"}>
          <button className="btn btn-stats">View By Quantity</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
