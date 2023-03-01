import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./FinishNewTimer.css";

const initialState = {
  time_name: "",
  total_time: "",
  count: "",
  additional_notes: "",
};

const FinishExistingTimer = () => {
  const [state, setState] = useState(initialState);
  const { time_name, total_time, count, additional_notes } = state;

  const navigate = useNavigate();
  const { id } = useParams();

  // fetching submission values of existing timer
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getSubmissionExists/${id}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:5000/api/submitTimerExists", {
        id,
        time_name,
        total_time,
        count,
        additional_notes,
      })
      .then(() => {
        setState({
          time_name: "",
          total_time: "",
          count: "",
          additional_notes: "",
        });
      })
      .catch((err) => toast.error(err.response.data));
    toast.success("Timer Updated Successfully!");
    setTimeout(() => navigate("/viewTimes"), 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div style={{ marginTop: "160px" }}>
      <h1 id="title">Finish Existing Timer</h1>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="time_name">Timer Name</label>
        <input
          type="text"
          id="time_name"
          name="time_name"
          value={time_name}
          onChange={handleInputChange}
        />

        <label htmlFor="total_time">Total Time</label>
        <input
          className="readOnly"
          type="text"
          id="total_time"
          name="total_time"
          value={total_time}
          readOnly
        />

        <label htmlFor="count">Count</label>
        <input
          className="readOnly"
          type="number"
          id="count"
          name="count"
          value={count}
          readOnly
        />

        <label htmlFor="additional_notes">Additional Notes (Optional)</label>
        <textarea
          style={{ resize: "none" }}
          type="text"
          id="additional_notes"
          name="additional_notes"
          rows="6"
          maxLength="255"
          placeholder="Additional notes for the item (255 character limit)"
          value={additional_notes}
          onChange={handleInputChange}
        ></textarea>
        <input type="submit" value="Update Timer" />
        <input type="button" value="Go Back" onClick={() => navigate(-1)} />
      </form>
    </div>
  );
};

export default FinishExistingTimer;
