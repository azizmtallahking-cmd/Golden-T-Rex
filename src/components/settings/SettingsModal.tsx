import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Settings, Palette, Database, Shield, User, ChevronLeft, 
  Bell, Folder, Cpu, Speaker, Battery, Globe, QrCode, Search, MoreVertical, Sparkles
} from 'lucide-react';
import { AppearanceSection } from './AppearanceSection';
import { DataSection } from './DataSection';
import { PrivacySection } from './PrivacySection';
import { AccountSection } from './AccountSection';
import { NotificationsSection } from './NotificationsSection';
import { FoldersSection } from './FoldersSection';
import { AdvancedSection } from './AdvancedSection';
import { SpeakersSection } from './SpeakersSection';
import { BatterySection } from './BatterySection';
import { LanguageSection } from './LanguageSection';
import { ConnectionSection } from './ConnectionSection';
import { PremiumSection } from './PremiumSection';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
  setSettings: (s: any) => void;
  saveSettings: (s: any) => void;
  chatsCount: number;
  onClearStorage: () => void;
  botInfo: any;
  onRefreshBotInfo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, settings, setSettings, saveSettings, chatsCount, onClearStorage, botInfo, onRefreshBotInfo 
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const menuItems = [
    { id: 'account', name: 'My Account', icon: <User size={20} />, color: 'text-blue-400' },
    { id: 'notifications', name: 'Notifications and Sounds', icon: <Bell size={20} />, color: 'text-orange-400' },
    { id: 'privacy', name: 'Privacy and Security', icon: <Shield size={20} />, color: 'text-zinc-400' },
    { id: 'appearance', name: 'Chat Settings', icon: <Palette size={20} />, color: 'text-emerald-400' },
    { id: 'folders', name: 'Folders', icon: <Folder size={20} />, color: 'text-yellow-400' },
    { id: 'advanced', name: 'Advanced', icon: <Settings size={20} />, color: 'text-zinc-400' },
    { id: 'data', name: 'Data and Storage', icon: <Database size={20} />, color: 'text-blue-400' },
    { id: 'connection', name: 'إعدادات الربط', icon: <Globe size={20} />, color: 'text-gold-400' },
    { id: 'premium', name: 'Telegram Premium', icon: <Sparkles size={20} />, color: 'text-purple-400' },
    { id: 'speakers', name: 'Speakers and Camera', icon: <Speaker size={20} />, color: 'text-zinc-400' },
    { id: 'battery', name: 'Battery and Animations', icon: <Battery size={20} />, color: 'text-emerald-400' },
    { id: 'language', name: 'Language', icon: <Globe size={20} />, color: 'text-zinc-400', extra: settings.language === 'ar' ? 'العربية' : 'English' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-[420px] h-[85vh] bg-[#1c242c] rounded-2xl shadow-2xl border border-white/5 overflow-hidden flex flex-col"
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between p-4 bg-[#1c242c]">
          <div className="flex items-center gap-4">
            {activeTab ? (
              <button 
                onClick={() => setActiveTab(null)}
                className="p-2 rounded-full hover:bg-white/5 text-zinc-400"
              >
                <ChevronLeft size={20} />
              </button>
            ) : (
              <h2 className="text-lg font-medium text-white ml-2">Settings</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!activeTab && <button className="p-2 rounded-full hover:bg-white/5 text-zinc-400"><Search size={20} /></button>}
            <button className="p-2 rounded-full hover:bg-white/5 text-zinc-400"><MoreVertical size={20} /></button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 text-zinc-400"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {!activeTab ? (
              <motion.div
                key="main-menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="pb-8"
              >
                {/* Profile Section */}
                <div 
                  onClick={() => setActiveTab('account')}
                  className="px-6 py-6 flex items-center gap-4 hover:bg-white/5 cursor-pointer group transition-colors"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold text-2xl border-2 border-gold-500/30 overflow-hidden">
                      {botInfo?.custom_photo_url ? (
                        <img src={botInfo.custom_photo_url} className="w-full h-full object-cover" alt="Bot" />
                      ) : (
                        botInfo?.first_name?.[0] || '?'
                      )}
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-2 border-[#1c242c] rounded-full" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white leading-tight">{botInfo?.first_name || 'Golden T-Rex'}</h3>
                    <p className="text-sm text-zinc-400">Bot ID: {botInfo?.id || '8620381706'}</p>
                    <p className="text-xs text-gold-500/80">@{botInfo?.username || 'golden_trex_bot'}</p>
                  </div>
                  <div className="text-zinc-500 group-hover:text-gold-500 transition-colors">
                    <QrCode size={24} />
                  </div>
                </div>

                <div className="h-[1px] bg-white/5 my-2" />

                {/* Menu Items */}
                <div className="space-y-0.5">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors group"
                    >
                      <div className={`${item.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                        {item.icon}
                      </div>
                      <span className="text-sm text-zinc-300 flex-1 text-left">{item.name}</span>
                      {item.extra && (
                        <span className="text-xs text-blue-400 font-medium">{item.extra}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="h-[1px] bg-white/5 my-2" />

                {/* Premium & Connection Quick Access */}
                <div className="px-6 py-4 space-y-3">
                  <button 
                    onClick={() => setActiveTab('connection')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gold-500/5 border border-gold-500/10 hover:bg-gold-500/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-gold-500" />
                      <span className="text-sm font-bold text-gold-100">إعدادات الربط الذهبية</span>
                    </div>
                    <span className="text-[10px] text-gold-500/50 group-hover:text-gold-500 transition-colors">100% Active</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('premium')}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                  >
                    <Sparkles size={18} className="animate-pulse" />
                    Telegram Premium (Chat Excellence)
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="active-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                    {menuItems.find(i => i.id === activeTab)?.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {menuItems.find(i => i.id === activeTab)?.name}
                  </h3>
                </div>

                {activeTab === 'appearance' && <AppearanceSection settings={settings} setSettings={setSettings} />}
                {activeTab === 'data' && <DataSection settings={settings} setSettings={setSettings} chatsCount={chatsCount} onClearStorage={onClearStorage} botInfo={botInfo} />}
                {activeTab === 'privacy' && <PrivacySection settings={settings} setSettings={setSettings} />}
                {activeTab === 'account' && <AccountSection settings={settings} setSettings={setSettings} botInfo={botInfo} onRefreshBotInfo={onRefreshBotInfo} />}
                {activeTab === 'notifications' && <NotificationsSection settings={settings} setSettings={setSettings} />}
                {activeTab === 'folders' && <FoldersSection settings={settings} setSettings={setSettings} />}
                {activeTab === 'advanced' && <AdvancedSection settings={settings} setSettings={setSettings} onClearStorage={onClearStorage} />}
                {activeTab === 'speakers' && <SpeakersSection settings={settings} setSettings={setSettings} />}
                {activeTab === 'battery' && <BatterySection settings={settings} setSettings={setSettings} />}
                {activeTab === 'language' && <LanguageSection settings={settings} setSettings={setSettings} />}
                {activeTab === 'connection' && <ConnectionSection settings={settings} setSettings={setSettings} />}
                {activeTab === 'premium' && <PremiumSection settings={settings} setSettings={setSettings} />}

                <div className="mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={() => {
                      saveSettings(settings);
                      setActiveTab(null);
                    }}
                    className="w-full golden-gradient py-3 rounded-xl text-black font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
