import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("jobhunt_token") || null,
  );
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("jobhunt_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verifikasi token dan sinkronisasi profil user saat aplikasi pertama dimuat
  const checkAuthStatus = useCallback(async () => {
    const savedToken = localStorage.getItem("jobhunt_token");
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      if (response && response.data) {
        setUser(response.data);
        localStorage.setItem("jobhunt_user", JSON.stringify(response.data));
      }
    } catch {
      // Jika token expired atau invalid, bersihkan
      localStorage.removeItem("jobhunt_token");
      localStorage.removeItem("jobhunt_user");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();

    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [checkAuthStatus]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem("jobhunt_token", receivedToken);
      localStorage.setItem("jobhunt_user", JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true, user: receivedUser, message: res.message };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login gagal, periksa email dan password Anda.";
      return { success: false, message };
    }
  };

  // Register handler

  // Register handler
  const register = async (name, email, password, role) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      console.log("Register response:", res.status, res.data);

      return {
        success: true,
        data: res.data,
        message: res.data?.message || "Registrasi berhasil.",
      };
    } catch (error) {
      // Debug informasi error tanpa mencetak password
      console.error("Register error:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });

      const message =
        error.response?.data?.message ||
        (error.response
          ? `Registrasi gagal (HTTP ${error.response.status}).`
          : "Tidak dapat terhubung ke server. Periksa koneksi dan konfigurasi API.");

      return {
        success: false,
        message,
      };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("jobhunt_token");
    localStorage.removeItem("jobhunt_user");
    setToken(null);
    setUser(null);
  };

  const isJobSeeker = user?.role === "job_seeker";
  const isRecruiter = user?.role === "recruiter";
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isLoading,
        isJobSeeker,
        isRecruiter,
        login,
        register,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
