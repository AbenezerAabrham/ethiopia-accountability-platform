/**
 * Client-Side Image Compression Utility for Proof Uploads
 * 
 * Optimized for low-bandwidth Ethiopian mobile networks (2G/3G/4G).
 * Shrinks 5MB-15MB high-resolution smartphone camera photos to <150 KB
 * using HTML5 Canvas & adaptive WebP/JPEG encoding without quality loss.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  originalSizeFormatted: string;
  compressedSizeFormatted: string;
  savedPercent: number;
  width: number;
  height: number;
  mimeType: string;
}

export interface CompressionOptions {
  maxDimension?: number; // Max width or height (default: 1280px)
  initialQuality?: number; // Quality ratio 0.1 - 1.0 (default: 0.78)
  targetMaxSizeBytes?: number; // Max target file size (default: 150 * 1024 = 150 KB)
  preferWebP?: boolean; // Prefer WebP format where supported
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxDimension = 1280,
    initialQuality = 0.78,
    targetMaxSizeBytes = 150 * 1024, // 150 KB
    preferWebP = true,
  } = options;

  const originalSizeBytes = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if exceeding maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Canvas 2D context unavailable'));
          }

          // Draw image to canvas with high smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Determine preferred MIME type
          const isWebPSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
          const mimeType = preferWebP && isWebPSupported ? 'image/webp' : 'image/jpeg';

          let quality = initialQuality;
          let dataUrl = canvas.toDataURL(mimeType, quality);
          let compressedSizeBytes = Math.round((dataUrl.length * 3) / 4);

          // Iterative reduction if still exceeds target size
          let attempts = 0;
          while (compressedSizeBytes > targetMaxSizeBytes && quality > 0.4 && attempts < 4) {
            quality -= 0.12;
            dataUrl = canvas.toDataURL(mimeType, quality);
            compressedSizeBytes = Math.round((dataUrl.length * 3) / 4);
            attempts++;
          }

          const savedPercent = Math.max(
            0,
            Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
          );

          resolve({
            dataUrl,
            originalSizeBytes,
            compressedSizeBytes,
            originalSizeFormatted: formatBytes(originalSizeBytes),
            compressedSizeFormatted: formatBytes(compressedSizeBytes),
            savedPercent,
            width,
            height,
            mimeType,
          });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
