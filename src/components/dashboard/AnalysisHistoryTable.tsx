import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Search, Eye, Share2, Trash2 } from 'lucide-react';

interface Analysis {
  id: string;
  user_id: string;
  target_url: string;
  result_json: string;
  created_at: string;
}

interface AnalysisHistoryTableProps {
  filteredAnalyses: Analysis[];
  loadingAnalyses: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterPeriod: string;
  setFilterPeriod: (period: string) => void;
  anonymizeData: boolean;
  setAnonymizeData: (anonymize: boolean) => void;
  extractSummary: (markdown: string) => string;
  handleViewReport: (reportContent: string) => void;
  handleCopyLink: (analysisId: string) => void;
  setAnalysisToDeleteId: (id: string) => void;
  setIsDeleteConfirmOpen: (isOpen: boolean) => void;
}

const AnalysisHistoryTable: React.FC<AnalysisHistoryTableProps> = ({
  filteredAnalyses,
  loadingAnalyses,
  searchTerm,
  setSearchTerm,
  filterPeriod,
  setFilterPeriod,
  anonymizeData,
  setAnonymizeData,
  extractSummary,
  handleViewReport,
  handleCopyLink,
  setAnalysisToDeleteId,
  setIsDeleteConfirmOpen,
}) => {
  return (
    <div className="mb-12 bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10">
      <h2 className="text-3xl font-subheading text-dw-accent-secondary mb-6">Historique des Analyses</h2>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dw-text-secondary" />
          <Input
            type="text"
            placeholder="Rechercher par URL ou résumé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 bg-dw-background-deep border-dw-accent-secondary/30 text-dw-text-primary placeholder:text-dw-text-secondary focus:border-dw-accent-primary focus:ring-dw-accent-primary"
          />
        </div>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-[180px] bg-dw-background-deep border-dw-accent-secondary/30 text-dw-text-primary">
              <SelectValue placeholder="Filtrer par période" />
            </SelectTrigger>
            <SelectContent className="bg-dw-background-deep border-dw-accent-secondary/30 text-dw-text-primary">
              <SelectItem value="all">Toutes les périodes</SelectItem>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymize-mode"
              checked={anonymizeData}
              onCheckedChange={setAnonymizeData}
              className="data-[state=checked]:bg-dw-accent-primary data-[state=unchecked]:bg-dw-background-glass"
            />
            <Label htmlFor="anonymize-mode" className="text-dw-text-secondary">Anonymiser</Label>
          </div>
        </div>
      </div>

      {loadingAnalyses ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-dw-accent-primary animate-spin" />
          <p className="ml-4 text-dw-text-secondary">Chargement de l'historique...</p>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <p className="text-center text-dw-text-secondary py-8">Aucune analyse trouvée correspondant à vos critères.</p>
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
              {filteredAnalyses.map((analysis) => (
                <TableRow key={analysis.id} className="border-dw-background-glass hover:bg-dw-background-glass/50">
                  <TableCell className="text-dw-text-secondary">
                    {new Date(analysis.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-dw-text-primary font-subheading">
                    {anonymizeData ? 'Site Concurrent Anonyme' : (
                      <a href={analysis.target_url} target="_blank" rel="noopener noreferrer" className="hover:text-dw-accent-primary">
                        {analysis.target_url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}
                      </a>
                    )}
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
    </div>
  );
};

export default AnalysisHistoryTable;