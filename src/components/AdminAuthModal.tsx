import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  User,
  Mail,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    adminLogin,
    adminRegister,
    adminUsers
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAuthCode, setRegAuthCode] = useState('SEWALAPTOP2026');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMessage('Mohon isi username/email dan kata sandi.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = adminLogin(loginIdentifier, loginPassword);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.message);
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regAuthCode.trim() !== 'SEWALAPTOP2026') {
      setErrorMessage('Kode otorisasi pendaftaran admin salah. Hubungi Superadmin.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = adminRegister({
        name: regName,
        username: regUsername,
        email: regEmail,
        password: regPassword,
        role: 'admin'
      });

      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.message);
      }
    }, 450);
  };

  const handleQuickFillAdam = () => {
    setLoginIdentifier('adam');
    setLoginPassword('admin123');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-cyan-400 flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm leading-tight">
                Portal Otentikasi Admin
              </h3>
              <p className="text-[11px] text-stone-500">
                SewaLaptop.id Internal Management
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminAuthModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-stone-200 text-xs font-semibold bg-stone-50">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`py-3 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'login'
                ? 'bg-white text-stone-900 border-b-2 border-cyan-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Admin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`py-3 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'register'
                ? 'bg-white text-stone-900 border-b-2 border-cyan-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Admin Baru</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Quick Credential Helper Banner */}
          {activeTab === 'login' && (
            <div className="p-3 bg-cyan-50/80 border border-cyan-200/90 rounded-xl text-xs flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-cyan-950 block">Akun Bawaan (Adam):</span>
                <span className="text-[11px] text-cyan-800 font-mono">user: adam · pass: admin123</span>
              </div>
              <button
                type="button"
                onClick={handleQuickFillAdam}
                className="px-2.5 py-1 bg-white hover:bg-cyan-100 text-cyan-800 border border-cyan-300 font-semibold rounded-md text-[11px] transition-colors shadow-2xs whitespace-nowrap"
              >
                Isi Cepat
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Login Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Username atau Email Admin *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: adam atau admin@sewalaptop.id"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Kata Sandi (Password) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan kata sandi..."
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="p-1 text-stone-400 hover:text-stone-600 absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isLoading ? 'Memvalidasi Kredensial...' : 'Masuk ke Panel Pengelola'}</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-stone-500 pt-1">
                Belum punya akun admin?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage(null);
                  }}
                  className="text-cyan-800 hover:text-cyan-900 font-semibold underline"
                >
                  Daftar akun baru di sini
                </button>
              </div>
            </form>
          ) : (
            /* 2. Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nama Lengkap Admin *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Adam Malik"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="adam_ops"
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 font-mono placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Role Akses
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      readOnly
                      value="Admin"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-100 border border-stone-300 rounded-lg text-stone-800 font-semibold cursor-not-allowed shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Email Kantor / Resmi *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@sewalaptop.id atau email aktif"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Kata Sandi (Minimal 6 Karakter) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Buat kata sandi aman..."
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="p-1 text-stone-400 hover:text-stone-600 absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Kode Otorisasi Registrasi Tim *
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regAuthCode}
                    onChange={e => setRegAuthCode(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-hidden focus:border-cyan-700 shadow-2xs"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Default passkey tim internal: <strong className="font-mono text-stone-600">SEWALAPTOP2026</strong>
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 disabled:bg-stone-400 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Mendaftarkan Akun...' : 'Daftarkan Akun & Langsung Masuk'}</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-stone-500 pt-1">
                Sudah memiliki akun admin?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                  }}
                  className="text-cyan-800 hover:text-cyan-900 font-semibold underline"
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          )}

          {/* Active Admin Count Indicator */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Terdaftar {adminUsers.length} akun pengelola aktif</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sistem Terenkripsi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
