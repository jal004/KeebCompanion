import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./AddEdit.css";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  item_name: "",
  quantity: "",
  item_type: "",
  price: "",
  additional_notes: "",
};

const AddEdit = () => {
  const [state, setState] = useState(initialState);

  const { item_name, quantity, item_type, price, additional_notes } = state;

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      document.getElementById("title").innerHTML = "Edit Item";
    }
    axios
      .get(`http://localhost:5000/api/get/${id}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item_name || !quantity || !item_type || !price) {
      toast.error("Please fill out all of the required input fields");
    } else {
      if (!id) {
        axios
          .post("http://localhost:5000/api/post", {
            item_name,
            quantity,
            item_type,
            price,
            additional_notes,
          })
          .then(() => {
            // clear input fields on successful insertion
            setState({
              item_name: "",
              quantity: "",
              item_type: "",
              price: "",
              additional_notes: "",
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Item Added Successfully!");
      } else {
        axios
          .put(`http://localhost:5000/api/update/${id}`, {
            item_name,
            quantity,
            item_type,
            price,
            additional_notes,
          })
          .then(() => {
            // clear input fields on successful insertion
            setState({
              item_name: "",
              quantity: "",
              item_type: "",
              price: "",
              additional_notes: "",
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Item Updated Successfully!");
      }
      // adding delay (ms) before navigating back to homepage
      setTimeout(() => navigate("/"), 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div style={{ marginTop: "160px" }}>
      <h1 id="title">Add Item</h1>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="item_name">Item Name</label>
        <input
          type="text"
          id="item_name"
          name="item_name"
          placeholder="Name of the item"
          value={item_name}
          onChange={handleInputChange}
        />

        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          placeholder="Quantity of the item"
          value={quantity}
          onChange={handleInputChange}
        />

        <label htmlFor="item_type">Item Type</label>
        <select
          name="item_type"
          id="item_type"
          required
          onChange={handleInputChange}
        >
          {/* required for placeholder text in select */}
          <option value="" selected disabled hidden>
            Select the type of the item
          </option>
          <option value="Keyboard">Keyboard</option>
          <option value="Switches">Switches</option>
          <option value="Keycaps">Keycaps</option>
          <option value="Artisan">Artisan</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="price">Price ($)</label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="Price of the item in dollars"
          value={price}
          onChange={handleInputChange}
        />

        <label htmlFor="additional_notes">Additional Notes (Optional)</label>
        <textarea
          style={{ resize: "none" }}
          type="text"
          id="additional_notes"
          name="additional_notes"
          rows="6"
          maxlength="255"
          placeholder="Additional notes for the item (255 character limit)"
          value={additional_notes}
          onChange={handleInputChange}
        ></textarea>
        <input type="submit" value="Save" />
        <Link to="/">
          <input type="button" value="Go Back" />
        </Link>
      </form>
    </div>
  );
};

export default AddEdit;
