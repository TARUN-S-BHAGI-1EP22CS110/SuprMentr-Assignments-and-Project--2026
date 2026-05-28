import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { server } from "../../main";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./certificate.css";

const Certificate = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const certRef = useRef();

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        const res = await axios.get(
          `${server}/api/certificate/${id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        console.log("CERT DATA:", res.data);

        setData(res.data.certificate);
      } catch (err) {
        console.log("CERT ERROR:", err.response?.data);
        alert(
          err.response?.data?.message ||
          "Failed to load certificate"
        );
      }
    };

    loadCertificate();
  }, [id]);

  const downloadPDF = async () => {
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    pdf.save("certificate.pdf");
  };

  if (!data) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading Certificate...</h2>
      </div>
    );
  }

  return (
    <div className="certificate-wrapper">

      <div className="certificate premium" ref={certRef}>

        {/* 🔥 LOGO */}
        <img src="/logo.png" alt="logo" className="cert-logo" />

        <h1 className="cert-title">CERTIFICATE OF COMPLETION</h1>

        <p className="cert-sub">This certifies that</p>

        <h2 className="cert-name">{data.name}</h2>

        <p className="cert-sub">
          has successfully completed the course
        </p>

        <h3 className="cert-course">{data.courseTitle}</h3>

        {/* 🔥 COURSE IMAGE SAFE */}
        {data.courseImage && (
          <img
            src={
              data.courseImage.startsWith("http")
                ? data.courseImage
                : `${server}${data.courseImage}`
            }
            alt="course"
            className="cert-course-img"
          />
        )}

        <p className="cert-score">
          Score: {data.score?.toFixed(2)}%
        </p>

        {/* 🔥 FOOTER */}
        <div className="cert-footer">

          <div>
            <p>ID: {data.certificateId}</p>
            <p>{new Date(data.date).toLocaleDateString()}</p>
          </div>

          <div className="cert-right">

            {/* 🔥 SIGNATURE */}
            <img
              src="/signature.png"
              alt="sign"
              className="cert-sign"
            />

            {/* 🔥 QR */}
            {data.qrCode && (
              <img
                src={data.qrCode}
                alt="QR"
                className="cert-qr"
              />
            )}

          </div>

        </div>

      </div>

      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>

    </div>
  );
};

export default Certificate;