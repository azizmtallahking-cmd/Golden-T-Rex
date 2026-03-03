import React from 'react';
import { Cpu, Settings, Database, Trash2, Zap, RefreshCw } from 'lucide-react';

interface AdvancedSectionProps {
  settings: any;
  setSettings: (s: any) => void;
  onClearStorage: () => void;
}

export const AdvancedSection: React.FC<AdvancedSectionProps> = ({ settings, setSettings, onClearStorage }) => {
  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Cpu size={20} />
          <h3 className="font-bold">إعدادات متقدمة</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">تحسين الأداء الذهبي</p>
                <p className="text-[10px] text-zinc-500">تسريع عمليات البوت</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('perf_gold')}
              className={`w-10 h-5 rounded-full transition-all relative ${settings.perf_gold ? 'bg-gold-500' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.perf_gold ? 'right-6' : 'right-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <RefreshCw size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">تحديث تلقائي</p>
                <p className="text-[10px] text-zinc-500">تحديث البيانات في الخلفية</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('auto_refresh')}
              className={`w-10 h-5 rounded-full transition-all relative ${settings.auto_refresh ? 'bg-gold-500' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.auto_refresh ? 'right-6' : 'right-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10">
        <div className="flex items-center gap-2 text-red-400 mb-4">
          <Trash2 size={20} />
          <h3 className="font-bold">منطقة الخطر</h3>
        </div>
        <button 
          onClick={onClearStorage}
          className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          حذف جميع البيانات المحلية
        </button>
      </div>
    </div>
  );
};
