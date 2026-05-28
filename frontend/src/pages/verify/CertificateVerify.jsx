import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import "./certificateVerify.css";

const CertificateVerify = () => {
  const { certId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `${server}/api/certificate/verify/${certId}`
        );

        setData(res.data);
      } catch (err) {
        console.error("Verification failed:", err);
        setData({ valid: false });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [certId]);

  if (loading) {
    return (
      <div className="verify-page">
        <h2>Checking Certificate...</h2>
      </div>
    );
  }

  if (!data.valid) {
    return (
      <div className="verify-page error">
        <h2>❌ Invalid Certificate</h2>
        <p>This certificate is not recognized.</p>
      </div>
    );
  }

  return (
    <div className="verify-page success">

      <h1>✔ Certificate Verified</h1>

      <div className="verify-card">
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Course:</strong> {data.course}</p>
        <p><strong>Score:</strong> {data.score.toFixed(2)}%</p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(data.date).toLocaleDateString()}
        </p>
      </div>

    </div>
  );
};

export default CertificateVerify;