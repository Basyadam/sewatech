import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminUser } from '../../types';
import {
  ShieldCheck,
  UserPlus,
  Shield,
  User,
  Mail,
  Calendar,
  Briefcase,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminTeamManagement: React.FC = () => {
  const { adminUsers, currentAdmin, adminRegister } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const res = adminRegister({
      name,
      username,
      email,
      password,
      role: 'admin'
    });

    if (!res.success) {
      setMessage({ text: res.message, type: 'error' });
    } else {
      setMessage({ text: `Admin baru ${name} berhasil ditambahkan!`, type: 'success' });
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-800" />
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Manajemen Tim & Akun Admin Pengelola
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Daftar pengelola dengan hak akses operasional, validasi KTP, dan penerimaan dana QRIS.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setMessage(null);
          }}
          className="px-3.5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showAddForm ? 'Tutup Formulir' : '+ Daftarkan Admin Baru'}</span>
        </button>
      </div>

      {/* Inline Feedback message */}
      {message && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add New Admin Form Card */}
      {showAddForm && (
        <div className="p-5 bg-white border border-cyan-200 rounded-xl shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-cyan-700" />
              <span>Formulir Pendaftaran Admin Baru</span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Akun yang didaftarkan dapat langsung digunakan untuk login ke panel pengelola ini.
            </p>
          </div>

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nama Lengkap Admin *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Adam Malik"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-cyan-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Username Login *
                </label>
                <input
                  type="text"
                  required
                  placeholder="adam_hub"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-hidden focus:border-cyan-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Email Admin *
                </label>
                <input
                  type="email"
                  required
                  placeholder="adam@sewalaptop.id"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-cyan-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Kata Sandi (Min. 6 Karakter) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-cyan-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Role Akses
                </label>
                <input
                  type="text"
                  readOnly
                  value="Admin"
                  className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-300 rounded-lg text-stone-800 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-lg transition-colors border border-stone-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                Simpan & Daftarkan Admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin Users Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-[#FAF9F5] text-stone-600 font-semibold">
              <tr>
                <th className="p-3.5">Admin & Username</th>
                <th className="p-3.5">Email Resmi</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Terdaftar Sejak</th>
                <th className="p-3.5 text-right">Status Sesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {adminUsers.map(admin => {
                const isCurrent = currentAdmin?.id === admin.id;

                return (
                  <tr key={admin.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-300 overflow-hidden flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                          {admin.avatarUrl ? (
                            <img src={admin.avatarUrl} alt={admin.name} className="w-full h-full object-cover" />
                          ) : (
                            admin.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 flex items-center gap-1.5">
                            <span>{admin.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-cyan-100 text-cyan-800 font-mono px-1.5 py-0.2 rounded border border-cyan-200 font-bold">
                                ANDA
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-stone-500">
                            @{admin.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-stone-600">
                      {admin.email}
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold border bg-cyan-50 text-cyan-800 border-cyan-200">
                        Admin
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-stone-500 text-[11px]">
                      {admin.createdAt}
                    </td>

                    <td className="p-3.5 text-right">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Sedang Aktif
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Terdaftar</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
