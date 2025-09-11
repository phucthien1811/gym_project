import React from "react";
import Button from "../componets/common/Button";

export default function AboutPage() {
  return (
    <section id="about" className="section about">
      <div className="container about__inner">
        <figure className="about__media">
          <img
            src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1400&auto=format&fit=crop"
            alt="Treadmills at Royal Fitness"
          />
        </figure>

        <div className="about__content">
          <h2 className="section__eyebrow">Why Choose</h2>
          <h3 className="section__title">Us?</h3>

          <ul className="about__bullets">
            <li>Friendly, supportive community to keep you motivated.</li>
            <li>Unlock your potential with expert Personal Trainers.</li>
            <li>Elevate your fitness with practice sessions.</li>
            <li>Supportive management for your success.</li>
          </ul>

          <Button as="a" href="#pricing" size="md">
            Book A Free Class
          </Button>
        </div>
      </div>
    </section>
  );
}
