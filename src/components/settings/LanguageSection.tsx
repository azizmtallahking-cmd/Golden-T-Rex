import React from 'react';
import { Globe, Check, Languages } from 'lucide-react';

interface LanguageSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export const LanguageSection: React.FC<LanguageSectionProps> = ({ settings, setSettings }) => {
  const languages = [
    { id: 'ar', name: 'العربية (الذهبية)', native: 'Arabic' },
    { id: 'en', name: 'English', native: 'English' },
    { id: 'fr', name: 'Français', native: 'French' },
    { id: 'es', name: 'Español', native: 'Spanish' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Globe size={20} />
          <h3 className="font-bold">لغة الواجهة</h3>
        </div>
        
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSettings({ ...settings, language: lang.id })}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${settings.language === lang.id ? 'bg-gold-500/10 border-gold-500 text-gold-500' : 'bg-black/20 border-white/5 text-zinc-400 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${settings.language === lang.id ? 'bg-gold-500/20' : 'bg-white/5'}`}>
                  <Languages size={18} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{lang.name}</p>
                  <p className="text-[10px] opacity-50">{lang.native}</p>
                </div>
              </div>
              {settings.language === lang.id && <Check size={18} />}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gold-500/5 border border-gold-500/10">
        <div className="flex items-center gap-2 text-gold-400 mb-2">
          <Globe size={18} />
          <h3 className="font-bold text-sm">ترجمة الرسائل</h3>
        </div>
        <p className="text-[10px] text-zinc-500 leading-relaxed">
          تفعيل ميزة الترجمة الذهبية التلقائية للرسائل الواردة بلغات أجنبية.
        </p>
        <button className="w-full mt-4 py-3 rounded-xl bg-gold-500/10 text-gold-500 text-xs font-bold hover:bg-gold-500 hover:text-black transition-all">
          تفعيل الترجمة التلقائية
        </button>
      </div>
    </div>
  );
};
