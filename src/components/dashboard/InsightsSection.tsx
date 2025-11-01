import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Profile } from '@/contexts/SessionContext'; // Assuming Profile type is exported

interface InsightsSectionProps {
  chartData: { date: string; count: number }[];
  profile: Profile;
}

const PIE_COLORS = ['#ff6b35', '#00d9ff', '#ffffff']; // dw-accent-primary, dw-accent-secondary, dw-text-primary

const InsightsSection: React.FC<InsightsSectionProps> = ({ chartData, profile }) => {
  const planDistributionData = [
    { name: 'Free', value: profile.plan === 'free' ? 1 : 0 },
    { name: 'Pro Tactique', value: profile.plan === 'pro' ? 1 : 0 },
    { name: 'Elite Stratégique', value: profile.plan === 'elite' ? 1 : 0 },
  ].filter(p => p.value > 0); // Only show the active plan

  return (
    <div className="mb-12 bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10">
      <h2 className="text-3xl font-subheading text-dw-accent-secondary mb-6">Insights Stratégiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-dw-background-deep border border-dw-accent-primary/20 p-4">
          <CardTitle className="text-xl font-subheading text-dw-text-primary mb-4">Analyses par Date</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a1929', border: '1px solid #ff6b35', borderRadius: '4px' }}
                itemStyle={{ color: '#ffffff' }}
                labelStyle={{ color: '#00d9ff' }}
              />
              <Line type="monotone" dataKey="count" stroke="#00d9ff" strokeWidth={2} dot={{ stroke: '#ff6b35', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="bg-dw-background-deep border border-dw-accent-primary/20 p-4">
          <CardTitle className="text-xl font-subheading text-dw-text-primary mb-4">Votre Plan Actif</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={planDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {planDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0a1929', border: '1px solid #ff6b35', borderRadius: '4px' }}
                itemStyle={{ color: '#ffffff' }}
                labelStyle={{ color: '#00d9ff' }}
              />
              <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default InsightsSection;