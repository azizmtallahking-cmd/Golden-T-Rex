import React from 'react';
import { Battery, Zap, Wind, Sparkles, Play } from 'lucide-react';

interface BatterySectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export const BatterySection: React.FC<BatterySectionProps> = ({ settings, setSettings }) => {
  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Battery size={20} />
          <h3 className="font-bold">البطارية والأداء</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">وضع توفير الطاقة الذهبي</p>
                <p className="text-[10px] text-zinc-500">تقليل استهلاك الموارد</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('power_save')}
              className={`w-10 h-5 rounded-full transition-all relative ${settings.power_save ? 'bg-gold-500' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.power_save ? 'right-6' : 'right-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Sparkles size={20} />
          <h3 className="font-bold">المؤثرات والرسوم</h3>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 'anim_stickers', name: 'الملصقات المتحركة', icon: <Play size={18} /> },
            { id: 'anim_bg', name: 'الخلفيات المتحركة', icon: <Wind size={18} /> },
            { id: 'anim_effects', name: 'مؤثرات الواجهة', icon: <Sparkles size={18} /> },
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
    </div>
  );
};
