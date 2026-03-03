import React from 'react';
import { Link, Globe, Shield, RefreshCw, Zap } from 'lucide-react';

interface ConnectionSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export const ConnectionSection: React.FC<ConnectionSectionProps> = ({ settings, setSettings }) => {
  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Link size={20} />
          <h3 className="font-bold">إعدادات الربط الذهبية</h3>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 'proxy_gold', name: 'البروكسي الذهبي (Proxy)', icon: <Shield size={18} /> },
            { id: 'auto_reconnect', name: 'إعادة الاتصال التلقائي', icon: <RefreshCw size={18} /> },
            { id: 'fast_connect', name: 'الاتصال السريع T-Rex', icon: <Zap size={18} /> },
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

      <div className="p-6 rounded-3xl bg-gold-500/5 border border-gold-500/10">
        <div className="flex items-center gap-2 text-gold-400 mb-2">
          <Globe size={18} />
          <h3 className="font-bold text-sm">حالة الربط</h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">المنطقة:</span>
          <span className="text-xs text-gold-500 font-bold">T-Rex Global Network</span>
        </div>
      </div>
    </div>
  );
};
