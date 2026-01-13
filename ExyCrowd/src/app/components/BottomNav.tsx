import { Map, Navigation, Clock } from 'lucide-react';
import type { ViewMode } from '@/app/App';

interface BottomNavProps {
  viewMode: ViewMode;
  onChangeView: (mode: ViewMode) => void;
}

export function BottomNav({ viewMode, onChangeView }: BottomNavProps) {
  const navItems: { mode: ViewMode; icon: any; label: string }[] = [
    { mode: 'map', icon: Map, label: 'Map' },
    { mode: 'navigate', icon: Navigation, label: 'Navigate' },
    { mode: 'timeslot', icon: Clock, label: 'Best Time' },
  ];

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-2 pb-4">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = viewMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => onChangeView(item.mode)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
