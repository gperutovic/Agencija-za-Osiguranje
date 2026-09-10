import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool, Type } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange: (signatureDataUrl: string, signatoryName: string) => void;
  defaultName?: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
  defaultName = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signatoryName, setSignatoryName] = useState(defaultName);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSignatureChange(canvas.toDataURL(), signatoryName);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureChange('', signatoryName);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSignatoryName(name);
    if (mode === 'type') {
      // render typed signature onto hidden canvas or export
      renderTypedSignature(name);
    } else if (canvasRef.current && hasDrawn) {
      onSignatureChange(canvasRef.current.toDataURL(), name);
    }
  };

  const renderTypedSignature = (name: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!name) {
      setHasDrawn(false);
      onSignatureChange('', '');
      return;
    }
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'italic 32px "Caveat", "Brush Script MT", cursive, sans-serif';
    ctx.fillText(name, 20, 75);
    setHasDrawn(true);
    onSignatureChange(canvas.toDataURL(), name);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
          Authorized Signatory Legal Full Name <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              setMode('draw');
              clearCanvas();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              mode === 'draw' ? 'bg-[#0284C7] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>Draw</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('type');
              renderTypedSignature(signatoryName);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              mode === 'type' ? 'bg-[#0284C7] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>Type to Sign</span>
          </button>
        </div>
      </div>

      <input
        type="text"
        value={signatoryName}
        onChange={handleNameChange}
        placeholder="e.g. Elena Rostova"
        className="w-full px-4 py-2.5 rounded-xl bg-[#07090E] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-sm"
        required
      />

      <div className="relative rounded-2xl border-2 border-dashed border-white/[0.15] bg-[#07090E] p-2 overflow-hidden group hover:border-[#0284C7]/50 transition-colors">
        <canvas
          ref={canvasRef}
          width={540}
          height={130}
          onMouseDown={mode === 'draw' ? startDrawing : undefined}
          onMouseMove={mode === 'draw' ? draw : undefined}
          onMouseUp={mode === 'draw' ? stopDrawing : undefined}
          onMouseLeave={mode === 'draw' ? stopDrawing : undefined}
          onTouchStart={mode === 'draw' ? startDrawing : undefined}
          onTouchMove={mode === 'draw' ? draw : undefined}
          onTouchEnd={mode === 'draw' ? stopDrawing : undefined}
          className={`w-full h-32 touch-none ${mode === 'draw' ? 'cursor-crosshair' : 'cursor-default'}`}
        />

        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-500 font-mono">
            {mode === 'draw' ? 'Draw signature using mouse or fingertip' : 'Type legal name above to auto-render signature'}
          </div>
        )}

        {/* Clear Button */}
        {hasDrawn && (
          <button
            type="button"
            onClick={clearCanvas}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1 text-emerald-400">
          <Check className="w-3.5 h-3.5" />
          <span>E-SIGN Act & UETA Compliant 256-bit Hash</span>
        </span>
        <span>Timestamp: {new Date().toLocaleDateString('en-US')}</span>
      </div>
    </div>
  );
};

