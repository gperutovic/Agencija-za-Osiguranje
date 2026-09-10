import React, { useState } from 'react';
import {
  FileText,
  Download,
  Lock,
  Search,
  ShieldCheck,
  Calendar,
  ExternalLink,
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
    <Card className="p-6 sm:p-8 bg-white border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">Digitalni Trezor Dokumenata</h3>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Lock className="w-3 h-3" />
              256-bit Enkripcija
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pristupite svim vašim ugovorima, uvjetima osiguranja, IPID obrascima i potvrdama pokrića.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Pretraži dokumente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-100">
        {[
          { id: 'all', label: 'Svi dokumenti' },
          { id: 'Polica', label: 'Police i Certifikati' },
          { id: 'IPID obrazac', label: 'IPID Obrasci' },
          { id: 'Opći uvjeti', label: 'Uvjeti osiguranja' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          <p className="text-sm font-medium">Nema pronađenih dokumenata.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 px-3 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 line-clamp-1">
                    {doc.title}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="font-mono text-slate-600">{doc.policyNumber}</span>
                    <span>•</span>
                    <span>{formatDate(doc.date)}</span>
                    <span>•</span>
                    <Badge variant="outline">{doc.category}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-brand-700"
                >
                  <Download className="w-3.5 h-3.5" />
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
