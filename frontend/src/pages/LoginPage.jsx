import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/LoginPage.css"; // import CSS

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await login(form);
      if (u?.role === "admin") navigate("/admin", { replace: true });
      else navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gm-page">
      <div className="gm-card" aria-live="polite">
        <header className="gm-head">
          <h1 className="gm-brand">Gym Management</h1>
          <p className="gm-subtitle">Đăng nhập để tiếp tục</p>
        </header>

        <section className="gm-demo">
          Tài khoản demo: <code>admin@royal.fit</code> / <code>123456</code>
        </section>

        <section className="gm-body">
          {error && <div className="gm-alert" role="alert">{error}</div>}

          <form onSubmit={onSubmit} noValidate className="gm-form">
            <div className="gm-field">
              <label className="gm-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="gm-input"
                placeholder="nhapemail@vi.du"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="gm-field">
              <label className="gm-label" htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                className="gm-input"
                placeholder="••••••"
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
                minLength={6}
                required
              />
              <div className="gm-row">
                <label className="gm-remember">
                  <input
                    type="checkbox"
                    className="gm-checkbox"
                    onChange={(e)=>console.log("remember:", e.target.checked)}
                  />
                  Ghi nhớ tôi
                </label>
                <button
                  type="button"
                  className="gm-link"
                  onClick={()=>alert("Quên mật khẩu (demo)")}
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>

            <div className="gm-submit">
              <button type="submit" className="gm-btn" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
              <button
                type="button"
                className="gm-btn gm-btn-secondary"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </div>
          </form>
        </section>
        {/* Thêm phần đăng nhập bằng mạng xã hội */}
<div className="gm-oauth">
  <div className="gm-or"><span>hoặc</span></div>
  <button type="button" className="gm-oauth-btn gm-google" onClick={()=>alert("Google login demo")}>
    <svg viewBox="0 0 24 24"><path fill="#EA4335" d="M12 11.9v3.9h5.5c-.2 1.4-1.7 4-5.5 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.7C16.8 4.9 14.6 4 12 4 6.9 4 2.9 8 2.9 13s4 9 9.1 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1.1-.2-1.4H12z"/></svg>
    Đăng nhập với Google
  </button>
  <button type="button" className="gm-oauth-btn gm-facebook" onClick={()=>alert("Facebook login demo")}>
    <svg viewBox="0 0 24 24"><path fill="#1877F2" d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2c0-2 1.2-3.2 3-3.2.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.4l-.4 3h-2v7A10 10 0 0 0 22 12"/></svg>
    Đăng nhập với Facebook
  </button>
</div>
        <footer className="gm-footer">
          © {new Date().getFullYear()} GYM Project — Software Engineering Coursework
        </footer>
      </div>
    </div>
  );
}
