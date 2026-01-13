import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, TrendingDown, TrendingUp, Sparkles, Calendar, Users, AlertCircle } from 'lucide-react';
import type { CrowdZone } from '@/app/App';

interface TimeSlotPanelProps {
  crowdZones: CrowdZone[];
}

interface TimeSlot {
  time: string;
  hour: number;
  crowdLevel: 'low' | 'medium' | 'high';
  density: number;
  trend: 'up' | 'down' | 'stable';
  isBestTime: boolean;
}

export function TimeSlotPanel({ crowdZones }: TimeSlotPanelProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>(crowdZones[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow'>('today');
  const [lastUpdate] = useState<string>(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  const generateTimeSlots = (locationId: string, date: 'today' | 'tomorrow'): TimeSlot[] => {
    const currentHour = new Date().getHours();
    const baseZone = crowdZones.find((z) => z.id === locationId);
    
    // Generate hourly predictions for the next 12 hours
    const slots: TimeSlot[] = [];
    for (let i = 0; i < 12; i++) {
      const hour = date === 'today' ? (currentHour + i) % 24 : i + 6;
      
      // Simulate crowd patterns (higher during rush hours)
      let predictedDensity = baseZone?.density || 2.0;
      
      // Morning rush (7-9)
      if (hour >= 7 && hour <= 9) {
        predictedDensity += Math.random() * 1.5 + 1.0;
      }
      // Lunch (12-14)
      else if (hour >= 12 && hour <= 14) {
        predictedDensity += Math.random() * 1.0 + 0.5;
      }
      // Evening rush (17-19)
      else if (hour >= 17 && hour <= 19) {
        predictedDensity += Math.random() * 1.8 + 1.2;
      }
      // Off-peak
      else {
        predictedDensity += Math.random() * 0.8 - 0.4;
      }
      
      predictedDensity = Math.max(0.5, Math.min(4.5, predictedDensity));
      
      const crowdLevel: 'low' | 'medium' | 'high' = 
        predictedDensity < 1.5 ? 'low' : predictedDensity < 2.8 ? 'medium' : 'high';
      
      // Determine trend
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (i > 0) {
        const prevDensity = slots[i - 1].density;
        if (predictedDensity > prevDensity + 0.3) trend = 'up';
        else if (predictedDensity < prevDensity - 0.3) trend = 'down';
      }
      
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour,
        crowdLevel,
        density: predictedDensity,
        trend,
        isBestTime: false,
      });
    }
    
    // Mark the slot with lowest density as best time
    const minDensitySlot = slots.reduce((min, slot) => 
      slot.density < min.density ? slot : min
    , slots[0]);
    minDensitySlot.isBestTime = true;
    
    return slots;
  };

  const timeSlots = generateTimeSlots(selectedLocation, selectedDate);
  const selectedZone = crowdZones.find((z) => z.id === selectedLocation);

  const getCrowdLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return { bg: 'bg-emerald-500', text: 'text-emerald-700', label: 'Low' };
      case 'medium': return { bg: 'bg-amber-500', text: 'text-amber-700', label: 'Moderate' };
      case 'high': return { bg: 'bg-red-500', text: 'text-red-700', label: 'High' };
    }
  };

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="p-4 pb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Best Time to Visit
          </h2>
          <p className="text-sm text-slate-500">AI-powered crowd predictions</p>
        </div>

        {/* Location selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-700 mb-2">Select Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
          >
            {crowdZones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date selector */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setSelectedDate('today')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
              selectedDate === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border-2 border-slate-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDate('tomorrow')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
              selectedDate === 'tomorrow'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border-2 border-slate-200'
            }`}
          >
            Tomorrow
          </button>
        </div>

        {/* Current status */}
        <div className="mb-4 p-4 bg-white rounded-xl border-2 border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Current Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-xs font-medium text-blue-600">Live</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{selectedZone?.density.toFixed(1)}</div>
              <div className="text-xs text-slate-500">people/m²</div>
            </div>
            <div className={`px-3 py-1.5 rounded-full ${
              selectedZone && selectedZone.density < 1.5
                ? 'bg-emerald-50 text-emerald-700'
                : selectedZone && selectedZone.density < 2.8
                ? 'bg-amber-50 text-amber-700'
                : 'bg-red-50 text-red-700'
            } text-xs font-semibold`}>
              {selectedZone && selectedZone.density < 1.5
                ? '🟢 Safe'
                : selectedZone && selectedZone.density < 2.8
                ? '🟡 Moderate'
                : '🔴 Crowded'}
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-900">Hourly Forecast</h3>
          </div>
          
          <div className="space-y-2">
            {timeSlots.map((slot, index) => {
              const colors = getCrowdLevelColor(slot.crowdLevel);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    slot.isBestTime
                      ? 'bg-purple-50 border-purple-300 shadow-md'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <Clock className="w-4 h-4 text-slate-500 mb-1" />
                        <span className="text-sm font-semibold text-slate-900">{slot.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500">Crowd Level</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-16 h-2 rounded-full ${colors.bg} opacity-50`}>
                              <div
                                className={`h-full rounded-full ${colors.bg}`}
                                style={{ width: `${(slot.density / 4.5) * 100}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs font-semibold ${colors.text}`}>
                              {colors.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {slot.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                      {slot.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-500" />}
                      
                      {slot.isBestTime && (
                        <div className="px-2 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          BEST
                        </div>
                      )}
                    </div>
                  </div>

                  {slot.isBestTime && (
                    <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-purple-100/50">
                      <AlertCircle className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-purple-900">
                        AI predicts lowest crowd density at this time. Perfect for a quick visit!
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Insight */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">AI Insight</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Based on historical patterns, {selectedZone?.name} typically sees peak crowds during morning rush (7-9 AM) and evening rush (5-7 PM). 
                We recommend visiting during off-peak hours for the best experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}