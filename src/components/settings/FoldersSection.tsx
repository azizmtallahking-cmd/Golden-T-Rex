import React from 'react';
import { Folder, Plus, MessageCircle, Archive, Star } from 'lucide-react';

interface FoldersSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export const FoldersSection: React.FC<FoldersSectionProps> = ({ settings, setSettings }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Folder size={20} />
          <h3 className="font-bold">مجلدات المحادثات</h3>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gold-500/5 border border-gold-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <Star size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">المجلد الذهبي</p>
                <p className="text-[10px] text-zinc-500">جميع المحادثات الهامة</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gold-500 bg-gold-500/10 px-2 py-1 rounded-lg">نشط</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-3 text-zinc-500">
            <div className="p-2 rounded-xl bg-white/5">
              <Archive size={18} />
            </div>
            <div>
              <p className="text-sm font-medium">الأرشيف</p>
              <p className="text-[10px]">المحادثات المؤرشفة</p>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-gold-500/30 text-gold-500/60 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gold-500/5 hover:text-gold-500 transition-all">
          <Plus size={16} />
          إنشاء مجلد جديد
        </button>
      </div>
    </div>
  );
};
