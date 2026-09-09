import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { day: 'Oct 1', views: 48, clicks: 24 },
  { day: 'Oct 5', views: 72, clicks: 38 },
  { day: 'Oct 10', views: 64, clicks: 29 },
  { day: 'Oct 15', views: 120, clicks: 61 },
  { day: 'Oct 20', views: 98, clicks: 47 },
  { day: 'Oct 25', views: 140, clicks: 75 },
  { day: 'Oct 30', views: 165, clicks: 88 },
]

export function PortfolioActivityChart() {
  return (
    <ResponsiveContainer width='100%' height={280}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 16, left: -8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
        <XAxis
          dataKey='day'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Bar
          dataKey='views'
          name='Profile Views'
          fill='hsl(var(--primary))'
          radius={[4, 4, 0, 0]}
          opacity={0.85}
        />
        <Bar
          dataKey='clicks'
          name='Project Clicks'
          fill='hsl(var(--muted-foreground))'
          radius={[4, 4, 0, 0]}
          opacity={0.5}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
