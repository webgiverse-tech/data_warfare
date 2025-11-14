import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Profile } from '@/contexts/SessionContext';

interface QuotaGaugeProps {
  profile: Profile;
}

const QuotaGauge: React.FC<QuotaGaugeProps> = ({ profile }) => {
  const analysesUsedPercentage = profile.analyses_count && profile.analyses_remaining !== null
    ? (profile.analyses_count / (profile.analyses_count + profile.analyses_remaining)) * 100
    : 0;

  return (
    <div className="mb-12 bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10 flex flex-col items-center">
      <h2 className="text-3xl font-subheading text-dw-accent-secondary mb-6">Quota d'Analyses</h2>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <Progress
          value={analysesUsedPercentage}
          className="w-full h-full absolute rounded-full [&>*]:bg-gradient-to-r [&>*]:from-dw-accent-secondary [&>*]:to-dw-accent-primary" // Apply gradient to the indicator using a child selector
          style={{
            transform: 'rotate(-90deg)',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'transparent',
            boxShadow: 'inset 0 0 10px rgba(0, 217, 255, 0.3)',
          }}
        />
        <div className="absolute text-center">
          <p className="text-4xl font-mono text-dw-accent-primary">{profile.analyses_count}</p>
          <p className="text-xl font-subheading text-dw-text-secondary">/{profile.analyses_count + profile.analyses_remaining} utilisées</p>
        </div>
      </div>
    </div>
  );
};

export default QuotaGauge;