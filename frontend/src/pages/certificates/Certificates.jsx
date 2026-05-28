import React, { useEffect, useState, useRef } from "react";
import { UserData } from "../../context/UserContext";
import axios from "axios";
import { server } from "../../main";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./certificates.css";

const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const certRefs = useRef({});
const { user } = UserData();
  useEffect(() => {
  const fetchCertificates = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/certificate`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setCerts(data.certificates || []);
    } catch (err) {
      console.log(err);
    }
  };

  if (user) fetchCertificates();

}, [user]); // 🔥 THIS FIXES YOUR ISSUE

  // 🔥 DOWNLOAD PDF
  const downloadPDF = async (id) => {
    const element = certRefs.current[id];
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    pdf.save("certificate.pdf");
  };

  return (
    <div className="certificates-page">
      <h2>Your Certificates</h2>

      {certs.length === 0 ? (
        <p>No certificates yet</p>
      ) : (
        <div className="cert-grid">
          {certs.map((cert) => {
  const course = cert.courseId || {};

  // ✅ SAFE IMAGE LOGIC
const imagePath = (
  cert.courseImage ||
  course.image ||
  ""
).replace(/\\/g, "/");

const imgSrc = imagePath
  ? `${server}/${imagePath.replace(/^\/+/, "")}`
  : "/placeholder.png";
  return (
    <div key={cert._id} className="cert-card">

      <div
        className="cert-preview"
        ref={(el) => (certRefs.current[cert._id] = el)}
      >

        {/* LOGO */}
       <img
  src="/logo.jpeg"
  className="cert-logo"
  crossOrigin="anonymous"
/>

        {/* TITLE */}
        <h1 className="cert-title">
          CERTIFICATE OF COMPLETION
        </h1>

        <p className="cert-text">This certifies that</p>

        {/* NAME */}
        <h2 className="cert-name">{cert.userName}</h2>

        <p className="cert-text">
          has successfully completed the course
        </p>

        {/* COURSE */}
        <h3 className="cert-course">
          {course.title || cert.courseTitle}
        </h3>

        {/* ✅ FINAL WORKING IMAGE */}
        <img
          src={imgSrc}
          alt="course"
          className="cert-course-img"
          crossOrigin="anonymous"
          onError={(e) => {
            console.log("IMAGE FAILED:", imgSrc);
            e.target.src = "/placeholder.png";
          }}
        />

        {/* SCORE */}
        <p className="cert-score">
          Score: {cert.score.toFixed(2)}%
        </p>

        {/* DATE */}
        <p className="cert-date">
          Issued on{" "}
          {new Date(cert.createdAt).toLocaleDateString()}
        </p>

        {/* FOOTER */}
        <div className="cert-footer">

          <div>
            <p>ID: {cert.certificateId}</p>
          </div>

          <div className="cert-right">

            {/* SIGNATURE */}
            <img src="/signature.png" className="cert-sign" />

            {/* QR */}
            {cert.qrCode && (
              <img src={cert.qrCode} className="cert-qr" />
            )}

          </div>

        </div>

      </div>

      {/* INFO */}
      <div className="cert-info">
        <h4>{course.title || cert.courseTitle}</h4>
        <p>Score: {cert.score.toFixed(2)}%</p>
      </div>

      {/* DOWNLOAD */}
      <button
        className="download-btn"
        onClick={() => downloadPDF(cert._id)}
      >
        Download PDF
      </button>

    </div>
  );
})}
        </div>
      )}
    </div>
  );
};

export default Certificates;