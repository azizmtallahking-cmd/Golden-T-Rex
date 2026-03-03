import React from 'react';
import { Palette, User, Settings, Image as ImageIcon, Type, Sparkles } from 'lucide-react';
import { GoldenDinoLogo } from '../GoldenDinoLogo';

interface AppearanceSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({ settings, setSettings }) => {
  const themes = [
    { id: 'dark-gold', name: 'الذهب الأسود (Dark Gold)', color: '#fab005' },
    { id: 'midnight-gold', name: 'ذهب منتصف الليل (Midnight Gold)', color: '#6366f1' },
    { id: 'emerald-gold', name: 'الذهب الزمردي (Emerald Gold)', color: '#10b981' },
    { id: 'ruby-gold', name: 'الذهب الياقوتي (Ruby Gold)', color: '#ef4444' },
  ];

  const dinoVariants = [
    { id: 'classic', name: 'الدينصور الذهبي (Classic Gold)', color: '#fab005' },
    { id: 'neon', name: 'الدينصور النيون (Neon Green)', color: '#00ff00' },
    { id: 'midnight', name: 'دينصور منتصف الليل (Midnight Blue)', color: '#6366f1' },
    { id: 'cyber', name: 'الدينصور السيبراني (Cyber Pink)', color: '#ff00ff' },
  ];

  const backgrounds = [
    { id: 'solid', name: 'خلفية صلبة (Solid)', icon: <ImageIcon size={18} /> },
    { id: 'gradient', name: 'تدرج ذهبي (Gradient)', icon: <Sparkles size={18} /> },
    { id: 'pattern', name: 'نمط الدينصور (Pattern)', icon: <Type size={18} /> },
  ];

  return (
    <div className="space-y-6">
      {/* App Identity */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <User size={20} />
          <h3 className="font-bold">هوية التطبيق (Locked)</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-zinc-500 uppercase mb-1 block">اسم التطبيق</label>
            <div className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-gold-500 font-bold select-none opacity-80">
              {settings.app_name || 'Golden T-Rex'}
            </div>
            <p className="text-[9px] text-zinc-600 mt-1">اسم التطبيق جزء من الهوية الذهبية ولا يمكن تعديله.</p>
          </div>
          
          <div>
            <label className="text-[10px] text-zinc-500 uppercase mb-1 block">أيقونة التطبيق (الدينصور)</label>
            <div className="grid grid-cols-2 gap-3">
              {dinoVariants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => setSettings({ ...settings, app_icon_variant: variant.id })}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${settings.app_icon_variant === variant.id ? 'bg-gold-500/10 border-gold-500' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                >
                  <div className="w-8 h-8">
                    <GoldenDinoLogo variant={variant.id} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-300 text-right leading-tight">{variant.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Palette size={20} />
          <h3 className="font-bold">المظهر والثيم</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-zinc-500 uppercase mb-2 block">اختر الثيم (الذهب هو المركز)</label>
            <div className="grid grid-cols-1 gap-2">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSettings({ ...settings, theme: theme.id })}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${settings.theme === theme.id ? 'bg-gold-500/10 border-gold-500' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                >
                  <span className={`text-sm font-bold ${settings.theme === theme.id ? 'text-gold-400' : 'text-zinc-400'}`}>{theme.name}</span>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.color }} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 uppercase mb-2 block">خلفية المحادثة</label>
            <div className="grid grid-cols-3 gap-2">
              {backgrounds.map(bg => (
                <button
                  key={bg.id}
                  onClick={() => setSettings({ ...settings, app_bg_variant: bg.id })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${settings.app_bg_variant === bg.id ? 'bg-gold-500/10 border-gold-500 text-gold-500' : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10'}`}
                >
                  {bg.icon}
                  <span className="text-[9px] font-bold uppercase tracking-tighter">{bg.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
