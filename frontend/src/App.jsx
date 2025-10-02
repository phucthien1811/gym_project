import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import Header from "./components/common/Header.jsx";
import HomePage from "./pages/public/HomePage.jsx";
import ServicesPage from "./pages/public/ServicesPage.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import PricingPage from "./pages/public/PricingPage.jsx";
import ReviewPage from "./pages/public/ReviewPage.jsx";
import ShopPage from "./pages/shop/ShopPage.jsx";
import CartPage from "./pages/shop/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";

import AdminLayout from "./components/layout/AdminLayout.jsx";
import MemberLayout from "./components/layout/MemberLayout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminMembers from "./pages/admin/AdminMembers.jsx";
import Trainers from "./pages/admin/Trainers.jsx";
import AdminClasses from "./pages/admin/AdminClasses.jsx";
import AdminPlans from "./pages/admin/AdminPlans.jsx";
import AdminInvoices from "./pages/admin/AdminInvoices.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminStaff from "./pages/admin/AdminStaff.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";

import MemberDashboard from "./pages/member/MemberDashboard.jsx";
import MemberProfile from "./pages/member/Profile.jsx";
import MemberSchedule from "./pages/member/MemberSchedule.jsx";
import BookClass from "./pages/member/BookClass.jsx";
import TrainingProgress from "./pages/member/TrainingProgress.jsx";
import MemberPackages from "./pages/member/MemberPackages.jsx";
import MyOrders from "./pages/member/MyOrders.jsx";
import OrderDetail from "./pages/member/OrderDetail.jsx";
import TransactionHistory from "./pages/member/TransactionHistory.jsx";

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

function MemberRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== "member") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          
          {/* Admin Routes */}
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
            <Route path="trainers" element={<Trainers />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Member Routes */}
          <Route
            path="/member"
            element={
              <MemberRoute>
                <MemberLayout />
              </MemberRoute>
            }
          >
            <Route index element={<Navigate to="/member/dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="schedule" element={<MemberSchedule />} />
            <Route path="book-class" element={<BookClass />} />
            <Route path="progress" element={<TrainingProgress />} />
            <Route path="packages" element={<MemberPackages />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="transactions" element={<TransactionHistory />} />
          </Route>

          <Route path="*" element={<Landing />} />
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}