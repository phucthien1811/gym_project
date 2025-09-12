import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const LS_KEY = "rf_auth_v1";

// Demo accounts (sau này thay bằng API)
const DEMO_USERS = [
  { id: "1", name: "Admin", email: "admin@royal.fit", role: "admin", password: "123456" },
  { id: "2", name: "Member", email: "member@royal.fit", role: "member", password: "123456" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // khôi phục phiên từ localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = async ({ email, password }) => {
    // demo: kiểm tra mảng cứng
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Email hoặc mật khẩu không đúng.");
    const { password: _pw, ...publicUser } = found;
    setUser(publicUser);
    localStorage.setItem(LS_KEY, JSON.stringify(publicUser));
    return publicUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_KEY);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong <AuthProvider>");
  return ctx;
}
