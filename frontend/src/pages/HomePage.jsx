import React from "react";
import Button from "../componets/common/Button";


export default function HomePage() {
  return (
    <section id="home" className="section hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1 className="hero__title">
            Build Your <br /> <span className="text-brand">Dream Physique</span>
          </h1>

          <h2 className="hero__subtitle">Weight Training • Cardio • Nutrition</h2>

          <p className="hero__desc">
            Lorem ipsum dolor sit, bus earum, aliquam ipsa repellat iusto esse laudantium
            animi vitae consectetur obcaecati.
          </p>

          <div className="hero__actions ">
            <Button as="a" href="#pricing" variant="outline" size="lg">
              View Plans
            </Button>
            <Button size="lg">Join Us</Button>
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
