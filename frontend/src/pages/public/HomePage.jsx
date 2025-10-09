import React from "react";
import Button from "../../components/common/Button.jsx";
import "./HomePage.css";

export default function HomePage() {
  const scrollToJoin = () => {
    const el = document.getElementById("join-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="home" className="section hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1 className="hero__title">
            Build Your <br /> <span className="text-brand">Dream Physique</span>
          </h1>

          <h2 className="hero__subtitle">Weight Training • Cardio • Nutrition</h2>

          <p className="hero__desc">
            Dynamic fitness hub, equipped with cutting-edge machines, vibrant atmosphere, and expert trainers for optimal workouts.
          </p>

          <div className="hero__actions">
            <Button as="a" href="#pricing" variant="outline" size="lg">
              View Plans
            </Button>

            {/* 👉 Giống Header: click là scroll mượt tới #join-section */}
            <Button variant="primary" size="lg" onClick={scrollToJoin}>
              Join Us
            </Button>
          </div>
        </div>

        <div className="hero__media" aria-hidden="true">
          <img
            className="hero__image"
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
