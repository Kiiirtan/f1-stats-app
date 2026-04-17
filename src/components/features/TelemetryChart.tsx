import React, { useMemo } from 'react';
import { useLiveStore } from '../../store/useLiveStore';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Custom tooltips styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/90 backdrop-blur border border-white/10 p-3 rounded shadow-xl">
        <p className="text-secondary font-mono text-xs mb-2">Time: {label}s</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between space-x-4 font-mono text-sm leading-tight">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="text-white font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const EMPTY_ARRAY: any[] = [];

export default function TelemetryChart() {
  const selectedDriver = useLiveStore(state => state.selectedDriver);
  const data = useLiveStore(state => {
    if (!selectedDriver) return EMPTY_ARRAY;
    return state.telemetryBuffer[selectedDriver] || EMPTY_ARRAY;
  });

  // Format data for Recharts, extracting time part only
  const formattedData = useMemo(() => {
    return (data || []).map(pkt => {
      const d = new Date(pkt.date);
      return {
        ...pkt,
        timeLabel: `${d.getSeconds()}.${Math.floor(d.getMilliseconds() / 100)}` 
      };
    });
  }, [data]);

  if (!selectedDriver || data?.length === 0) {
    return (
      <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-64 flex items-center justify-center">
        <p className="text-secondary/50 font-display">WAITING FOR DATALINK...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-display font-medium text-white/90">LIVE TELEMETRY TRACE</h3>
          <p className="text-xs text-secondary font-mono">Last 60 Seconds Buffer</p>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="timeLabel" 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace' }} 
              stroke="rgba(255,255,255,0.1)"
              tickMargin={10}
              minTickGap={30}
            />
            {/* Speed Y-axis */}
            <YAxis 
              yAxisId="speed" 
              domain={[0, 350]}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }}
              stroke="rgba(255,255,255,0.1)"
              hide={false}
            />
            {/* Pedals Y-axis */}
            <YAxis 
              yAxisId="pedals" 
              domain={[0, 100]}
              hide={true} 
            />
            
            <Tooltip content={<CustomTooltip />} animationDuration={100} isAnimationActive={false} />

            <Line 
              yAxisId="speed" 
              type="monotone" 
              dataKey="speed" 
              stroke="#ffffff" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
              name="Speed (kph)"
            />
            <Line 
              yAxisId="pedals" 
              type="monotone" 
              dataKey="throttle" 
              stroke="#3b82f6" 
              strokeWidth={1.5} 
              dot={false}
              isAnimationActive={false}
              name="Throttle %"
            />
            <Line 
              yAxisId="pedals" 
              type="step" 
              dataKey="brake" 
              stroke="#ef4444" 
              strokeWidth={1.5} 
              dot={false}
              strokeDasharray="4 4"
              isAnimationActive={false}
              name="Brake %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
