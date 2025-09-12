import React, { useEffect } from "react";

// Common components (UI-only, bạn đã có)
import Header from "./componets/common/Header";

// Các section pages (UI-only mình đã viết)
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import ReviewPage from "./pages/ReviewPage";

/**
 * App one-page với anchor navigation.
 * - Render tất cả section trên 1 trang
 * - Nếu không có hash khi vào lần đầu -> tự set #home
 * - Hỗ trợ scroll-margin-top để tránh che bởi header sticky (khai báo trong CSS)
 */
export default function App() {
  // Nếu URL chưa có hash, set mặc định #home (để active nav đúng)
  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#home");
    }
  }, []);

  // (Tuỳ chọn) Smooth scroll khi thay hash (nếu CSS chưa bật)
  // CSS bạn có thể dùng: html { scroll-behavior: smooth; }
  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      

      <Header />

      <main>
        <HomePage />
        <ServicesPage />
        <AboutPage />
        <PricingPage />
        <ReviewPage />

        {/* Section join (điểm đến của CTA trong Header) */}
        <section id="join-section" className="section">
          <div className="container">
            <h3 className="section__title">
              <span className="text-brand">Join</span> Royal Fitness
            </h3>
            <p className="mt-12" style={{ maxWidth: 560, color: "#d0d0d0" }}>
              Leave your email and we’ll contact you for a free trial class.
            </p>

            <form
              className="join-form"
              onSubmit={(e) => {
                e.preventDefault(); // UI-only; sau gắn logic
                alert("Submitted (UI-only).");
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email"
                className="join-input"
                aria-label="Your email"
              />
              <button type="submit" className="btn btn--primary btn-md">
                Get Started
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Royal <span className="text-brand">Fitness</span>. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
