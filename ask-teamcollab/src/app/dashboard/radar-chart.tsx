"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function RadarChartComponent({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.2)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 14 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.5)' }} />
        <Radar
          name="Điểm cá nhân"
          dataKey="A"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.4}
        />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
