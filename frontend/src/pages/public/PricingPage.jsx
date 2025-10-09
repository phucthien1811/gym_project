import React from "react";
import Button from "../../components/common/Button";
import "./PricingPage.css";


const plans = [
  {
    name: "BASIC",
    price: 100,
    features: ["Smart workout plan", "At home workouts"],
  },
  {
    name: "PRO",
    price: 150,
    features: ["Pro GYMS", "Smart workout plan", "At home workouts"],
  },
  {
    name: "PREMIUM",
    price: 300,
    features: [
      "ELITE Gyms & Classes",
      "Pro GYMS",
      "Smart workout plan",
      "At home workouts",
      "Personal Training",
    ],
  },
];

export default function PricingPage() {
  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <h2 className="section__eyebrow">Our</h2>
        <h3 className="section__title">
          <span className="text-brand">Plans</span>
        </h3>

        <div className="pricing__grid">
          {plans.map((p) => (
            <article className="plan" key={p.name}>
              <header className="plan__header">
                <h4 className="plan__name">{p.name}</h4>
                <div className="plan__price">
                  ${p.price}
                  <span className="plan__price--unit">/Month</span>
                </div>
              </header>

              <ul className="plan__features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <footer className="plan__footer">
                <Button as="a" href="#join-section" variant="ghost">
                  Join Now →
                </Button>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
