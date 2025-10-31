import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import MarkdownRenderer from '@/components/MarkdownRenderer';

import {
  Loader2,
  Gauge,
  BarChart,
  PieChart,
  Clipboard,
  Share2,
  Trash2,
  Eye,
  Download,
  RefreshCcw,
  PlusCircle,
  UserCircle,
  Zap,
  Crown,
  Rocket,
} from 'lucide-react';

// Recharts imports
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

interface Analysis {
  id: string;
  user_id: string;
  target_url: string;
  result_json: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session, user, profile, isLoading, refreshProfile } = useSession();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [selectedAnalysisReport, setSelectedAnalysisReport] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [analysisToDeleteId, setAnalysisToDeleteId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/login');
    }
  }, [session, isLoading, navigate]);

  const fetchAnalyses = useCallback(async () => {
    if (!user) return;
    setLoadingAnalyses(true);
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10); // Limit to 10 latest analyses

    if (error) {
      console.error('Error fetching analyses:', error);
      showError('Erreur lors du chargement de l\'historique des analyses.');
    } else {
      setAnalyses(data || []);
    }
    setLoadingAnalyses(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAnalyses();

      // Setup Realtime listener
      const channel = supabase
        .channel('analyses_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'analyses', filter: `user_id=eq.${user.id}` },
          (payload) => {
            console.log('Realtime change received!', payload);
            fetchAnalyses(); // Re-fetch analyses on any change
            refreshProfile(); // Also refresh profile to update quota
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchAnalyses, refreshProfile]);

  if (isLoading || !session || !profile) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-dw-background-deep">
        <Loader2 className="h-12 w-12 text-dw-accent-primary animate-spin" />
        <p className="ml-4 text-dw-text-secondary">Chargement du tableau de bord...</p>
      </div>
    );
  }

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

  const extractSummary = (jsonString: string): string => {
    try {
      const data = JSON.parse(jsonString);
      // Assuming the first paragraph of the output is a good summary
      const firstParagraphMatch = data.output.match(/^(.*?)\n\n/);
      return firstParagraphMatch ? firstParagraphMatch[1].substring(0, 100) + '...' : 'Aucun résumé disponible.';
    } catch (e) {
      console.error('Error parsing result_json for summary:', e);
      return 'Erreur de résumé.';
    }
  };

  const handleViewReport = (reportContent: string) => {
    setSelectedAnalysisReport(reportContent);
    setIsReportModalOpen(true);
  };

  const handleCopyLink = (analysisId: string) => {
    // In a real app, this would generate a public link to the report
    navigator.clipboard.writeText(`${window.location.origin}/analysis?id=${analysisId}`);
    showSuccess('Lien du rapport copié dans le presse-papiers !');
  };

  const handleDeleteAnalysis = async () => {
    if (!analysisToDeleteId) return;

    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', analysisToDeleteId);

    if (error) {
      console.error('Error deleting analysis:', error);
      showError('Erreur lors de la suppression de l\'analyse.');
    } else {
      showSuccess('Analyse supprimée avec succès !');
      setAnalyses(analyses.filter(a => a.id !== analysisToDeleteId));
      refreshProfile(); // Refresh profile to update analyses_count
    }
    setIsDeleteConfirmOpen(false);
    setAnalysisToDeleteId(null);
  };

  const handleExportPdf = (analysisId: string) => {
    showSuccess('Fonctionnalité d\'export PDF en cours de développement !');
    // TODO: Implement react-pdf or similar
  };

  const handleNewAnalysis = () => {
    navigate('/');
  };

  const handleRefreshData = async () => {
    setLoadingAnalyses(true);
    await fetchAnalyses();
    await refreshProfile();
    setLoadingAnalyses(false);
    showSuccess('Données actualisées !');
  };

  // Data for Recharts (example: analyses per day/week)
  const analysesByDate = analyses.reduce((acc, analysis) => {
    const date = new Date(analysis.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(analysesByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());

  const planDistributionData = [
    { name: 'Free', value: profile.plan === 'free' ? 1 : 0 },
    { name: 'Pro Tactique', value: profile.plan === 'pro' ? 1 : 0 },
    { name: 'Elite Stratégique', value: profile.plan === 'elite' ? 1 : 0 },
  ].filter(p => p.value > 0); // Only show the active plan

  const PIE_COLORS = ['#ff6b35', '#00d9ff', '#ffffff']; // dw-accent-primary, dw-accent-secondary, dw-text-primary

  const analysesUsedPercentage = profile.analyses_count && profile.analyses_remaining !== null
    ? (profile.analyses_count / (profile.analyses_count + profile.analyses_remaining)) * 100
    : 0;

  return (
    <div className="container mx-auto p-8 min-h-[calc(100vh-160px)] flex flex-col bg-dw-background-deep text-dw-text-primary">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl font-heading gradient-text mb-10 text-center"
      >
        Data Warfare Command Center
      </motion.h1>

      {/* Section 1: En-tête / Profil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12 flex flex-col md:flex-row items-center justify-between bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10"
      >
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="relative w-16 h-16 rounded-full bg-dw-accent-primary flex items-center justify-center text-2xl font-bold text-dw-background-deep">
            {getAvatarInitials(user?.email || '')}
          </div>
          <div>
            <h2 className="text-2xl font-subheading text-dw-text-primary">{user?.email}</h2>
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
      </motion.div>

      {/* Section 2: Indicateurs (KPI cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 text-center backdrop-blur-sm shadow-lg shadow-dw-accent-secondary/10">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-subheading text-dw-accent-secondary">Analyses effectuées</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-5xl font-mono text-dw-accent-primary">{profile.analyses_count}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 text-center backdrop-blur-sm shadow-lg shadow-dw-accent-secondary/10">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-subheading text-dw-accent-secondary">Analyses restantes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-5xl font-mono text-dw-accent-primary">{profile.analyses_remaining}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 text-center backdrop-blur-sm shadow-lg shadow-dw-accent-secondary/10">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-subheading text-dw-accent-secondary">Plan actuel</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex items-center justify-center">
              {getPlanIcon(profile.plan)}
              <p className="text-5xl font-mono text-dw-accent-primary ml-2">{profile.plan.toUpperCase()}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Section 3: Jauge de quota */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mb-12 bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10 flex flex-col items-center"
      >
        <h2 className="text-3xl font-subheading text-dw-accent-secondary mb-6">Quota d'Analyses</h2>
        <div className="relative w-48 h-48 flex items-center justify-center">
          <Progress
            value={analysesUsedPercentage}
            className="w-full h-full absolute rounded-full"
            indicatorClassName="bg-gradient-to-r from-dw-accent-secondary to-dw-accent-primary"
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
      </motion.div>

      {/* Section 4: Historique des analyses */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mb-12 bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10"
      >
        <h2 className="text-3xl font-subheading text-dw-accent-secondary mb-6">Historique des Analyses</h2>
        {loadingAnalyses ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-dw-accent-primary animate-spin" />
            <p className="ml-4 text-dw-text-secondary">Chargement de l'historique...</p>
          </div>
        ) : analyses.length === 0 ? (
          <p className="text-center text-dw-text-secondary py-8">Aucune analyse trouvée. Lancez votre première analyse !</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-dw-background-glass">
                  <TableHead className="text-dw-accent-secondary">Date</TableHead>
                  <TableHead className="text-dw-accent-secondary">Site Analysé</TableHead>
                  <TableHead className="text-dw-accent-secondary">Résumé</TableHead>
                  <TableHead className="text-dw-accent-secondary text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.map((analysis) => (
                  <TableRow key={analysis.id} className="border-dw-background-glass hover:bg-dw-background-glass/50">
                    <TableCell className="text-dw-text-secondary">
                      {new Date(analysis.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-dw-text-primary font-subheading">
                      <a href={analysis.target_url} target="_blank" rel="noopener noreferrer" className="hover:text-dw-accent-primary">
                        {analysis.target_url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}
                      </a>
                    </TableCell>
                    <TableCell className="text-dw-text-secondary text-sm max-w-xs truncate">
                      {extractSummary(analysis.result_json)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReport(analysis.result_json)}
                        className="text-dw-accent-secondary hover:bg-dw-accent-secondary/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportPdf(analysis.id)}
                        className="text-dw-text-secondary hover:bg-dw-text-secondary/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(analysis.id)}
                        className="text-dw-text-secondary hover:bg-dw-text-secondary/20"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setAnalysisToDeleteId(analysis.id); setIsDeleteConfirmOpen(true); }}
                        className="text-dw-error hover:bg-dw-error/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Section 5: Insights / Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mb-12 bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10"
      >
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
      </motion.div>

      {/* Section 6: Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mb-12 bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10 flex flex-wrap justify-center gap-4"
      >
        <Button
          onClick={handleNewAnalysis}
          className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-6 py-3 flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Nouvelle Analyse
        </Button>
        <Button
          onClick={() => showSuccess('Fonctionnalité d\'export de toutes les analyses en PDF en cours de développement !')}
          className="bg-dw-accent-secondary/20 hover:bg-dw-accent-secondary/30 text-dw-accent-secondary font-subheading px-6 py-3 flex items-center"
        >
          <Download className="h-5 w-5 mr-2" /> Exporter tout en PDF
        </Button>
        <Button
          onClick={() => showError('Fonctionnalité de suppression de toutes les analyses en cours de développement !')}
          className="bg-dw-error/20 hover:bg-dw-error/30 text-dw-error font-subheading px-6 py-3 flex items-center"
        >
          <Trash2 className="h-5 w-5 mr-2" /> Tout supprimer
        </Button>
        <Button
          onClick={handleRefreshData}
          className="bg-dw-background-glass hover:bg-dw-background-glass/50 text-dw-text-secondary font-subheading px-6 py-3 flex items-center"
        >
          <RefreshCcw className={`h-5 w-5 mr-2 ${loadingAnalyses ? 'animate-spin' : ''}`} /> Actualiser les données
        </Button>
      </motion.div>

      {/* Modale d'affichage du rapport */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-4xl bg-dw-background-deep border border-dw-accent-primary/30 text-dw-text-primary p-8 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl font-heading gradient-text mb-4">Rapport d'Analyse</DialogTitle>
            <DialogDescription className="text-dw-text-secondary">
              Voici le rapport détaillé de votre analyse.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-4">
            {selectedAnalysisReport && <MarkdownRenderer markdown={selectedAnalysisReport} />}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsReportModalOpen(false)} className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de confirmation de suppression */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="bg-dw-background-deep border border-dw-error/30 text-dw-text-primary p-8 rounded-lg max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-heading text-dw-error mb-4">Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-dw-text-secondary mb-6">
              Êtes-vous sûr de vouloir supprimer cette analyse ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center space-x-4">
            <Button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="bg-dw-background-glass hover:bg-dw-background-glass/50 text-dw-text-secondary font-subheading px-6 py-3"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDeleteAnalysis}
              className="bg-dw-error hover:bg-dw-error/90 text-dw-text-primary font-subheading px-6 py-3"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;