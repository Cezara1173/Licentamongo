import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();
let refreshInterval;

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

  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setAuthState({ token: data.token, user: data.user });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const savedCart = localStorage.getItem("lastCart");
        if (savedCart) {
          localStorage.setItem("cart", savedCart);
          localStorage.removeItem("lastCart");
        }

        const likesKey = `likedArtists_${data.user._id}`;
        const savedLikes = localStorage.getItem(`last_${likesKey}`);
        if (savedLikes) {
          localStorage.setItem(likesKey, savedLikes);
          localStorage.removeItem(`last_${likesKey}`);
        }

      } else {
        const message = data.message?.toLowerCase() || "";

        if (message.includes("contul nu a fost găsit") || message.includes("user not found")) {
          alert("Contul nu a fost găsit. Creează-ți un cont și devino membru ArtHunt!");
        } else if (message.includes("parola introdusă nu este corectă") || message.includes("wrong password")) {
          alert("Parola introdusă nu este corectă.");
        } else {
          alert(data.message || "Autentificare eșuată.");
        }
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Înregistrare reușită. Te rugăm să te loghezi.");
      } else {
        throw new Error(data.message || "Înregistrarea a eșuat.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const cart = localStorage.getItem("cart");
      const likesKey = user?._id ? `likedArtists_${user._id}` : null;
      const likes = likesKey ? localStorage.getItem(likesKey) : null;

      if (token && !isTokenExpired(token)) {
        if (cart) localStorage.setItem("lastCart", cart);
        if (likesKey && likes) localStorage.setItem(`last_${likesKey}`, likes);
      }

      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      setAuthState({ token: null, user: null });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      if (likesKey) localStorage.removeItem(likesKey);

      clearInterval(refreshInterval);
      window.location.reload();

    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setAuthState((prev) => ({
          ...prev,
          token: data.accessToken,
        }));
        localStorage.setItem("token", data.accessToken);
      } else {
        console.warn("Token refresh failed");
        localStorage.removeItem("cart");
        localStorage.removeItem("lastCart");
        logout();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }, [logout]);

  useEffect(() => {
    if (authState.token) {
      refreshInterval = setInterval(refreshAccessToken, 10 * 60 * 1000);
    }
    return () => clearInterval(refreshInterval);
  }, [authState.token, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
