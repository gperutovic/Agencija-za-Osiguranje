import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export interface UploadedEvidenceItem {
  id: string;
  file: File;
  previewUrl: string;
  type: 'image' | 'pdf' | 'video' | 'other';
}

export interface DamagePhotoUploaderProps {
  onFilesChanged: (files: File[]) => void;
  maxFiles?: number;
}

export const DamagePhotoUploader: React.FC<DamagePhotoUploaderProps> = ({
  onFilesChanged,
  maxFiles = 10,
}) => {
  const [items, setItems] = useState<UploadedEvidenceItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setError(null);

    const validNewItems: UploadedEvidenceItem[] = [];
    const MAX_SIZE = 15 * 1024 * 1024; // 15 MB

    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i];
      if (file.size > MAX_SIZE) {
        setError(`Datoteka "${file.name}" premašuje limit od 15 MB.`);
        continue;
      }

      let type: UploadedEvidenceItem['type'] = 'other';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type === 'application/pdf') type = 'pdf';
      else if (file.type.startsWith('video/')) type = 'video';

      const previewUrl = type === 'image' ? URL.createObjectURL(file) : '';

      validNewItems.push({
        id: `${Date.now()}-${i}-${file.name}`,
        file,
        previewUrl,
        type,
      });
    }

    const updated = [...items, ...validNewItems].slice(0, maxFiles);
    setItems(updated);
    onFilesChanged(updated.map((item) => item.file));
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onFilesChanged(updated.map((item) => item.file));
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[#fb6504] bg-[#fb6504]/10 scale-[0.99]'
            : 'border-white/[0.15] hover:border-[#fb6504] bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] text-[#fb6504] shadow-sm border border-white/[0.1] flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              Povucite dokaze ovdje ili kliknite za odabir
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Podržani formati: JPG, PNG, HEIC, MP4, PDF (do 15 MB po datoteci)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded Previews */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2.5 flex flex-col items-center text-center overflow-hidden"
            >
              {item.type === 'image' ? (
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-full h-24 object-cover rounded-xl mb-2"
                />
              ) : (
                <div className="w-full h-24 bg-white/[0.04] rounded-xl flex items-center justify-center mb-2 text-slate-400">
                  {item.type === 'pdf' ? (
                    <FileText className="w-8 h-8 text-rose-400" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#fb6504]" />
                  )}
                </div>
              )}

              <span className="text-[11px] font-medium text-slate-200 truncate w-full px-1">
                {item.file.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {(item.file.size / 1024 / 1024).toFixed(1)} MB
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                title="Ukloni datoteku"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
