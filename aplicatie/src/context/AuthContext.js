import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

let refreshInterval; // Store interval reference globally

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem("token") || null,
    user: (() => {
      try {
        const storedUser = localStorage.getItem("user");
        return storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    })(),
  });

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        // Update the state with new token and user info
        setAuthState({ token: data.token, user: data.user });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        alert("Registration successful, please log in.");
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setAuthState({ token: null, user: null });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      clearInterval(refreshInterval);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setAuthState((prevState) => ({
          ...prevState,
          token: data.accessToken,
        }));
        localStorage.setItem("token", data.accessToken);
      } else {
        console.warn("Token refresh failed");
        logout();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  useEffect(() => {
    if (authState.token) {
      refreshInterval = setInterval(refreshAccessToken, 10 * 60 * 10000);
    }
    return () => clearInterval(refreshInterval);
  }, [authState.token]);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
