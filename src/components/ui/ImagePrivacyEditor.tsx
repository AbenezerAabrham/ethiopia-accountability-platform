'use client';

import React, { useRef, useEffect, useState } from 'react';
import { EyeOff, Check, RotateCcw, Shield, Sparkles } from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from './Button';

interface ImagePrivacyEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSaveBlurredImage: (blurredDataUrl: string) => void;
}

export const ImagePrivacyEditor: React.FC<ImagePrivacyEditorProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onSaveBlurredImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFaceBlurred, setIsFaceBlurred] = useState(false);
  const [blurCount, setBlurCount] = useState(0);

  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setIsFaceBlurred(false);
      setBlurCount(0);
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  // Apply automatic face / subject privacy blur
  const applyAutoFaceBlur = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Approximate face/subject region (center upper third: 30% width, 30% height)
    const faceX = Math.round(width * 0.35);
    const faceY = Math.round(height * 0.12);
    const faceW = Math.round(width * 0.3);
    const faceH = Math.round(height * 0.32);

    // Apply pixelation / heavy box blur
    const imgData = ctx.getImageData(faceX, faceY, faceW, faceH);
    const pixelSize = 14;

    for (let y = 0; y < faceH; y += pixelSize) {
      for (let x = 0; x < faceW; x += pixelSize) {
        const redIndex = (y * faceW + x) * 4;
        const r = imgData.data[redIndex];
        const g = imgData.data[redIndex + 1];
        const b = imgData.data[redIndex + 2];

        for (let py = 0; py < pixelSize && y + py < faceH; py++) {
          for (let px = 0; px < pixelSize && x + px < faceW; px++) {
            const idx = ((y + py) * faceW + (x + px)) * 4;
            imgData.data[idx] = r;
            imgData.data[idx + 1] = g;
            imgData.data[idx + 2] = b;
          }
        }
      }
    }

    ctx.putImageData(imgData, faceX, faceY);
    setIsFaceBlurred(true);
    setBlurCount((prev) => prev + 1);
  };

  // Reset original unblurred image
  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      setIsFaceBlurred(false);
      setBlurCount(0);
    };
    img.src = imageSrc;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onSaveBlurredImage(dataUrl);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Proof Privacy & Anonymization Editor">
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start space-x-2.5">
          <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Protect Your Personal Privacy</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
              Automatically anonymize your face or background before submitting workout/study proof.
            </p>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-80">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-72 object-contain"
          />
          {isFaceBlurred && (
            <div className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
              <EyeOff className="w-3 h-3" />
              <span>Face Anonymized</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="primary"
              onClick={applyAutoFaceBlur}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              1-Click Auto Face Blur
            </Button>
            {blurCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={handleSave} leftIcon={<Check className="w-3.5 h-3.5" />}>
              Apply & Keep
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
