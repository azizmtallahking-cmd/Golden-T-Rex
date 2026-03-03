import React from 'react';
import { Shield, RefreshCw, Database, Trash2, Zap } from 'lucide-react';

interface DataSectionProps {
  settings: any;
  setSettings: (s: any) => void;
  chatsCount: number;
  onClearStorage: () => void;
  botInfo: any;
}

export const DataSection: React.FC<DataSectionProps> = ({ settings, setSettings, chatsCount, onClearStorage, botInfo }) => {
  const isTokenValid = botInfo && botInfo.id;
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Database size={20} />
          <h3 className="font-bold">التخزين والبيانات</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <RefreshCw size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">العمل السري (Auto-Sync)</p>
                <p className="text-[10px] text-zinc-500">سحب المعلومات تلقائياً في الخلفية</p>
              </div>
            </div>
            <button 
              onClick={() => setSettings({ ...settings, auto_sync: settings.auto_sync === 'true' ? 'false' : 'true' })}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.auto_sync === 'true' ? 'bg-gold-500' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.auto_sync === 'true' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase mb-1">المحادثات المشفوطة</p>
              <p className="text-xl font-bold text-gold-500">{chatsCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase mb-1">حالة الشبكة</p>
              {isTokenValid ? (
                <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <Zap size={10} /> متصل وآمن
                </p>
              ) : (
                <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                  <Zap size={10} /> غير متصل (خطأ في التوكن)
                </p>
              )}
            </div>
          </div>

          <button 
            onClick={onClearStorage}
            className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all border border-red-500/10 flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            مسح التخزين المحلي (Clear Cache)
          </button>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gold-500/5 border border-gold-500/10">
        <div className="flex items-center gap-2 text-gold-400 mb-2">
          <Shield size={18} />
          <h3 className="font-bold text-sm">مفتاح الوصول (Bot Token)</h3>
        </div>
        <div className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-gold-500/50 select-none">
          {settings.telegram_token ? '••••••••••••••••••••••••••••••••••••' : 'لم يتم ضبط المفتاح'}
        </div>
        <p className="text-[10px] text-zinc-500 mt-2">هذا المفتاح محمي ولا يمكن تغييره لضمان استقرار النظام.</p>
      </div>
    </div>
  );
};
