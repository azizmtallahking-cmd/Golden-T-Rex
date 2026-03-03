import React, { useRef } from 'react';
import { User, Mail, Phone, ShieldCheck, Globe, Camera, Trash2 } from 'lucide-react';

interface AccountSectionProps {
  settings: any;
  setSettings: (s: any) => void;
  botInfo: any;
  onRefreshBotInfo: () => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({ settings, setSettings, botInfo, onRefreshBotInfo }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/bot/photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo_url: base64 }),
        });
        if (res.ok) {
          onRefreshBotInfo();
        }
      } catch (err) {
        console.error('Error uploading photo:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = async () => {
    try {
      const res = await fetch('/api/bot/photo', { method: 'DELETE' });
      if (res.ok) {
        onRefreshBotInfo();
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold-500/30 shadow-[0_0_20px_rgba(250,176,5,0.2)]">
              {botInfo?.custom_photo_url ? (
                <img src={botInfo.custom_photo_url} className="w-full h-full object-cover" alt="Bot" />
              ) : (
                <div className="w-full h-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                  <User size={40} />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-gold-500 text-black hover:scale-110 transition-transform"
                title="تغيير الصورة"
              >
                <Camera size={16} />
              </button>
              {botInfo?.custom_photo_url && (
                <button 
                  onClick={handleDeletePhoto}
                  className="p-2 rounded-full bg-red-500 text-white hover:scale-110 transition-transform"
                  title="حذف الصورة"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            className="hidden" 
            accept="image/*" 
          />
          <h3 className="mt-4 font-bold text-gold-400">{botInfo?.first_name || 'Golden T-Rex'}</h3>
          <p className="text-[10px] text-zinc-500">@{botInfo?.username || 'bot'}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">اسم البوت</p>
                <p className="text-[10px] text-zinc-500">{botInfo?.first_name || 'Golden T-Rex'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <Globe size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">اسم المستخدم</p>
                <p className="text-[10px] text-zinc-500">@{botInfo?.username || 'golden_trex_bot'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">رقم المعرف (ID)</p>
                <p className="text-[10px] text-zinc-500">{botInfo?.id || '8620381706'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gold-500/5 border border-gold-500/10">
        <h4 className="text-gold-500 font-bold text-sm mb-2">نبذة عن الحساب</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          هذا الحساب محمي بنظام T-Rex الذهبي. جميع العمليات مشفرة وتتم في بيئة آمنة تماماً.
        </p>
      </div>
    </div>
  );
};
