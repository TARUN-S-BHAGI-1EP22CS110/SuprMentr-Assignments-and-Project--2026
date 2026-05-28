import React from "react";
import "./footer.css";
import { AiFillLinkedin, AiFillGithub, AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        
        <p>
          © 2026 Your E-Learning Platform. All rights reserved. <br />
          Made with 🔥  by {"TARUN, TANUSHREE, VATHSA , PRAHARSHA  "}
          <a href="#" target="_blank" rel="noreferrer">
            
          </a>
        </p>

        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/tarun-bhagi-99b145281?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noreferrer"
          >
            <AiFillLinkedin />
          </a>

          <a
            href="https://github.com/YOUR-ID"
            target="_blank"
            rel="noreferrer"
          >
            <AiFillGithub />
          </a>

          <a href="#" target="_blank" rel="noreferrer">
            <AiFillInstagram />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;