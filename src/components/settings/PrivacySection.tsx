import React from 'react';
import { Shield, Lock, Key, Eye, EyeOff, Smartphone, LogOut } from 'lucide-react';

interface PrivacySectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({ settings, setSettings }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Shield size={20} />
          <h3 className="font-bold">الخصوصية والأمان</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <Lock size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">رمز القفل (Lock Code)</p>
                <p className="text-[10px] text-zinc-500">تأمين الدخول للتطبيق</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-gold-500/10 text-gold-500 text-xs font-bold hover:bg-gold-500 hover:text-black transition-all">
              تغيير الرمز
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <Smartphone size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">الجلسات النشطة</p>
                <p className="text-[10px] text-zinc-500">الأجهزة المتصلة حالياً</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-500">نشط الآن</span>
          </div>

          <div className="p-4 rounded-2xl bg-gold-500/5 border border-gold-500/10">
            <div className="flex items-center gap-2 text-gold-400 mb-2">
              <Key size={18} />
              <h3 className="font-bold text-sm">التشفير الذهبي</h3>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">جميع البيانات المخزنة محلياً مشفرة باستخدام خوارزمية T-Rex الذهبية لضمان أقصى درجات الخصوصية.</p>
          </div>
        </div>
      </div>

      <button className="w-full py-4 rounded-2xl bg-zinc-800 text-zinc-400 text-sm font-bold hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5 flex items-center justify-center gap-2">
        <LogOut size={18} />
        تسجيل الخروج من الجلسة
      </button>
    </div>
  );
};
