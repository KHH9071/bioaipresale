'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { PhaseCount } from '@/lib/types'
import styles from './PhaseChart.module.css'

interface Props {
  data: PhaseCount[]
}

const COLORS = ['#58A6FF', '#3FB950', '#D29922', '#BC8CFF', '#F85149', '#8B949E']

export default function PhaseChart({ data }: Props) {
  if (data.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Phase별 분포</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 4 }}>
          <XAxis
            dataKey="phase"
            tick={{ fill: '#8B949E', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8B949E', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: '#1C2128',
              border: '1px solid #30363D',
              borderRadius: 6,
              color: '#E6EDF3',
              fontSize: 12,
            }}
            cursor={{ fill: 'rgba(88,166,255,0.08)' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
