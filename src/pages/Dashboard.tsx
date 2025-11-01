import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

import { Loader2 } from 'lucide-react';

// PDF Export imports
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import new modular components
import ProfileSection from '@/components/dashboard/ProfileSection';
import KpiCards from '@/components/dashboard/KpiCards';
import QuotaGauge from '@/components/dashboard/QuotaGauge';
import AnalysisHistoryTable from '@/components/dashboard/AnalysisHistoryTable';
import InsightsSection from '@/components/dashboard/InsightsSection';
import QuickActions from '@/components/dashboard/QuickActions';
import ReportModal from '@/components/dashboard/ReportModal';
import DeleteConfirmModal from '@/components/dashboard/DeleteConfirmModal';

export interface Analysis {
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

  // States for search, filter, and anonymization
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterPeriod, setFilterPeriod] = useState<string>('all'); // 'all', '7days', '30days'
  const [anonymizeData, setAnonymizeData] = useState<boolean>(false);

  const reportModalRef = useRef<HTMLDivElement>(null); // Ref for the report modal content

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

  const handleViewReport = (reportContent: string) => {
    setSelectedAnalysisReport(reportContent);
    setIsReportModalOpen(true);
  };

  const handleCopyLink = (analysisId: string) => {
    // In a real app, this would generate a public link to the report
    navigator.clipboard.writeText(`${window.location.origin}/analysis?id=${analysisId}`);
    showSuccess('Lien du rapport copié dans le presse-papiers !');
  };

  const handleDeleteClick = (analysisId: string) => {
    setAnalysisToDeleteId(analysisId);
    setIsDeleteConfirmOpen(true);
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

  const handleExportPdf = async () => {
    if (!reportModalRef.current) {
      showError('Impossible de générer le PDF. Contenu du rapport introuvable.');
      return;
    }

    showSuccess('Génération du PDF en cours...');
    try {
      const canvas = await html2canvas(reportModalRef.current, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Important for images from external sources
        windowWidth: reportModalRef.current.scrollWidth,
        windowHeight: reportModalRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('rapport-data-warfare.pdf');
      showSuccess('Rapport exporté en PDF avec succès !');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showError('Erreur lors de la génération du PDF.');
    }
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

  // Filtering logic
  const filteredAnalyses = analyses.filter(analysis => {
    const extractSummary = (markdownString: string): string => {
      const firstParagraphMatch = markdownString.match(/^(.*?)\n\n/);
      const summary = firstParagraphMatch ? firstParagraphMatch[1] : markdownString.substring(0, 100);
      return summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
    };

    const matchesSearch = searchTerm === '' ||
      analysis.target_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      extractSummary(analysis.result_json).toLowerCase().includes(searchTerm.toLowerCase());

    const analysisDate = new Date(analysis.created_at);
    const now = new Date();
    let matchesPeriod = true;

    if (filterPeriod === '7days') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      matchesPeriod = analysisDate >= sevenDaysAgo;
    } else if (filterPeriod === '30days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      matchesPeriod = analysisDate >= thirtyDaysAgo;
    }

    return matchesSearch && matchesPeriod;
  });

  // Data for Recharts (example: analyses per day/week)
  const analysesByDate = filteredAnalyses.reduce((acc, analysis) => {
    const date = new Date(analysis.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(analysesByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());

  // Placeholder for Global Performance Score
  const globalPerformanceScore = "N/A"; // Requires structured data from result_json

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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <ProfileSection userEmail={user?.email} profile={profile} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
        <KpiCards profile={profile} globalPerformanceScore={globalPerformanceScore} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
        <QuotaGauge profile={profile} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}>
        <AnalysisHistoryTable
          analyses={filteredAnalyses}
          loadingAnalyses={loadingAnalyses}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
          anonymizeData={anonymizeData}
          setAnonymizeData={setAnonymizeData}
          handleViewReport={handleViewReport}
          handleExportPdf={handleExportPdf}
          handleCopyLink={handleCopyLink}
          handleDeleteClick={handleDeleteClick}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }}>
        <InsightsSection chartData={chartData} profile={profile} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }}>
        <QuickActions
          handleNewAnalysis={handleNewAnalysis}
          handleRefreshData={handleRefreshData}
          loadingAnalyses={loadingAnalyses}
        />
      </motion.div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportContent={selectedAnalysisReport}
        onExportPdf={handleExportPdf}
        reportModalRef={reportModalRef}
      />

      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteAnalysis}
      />
    </div>
  );
};

export default Dashboard;