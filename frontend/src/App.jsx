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
import Card1 from "./pages/admin/Card/Card1.jsx";
import Card2 from "./pages/admin/Card/Card2.jsx";
import Card3 from "./pages/admin/Card/Card3.jsx";
import Card4 from "./pages/admin/Card/Card4.jsx";
import Card5 from "./pages/admin/Card/Card5.jsx";
import Card6 from "./pages/admin/Card/Card6.jsx";
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

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route
//             path="/admin"
//             element={
//               <AdminRoute>
//                 <AdminLayout />
//               </AdminRoute>
//             }
//           >
//             <Route index element={<AdminDashboard />} />
//             <Route path="members" element={<AdminMembers />} />
//           </Route>
//           <Route path="*" element={<Landing />} />
//         </Routes>
//         <Routes path="card1" element={<Card1/>}></Routes>
//         <Routes path="card2" element={<Card2/>}></Routes>
//         <Routes path="card3" element={<Card3/>}></Routes>
//         <Routes path="card4" element={<Card4/>}></Routes>
//         <Routes path="card5" element={<Card5/>}></Routes>
//         <Routes path="card6" element={<Card6/>}></Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }
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
            <Route path="card1" element={<Card1 />} />
            <Route path="card2" element={<Card2 />} />
            <Route path="card3" element={<Card3 />} />
            <Route path="card4" element={<Card4 />} />
            <Route path="card5" element={<Card5 />} />
            <Route path="card6" element={<Card6 />} />
          </Route>
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}