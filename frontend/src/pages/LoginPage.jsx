import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../componets/common/Button.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const u = await login(form);
      // nếu là admin chuyển tới /admin, không thì về trang trước
      if (u.role === "admin") navigate("/admin", { replace: true });
      else navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <section className="section">
      <div className="container" style={{display:"grid", placeItems:"center"}}>
        <div className="auth-card">
          <h1 className="auth-title">Login</h1>
          {error && <div className="auth-error">{error}</div>}
          <form className="auth-form" onSubmit={onSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="admin@royal.fit"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                className="input"
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••"
                required
              />
            </label>

            <Button type="submit" className="w-full btn-lg">Sign in</Button>

            <div className="auth-hint">
              Demo: <code>admin@royal.fit</code> / <code>123456</code>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
