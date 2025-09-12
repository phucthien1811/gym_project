import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import Header from "./componets/common/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminMembers from "./pages/admin/Members.jsx";

function Landing() {
  return (
    <>
      <Header />
      <main>
        <HomePage />
        <ServicesPage />
        <AboutPage />
        <PricingPage />
        <ReviewPage />
        <section id="join-section" className="section">
          <div className="container">
            <h3 className="section__title"><span className="text-brand">Join</span> Royal Fitness</h3>
            <p className="mt-12" style={{ maxWidth: 560, color: "#d0d0d0" }}>
              Leave your email and we’ll contact you for a free trial class.
            </p>
            <form className="join-form" onSubmit={(e)=>{e.preventDefault(); alert("Submitted (UI-only).");}}>
              <input type="email" required placeholder="Your email" className="join-input" aria-label="Your email" />
              <button type="submit" className="btn btn--primary btn-md">Get Started</button>
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

function AdminRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
          </Route>
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
