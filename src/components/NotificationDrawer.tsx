import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  MessageCircle,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationAsRead,
    sendSimulatedNotification,
    setActiveOrder,
    orders,
    setIsTrackingModalOpen
  } = useApp();

  const [channelFilter, setChannelFilter] = useState<'all' | 'wa' | 'email' | 'system'>('all');

  if (!isNotificationDrawerOpen) return null;

  const filteredNotifs = notifications.filter(
    n => channelFilter === 'all' || n.channel === channelFilter
  );

  const handleSimulateReturnReminder = () => {
    sendSimulatedNotification({
      type: 'reminder_return',
      channel: 'wa',
      title: 'Pengingat Pengembalian Sewa (H-1 WhatsApp)',
      message: 'Halo, masa sewa kamera Sony A7 IV Anda akan berakhir besok pukul 18:00 WIB. Mohon persiapkan kelengkapan box atau hubungi CS jika ingin perpanjang.'
    });
  };

  const handleSimulatePaymentReminder = () => {
    sendSimulatedNotification({
      type: 'reminder_payment',
      channel: 'email',
      title: 'Pemberitahuan Tagihan QRIS Aktif (Email)',
      message: 'Tagihan pesanan sewa laptop ASUS ROG Zephyrus G16 sedang aktif. Silakan unggah bukti transfer sebelum batas waktu 15 menit berakhir.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border-l border-stone-200 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-800" />
            <h3 className="font-bold text-stone-900 text-base">Pusat Notifikasi & Reminder</h3>
          </div>
          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Filters */}
        <div className="p-3 bg-[#FAF9F5] border-b border-stone-200 flex items-center gap-2 text-xs">
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              channelFilter === 'all'
                ? 'bg-stone-900 text-white font-medium shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setChannelFilter('wa')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
              channelFilter === 'wa'
                ? 'bg-emerald-700 text-white font-medium shadow-xs'
                : 'text-stone-600 hover:text-emerald-700'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => setChannelFilter('email')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
              channelFilter === 'email'
                ? 'bg-cyan-700 text-white font-medium shadow-xs'
                : 'text-stone-600 hover:text-cyan-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              Belum ada riwayat notifikasi untuk kategori ini.
            </div>
          ) : (
            filteredNotifs.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.orderId) {
                    const found = orders.find(o => o.id === notif.orderId);
                    if (found) {
                      setActiveOrder(found);
                      setIsTrackingModalOpen(true);
                      setIsNotificationDrawerOpen(false);
                    }
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-[#FAF9F5] border-stone-200 text-stone-600'
                    : 'bg-white border-cyan-300 text-stone-900 shadow-xs ring-1 ring-cyan-500/20'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    {notif.channel === 'wa' ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Reminder
                      </span>
                    ) : notif.channel === 'email' ? (
                      <span className="text-cyan-800 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> Email Notification
                      </span>
                    ) : (
                      <span className="text-stone-700 flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5 text-cyan-800" /> Sistem SewaTech
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{notif.timestamp}</span>
                </div>

                <div className="font-bold text-xs text-stone-900 mb-1">{notif.title}</div>
                <p className="text-xs text-stone-600 leading-relaxed">{notif.message}</p>

                {notif.orderId && (
                  <div className="mt-2 text-[10px] text-cyan-800 font-semibold flex items-center gap-1">
                    <span>Lihat detail pesanan terkait</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Simulation testing triggers in footer */}
        <div className="p-4 bg-[#FAF9F5] border-t border-stone-200 space-y-2">
          <div className="text-[11px] text-stone-600 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-800" />
            <span>Uji Coba Pengiriman Notifikasi Reminder Otomatis:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleSimulateReturnReminder}
              className="p-2.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-lg text-stone-800 text-left transition-colors shadow-xs"
            >
              <div className="font-semibold text-emerald-700 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Trigger WA (H-1)</span>
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Pengingat Pengembalian</div>
            </button>
            <button
              onClick={handleSimulatePaymentReminder}
              className="p-2.5 bg-white hover:bg-cyan-50 border border-stone-200 hover:border-cyan-300 rounded-lg text-stone-800 text-left transition-colors shadow-xs"
            >
              <div className="font-semibold text-cyan-800 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Trigger Email</span>
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Tagihan Pembayaran QRIS</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
