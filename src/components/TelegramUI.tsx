import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoldenDinoLogo } from './GoldenDinoLogo';
import { SettingsModal } from './settings/SettingsModal';
import { translations } from '../constants/translations';
import { Send, Search, MoreVertical, Paperclip, Smile, Video, Image as ImageIcon, Music, Forward, User, Users, Plus, X, Lock, Settings, RefreshCw, Shield, Database, Zap, Volume2, BellOff, BarChart2, Download, Eraser, Trash2, ChevronRight } from 'lucide-react';

interface Chat {
  chat_id: number;
  name: string;
  type: string;
  last_message_date: number;
  photo_url: string | null;
  can_send_messages: number;
}

interface Message {
  id: number;
  chat_id: number;
  sender_name: string;
  sender_id: number;
  text: string;
  date: number;
  media_type: string | null;
  media_url: string | null;
  reply_to_id: number | null;
  reply_to_text: string | null;
  forward_from_name: string | null;
  is_outgoing: number;
}

interface TelegramUIProps {
  onLock: () => void;
}

export const TelegramUI: React.FC<TelegramUIProps> = ({ onLock }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newChatIdentifier, setNewChatIdentifier] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeepSyncing, setIsDeepSyncing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<any>({
    app_name: 'Golden T-Rex',
    theme: 'dark-gold',
    auto_sync: true,
    app_icon_variant: 'classic',
    perf_gold: true,
    auto_refresh: true,
    notify_private: true,
    notify_groups: true,
    notify_channels: true,
    notify_sound: true,
    power_save: false,
    anim_stickers: true,
    anim_bg: true,
    anim_effects: true,
    language: 'ar'
  });
  const [botInfo, setBotInfo] = useState<any>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    if (type !== 'error') {
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const t = translations[settings.language] || translations.ar;

  // Sound notification effect
  const lastMessageId = useRef<number | null>(null);
  useEffect(() => {
    if (messages.length > 0 && settings.notify_sound === 'true') {
      const latest = messages[messages.length - 1];
      if (latest.id !== lastMessageId.current && !latest.is_outgoing) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
        lastMessageId.current = latest.id;
      }
    }
  }, [messages, settings.notify_sound]);

  useEffect(() => {
    fetchBotInfo();
    fetchChats();
    fetchSettings();
    
    let interval: any;
    if (settings.auto_refresh === 'true') {
      interval = setInterval(fetchChats, 5000);
    }
    return () => clearInterval(interval);
  }, [settings.auto_refresh]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (e) { console.error(e); }
  };

  const handleSync = async () => {
    setIsDeepSyncing(true);
    try {
      await fetch('/api/sync', { method: 'POST' });
      await fetchChats();
      if (selectedChat) await fetchMessages(selectedChat.chat_id);
    } catch (e) { console.error(e); }
    setTimeout(() => setIsDeepSyncing(false), 3000);
  };

  const saveSettings = async (newSettings: any) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings }),
      });
      if (res.ok) {
        setSettings(newSettings);
        fetchBotInfo(); // Refresh bot info in case token changed
      }
    } catch (e) { console.error(e); }
  };

  const clearStorage = async () => {
    if (!confirm(t.clear_storage_confirm)) return;
    try {
      await fetch('/api/messages/clear', { method: 'POST' });
      setMessages([]);
      showNotification(t.clear_storage_success, 'success');
    } catch (e) { console.error(e); }
  };

  const fetchBotInfo = async () => {
    try {
      const res = await fetch('/api/me');
      const data = await res.json();
      setBotInfo(data);
    } catch (e) {}
  };

  useEffect(() => {
    if (selectedChat) {
      localStorage.setItem('selectedChatId', selectedChat.chat_id.toString());
      fetchMessages(selectedChat.chat_id);
      
      let interval: any;
      if (settings.auto_refresh === 'true') {
        interval = setInterval(() => fetchMessages(selectedChat.chat_id), 3000);
      }
      return () => clearInterval(interval);
    }
  }, [selectedChat, settings.auto_refresh]);

  useEffect(() => {
    if (chats.length > 0 && !selectedChat) {
      const savedChatId = localStorage.getItem('selectedChatId');
      if (savedChatId) {
        const chat = chats.find(c => c.chat_id.toString() === savedChatId);
        if (chat) setSelectedChat(chat);
      }
    }
  }, [chats, selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      const data = await res.json();
      setChats(data);
    } catch (e) { console.error(e); }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      const res = await fetch(`/api/messages/${chatId}`);
      const data = await res.json();
      setMessages(data);
    } catch (e) { console.error(e); }
  };

  const clearChatHistory = async () => {
    if (!selectedChat) return;
    if (!confirm(t.clear_storage_confirm)) return;
    try {
      const res = await fetch(`/api/messages/clear/${selectedChat.chat_id}`, { method: 'POST' });
      if (res.ok) {
        setMessages([]);
        showNotification(t.clear_storage_success, 'success');
      }
    } catch (e) { console.error(e); }
    setIsChatMenuOpen(false);
  };

  const deleteChat = async () => {
    if (!selectedChat) return;
    if (!confirm(`${t.delete_chat}?`)) return;
    try {
      const res = await fetch(`/api/chats/${selectedChat.chat_id}`, { method: 'DELETE' });
      if (res.ok) {
        setChats(prev => prev.filter(c => c.chat_id !== selectedChat.chat_id));
        setSelectedChat(null);
        showNotification(t.delete_chat, 'success');
      }
    } catch (e) { console.error(e); }
    setIsChatMenuOpen(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: selectedChat.chat_id, text: inputText }),
      });
      if (!res.ok) {
        const err = await res.json();
        showNotification(`${err.error}\n\nDetails: ${err.details || 'No additional details'}`, 'error');
      }
      setInputText('');
      fetchMessages(selectedChat.chat_id);
    } catch (e) { console.error(e); }
  };

  const handleResendMessage = async (text: string) => {
    if (!selectedChat) return;
    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: selectedChat.chat_id, text }),
      });
      fetchMessages(selectedChat.chat_id);
    } catch (e) { console.error(e); }
  };

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinIdentifier, setJoinIdentifier] = useState('');
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [mutedChats, setMutedChats] = useState<number[]>([]);
  const [chatWallpapers, setChatWallpapers] = useState<{[key: number]: string}>({});

  const toggleMute = () => {
    if (!selectedChat) return;
    const isMuted = mutedChats.includes(selectedChat.chat_id);
    if (isMuted) {
      setMutedChats(prev => prev.filter(id => id !== selectedChat.chat_id));
      showNotification(t.unmute_notifications, 'success');
    } else {
      setMutedChats(prev => [...prev, selectedChat.chat_id]);
      showNotification(t.mute_notifications, 'success');
    }
    setIsChatMenuOpen(false);
  };

  const handleLinkClick = async (e: React.MouseEvent, url: string) => {
    if (url.includes('t.me/')) {
      e.preventDefault();
      const identifier = url.split('t.me/')[1].split('?')[0];
      if (identifier && settings.premium_links) {
        setJoinIdentifier(identifier);
        setIsJoinModalOpen(true);
      } else {
        window.open(url, '_blank');
      }
    } else {
      e.preventDefault();
      window.open(url, '_blank');
    }
  };

  const confirmJoinChat = async () => {
    setIsAdding(true);
    try {
      const res = await fetch('/api/chats/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: joinIdentifier }),
      });
      const data = await res.json();
      if (data.success) {
        fetchChats();
        setIsJoinModalOpen(false);
        showNotification(`تمت إضافة ${joinIdentifier} بنجاح إلى شبكة T-Rex الذهبية.`, 'success');
      } else {
        showNotification(`⚠️ تعذر الانضمام: ${data.details || 'تأكد من صلاحيات البوت أو صحة الرابط.'}`, 'error');
      }
    } catch (e) { 
      console.error(e);
      showNotification('⚠️ حدث خطأ أثناء محاولة الاتصال بالخادم الذهبي.', 'error');
    }
    finally { setIsAdding(false); }
  };

  const handleAddChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatIdentifier.trim()) return;
    setIsAdding(true);
    setIsSyncing(true);
    try {
      const res = await fetch('/api/chats/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: newChatIdentifier }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewChatIdentifier('');
        fetchChats();
        // Simulate "Scraping" feel
        setTimeout(() => setIsSyncing(false), 2000);
      } else {
        showNotification(`${data.error || 'Failed to add chat'}\n\nDetails: ${data.details || 'No additional details'}`, 'error');
        setIsSyncing(false);
      }
    } catch (e) {
      console.error(e);
      showNotification('Error connecting to server', 'error');
      setIsSyncing(false);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={`flex h-screen text-white overflow-hidden font-sans transition-all duration-500 theme-${settings.theme || 'dark_gold'} bg-[var(--bg-primary)] ${settings.power_save === 'true' ? 'disable-animations' : ''}`}>
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col relative bg-[var(--bg-primary)] ${settings.anim_bg === 'true' ? 'bg-animated' : ''}`}>
        {/* Chat Header */}
        {selectedChat ? (
          <div className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-4">
              {selectedChat.photo_url ? (
                <img 
                  src={`/api/media/${selectedChat.photo_url}`} 
                  className="w-10 h-10 rounded-full object-cover border border-gold-500/30 shadow-[0_0_10px_rgba(250,176,5,0.2)]" 
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center font-bold text-black shadow-lg">
                  {selectedChat.name?.[0] || '?'}
                </div>
              )}
              <div>
                <h2 className="font-bold text-gold-100 high-contrast-text">{selectedChat.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] text-gold-500/60 uppercase tracking-tighter dim-text">{t[selectedChat.type] || selectedChat.type}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gold-500/80">
              {mutedChats.includes(selectedChat.chat_id) && (
                <BellOff size={14} className="text-zinc-500" />
              )}
              {(isSyncing || isDeepSyncing) && (
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                  className="text-gold-500 opacity-30"
                >
                  <RefreshCw size={14} />
                </motion.div>
              )}
              <Search size={20} className="cursor-pointer hover:text-gold-400" />
              <div className="relative">
                <MoreVertical 
                  size={20} 
                  className={`cursor-pointer transition-colors ${isChatMenuOpen ? 'text-gold-400' : 'hover:text-gold-400'}`} 
                  onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
                />
                
                <AnimatePresence>
                  {isChatMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setIsChatMenuOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-64 glass-panel border border-white/10 rounded-2xl shadow-2xl z-40 overflow-hidden py-2"
                      >
                        <button 
                          onClick={toggleMute}
                          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <BellOff size={18} className={`${mutedChats.includes(selectedChat.chat_id) ? 'text-gold-500' : 'text-zinc-500'} group-hover:text-gold-500`} />
                            <span className="text-sm text-zinc-300 group-hover:text-white">
                              {mutedChats.includes(selectedChat.chat_id) ? t.unmute_notifications : t.mute_notifications}
                            </span>
                          </div>
                          <ChevronRight size={14} className="text-zinc-600" />
                        </button>
                        
                        <button 
                          onClick={() => { setIsProfileModalOpen(true); setIsChatMenuOpen(false); }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors group"
                        >
                          <User size={18} className="text-zinc-500 group-hover:text-gold-500" />
                          <span className="text-sm text-zinc-300 group-hover:text-white">{t.view_profile}</span>
                        </button>
                        
                        <button 
                          onClick={() => { setIsPollModalOpen(true); setIsChatMenuOpen(false); }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors group"
                        >
                          <BarChart2 size={18} className="text-zinc-500 group-hover:text-gold-500" />
                          <span className="text-sm text-zinc-300 group-hover:text-white">{t.create_poll}</span>
                        </button>
                        
                        <button 
                          onClick={() => { setIsWallpaperModalOpen(true); setIsChatMenuOpen(false); }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors group"
                        >
                          <ImageIcon size={18} className="text-zinc-500 group-hover:text-gold-500" />
                          <span className="text-sm text-zinc-300 group-hover:text-white">{t.set_wallpaper}</span>
                        </button>
                        
                        <div className="h-px bg-white/5 my-1" />
                        
                        <button 
                          onClick={clearChatHistory}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors group"
                        >
                          <Eraser size={18} className="text-zinc-500 group-hover:text-gold-500" />
                          <span className="text-sm text-zinc-300 group-hover:text-white">{t.clear_history}</span>
                        </button>
                        
                        <button 
                          onClick={deleteChat}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-500/10 transition-colors group"
                        >
                          <Trash2 size={18} className="text-red-500/60 group-hover:text-red-500" />
                          <span className="text-sm text-red-500/80 group-hover:text-red-500">{t.delete_chat}</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              className="w-64 h-64"
            >
              <GoldenDinoLogo variant={settings.app_icon_variant} />
            </motion.div>
            <div className="text-gold-500/30 italic font-display tracking-widest uppercase text-sm">{t.app_name} Network</div>
          </div>
        )}

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth relative"
          style={{ 
            backgroundImage: selectedChat && chatWallpapers[selectedChat.chat_id] ? `url(${chatWallpapers[selectedChat.chat_id]})` : "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {messages.length === 0 && selectedChat && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} 
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-16 h-16 rounded-full border-2 border-dashed border-gold-500/10 flex items-center justify-center"
              >
                <GoldenDinoLogo variant={settings.app_icon_variant} />
              </motion.div>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.is_outgoing === 1 || (botInfo && (msg.sender_id === botInfo.id || msg.sender_name === botInfo.first_name));
            return (
              <motion.div
                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-2xl p-4 shadow-2xl relative group ${
                  isMe 
                    ? 'bg-gradient-to-br from-gold-500 to-gold-700 text-black rounded-tr-none' 
                    : 'bg-zinc-900/80 text-white rounded-tl-none border border-gold-500/10 backdrop-blur-sm'
                }`}>
                  {/* Forwarded Header */}
                  {msg.forward_from_name && (
                    <div className="flex items-center gap-1 mb-2 opacity-60 text-[9px] italic">
                      <Forward size={10} />
                      <span>{t.forwarded_from} {msg.forward_from_name}</span>
                    </div>
                  )}

                  {/* Reply Header */}
                  {msg.reply_to_text && (
                    <div className={`mb-2 p-2 rounded border-l-2 text-[10px] truncate ${
                      isMe ? 'bg-black/10 border-black/30' : 'bg-white/5 border-gold-500/50'
                    }`}>
                      <p className="opacity-60 font-bold">{t.reply_to}</p>
                      <p className="truncate">{msg.reply_to_text}</p>
                    </div>
                  )}

                  {/* Sender Name */}
                  {!isMe && msg.sender_name !== 'System' && (
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-gold-500">
                      {msg.sender_name}
                    </p>
                  )}

                  {/* Media Content */}
                  {msg.media_type === 'photo' && (
                    <img 
                      src={`/api/media/${msg.media_url}`} 
                      className="rounded-lg mb-2 max-h-64 w-full object-cover border border-white/10 cursor-pointer"
                      referrerPolicy="no-referrer"
                      onClick={() => window.open(`/api/media/${msg.media_url}`)}
                    />
                  )}
                  {msg.media_type === 'video' && (
                    <video 
                      src={`/api/media/${msg.media_url}`} 
                      controls 
                      className="rounded-lg mb-2 max-h-64 w-full border border-white/10"
                    />
                  )}
                  {msg.media_type === 'audio' && (
                    <audio 
                      src={`/api/media/${msg.media_url}`} 
                      controls 
                      className="mb-2 w-full h-8"
                    />
                  )}
                  {msg.media_type === 'voice' && (
                    <audio 
                      src={`/api/media/${msg.media_url}`} 
                      controls 
                      className="mb-2 w-full h-8"
                    />
                  )}
                  {msg.media_type === 'sticker' && (
                    <img 
                      src={`/api/media/${msg.media_url}`} 
                      className="w-48 h-48 object-contain mb-2"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {msg.media_type === 'video_note' && (
                    <video 
                      src={`/api/media/${msg.media_url}`} 
                      controls 
                      className="rounded-full w-48 h-48 object-cover border-2 border-gold-500/30 mb-2"
                    />
                  )}
                  {msg.media_type === 'animation' && (
                    <video 
                      src={`/api/media/${msg.media_url}`} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="rounded-lg mb-2 max-h-64 w-full border border-white/10"
                    />
                  )}
                  {msg.media_type === 'document' && (
                    <a 
                      href={`/api/media/${msg.media_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10 mb-2 hover:bg-white/10 transition-colors"
                    >
                      <Paperclip size={16} className="text-gold-500" />
                      <span className="text-xs truncate">Document</span>
                    </a>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words high-contrast-text">
                    {(() => {
                      if (!msg.text) return null;
                      const urlRegex = /(https?:\/\/[^\s]+)/g;
                      const parts = msg.text.split(urlRegex);
                      return parts.map((part, i) => {
                        if (part.match(urlRegex)) {
                          return (
                            <a 
                              key={i} 
                              href={part} 
                              onClick={(e) => handleLinkClick(e, part)}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`${isMe ? 'text-black font-bold underline' : 'text-gold-400 underline'} break-all relative group/link`}
                            >
                              {part}
                              {settings.premium_links === 'true' && (
                                <span className="absolute -top-4 left-0 text-[8px] bg-gold-500 text-black px-1 rounded opacity-0 group-hover/link:opacity-100 transition-opacity whitespace-nowrap">
                                  {t.secure_link}
                                </span>
                              )}
                            </a>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      });
                    })()}
                  </p>
                  
                  <div className="flex justify-end mt-2 items-center gap-2">
                    {isMe && settings.premium_resend && (
                      <button 
                        onClick={() => handleResendMessage(msg.text)}
                        className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 px-2 py-0.5 rounded hover:bg-black/40 flex items-center gap-1"
                      >
                        <RefreshCw size={8} />
                        {t.resend}
                      </button>
                    )}
                    <span className="text-[9px] opacity-40 font-mono">
                      {new Date(msg.date * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <span className="text-[9px] opacity-40">✓✓</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {selectedChat && (
          <div className="p-4 glass-panel border-t border-white/10">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 text-gold-500/60">
                <Paperclip size={22} className="cursor-pointer hover:text-gold-400 transition-colors" />
              </div>
              <div className="flex-1 relative">
                {(() => {
                  const isReadOnly = selectedChat.can_send_messages === 0 || (selectedChat.type === 'channel' && selectedChat.can_send_messages !== 1);
                  return (
                    <>
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={isReadOnly}
                        placeholder={isReadOnly ? t.read_only_placeholder : t.input_placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold-500/50 transition-all text-sm placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium"
                      />
                      <Smile className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-500/30 cursor-pointer hover:text-gold-400 transition-colors" size={20} />
                    </>
                  );
                })()}
              </div>
              <button
                type="submit"
                disabled={selectedChat.can_send_messages === 0 || (selectedChat.type === 'channel' && selectedChat.can_send_messages !== 1)}
                className="w-14 h-14 rounded-2xl golden-gradient flex items-center justify-center text-black shadow-[0_0_20px_rgba(250,176,5,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                <Send size={22} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Sidebar - Right Side */}
      <div className="w-64 glass-panel border-l border-white/10 flex flex-col z-20 bg-[var(--bg-secondary)]">
        <div className="p-6 border-b border-white/10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold golden-text tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8">
                <GoldenDinoLogo variant={settings.app_icon_variant} />
              </div>
              {t.app_name}
            </h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="w-8 h-8 rounded-full bg-gold-600/20 text-gold-500 flex items-center justify-center hover:bg-gold-600 hover:text-black transition-all"
                title="Add Chat"
              >
                <Plus size={18} />
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-8 h-8 rounded-full bg-gold-600/20 text-gold-500 flex items-center justify-center hover:bg-gold-600 hover:text-black transition-all"
                title="Settings"
              >
                <Settings size={16} />
              </button>
              <button 
                onClick={onLock}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all"
                title="Lock App"
              >
                <Lock size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          {chats.map((chat) => (
            <div
              key={chat.chat_id}
              onClick={() => setSelectedChat(chat)}
              className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 hover:bg-white/5 ${
                selectedChat?.chat_id === chat.chat_id ? 'bg-gold-600/10 border-r-2 border-gold-500' : ''
              }`}
            >
              {chat.photo_url ? (
                <img 
                  src={`/api/media/${chat.photo_url}`} 
                  className="w-10 h-10 rounded-full object-cover border border-gold-500/20" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  chat.type === 'private' ? 'bg-zinc-800 text-gold-400' : 'bg-gold-600 text-black'
                }`}>
                  {chat.type === 'private' ? <User size={18} /> : <Users size={18} />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-medium truncate ${selectedChat?.chat_id === chat.chat_id ? 'text-gold-400' : 'text-zinc-300'}`}>
                    {chat.name}
                  </h3>
                  {mutedChats.includes(chat.chat_id) && (
                    <BellOff size={10} className="text-zinc-500 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 truncate">{chat.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && selectedChat && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel p-8 rounded-3xl border border-gold-500/30 shadow-2xl"
            >
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute right-6 top-6 text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center mb-8">
                {selectedChat.photo_url ? (
                  <img 
                    src={`/api/media/${selectedChat.photo_url}`} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gold-500/20 mb-4 shadow-[0_0_30px_rgba(250,176,5,0.2)]" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gold-600 flex items-center justify-center text-4xl font-bold text-black mb-4 shadow-xl">
                    {selectedChat.name?.[0]}
                  </div>
                )}
                <h2 className="text-2xl font-bold golden-text mb-1">{selectedChat.name}</h2>
                <p className="text-zinc-500 text-sm uppercase tracking-widest">{selectedChat.type}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-gold-500/50 uppercase font-bold mb-1">Chat ID</p>
                  <p className="text-sm font-mono">{selectedChat.chat_id}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-gold-500/50 uppercase font-bold mb-1">Notifications</p>
                  <p className="text-sm">{mutedChats.includes(selectedChat.chat_id) ? t.muted : t.enabled}</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full mt-8 py-4 rounded-xl golden-gradient text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t.close}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Poll Modal */}
      <AnimatePresence>
        {isPollModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPollModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel p-8 rounded-3xl border border-gold-500/30 shadow-2xl"
            >
              <button 
                onClick={() => setIsPollModalOpen(false)}
                className="absolute right-6 top-6 text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold golden-text mb-6">{t.create_poll}</h2>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Question" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold-500"
                />
                <div className="space-y-2">
                  <input type="text" placeholder="Option 1" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                  <input type="text" placeholder="Option 2" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                </div>
              </div>
              
              <button
                onClick={() => {
                  showNotification('Poll feature is coming soon to T-Rex Network!', 'info');
                  setIsPollModalOpen(false);
                }}
                className="w-full mt-8 py-4 rounded-xl golden-gradient text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t.create_poll}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wallpaper Modal */}
      <AnimatePresence>
        {isWallpaperModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWallpaperModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel p-8 rounded-3xl border border-gold-500/30 shadow-2xl"
            >
              <button 
                onClick={() => setIsWallpaperModalOpen(false)}
                className="absolute right-6 top-6 text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold golden-text mb-6">{t.set_wallpaper}</h2>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=500',
                  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=500',
                  'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500',
                  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500',
                  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=500',
                  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=500'
                ].map((url, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (selectedChat) {
                        setChatWallpapers(prev => ({ ...prev, [selectedChat.chat_id]: url }));
                        showNotification(t.set_wallpaper, 'success');
                      }
                      setIsWallpaperModalOpen(false);
                    }}
                    className={`aspect-[9/16] rounded-xl cursor-pointer border-2 transition-all ${selectedChat && chatWallpapers[selectedChat.chat_id] === url ? 'border-gold-500 shadow-[0_0_15px_rgba(250,176,5,0.5)]' : 'border-transparent hover:border-white/20'}`}
                    style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover' }}
                  />
                ))}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (selectedChat) {
                      const newWallpapers = { ...chatWallpapers };
                      delete newWallpapers[selectedChat.chat_id];
                      setChatWallpapers(newWallpapers);
                      showNotification(t.set_wallpaper, 'success');
                    }
                    setIsWallpaperModalOpen(false);
                  }}
                  className="aspect-[9/16] rounded-xl cursor-pointer border-2 border-dashed border-white/10 flex items-center justify-center text-zinc-500 hover:border-gold-500/50 hover:text-gold-500"
                >
                  <RefreshCw size={24} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join Chat Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm glass-panel p-8 rounded-3xl border border-gold-500/50 shadow-[0_0_50px_rgba(250,176,5,0.2)] text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 border border-gold-500/20">
                <Zap size={40} className="animate-pulse" />
              </div>
              <h2 className="text-xl font-bold golden-text mb-2">{t.join_chat_confirm}</h2>
              <p className="text-zinc-400 text-sm mb-8 font-mono">@{joinIdentifier}</p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmJoinChat}
                  disabled={isAdding}
                  className="w-full golden-gradient py-4 rounded-xl text-black font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAdding ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
                  {isAdding ? t.searching : t.join_chat_btn}
                </button>
                <button
                  onClick={() => setIsJoinModalOpen(false)}
                  className="w-full py-4 rounded-xl bg-white/5 text-zinc-400 font-bold hover:bg-white/10 transition-all"
                >
                  {t.cancel || 'إلغاء'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            setSettings={setSettings}
            saveSettings={saveSettings}
            chatsCount={chats.length}
            onClearStorage={clearStorage}
            botInfo={botInfo}
            onRefreshBotInfo={fetchBotInfo}
          />
        )}
      </AnimatePresence>

      {/* Add Chat Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md glass-panel p-8 rounded-3xl border border-gold-500/30"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute right-6 top-6 text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold golden-text mb-2">{t.add_chat}</h2>
              <p className="text-zinc-400 text-sm mb-6">{t.add_chat_desc}</p>
              
              <form onSubmit={handleAddChat} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newChatIdentifier}
                    onChange={(e) => setNewChatIdentifier(e.target.value)}
                    placeholder={t.search_placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-gold-500 transition-all"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full golden-gradient py-4 rounded-xl text-black font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isAdding ? t.searching : t.add_chat}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Overlay */}
      <AnimatePresence>
        {notification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto relative w-full max-w-sm glass-panel p-6 rounded-3xl border border-gold-500/50 shadow-[0_0_50px_rgba(250,176,5,0.3)] text-center overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 opacity-10 ${notification.type === 'error' ? 'bg-red-500' : 'bg-gold-500'}`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border ${
                  notification.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-gold-500/10 text-gold-500 border-gold-500/20'
                }`}>
                  {notification.type === 'error' ? <Zap size={32} /> : <GoldenDinoLogo variant={settings.app_icon_variant} />}
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${notification.type === 'error' ? 'text-red-400' : 'golden-text'}`}>
                  {notification.type === 'error' ? t.error : t.success}
                </h3>
                
                <p className="text-zinc-300 text-sm mb-6 leading-relaxed whitespace-pre-wrap">
                  {notification.message}
                </p>
                
                <button
                  onClick={() => setNotification(null)}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    notification.type === 'error' 
                      ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                      : 'golden-gradient text-black hover:scale-[1.02]'
                  }`}
                >
                  {t.close || 'إغلاق'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
