// this page will be used to insert new rows and edit existing rows
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./AddEdit.css";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  email: "",
  contact: "",
};

const AddEdit = () => {
  const [state, setState] = useState(initialState);

  // input values
  const { name, email, contact } = state;

  // redirects users back to previous page in history
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // notification to require all fields be filled
    if (!name || !email || !contact) {
      toast.error("Please fill out all input fields");
    } else {
      axios
        .post("http://localhost:5000/api/post", {
          name,
          email,
          contact,
        })
        .then(() => {
          // clear input fields on successful insertion
          setState({ name: "", email: "", contact: "" });
        })
        .catch((err) => toast.error(err.response.data));
      toast.success("Contact Added Successfully!");
      // adding delay (ms) before navigating back to homepage
      setTimeout(() => navigate("/"), 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          value={name}
          onChange={handleInputChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          value={email}
          onChange={handleInputChange}
        />

        <label htmlFor="name">Contact</label>
        <input
          type="number"
          id="contact"
          name="contact"
          placeholder="Your Contact Number"
          value={contact}
          onChange={handleInputChange}
        />

        <input type="submit" value="Save" />
        <Link to="/">
          <input type="button" value="Go Back" />
        </Link>
      </form>
    </div>
  );
};

export default AddEdit;
