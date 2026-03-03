import React from 'react';
import { Speaker, Mic, Video, Volume2, Settings } from 'lucide-react';

interface SpeakersSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({ settings, setSettings }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Speaker size={20} />
          <h3 className="font-bold">الصوت والميكروفون</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                  <Mic size={18} />
                </div>
                <span className="text-sm font-medium">حساسية الميكروفون</span>
              </div>
              <span className="text-xs text-gold-500 font-bold">75%</span>
            </div>
            <div className="relative h-1 bg-white/10 rounded-full">
              <div className="absolute left-0 top-0 h-full w-[75%] bg-gold-500 rounded-full" />
              <div className="absolute left-[75%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                  <Volume2 size={18} />
                </div>
                <span className="text-sm font-medium">مستوى الصوت</span>
              </div>
              <span className="text-xs text-gold-500 font-bold">100%</span>
            </div>
            <div className="relative h-1 bg-white/10 rounded-full">
              <div className="absolute left-0 top-0 h-full w-[100%] bg-gold-500 rounded-full" />
              <div className="absolute left-[100%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 text-gold-400 mb-4">
          <Video size={20} />
          <h3 className="font-bold">الكاميرا</h3>
        </div>
        <div className="aspect-video rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-zinc-600">
          <div className="flex flex-col items-center gap-2">
            <Video size={32} />
            <span className="text-[10px] font-bold uppercase tracking-widest">معاينة الكاميرا غير متاحة</span>
          </div>
        </div>
      </div>
    </div>
  );
};
