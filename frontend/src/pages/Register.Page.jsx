import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.Page.css"; // CSS riêng cho trang đăng ký

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Vui lòng nhập họ và tên.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email không hợp lệ.";
    if (form.password.length < 6) return "Mật khẩu phải từ 6 ký tự.";
    if (form.password !== form.confirm) return "Xác nhận mật khẩu không trùng khớp.";
    if (!form.agree) return "Bạn cần đồng ý với Điều khoản & Chính sách.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) return setError(msg);

    try {
      setLoading(true);
      // TODO: call API thật ở đây
      await new Promise((r) => setTimeout(r, 600)); // giả lập
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "Đăng ký thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gr-page">
      <div className="gr-card" aria-live="polite">
        <header className="gr-head">
          <h1 className="gr-brand">Đăng ký tài khoản</h1>
          <p className="gr-subtitle">Tạo tài khoản để bắt đầu luyện tập</p>
        </header>

        {!!error && <div className="gr-alert" role="alert">{error}</div>}

        <form onSubmit={onSubmit} noValidate className="gr-form">
          <div className="gr-field">
            <label className="gr-label" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              className="gr-input"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={onChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="gr-field">
            <label className="gr-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="gr-input"
              placeholder="nhapemail@vi.du"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="gr-row">
            <div className="gr-field">
              <label className="gr-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="gr-input"
                placeholder="••••••"
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <div className="gr-field">
              <label className="gr-label" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                className="gr-input"
                placeholder="Nhập lại mật khẩu"
                value={form.confirm}
                onChange={onChange}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          </div>

          <label className="gr-agree">
            <input
              type="checkbox"
              className="gr-checkbox"
              name="agree"
              checked={form.agree}
              onChange={onChange}
            />
            Tôi đồng ý với <button type="button" className="gr-link" onClick={()=>alert("Điều khoản (demo)")}>Điều khoản</button> &nbsp;và&nbsp;
            <button type="button" className="gr-link" onClick={()=>alert("Chính sách (demo)")}>Chính sách</button>.
          </label>

          <div className="gr-submit">
            <button type="submit" className="gr-btn" disabled={loading}>
              {loading ? "Đang tạo tài khoản..." : "Register"}
            </button>
            <button
              type="button"
              className="gr-btn gr-btn-secondary"
              onClick={() => navigate("/login")}
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        </form>

        {/* OAuth (demo) – giống login để đồng bộ UI */}
        <div className="gr-oauth">
          <div className="gr-or"><span>hoặc</span></div>
          <button type="button" className="gr-oauth-btn gr-google" onClick={()=>alert("Google register demo")}>
            <svg viewBox="0 0 24 24"><path fill="#EA4335" d="M12 11.9v3.9h5.5c-.2 1.4-1.7 4-5.5 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.7C16.8 4.9 14.6 4 12 4 6.9 4 2.9 8 2.9 13s4 9 9.1 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1.1-.2-1.4H12z"/></svg>
            Đăng ký với Google
          </button>
          <button type="button" className="gr-oauth-btn gr-facebook" onClick={()=>alert("Facebook register demo")}>
            <svg viewBox="0 0 24 24"><path fill="#1877F2" d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2c0-2 1.2-3.2 3-3.2.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.4l-.4 3h-2v7A10 10 0 0 0 22 12"/></svg>
            Đăng ký với Facebook
          </button>
        </div>

        <footer className="gr-footer">
          © {new Date().getFullYear()} GYM Project — Software Engineering Coursework
        </footer>
      </div>
    </div>
  );
}
