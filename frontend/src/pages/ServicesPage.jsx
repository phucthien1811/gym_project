import React from "react";

const services = [
  {
    title: "Physical Fitness",
    img: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Weight Gain",
    img: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Strength Training",
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Cardio Program",
    img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Fat Loss",
    img: "https://images.unsplash.com/photo-1517963628607-235ccdd543f3?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Personal Training",
    img: "https://images.unsplash.com/photo-1534367610401-9f51f7b1d1f4?q=80&w=1400&auto=format&fit=crop",
  },
];

export default function ServicesPage() {
  return (
    <section id="services" className="section services">
      <div className="container">
        <h2 className="section__eyebrow">Our</h2>
        <h3 className="section__title">
          <span className="text-brand">Services</span>
        </h3>

        <div className="services__grid">
          {services.map((s) => (
            <article className="service-card" key={s.title}>
              <figure className="service-card__media">
                <img src={s.img} alt={s.title} />
              </figure>
              <h4 className="service-card__title">{s.title}</h4>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
