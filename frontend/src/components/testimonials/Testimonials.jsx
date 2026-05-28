import React from "react";
import "./testimonials.css";
import vigneesh from "./assets/vigneesh.jpeg";
import swaroop from "./assets/swaroop.jpeg";
import srinu from "./assets/srinu.jpeg";
import srini from "./assets/srini.jpeg";
import rupin from "./assets/rupin.jpeg";
import tillu from "./assets/tillu.jpg";


const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "Vigneeshan S",
      position: "Student",
      message:
        "This platform made learning super easy. The structured courses helped me stay consistent.",
      image: vigneesh,
    },
    {
      id: 2,
      name: "Rupin R",
      position: "Student",
      message:
        "Amazing content and smooth UI. I improved my coding skills a lot.",
      image: rupin,
    },
    {
      id: 3,
      name: "Swaroop Tom",
      position: "Student",
      message:
        "The explanations are simple and practical. Highly recommend this platform.",
      image: swaroop,
    },
    {
      id: 4,
      name: "Thilak U M",
      position: "Student",
      message:
        "Great learning experience with real-world examples. Loved the courses!",
      image: tillu,
    },
    {
      id: 5,
      name: "Srinivas R",
      position: "Student",
      message:
        "Clean design and very helpful content. Perfect for beginners.",
      image: srinu,
    },
    {
      id: 6,
      name: "Srinidhi S",
      position: "Student",
      message:
        "One of the best platforms to learn development step by step.",
      image: srini,
    },
  ];

  return (
    <section className="testimonials">
      <h2>What our students say</h2>

      <div className="testimonials-cards">
        {testimonialsData.map((e) => (
          <div className="testimonial-card" key={e.id}>
            
            <div className="student-image">
              <img src={e.image} alt={e.name} />
            </div>

            <p className="message">"{e.message}"</p>

            <div className="info">
              <p className="name">{e.name}</p>
              <p className="position">{e.position}</p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;