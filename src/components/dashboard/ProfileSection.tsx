import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, Zap, Crown, Rocket } from 'lucide-react';
import { Profile } from '@/contexts/SessionContext'; // Assuming Profile type is exported

interface ProfileSectionProps {
  userEmail: string | undefined;
  profile: Profile;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ userEmail, profile }) => {
  const navigate = useNavigate();

  const getAvatarInitials = (email: string) => {
    if (!email) return '??';
    const parts = email.split('@')[0].split('.');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'bg-dw-accent-secondary text-dw-background-deep';
      case 'elite':
        return 'bg-dw-accent-primary text-dw-background-deep';
      default:
        return 'bg-gray-500 text-white';
    }
  };

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
    <div className="mb-12 flex flex-col md:flex-row items-center justify-between bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <div className="relative w-16 h-16 rounded-full bg-dw-accent-primary flex items-center justify-center text-2xl font-bold text-dw-background-deep">
          {getAvatarInitials(userEmail || '')}
        </div>
        <div>
          <h2 className="text-2xl font-subheading text-dw-text-primary">{userEmail}</h2>
          <div className="flex items-center text-dw-text-secondary text-sm">
            {getPlanIcon(profile.plan)}
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPlanBadgeColor(profile.plan)}`}>
              {profile.plan.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      <Button
        onClick={() => navigate('/pricing')}
        className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-6 py-3"
      >
        Mettre à niveau
      </Button>
    </div>
  );
};

export default ProfileSection;