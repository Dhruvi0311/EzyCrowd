import { useState, useEffect } from 'react';
import { VenueMap } from '@/app/components/VenueMap';
import { NavigationPanel } from '@/app/components/NavigationPanel';
import { TimeSlotPanel } from '@/app/components/TimeSlotPanel';
import { EmergencyMode } from '@/app/components/EmergencyMode';
import { Header } from '@/app/components/Header';
import { BottomNav } from '@/app/components/BottomNav';

export type ViewMode = 'map' | 'navigate' | 'timeslot';
export type AppMode = 'normal' | 'emergency';

export interface CrowdZone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  density: number; // people/m²
  maxDensity: number;
}

export default function App() {
  // Auto-toggle between normal and emergency mode every 1 minute
  const [appMode, setAppMode] = useState<AppMode>('normal');
  
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [crowdZones, setCrowdZones] = useState<CrowdZone[]>([
    { id: 'entrance', name: 'Main Entrance', x: 10, y: 15, width: 25, height: 20, density: 1.2, maxDensity: 4.0 },
    { id: 'lobby', name: 'Central Lobby', x: 40, y: 30, width: 35, height: 30, density: 2.8, maxDensity: 4.0 },
    { id: 'platform-a', name: 'Platform A', x: 15, y: 65, width: 20, height: 25, density: 3.5, maxDensity: 4.0 },
    { id: 'platform-b', name: 'Platform B', x: 65, y: 65, width: 20, height: 25, density: 1.5, maxDensity: 4.0 },
    { id: 'food-court', name: 'Food Court', x: 50, y: 5, width: 30, height: 15, density: 2.1, maxDensity: 4.0 },
    { id: 'exit-north', name: 'North Exit', x: 80, y: 20, width: 15, height: 18, density: 0.8, maxDensity: 4.0 },
  ]);

  const [currentLocation] = useState<CrowdZone>({
    id: 'current',
    name: 'Your Location',
    x: 25,
    y: 40,
    width: 0,
    height: 0,
    density: 1.8,
    maxDensity: 4.0,
  });

  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [emergencyExit, setEmergencyExit] = useState<string | null>(null);

  // Auto-toggle mode every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      setAppMode((prev) => prev === 'normal' ? 'emergency' : 'normal');
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  // Simulate real-time crowd changes - faster for map/navigation
  useEffect(() => {
    const interval = setInterval(() => {
      setCrowdZones((prev) =>
        prev.map((zone) => ({
          ...zone,
          density: Math.max(
            0.3,
            Math.min(
              zone.maxDensity + 0.5,
              zone.density + (Math.random() - 0.5) * 0.3
            )
          ),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Check for emergency threshold - only in emergency mode
  useEffect(() => {
    if (appMode === 'emergency') {
      // Force emergency conditions
      const exits = crowdZones.filter((z) => z.name.includes('Exit'));
      const safestExit = exits.reduce((min, exit) =>
        exit.density < min.density ? exit : min
      , exits[0]);
      setEmergencyExit(safestExit.id);
    }
  }, [crowdZones, appMode]);

  if (appMode === 'emergency') {
    return (
      <EmergencyMode
        crowdZones={crowdZones}
        emergencyExit={emergencyExit}
        onSafe={() => setAppMode('normal')}
      />
    );
  }

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden max-w-md mx-auto">
      <Header appMode={appMode} />
      
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'map' && (
          <VenueMap
            crowdZones={crowdZones}
            currentLocation={currentLocation}
            selectedDestination={selectedDestination}
            onSelectDestination={setSelectedDestination}
          />
        )}
        {viewMode === 'navigate' && (
          <NavigationPanel
            crowdZones={crowdZones}
            selectedDestination={selectedDestination}
            onSelectDestination={setSelectedDestination}
          />
        )}
        {viewMode === 'timeslot' && (
          <TimeSlotPanel crowdZones={crowdZones} />
        )}
      </div>

      <BottomNav viewMode={viewMode} onChangeView={setViewMode} />
    </div>
  );
}