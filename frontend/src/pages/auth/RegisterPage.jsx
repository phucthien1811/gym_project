import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/Register.css'; 

// --- Bắt đầu phần giả lập API để ví dụ chạy được ---
const authAPI = {
  register: async (data) => {
    console.log("Registering with:", data);
    if (data.email.includes("existing")) {
      await new Promise(res => setTimeout(res, 500));
      const error = new Error("Conflict");
      error.response = { data: { message: "Email đã tồn tại." } };
      throw error;
    }
    await new Promise(res => setTimeout(res, 1000));
    return { data: { message: "User created successfully" } };
  }
};
// --- Kết thúc phần giả lập API ---

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp.');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'member'
      });

      console.log('Registration successful:', response.data);
      
      navigate('/login', { 
        state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create Your Account</h2>
          <p className="register-subtitle">Start your fitness journey today</p>
        </div>

        {error && (
          <div className="register-error">
            <p>{error}</p>
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="form-input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="login-link">
            Already a member?{' '}
            <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
