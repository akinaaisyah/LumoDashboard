import React, { useState, useEffect } from 'react';
import { Power, Gamepad2, RotateCw, Wind, Droplets, Flame, AlertCircle } from 'lucide-react';

export default function LumoDashboard() {
  const [mainPower, setMainPower] = useState(false);
  const [pressureBars, setPressureBars] = useState([120, 250, 380, 450]);
  const [controllerConnected, setControllerConnected] = useState(true);
  const [rollerActive, setRollerActive] = useState('off');
  const [compressorOn, setCompressorOn] = useState(false);
  const [sensors, setSensors] = useState({
    plasticTurgidity: 85,
    airHumidity: 62,
    gasSensor: 12
  });
  const [wormPosition, setWormPosition] = useState({ x: 0, y: 0 });
  const [pulseAnimation, setPulseAnimation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(prev => (prev + 1) % 100);
      
      // Simulate live data
      if (mainPower) {
        setPressureBars(prev => prev.map(val => 
          Math.min(500, Math.max(0, val + (Math.random() - 0.5) * 10))
        ));
        setSensors(prev => ({
          plasticTurgidity: Math.min(100, Math.max(0, prev.plasticTurgidity + (Math.random() - 0.5) * 5)),
          airHumidity: Math.min(100, Math.max(0, prev.airHumidity + (Math.random() - 0.5) * 3)),
          gasSensor: Math.min(100, Math.max(0, prev.gasSensor + (Math.random() - 0.5) * 2))
        }));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [mainPower]);

  const handleWormMove = (direction) => {
    if (!mainPower) return;
    setWormPosition(prev => {
      const newPos = { ...prev };
      const step = 15;
      switch(direction) {
        case 'up': newPos.y = Math.max(-60, prev.y - step); break;
        case 'down': newPos.y = Math.min(60, prev.y + step); break;
        case 'left': newPos.x = Math.max(-60, prev.x - step); break;
        case 'right': newPos.x = Math.min(60, prev.x + step); break;
      }
      return newPos;
    });
  };

  const PressureBar = ({ value, index }) => (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-cyan-400 font-mono text-xs">BAR {index + 1}</div>
      <div className="relative w-10 h-32 bg-black border border-cyan-500/30 rounded">
        <div 
          className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-500 to-cyan-300 rounded transition-all duration-300"
          style={{ height: `${(value / 500) * 100}%` }}
        >
          <div className="absolute inset-0 bg-cyan-400/20 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="text-xs font-mono text-cyan-300 font-bold">{Math.round(value)}</span>
        </div>
      </div>
      <div className="text-xs text-cyan-400/60 font-mono">PSI</div>
    </div>
  );

  const StatusIndicator = ({ active, label, icon: Icon, color = 'cyan' }) => {
    const colorMap = {
      cyan: {
        border: active ? 'border-cyan-500' : 'border-gray-600',
        bg: active ? 'bg-cyan-500/10' : 'bg-gray-900/50',
        text: active ? 'text-cyan-400' : 'text-gray-500',
        icon: active ? 'text-cyan-400' : 'text-gray-600',
        pulse: 'bg-cyan-400'
      },
      red: {
        border: active ? 'border-red-500' : 'border-gray-600',
        bg: active ? 'bg-red-500/10' : 'bg-gray-900/50',
        text: active ? 'text-red-400' : 'text-gray-500',
        icon: active ? 'text-red-400' : 'text-gray-600',
        pulse: 'bg-red-400'
      }
    };
    const colors = colorMap[color];
    
    return (
      <div className={`relative border ${colors.border} ${colors.bg} rounded-lg p-3 transition-all duration-300`}>
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${colors.icon}`} />
          <span className={`text-sm font-mono ${colors.text}`}>{label}</span>
        </div>
        {active && (
          <div className={`absolute top-1 right-1 w-2 h-2 ${colors.pulse} rounded-full animate-pulse`}></div>
        )}
      </div>
    );
  };

  const SensorPanel = ({ label, value, icon: Icon, unit }) => {
    const getColor = () => {
      if (label === 'PLASTIC TURGIDITY') return value > 70 ? 'cyan' : 'red';
      if (label === 'AIR HUMIDITY') return value < 80 ? 'cyan' : 'red';
      if (label === 'GAS SENSOR') return value < 30 ? 'cyan' : 'red';
      return 'cyan';
    };
    const color = getColor();
    
    return (
      <div className={`border border-${color}-500/40 bg-black/60 rounded-lg p-4`}>
        <div className="flex items-center justify-between mb-3">
          <Icon className={`w-5 h-5 text-${color}-400`} />
          <span className={`text-xs font-mono text-${color}-400/80`}>{label}</span>
        </div>
        <div className={`text-3xl font-bold text-${color}-400 font-mono`}>
          {Math.round(value)}<span className="text-lg">{unit}</span>
        </div>
        <div className="mt-2 w-full bg-gray-800 rounded-full h-2">
          <div 
            className={`h-2 bg-${color}-500 rounded-full transition-all duration-300`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(0, 200, 255, 0.05) 25%, rgba(0, 200, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 200, 255, 0.05) 75%, rgba(0, 200, 255, 0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(0, 200, 255, 0.05) 25%, rgba(0, 200, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 200, 255, 0.05) 75%, rgba(0, 200, 255, 0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-cyan-500/30 pb-4">
          <div>
            <h1 className="text-4xl font-bold tracking-wider">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ASTERIA </span>
              <span className="text-red-500">NOVA</span>
            </h1>
            <p className="text-xs text-cyan-400/60 font-mono mt-1">ROBOTIC CONTROL INTERFACE v2.0</p>
          </div>
          
          {/* Master Power Button */}
          <button
            onClick={() => setMainPower(!mainPower)}
            className={`relative group ${mainPower ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-gray-700 to-gray-600'} p-6 rounded-lg border-2 ${mainPower ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-gray-500'} transition-all duration-300 hover:scale-105`}
          >
            <Power className={`w-10 h-10 ${mainPower ? 'text-white' : 'text-gray-400'}`} />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap">
              {mainPower ? 'ONLINE' : 'OFFLINE'}
            </div>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Pressure Bars & Status */}
          <div className="space-y-6">
            <div className="border border-cyan-500/40 bg-black/60 rounded-lg p-4">
              <h2 className="text-cyan-400 font-mono text-sm mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                PRESSURE MONITORING
              </h2>
              <div className="flex justify-around">
                {pressureBars.map((value, idx) => (
                  <PressureBar key={idx} value={value} index={idx} />
                ))}
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3">
              <StatusIndicator 
                active={controllerConnected && mainPower} 
                label="PS4 CONTROLLER" 
                icon={Gamepad2} 
              />
              <button
                onClick={() => {
                  if (!mainPower) return;
                  setRollerActive(prev => {
                    if (prev === 'off') return 'in';
                    if (prev === 'in') return 'out';
                    return 'off';
                  });
                }}
                disabled={!mainPower}
                className="w-full"
              >
                <div className={`relative border ${
                  rollerActive === 'in' && mainPower ? 'border-cyan-500 bg-cyan-500/10' : 
                  rollerActive === 'out' && mainPower ? 'border-red-500 bg-red-500/10' : 
                  'border-gray-600 bg-gray-900/50'
                } rounded-lg p-3 transition-all duration-300`}>
                  <div className="flex items-center space-x-2">
                    <RotateCw className={`w-5 h-5 ${
                      rollerActive === 'in' && mainPower ? 'text-cyan-400' : 
                      rollerActive === 'out' && mainPower ? 'text-red-400' : 
                      'text-gray-600'
                    }`} />
                    <span className={`text-sm font-mono ${
                      rollerActive === 'in' && mainPower ? 'text-cyan-400' : 
                      rollerActive === 'out' && mainPower ? 'text-red-400' : 
                      'text-gray-500'
                    }`}>
                      {rollerActive === 'in' ? "ROLLER: IN" : rollerActive === 'out' ? "ROLLER: OUT" : "ROLLER: STATIC"}
                    </span>
                  </div>
                  {mainPower && rollerActive !== 'off' && (
                    <div className={`absolute top-1 right-1 w-2 h-2 ${rollerActive === 'out' ? 'bg-red-400' : 'bg-cyan-400'} rounded-full animate-pulse`}></div>
                  )}
                </div>
              </button>
              <button
                onClick={() => mainPower && setCompressorOn(!compressorOn)}
                disabled={!mainPower}
                className="w-full"
              >
                <StatusIndicator 
                  active={compressorOn && mainPower} 
                  label="AIR COMPRESSOR" 
                  icon={Wind} 
                />
              </button>
            </div>
          </div>

          {/* Center Column - LUMO Movement */}
          <div className="border border-cyan-500/40 bg-black/60 rounded-lg p-6">
            <h2 className="text-cyan-400 font-mono text-sm mb-4 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
              LUMO NAVIGATION
            </h2>
            
            <div className="relative w-full h-64 border border-cyan-500/30 rounded bg-gradient-to-br from-cyan-950/20 to-blue-950/20 mb-4">
              {/* Grid overlay */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(0, 200, 255, 0.1) 25%, rgba(0, 200, 255, 0.1) 26%, transparent 27%),
                  linear-gradient(90deg, transparent 24%, rgba(0, 200, 255, 0.1) 25%, rgba(0, 200, 255, 0.1) 26%, transparent 27%)
                `,
                backgroundSize: '25px 25px'
              }}></div>
              
              {/* Center crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 border-2 border-cyan-500/30 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full"></div>
              </div>
              
              {/* LUMO robot */}
              <div 
                className="absolute top-1/2 left-1/2 transition-all duration-300"
                style={{
                  transform: `translate(calc(-50% + ${wormPosition.x}px), calc(-50% + ${wormPosition.y}px))`
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)]">
                    <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">L</div>
                </div>
              </div>

              {/* Position coordinates */}
              <div className="absolute top-2 right-2 text-xs font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded">
                X: {wormPosition.x} Y: {wormPosition.y}
              </div>
            </div>

            {/* Direction Controls */}
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <button
                onClick={() => handleWormMove('up')}
                disabled={!mainPower}
                className={`p-3 border rounded ${mainPower ? 'border-cyan-500 bg-cyan-500/20 hover:bg-cyan-500/30' : 'border-gray-600 bg-gray-900/50'} transition-all`}
              >
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-cyan-400 mx-auto"></div>
              </button>
              <div></div>
              
              <button
                onClick={() => handleWormMove('left')}
                disabled={!mainPower}
                className={`p-3 border rounded ${mainPower ? 'border-cyan-500 bg-cyan-500/20 hover:bg-cyan-500/30' : 'border-gray-600 bg-gray-900/50'} transition-all`}
              >
                <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-cyan-400 mx-auto"></div>
              </button>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500/50 rounded-full"></div>
              </div>
              <button
                onClick={() => handleWormMove('right')}
                disabled={!mainPower}
                className={`p-3 border rounded ${mainPower ? 'border-cyan-500 bg-cyan-500/20 hover:bg-cyan-500/30' : 'border-gray-600 bg-gray-900/50'} transition-all`}
              >
                <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-cyan-400 mx-auto"></div>
              </button>
              
              <div></div>
              <button
                onClick={() => handleWormMove('down')}
                disabled={!mainPower}
                className={`p-3 border rounded ${mainPower ? 'border-cyan-500 bg-cyan-500/20 hover:bg-cyan-500/30' : 'border-gray-600 bg-gray-900/50'} transition-all`}
              >
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-cyan-400 mx-auto"></div>
              </button>
              <div></div>
            </div>
          </div>

          {/* Right Column - Sensors */}
          <div className="space-y-4">
            <SensorPanel 
              label="PLASTIC TURGIDITY" 
              value={sensors.plasticTurgidity} 
              icon={AlertCircle}
              unit="%"
            />
            <SensorPanel 
              label="AIR HUMIDITY" 
              value={sensors.airHumidity} 
              icon={Droplets}
              unit="%"
            />
            <SensorPanel 
              label="GAS SENSOR" 
              value={sensors.gasSensor} 
              icon={Flame}
              unit="ppm"
            />

            {/* System Status */}
            <div className="border border-cyan-500/40 bg-black/60 rounded-lg p-4 mt-4">
              <h3 className="text-cyan-400 font-mono text-xs mb-3">SYSTEM STATUS</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">UPTIME</span>
                  <span className="text-cyan-400">02:34:17</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CPU LOAD</span>
                  <span className="text-cyan-400">42%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MEMORY</span>
                  <span className="text-cyan-400">2.1/4.0 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">NETWORK</span>
                  <span className="text-green-400">CONNECTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs font-mono text-cyan-400/40">
          ASTERIA NOVA ROBOTICS © 2025 | LUMO DASHBOARD
        </div>
      </div>
    </div>
  );