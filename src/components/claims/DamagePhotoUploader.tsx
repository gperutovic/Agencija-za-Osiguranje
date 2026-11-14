import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

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
        setError(`Datoteka "${file.name}" premašuje dopušteno ograničenje od 15 MB.`);
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
        className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-[#0F2942] bg-slate-100'
            : 'border-slate-300 hover:border-[#0F2942] bg-slate-50'
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

        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-11 h-11 rounded-lg bg-white text-[#0F2942] border border-slate-200 shadow-sm flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Povucite fotografije ili dokumente ovdje, ili kliknite za odabir
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Podržani formati: JPG, PNG, HEIC, MP4, PDF (do 15 MB po datoteci)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 flex flex-col items-center text-center overflow-hidden shadow-sm"
            >
              {item.type === 'image' ? (
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="w-full h-24 bg-slate-50 rounded-lg flex items-center justify-center mb-2 text-slate-500">
                  {item.type === 'pdf' ? (
                    <FileText className="w-8 h-8 text-red-700" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#0F2942]" />
                  )}
                </div>
              )}

              <span className="text-xs font-medium text-slate-800 truncate w-full px-1">
                {item.file.name}
              </span>
              <span className="text-[11px] text-slate-500 tabular-nums">
                {(item.file.size / 1024 / 1024).toFixed(1)} MB
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/75 text-white hover:bg-red-700 transition-colors cursor-pointer"
                title="Ukloni datoteku"
                aria-label="Ukloni datoteku"
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
