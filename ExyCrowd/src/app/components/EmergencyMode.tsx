import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Navigation, ArrowRight, MapPin, Users, CheckCircle, Shield, TrendingDown } from 'lucide-react';
import type { CrowdZone } from '@/app/App';

interface EmergencyModeProps {
  crowdZones: CrowdZone[];
  emergencyExit: string | null;
  onSafe: () => void;
}

interface EvacuationStep {
  id: string;
  instruction: string;
  zone: string;
  completed: boolean;
}

export function EmergencyMode({ crowdZones, emergencyExit, onSafe }: EmergencyModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAlert, setShowAlert] = useState(true);
  
  const exitZone = emergencyExit ? crowdZones.find((z) => z.id === emergencyExit) : null;
  
  // Generate evacuation steps
  const evacuationSteps: EvacuationStep[] = [
    {
      id: 'step-1',
      instruction: 'Move away from crowded areas immediately',
      zone: 'current-location',
      completed: false,
    },
    {
      id: 'step-2',
      instruction: 'Follow the AI-designated safe route',
      zone: 'route',
      completed: false,
    },
    {
      id: 'step-3',
      instruction: `Proceed to ${exitZone?.name || 'Safe Exit'}`,
      zone: emergencyExit || '',
      completed: false,
    },
  ];

  const [steps, setSteps] = useState(evacuationSteps);

  // Simulate step completion
  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, idx) =>
            idx === currentStep ? { ...step, completed: true } : step
          )
        );
        setCurrentStep((prev) => prev + 1);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  // Dismiss initial alert
  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="h-screen w-full bg-red-950 flex flex-col overflow-hidden max-w-md mx-auto">
      {/* Emergency Alert Overlay */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-600 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <AlertTriangle className="w-24 h-24 text-white mx-auto mb-4" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">EMERGENCY MODE</h1>
              <p className="text-white text-lg">Activating Safe Evacuation</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Header */}
      <div className="bg-red-600 text-white px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <AlertTriangle className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">EMERGENCY EVACUATION</h1>
              <p className="text-sm text-red-100">Crowd density exceeded safety threshold</p>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-red-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
        <p className="text-xs text-red-100 mt-1">Evacuation Progress: {Math.round(progress)}%</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-slate-900">
        {/* Safe Exit Info */}
        <div className="p-4 bg-gradient-to-b from-red-900 to-slate-900">
          <div className="bg-white rounded-xl p-4 shadow-xl border-4 border-yellow-400">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-slate-600">AI ASSIGNED SAFE EXIT</h2>
                <h3 className="text-xl font-bold text-slate-900">{exitZone?.name || 'Safe Exit'}</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-slate-600">Crowd Level</span>
                </div>
                <div className="text-lg font-bold text-emerald-700">
                  {exitZone?.density.toFixed(1) || '0.8'} p/m²
                </div>
                <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  Lowest density
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-slate-600">Distance</span>
                </div>
                <div className="text-lg font-bold text-blue-700">85m</div>
                <div className="text-xs text-blue-600">~2 min walk</div>
              </div>
            </div>
          </div>
        </div>

        {/* Evacuation Steps */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Evacuation Instructions
          </h3>
          
          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  step.completed
                    ? 'bg-emerald-900/30 border-emerald-500'
                    : index === currentStep
                    ? 'bg-yellow-900/30 border-yellow-400'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.completed
                      ? 'bg-emerald-500'
                      : index === currentStep
                      ? 'bg-yellow-400'
                      : 'bg-slate-700'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-bold text-white">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-semibold mb-1 ${
                      step.completed ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {step.instruction}
                    </p>
                    {index === currentStep && !step.completed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 mt-2"
                      >
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                            className="w-2 h-2 rounded-full bg-yellow-400"
                          ></motion.div>
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                            className="w-2 h-2 rounded-full bg-yellow-400"
                          ></motion.div>
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                            className="w-2 h-2 rounded-full bg-yellow-400"
                          ></motion.div>
                        </div>
                        <span className="text-xs text-yellow-400">In progress</span>
                      </motion.div>
                    )}
                    {step.completed && (
                      <p className="text-xs text-emerald-400">✓ Completed</p>
                    )}
                  </div>
                  
                  {!step.completed && index === currentStep && (
                    <ArrowRight className="w-5 h-5 text-yellow-400 animate-pulse" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Map Preview */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Live Route Preview
          </h3>
          
          <div className="bg-slate-800 rounded-xl p-4 border-2 border-slate-700">
            <div className="relative h-48 bg-slate-700 rounded-lg overflow-hidden">
              {/* Simplified route visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full px-6">
                  {/* Current location */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white mb-4"
                  ></motion.div>
                  
                  {/* Path */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '60px' }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1 bg-gradient-to-b from-blue-500 to-emerald-500 ml-1.5 mb-4"
                  ></motion.div>
                  
                  {/* Exit location */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                  ></motion.div>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                You
              </div>
              <div className="absolute bottom-4 left-4 px-2 py-1 bg-emerald-600 text-white text-xs font-semibold rounded">
                Safe Exit
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-slate-900 rounded-lg">
              <p className="text-xs text-slate-400 leading-relaxed">
                🛡️ Route is continuously monitored. You will be notified of any changes to ensure your safety.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts (Optional) */}
        <div className="p-4 pb-8">
          <div className="bg-slate-800 rounded-xl p-4 border-2 border-slate-700">
            <h3 className="text-white font-semibold mb-2">Emergency Assistance</h3>
            <p className="text-sm text-slate-400 mb-3">Need help? Contact station staff immediately.</p>
            <button className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
              Call Emergency Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
