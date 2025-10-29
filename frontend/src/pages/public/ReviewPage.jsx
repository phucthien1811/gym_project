import React from "react";
import "./ReviewPage.css";

const reviews = [
  {
    name: "Alex Carter",
    text:
      "Great coaches and clean facilities. I gained strength and confidence in 3 months.",
    avatar:
      "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Mia Nguyen",
    text:
      "Friendly community and diverse classes. The plans are worth every penny!",
    avatar:
      "https://i.pravatar.cc/100?img=31",
  },
  {
    name: "Kenji Park",
    text:
      "PT sessions are top-notch. Personalized programming helped me lose 7kg.",
    avatar:
      "https://i.pravatar.cc/100?img=5",
  },
];

export default function ReviewPage() {
  return (
    <section id="review" className="section review">
      <div className="container">
        <h2 className="section__eyebrow">Members</h2>
        <h3 className="section__title">
          <span className="text-brand">Reviews</span>
        </h3>

        <div className="review__grid">
          {reviews.map((r) => (
            <article className="testimonial" key={r.name}>
              <div className="testimonial__head">
                <img className="testimonial__avatar" src={r.avatar} alt={r.name} />
                <div>
                  <h4 className="testimonial__name">{r.name}</h4>
                  <p className="testimonial__meta">Royal Fitness Member</p>
                </div>
              </div>
              <p className="testimonial__text">“{r.text}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
