import React from "react";
import { useNavigate } from "react-router-dom";
import Testimonials from "../../components/testimonials/Testimonials";
import "./home.css";
import heroImg from "./images/hero.png";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">

      <div className="home-content">
        <h1>Welcome to our E-learning Platform</h1>
        <p>Learn, Grow, Excel</p>

       <img
        src={heroImg}
        alt="E-learning"
        className="home-image"
        />

        <button
          onClick={() => navigate("/courses")}
          className="common-btn"
        >
          Get Started
        </button>
      </div>

      <Testimonials />

    </div>
  );
};

export default Home;