import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  X,
  Send,
  CheckCheck,
  Sparkles,
  Phone,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
}

const WA_PHONE_NUMBER = '6283188537999';
const WA_DISPLAY_NUMBER = '0831-8853-7999';

export const WhatsAppSupportBubble: React.FC = () => {
  const { isWaChatOpen, setIsWaChatOpen, waPrefilledMessage, setWaPrefilledMessage } = useApp();

  const [inputMessage, setInputMessage] = useState(waPrefilledMessage || '');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'support',
      text: 'Halo! Selamat datang di Customer Service WhatsApp SewaLaptop.id. Ada yang bisa kami bantu seputar peminjaman laptop Windows, MacBook, verifikasi KTP, pembayaran QRIS, atau pricelist sewa?',
      time: 'Baru saja'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Sync prefilled message
  React.useEffect(() => {
    if (waPrefilledMessage) {
      setInputMessage(waPrefilledMessage);
    }
  }, [waPrefilledMessage]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setWaPrefilledMessage('');
    setIsTyping(true);

    // Dynamic smart reply simulation
    setTimeout(() => {
      let replyText = 'Baik kak, pesan Anda telah kami catat. Petugas operasional Hub SewaLaptop.id siap membantu kelancaran sewa Anda.';
      const lower = text.toLowerCase();

      if (lower.includes('ktp') || lower.includes('daftar') || lower.includes('identitas')) {
        replyText = 'Untuk verifikasi KTP, Anda dapat mengisi formulir data diri dan mengupload foto KTP saat hendak meminjam barang. Sistem kami memvalidasi foto secara cepat & aman.';
      } else if (lower.includes('qris') || lower.includes('bayar') || lower.includes('transfer')) {
        replyText = 'Pembayaran sewa menggunakan QRIS resmi SewaLaptop.id. Cukup scan dari BCA, Mandiri, GoPay, OVO, Dana, dll. Lalu upload screenshot bukti bayar untuk langsung divalidasi.';
      } else if (lower.includes('rusak') || lower.includes('hilang') || lower.includes('kendala') || lower.includes('somasi')) {
        replyText = 'Terkait kendala barang rusak atau hilang, Pusat Penyelesaian Masalah kami akan memandu proses klaim ganti rugi atau penyesuaian deposit secara transparan dan adil.';
      } else if (lower.includes('perpanjang') || lower.includes('durasi')) {
        replyText = 'Perpanjangan sewa dapat diproses langsung selama unit belum dipesan oleh penyewa lain. Silakan sebutkan nomor pesanan sewa Anda.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'support',
        text: replyText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleOpenDirectWhatsApp = () => {
    const encoded = encodeURIComponent(inputMessage.trim() || waPrefilledMessage || 'Halo CS SewaLaptop.id, saya ingin konsultasi seputar sewa laptop.');
    window.open(`https://wa.me/${WA_PHONE_NUMBER}?text=${encoded}`, '_blank');
  };

  const quickQuestions = [
    'Tanya ketersediaan unit laptop & Mac',
    'Bantuan verifikasi KTP atau bayar QRIS',
    'Mau perpanjang durasi masa sewa',
    'Pusat bantuan kendala atau kerusakan unit'
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        {!isWaChatOpen && (
          <button
            onClick={() => setIsWaChatOpen(true)}
            aria-label="Buka Chat WhatsApp Customer Service"
            className="group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-105"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5 fill-current" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            </div>
            <span className="hidden sm:inline font-semibold">Tanya CS SewaLaptop.id (Adam)</span>
            <span className="sm:hidden font-semibold">Chat WA Adam</span>
          </button>
        )}
      </div>

      {/* WhatsApp Chat Dialog Drawer */}
      {isWaChatOpen && (
        <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[380px] bg-white border border-stone-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[82vh]">
          {/* Header styled like WhatsApp Business */}
          <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between text-white shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs overflow-hidden border border-emerald-400">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt="CS Adam"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
              </div>
              <div>
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>CS Adam</span>
                  <span className="font-mono text-[11px] bg-emerald-700/80 px-1.5 py-0.2 rounded text-emerald-100">
                    {WA_DISPLAY_NUMBER}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <div className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Online · CS Resmi SewaLaptop.id</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleOpenDirectWhatsApp}
                title="Buka langsung di aplikasi WhatsApp (0831-8853-7999)"
                className="px-2 py-1 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-md text-[10px] font-bold transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Buka WA</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsWaChatOpen(false)}
                className="p-1 hover:bg-[#128C7E] rounded-md transition-colors text-emerald-100 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed styled like WhatsApp */}
          <div className="flex-1 p-3 overflow-y-auto bg-[#EFEAE2] space-y-2.5">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#D9FDD3] text-stone-900 rounded-tr-none'
                      : 'bg-white text-stone-900 rounded-tl-none border border-stone-200/60'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`mt-1 text-[9px] flex items-center justify-end gap-1 ${
                      msg.sender === 'user' ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-white shadow-xs w-fit px-3 py-1.5 rounded-full border border-stone-200">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] ml-1">CS Adam sedang mengetik...</span>
              </div>
            )}
          </div>

          {/* Quick preset chips */}
          <div className="px-3 py-1.5 bg-[#F0F2F5] border-t border-stone-200 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="text-[10px] text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 px-2 py-1 rounded whitespace-nowrap border border-stone-300 shrink-0 shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-[#F0F2F5] border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Tulis pesan ke CS Adam (SewaLaptop.id)..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-emerald-600 shadow-xs"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2 bg-[#25D366] hover:bg-[#20ba5a] disabled:bg-stone-300 disabled:text-stone-400 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
