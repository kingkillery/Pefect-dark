import React from 'react';
import { PlayerStats, WeaponType } from '../types';
import { KILLS_TO_WIN, WEAPONS } from '../constants';

interface HUDProps {
  stats: PlayerStats;
  killsToWin: number;
}

const Bar: React.FC<{ value: number; maxValue: number; color: string; label: string }> = ({ value, maxValue, color, label }) => (
    <div className="w-64">
        <span className="text-lg font-bold text-white uppercase tracking-wider">{label}</span>
        <div className="relative w-full bg-black/50 rounded-full h-7 border-2 border-gray-400/50">
            <div
                className={`${color} h-full rounded-full transition-all duration-300 ease-in-out`}
                style={{ width: `${(value / maxValue) * 100}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.9)'}}>
                {Math.round(value)} / {maxValue}
            </span>
        </div>
    </div>
);

const HUD: React.FC<HUDProps> = ({ stats, killsToWin }) => {
  return (
    <>
      {/* Crosshair */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-10 opacity-80">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-0.5 bg-cyan-300 rounded-full"></div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-0.5 bg-cyan-300 rounded-full"></div>
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-2 w-0.5 bg-cyan-300 rounded-full"></div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 h-2 w-0.5 bg-cyan-300 rounded-full"></div>
      </div>

      {/* Bottom HUD */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-end gap-8 p-4 bg-black/30 rounded-lg backdrop-blur-sm border border-white/20 z-10">
        <div className="flex flex-col gap-2 items-start">
          <Bar value={stats.shield} maxValue={50} color="bg-blue-500" label="Shield" />
          <Bar value={stats.health} maxValue={100} color="bg-red-500" label="Health" />
        </div>
        <div className="text-center h-full flex flex-col justify-between items-center pb-2">
            <div className="text-7xl font-black text-cyan-300 tracking-tighter" style={{textShadow: '0 0 10px #0ff'}}>{stats.ammo}</div>
            <div className="text-xl text-white uppercase -mt-2">{WEAPONS[WeaponType.RIFLE].name}</div>
        </div>
      </div>

      {/* Top HUD */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 flex items-center gap-6 p-3 px-6 bg-black/30 rounded-lg backdrop-blur-sm border border-white/20 z-10">
        <div className="text-center">
            <div className="text-sm uppercase text-gray-300">Kills</div>
            <div className="text-4xl font-black text-green-400" style={{textShadow: '0 0 10px #4f4'}}>{stats.kills}</div>
        </div>
        <div className="text-center border-x-2 border-white/20 px-6">
            <div className="text-sm font-bold text-gray-300">WIN SCORE</div>
            <div className="text-3xl text-white font-black">{killsToWin}</div>
        </div>
         <div className="text-center">
            <div className="text-sm uppercase text-gray-300">Deaths</div>
            <div className="text-4xl font-black text-red-400" style={{textShadow: '0 0 10px #f44'}}>{stats.deaths}</div>
        </div>
      </div>
    </>
  );
};

export default HUD;
