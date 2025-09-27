import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.Page.css";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Vui lòng nhập tên đăng nhập";
    if (!form.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ";
    if (!form.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 6) newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccess("Đăng ký thành công!");
      setServerError("");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Đăng ký tài khoản</h2>
        {serverError && <div className="error-message">{serverError}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;