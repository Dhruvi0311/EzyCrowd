import { useState } from 'react';
import { motion } from 'motion/react';
import { Navigation, Clock, Users, TrendingUp, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { CrowdZone } from '@/app/App';

interface NavigationPanelProps {
  crowdZones: CrowdZone[];
  selectedDestination: string | null;
  onSelectDestination: (id: string) => void;
}

interface Route {
  id: string;
  name: string;
  crowdLevel: 'low' | 'medium' | 'high';
  estimatedTime: number; // minutes
  distance: number; // meters
  zones: string[];
  isRecommended: boolean;
}

export function NavigationPanel({ crowdZones, selectedDestination, onSelectDestination }: NavigationPanelProps) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Generate smart routes based on current crowd data
  const generateRoutes = (destination: string): Route[] => {
    const destZone = crowdZones.find((z) => z.id === destination);
    if (!destZone) return [];

    // Calculate average crowd density for different paths
    const routes: Route[] = [
      {
        id: 'route-1',
        name: 'AI Recommended Route',
        crowdLevel: 'low',
        estimatedTime: 3,
        distance: 120,
        zones: ['entrance', 'exit-north', destination],
        isRecommended: true,
      },
      {
        id: 'route-2',
        name: 'Shortest Route',
        crowdLevel: 'high',
        estimatedTime: 2,
        distance: 80,
        zones: ['entrance', 'lobby', destination],
        isRecommended: false,
      },
      {
        id: 'route-3',
        name: 'Scenic Route',
        crowdLevel: 'medium',
        estimatedTime: 4,
        distance: 150,
        zones: ['entrance', 'food-court', destination],
        isRecommended: false,
      },
    ];

    // Adjust crowd levels based on actual zone densities
    routes.forEach((route) => {
      const routeZones = route.zones.map((zoneId) => crowdZones.find((z) => z.id === zoneId)).filter(Boolean);
      const avgDensity = routeZones.reduce((sum, zone) => sum + (zone?.density || 0), 0) / routeZones.length;
      
      if (avgDensity < 1.5) route.crowdLevel = 'low';
      else if (avgDensity < 2.5) route.crowdLevel = 'medium';
      else route.crowdLevel = 'high';
      
      // Adjust time based on crowd
      route.estimatedTime += Math.floor(avgDensity * 0.5);
    });

    return routes;
  };

  const destinations = crowdZones.filter((z) => z.name.includes('Platform') || z.name.includes('Exit'));
  const routes = selectedDestination ? generateRoutes(selectedDestination) : [];

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'low': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'medium': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'high': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
    }
  };

  if (!selectedDestination) {
    return (
      <div className="h-full bg-slate-50 overflow-auto">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Where to?</h2>
            <p className="text-sm text-slate-500">Select your destination for smart routing</p>
          </div>

          <div className="space-y-3">
            {destinations.map((zone) => {
              const { bg, border } = getCrowdLevelColor(
                zone.density < 1.5 ? 'low' : zone.density < 2.5 ? 'medium' : 'high'
              );
              return (
                <motion.button
                  key={zone.id}
                  onClick={() => onSelectDestination(zone.id)}
                  className={`w-full p-4 rounded-xl border-2 ${border} ${bg} text-left transition-all hover:shadow-md`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-slate-700" />
                        <h3 className="font-semibold text-slate-900">{zone.name}</h3>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs text-slate-600">{zone.density.toFixed(1)} p/m²</span>
                        </div>
                        <span className={`text-xs font-medium ${
                          zone.density < 1.5 ? 'text-emerald-600' : zone.density < 2.5 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {zone.density < 1.5 ? '🟢 Safe' : zone.density < 2.5 ? '🟡 Moderate' : '🔴 Crowded'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 mt-1" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="p-4">
        <div className="mb-4">
          <button
            onClick={() => onSelectDestination(null)}
            className="text-sm text-blue-600 mb-2"
          >
            ← Back to destinations
          </button>
          <h2 className="text-lg font-bold text-slate-900">Routes to {crowdZones.find(z => z.id === selectedDestination)?.name}</h2>
          <p className="text-sm text-slate-500">AI-optimized paths to avoid crowds</p>
        </div>

        <div className="space-y-3">
          {routes.map((route) => {
            const colors = getCrowdLevelColor(route.crowdLevel);
            const isSelected = selectedRoute === route.id;
            
            return (
              <motion.div
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : `${colors.border} ${colors.bg}`
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {route.isRecommended && (
                      <div className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
                        AI PICK
                      </div>
                    )}
                    <h3 className="font-semibold text-slate-900 text-sm">{route.name}</h3>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] text-slate-500">Crowd</span>
                    </div>
                    <span className={`text-xs font-semibold ${colors.text} capitalize`}>
                      {route.crowdLevel}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] text-slate-500">Time</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {route.estimatedTime} min
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-1">
                      <Navigation className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] text-slate-500">Distance</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {route.distance}m
                    </span>
                  </div>
                </div>

                {route.isRecommended && (
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-white/50 border border-blue-200">
                    <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-slate-600">
                      AI detected lower crowd density along this path. Estimated to save 2 min wait time.
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {selectedRoute && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-4 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
          >
            Start Navigation
          </motion.button>
        )}
      </div>
    </div>
  );
}
