import { motion } from 'motion/react';
import { MapPin, Users, Navigation as NavigationIcon, Locate } from 'lucide-react';
import type { CrowdZone } from '@/app/App';

interface VenueMapProps {
  crowdZones: CrowdZone[];
  currentLocation: CrowdZone;
  selectedDestination: string | null;
  onSelectDestination: (id: string) => void;
}

export function VenueMap({ crowdZones, currentLocation, selectedDestination, onSelectDestination }: VenueMapProps) {
  const getZoneColor = (density: number, maxDensity: number) => {
    const ratio = density / maxDensity;
    // Google Maps heatmap color scheme: green -> yellow -> orange -> red
    if (ratio < 0.3) return { 
      color: 'rgba(76, 175, 80, 0.7)', 
      label: 'Safe',
      innerColor: 'rgba(76, 175, 80, 0.9)',
      outerColor: 'rgba(76, 175, 80, 0)'
    };
    if (ratio < 0.5) return { 
      color: 'rgba(255, 235, 59, 0.7)', 
      label: 'Low',
      innerColor: 'rgba(255, 235, 59, 0.9)',
      outerColor: 'rgba(255, 235, 59, 0)'
    };
    if (ratio < 0.7) return { 
      color: 'rgba(255, 152, 0, 0.7)', 
      label: 'Moderate',
      innerColor: 'rgba(255, 152, 0, 0.9)',
      outerColor: 'rgba(255, 152, 0, 0)'
    };
    return { 
      color: 'rgba(244, 67, 54, 0.8)', 
      label: 'Crowded',
      innerColor: 'rgba(244, 67, 54, 1)',
      outerColor: 'rgba(244, 67, 54, 0)'
    };
  };

  const getCurrentLocationStatus = () => {
    const ratio = currentLocation.density / currentLocation.maxDensity;
    if (ratio < 0.5) return { label: 'Safe', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (ratio < 0.8) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { label: 'Crowded', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const locationStatus = getCurrentLocationStatus();

  return (
    <div className="h-full w-full bg-slate-100 flex flex-col overflow-hidden">
      {/* Current Location Info Card */}
      <div className="p-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${locationStatus.bg} flex items-center justify-center relative`}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`absolute inset-0 rounded-full ${locationStatus.bg} opacity-50`}
              ></motion.div>
              <Locate className={`w-6 h-6 ${locationStatus.color} relative z-10`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{currentLocation.name}</h3>
              <p className="text-xs text-slate-500">Main Concourse, Level 1</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{currentLocation.density.toFixed(1)}</div>
            <div className="text-xs text-slate-500">people/m²</div>
          </div>
        </div>
        <div className={`mt-3 px-3 py-2 rounded-lg border ${locationStatus.border} ${locationStatus.bg} flex items-center justify-between`}>
          <span className={`text-sm font-semibold ${locationStatus.color}`}>
            🟢 {locationStatus.label} Crowd Level
          </span>
          <Users className={`w-4 h-4 ${locationStatus.color}`} />
        </div>
      </div>

      {/* Google Maps Style Heatmap */}
      <div className="flex-1 overflow-hidden relative">
        {/* Map background with Google Maps styling */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-200">
          {/* Street/building outlines */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Venue structures - Google Maps style */}
          <div className="absolute top-[8%] left-[8%] w-[28%] h-[15%] bg-slate-300 rounded-sm border border-slate-400 shadow-sm flex items-center justify-center">
            <span className="text-[10px] text-slate-600 font-medium">Entrance</span>
          </div>
          <div className="absolute top-[28%] left-[38%] w-[38%] h-[32%] bg-slate-200 rounded-sm border border-slate-400 shadow-sm flex items-center justify-center">
            <span className="text-xs text-slate-600 font-medium">Central Hall</span>
          </div>
          <div className="absolute bottom-[8%] left-[12%] w-[22%] h-[25%] bg-blue-100 rounded-sm border-2 border-blue-400 shadow-sm flex items-center justify-center">
            <span className="text-[10px] text-blue-700 font-semibold">Platform A</span>
          </div>
          <div className="absolute bottom-[8%] right-[12%] w-[22%] h-[25%] bg-blue-100 rounded-sm border-2 border-blue-400 shadow-sm flex items-center justify-center">
            <span className="text-[10px] text-blue-700 font-semibold">Platform B</span>
          </div>
          <div className="absolute top-[5%] right-[12%] w-[28%] h-[12%] bg-orange-50 rounded-sm border border-orange-300 shadow-sm flex items-center justify-center">
            <span className="text-[10px] text-orange-700 font-medium">Food Court</span>
          </div>

          {/* Heatmap overlay - Google Maps style with gradient blobs */}
          {crowdZones.map((zone) => {
            const { color, innerColor, outerColor } = getZoneColor(zone.density, zone.maxDensity);
            return (
              <motion.div
                key={zone.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {/* Multiple overlapping blobs for more realistic heatmap effect */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${innerColor} 0%, ${color} 40%, ${outerColor} 100%)`,
                    filter: 'blur(30px)',
                    transform: 'scale(1.5)',
                  }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${innerColor} 0%, ${color} 30%, ${outerColor} 80%)`,
                    filter: 'blur(40px)',
                    transform: 'scale(1.8)',
                  }}
                ></div>
              </motion.div>
            );
          })}

          {/* Location markers */}
          {crowdZones.map((zone) => {
            const { color } = getZoneColor(zone.density, zone.maxDensity);
            return (
              <motion.button
                key={`marker-${zone.id}`}
                className="absolute cursor-pointer"
                style={{
                  left: `${zone.x + zone.width / 2}%`,
                  top: `${zone.y + zone.height / 2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSelectDestination(zone.id)}
              >
                <div className="relative">
                  {/* Pin shadow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm"></div>
                  
                  {/* Pin */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div 
                      className="w-8 h-10 rounded-t-full rounded-bl-full rounded-br-full flex items-center justify-center border-2 border-white shadow-lg"
                      style={{ 
                        backgroundColor: color,
                        transform: 'rotate(-45deg)',
                      }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full" style={{ transform: 'rotate(45deg)' }}></div>
                    </div>
                  </motion.div>

                  {/* Info tooltip */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl px-3 py-2 border border-slate-200 min-w-[100px] pointer-events-none">
                    <div className="text-[10px] font-semibold text-slate-900 text-center mb-1">{zone.name}</div>
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">{zone.density.toFixed(1)}</span>
                      <span className="text-[9px] text-slate-500">p/m²</span>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-slate-200 transform rotate-45"></div>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Current location marker */}
          <motion.div
            className="absolute"
            style={{
              left: `${currentLocation.x}%`,
              top: `${currentLocation.y}%`,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="relative">
              {/* Pulse rings */}
              <motion.div
                animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500"
              ></motion.div>
              <motion.div
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.5, 0, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500"
              ></motion.div>
              
              {/* Dot */}
              <div className="relative w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 border-3 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map controls - Google Maps style */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50">
            <NavigationIcon className="w-5 h-5 text-slate-600" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50">
            <Locate className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-slate-700">Live Crowd Heatmap</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-slate-500">Updating</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <span className="text-xs text-slate-600">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
            <span className="text-xs text-slate-600">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600"></div>
            <span className="text-xs text-slate-600">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}