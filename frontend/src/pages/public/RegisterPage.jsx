import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import {
  Briefcase,
  User,
  Building,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();

  const [role, setRole] = useState("job_seeker"); // 'job_seeker' | 'recruiter'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage("Harap lengkapi semua kolom.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password Anda kurang dari 6 karakter.");
      return;
    }

    if (password.length > 6) {
      setErrorMessage("Password Anda melebihi 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(name.trim(), email.trim(), password, role);

      if (result?.success) {
        showSuccess(
          "Registrasi berhasil! Silakan masuk dengan akun baru Anda.",
        );
        navigate("/login");
      } else {
        const message =
          result?.message || "Registrasi gagal. Silakan coba lagi.";
        setErrorMessage(message);
        showError(message);
      }
    } catch (error) {
      console.error("Register error:", error);

      const message = "Terjadi kesalahan saat registrasi.";
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-xl shadow-orange-950/5">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-600/25 mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Buat Akun JobHunt Baru
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Pilih peran Anda dan mulai jelajahi peluang karir atau talenta
            impian
          </p>
        </div>

        {/* Role Selector Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Daftar Sebagai
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Job Seeker Card */}
            <button
              type="button"
              onClick={() => setRole("job_seeker")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                role === "job_seeker"
                  ? "border-orange-500 bg-orange-50/60 shadow-xs ring-2 ring-orange-500/20"
                  : "border-stone-200 hover:border-stone-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl ${role === "job_seeker" ? "bg-orange-600 text-white" : "bg-stone-100 text-stone-600"}`}
                >
                  <User className="w-5 h-5" />
                </div>
                {role === "job_seeker" && (
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">
                  Pencari Kerja
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                  Cari lowongan & kirim lamaran kerja
                </p>
              </div>
            </button>

            {/* Recruiter Card */}
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                role === "recruiter"
                  ? "border-orange-500 bg-orange-50/60 shadow-xs ring-2 ring-orange-500/20"
                  : "border-stone-200 hover:border-stone-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl ${role === "recruiter" ? "bg-orange-600 text-white" : "bg-stone-100 text-stone-600"}`}
                >
                  <Building className="w-5 h-5" />
                </div>
                {role === "recruiter" && (
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">Recruiter</p>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                  Pasang lowongan & kelola pelamar
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {role === "recruiter"
                ? "Nama Recruiter / Perusahaan"
                : "Nama Lengkap"}
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
              <User className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === "recruiter"
                    ? "PT Teknologi Nusantara atau HRD"
                    : "Budi Santoso"
                }
                className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Alamat Email
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Kata Sandi
              </label>
              <span className="text-[11px] text-stone-400 font-normal">
                Tepat 6 karakter
              </span>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
              <Lock className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-stone-400 hover:text-stone-600 p-0.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Membuat Akun...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Sudah memiliki akun?{" "}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
