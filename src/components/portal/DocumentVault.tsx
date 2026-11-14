import React, { useState } from 'react';
import {
  FileText,
  Download,
  Lock,
  Search,
  FileCheck,
} from 'lucide-react';
import { Policy } from '../../types/database';
import { formatDate, generatePolicyCertificatePdf } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface DocumentVaultProps {
  policies: Policy[];
}

interface VaultDocItem {
  id: string;
  title: string;
  category: 'Polica' | 'IPID obrazac' | 'Opći uvjeti' | 'Zapisnik';
  policyNumber: string;
  policy: Policy;
  date: string;
  isDownloadablePdf: boolean;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ policies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Build documents list from policies
  const documents: VaultDocItem[] = policies.flatMap((p) => [
    {
      id: `${p.id}-cert`,
      title: `Službena Polica osiguranja ${p.policyNumber}`,
      category: 'Polica',
      policyNumber: p.policyNumber,
      policy: p,
      date: p.startDate,
      isDownloadablePdf: true,
    },
    {
      id: `${p.id}-ipid`,
      title: `Standardizirani informativni dokument o proizvodu (IPID) - ${p.type.toUpperCase()}`,
      category: 'IPID obrazac',
      policyNumber: p.policyNumber,
      policy: p,
      date: p.startDate,
      isDownloadablePdf: false,
    },
    {
      id: `${p.id}-terms`,
      title: `Opći uvjeti osiguranja Generali osiguranje d.d. (Izdanje 2026)`,
      category: 'Opći uvjeti',
      policyNumber: p.policyNumber,
      policy: p,
      date: p.startDate,
      isDownloadablePdf: false,
    },
  ]);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (doc: VaultDocItem) => {
    // Generate official Generali-branded PDF certificate
    generatePolicyCertificatePdf(doc.policy);
  };

  return (
    <Card className="p-6 sm:p-8 bg-white border border-slate-200 text-slate-900 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">Digitalni trezor dokumenata</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Lock className="w-3 h-3" />
              Sigurna pohrana
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Pristupite svim vašim ugovorima, uvjetima osiguranja, IPID obrascima i potvrdama pokrića.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Pretraži dokumente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-200">
        {[
          { id: 'all', label: 'Svi dokumenti' },
          { id: 'Polica', label: 'Police i certifikati' },
          { id: 'IPID obrazac', label: 'IPID obrasci' },
          { id: 'Opći uvjeti', label: 'Uvjeti osiguranja' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#0F2942] text-white'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document List */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">Nema pronađenih dokumenata.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-3 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F2942]/5 text-[#0F2942] border border-[#0F2942]/15 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 line-clamp-1">
                    {doc.title}
                  </h5>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500 tabular-nums">
                    <span className="font-semibold text-[#0F2942]">{doc.policyNumber}</span>
                    <span>&bull;</span>
                    <span>{formatDate(doc.date)}</span>
                    <span>&bull;</span>
                    <Badge variant="outline">{doc.category}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#0F2942]"
                >
                  <Download className="w-3.5 h-3.5 text-[#0F2942]" />
                  Preuzmi PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
