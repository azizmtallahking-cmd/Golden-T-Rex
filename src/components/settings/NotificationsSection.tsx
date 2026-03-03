import React from 'react';
import { Bell, BellOff, Volume2, MessageSquare, Users, Radio } from 'lucide-react';

interface NotificationsSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ settings, setSettings }) => {
  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Bell size={20} />
          <h3 className="font-bold">تنبيهات الرسائل</h3>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 'notify_private', name: 'المحادثات الخاصة', icon: <MessageSquare size={18} /> },
            { id: 'notify_groups', name: 'المجموعات', icon: <Users size={18} /> },
            { id: 'notify_channels', name: 'القنوات', icon: <Radio size={18} /> },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <button 
                onClick={() => toggleSetting(item.id)}
                className={`w-10 h-5 rounded-full transition-all relative ${settings[item.id] ? 'bg-gold-500' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings[item.id] ? 'right-6' : 'right-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Volume2 size={20} />
          <h3 className="font-bold">الأصوات والاهتزاز</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <span className="text-sm font-medium">صوت الإشعارات الذهبي</span>
            <button 
              onClick={() => toggleSetting('notify_sound')}
              className={`w-10 h-5 rounded-full transition-all relative ${settings.notify_sound ? 'bg-gold-500' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.notify_sound ? 'right-6' : 'right-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
