import React from 'react';
import { Sparkles, Image as ImageIcon, Video, Music, Forward, Link as LinkIcon, Send, Globe } from 'lucide-react';

interface PremiumSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export const PremiumSection: React.FC<PremiumSectionProps> = ({ settings, setSettings }) => {
  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const premiumFeatures = [
    { id: 'premium_images', name: 'دعم الصور عالية الدقة', icon: <ImageIcon size={18} /> },
    { id: 'premium_videos', name: 'دعم الفيديوهات 4K', icon: <Video size={18} /> },
    { id: 'premium_audio', name: 'دعم الصوتيات المحسنة', icon: <Music size={18} /> },
    { id: 'premium_forward', name: 'إعادة التوجيه المتقدمة', icon: <Forward size={18} /> },
    { id: 'premium_forward_ext', name: 'إعادة التوجيه من صفحات خارجية', icon: <Globe size={18} /> },
    { id: 'premium_resend', name: 'إعادة الإرسال التلقائي', icon: <Send size={18} /> },
    { id: 'premium_links', name: 'دعم الروابط الذكية', icon: <LinkIcon size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30">
        <div className="flex items-center gap-3 text-purple-400 mb-4">
          <Sparkles size={24} className="animate-pulse" />
          <h3 className="text-xl font-bold">Telegram Premium (Chat Excellence)</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          تفعيل ميزات الدردشة العظيمة لتعزيز تجربة التواصل الذهبية.
        </p>
        
        <div className="space-y-3">
          {premiumFeatures.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-zinc-200">{item.name}</span>
              </div>
              <button 
                onClick={() => toggleSetting(item.id)}
                className={`w-10 h-5 rounded-full transition-all relative ${settings[item.id] ? 'bg-purple-500' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings[item.id] ? 'right-6' : 'right-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gold-500/5 border border-gold-500/10">
        <h4 className="text-gold-500 font-bold text-sm mb-2">ملاحظة ذهبية</h4>
        <p className="text-[10px] text-zinc-500 leading-relaxed">
          جميع ميزات البريميوم مفعلة تلقائياً لضمان الفاعلية القصوى لنظام T-Rex.
        </p>
      </div>
    </div>
  );
};
