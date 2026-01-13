import { Wifi, Battery, Signal } from 'lucide-react';
import type { AppMode } from '@/app/App';

interface HeaderProps {
  appMode: AppMode;
}

export function Header({ appMode }: HeaderProps) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Status bar */}
      <div className="px-4 pt-2 pb-1 flex justify-between items-center text-xs">
        <span className="font-medium">{time}</span>
        <div className="flex items-center gap-2">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* App header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">EzyCrowd</h1>
            <p className="text-xs text-slate-500">Central Station</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-700">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
