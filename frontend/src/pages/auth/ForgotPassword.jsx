import React, { useState } from "react";
import "./auth.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setBtnLoading(true);

    try {
      await axios.post(`${server}/api/user/forgot`, {
        email: email.trim(),
      });

      toast.success("Reset link sent to your email. Check inbox.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <label>Enter Email</label>

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            disabled={btnLoading}
            type="submit"
            className="common-btn"
          >
            {btnLoading ? "Please Wait..." : "Send Reset Link"}
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Check your email after submitting.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;