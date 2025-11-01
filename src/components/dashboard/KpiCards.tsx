import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Crown, Rocket } from 'lucide-react';
import { Profile } from '@/contexts/SessionContext'; // Assuming Profile type is exported

interface KpiCardsProps {
  profile: Profile;
  globalPerformanceScore: string; // Placeholder for now
}

const KpiCards: React.FC<KpiCardsProps> = ({ profile, globalPerformanceScore }) => {
  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Zap className="h-4 w-4 mr-1" />;
      case 'elite':
        return <Crown className="h-4 w-4 mr-1" />;
      default:
        return <Rocket className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <Card className="bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 text-center backdrop-blur-sm shadow-lg shadow-dw-accent-secondary/10">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-subheading text-dw-accent-secondary">Analyses effectuées</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-5xl font-mono text-dw-accent-primary">{profile.analyses_count}</p>
        </CardContent>
      </Card>
      <Card className="bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 text-center backdrop-blur-sm shadow-lg shadow-dw-accent-secondary/10">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-subheading text-dw-accent-secondary">Analyses restantes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-5xl font-mono text-dw-accent-primary">{profile.analyses_remaining}</p>
        </CardContent>
      </Card>
      <Card className="bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 text-center backdrop-blur-sm shadow-lg shadow-dw-accent-secondary/10">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-subheading text-dw-accent-secondary">Plan actuel</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex items-center justify-center">
          {getPlanIcon(profile.plan)}
          <p className="text-5xl font-mono text-dw-accent-primary ml-2">{profile.plan.toUpperCase()}</p>
        </CardContent>
      </Card>
      <Card className="bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 text-center backdrop-blur-sm shadow-lg shadow-dw-accent-secondary/10">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-subheading text-dw-accent-secondary">Performance Globale</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-5xl font-mono text-dw-accent-primary">{globalPerformanceScore}</p>
          <p className="text-sm text-dw-text-secondary mt-2">
            (Nécessite une extraction structurée des données de rapport)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiCards;