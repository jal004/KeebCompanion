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

const FinishNewTimer = () => {
  // values to submit in times table
  const [state, setState] = useState(initialState);
  const { time_name, total_time, count, additional_notes } = state;

  const navigate = useNavigate();
  const { name } = useParams();

  // fetching submission values of new timer
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getSubmissionNew/${name}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:5000/api/submitTimerNew", {
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
    toast.success("Timer ");
  };

  return <div>FinishNewTimer</div>;
};

export default FinishNewTimer;
