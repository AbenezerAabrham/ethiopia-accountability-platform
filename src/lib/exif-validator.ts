/**
 * Client-Side EXIF Metadata & Image Anti-Fraud Validator
 * 
 * Inspects binary photo headers to extract original capture timestamps and GPS data.
 * Detects:
 * 1. Recycled old photos (taken >24-48 hours ago).
 * 2. Dummy blank/black screenshots uploaded to game streak counters.
 */

export interface ExifValidationResult {
  isValid: boolean;
  captureDate?: Date;
  captureDateFormatted?: string;
  isRecent: boolean; // Within 24-48h of today
  isDummyBlackOrBlank: boolean;
  luminanceScore: number;
  entropyScore: number;
  fraudRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
}

/**
 * Parses binary EXIF tags from an ArrayBuffer (JPEG format)
 */
function extractExifDate(buffer: ArrayBuffer): Date | null {
  try {
    const dataView = new DataView(buffer);

    // Verify JPEG SOI marker (0xFFD8)
    if (dataView.getUint16(0) !== 0xffd8) return null;

    let offset = 2;
    const length = buffer.byteLength;

    while (offset < length) {
      const marker = dataView.getUint16(offset);
      offset += 2;

      // APP1 Marker (0xFFE1) contains EXIF data
      if (marker === 0xffe1) {
        const app1Length = dataView.getUint16(offset);
        offset += 2;

        // Check for 'Exif\0\0' string header
        const exifHeader =
          String.fromCharCode(dataView.getUint8(offset)) +
          String.fromCharCode(dataView.getUint8(offset + 1)) +
          String.fromCharCode(dataView.getUint8(offset + 2)) +
          String.fromCharCode(dataView.getUint8(offset + 3));

        if (exifHeader === 'Exif') {
          const tiffStart = offset + 6;
          // Simple scan for standard EXIF date format: "YYYY:MM:DD HH:MM:SS"
          const bytes = new Uint8Array(buffer, tiffStart, app1Length - 6);
          const text = new TextDecoder('ascii').decode(bytes);

          // Regex matching EXIF DateTime "YYYY:MM:DD HH:MM:SS"
          const match = text.match(/(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
          if (match) {
            const [, year, month, day, hours, mins, secs] = match;
            return new Date(
              parseInt(year, 10),
              parseInt(month, 10) - 1,
              parseInt(day, 10),
              parseInt(hours, 10),
              parseInt(mins, 10),
              parseInt(secs, 10)
            );
          }
        }
        break;
      } else if ((marker & 0xff00) !== 0xff00) {
        break;
      } else {
        const sectionLength = dataView.getUint16(offset);
        offset += sectionLength;
      }
    }
  } catch (err) {
    console.warn('EXIF binary parsing bypassed:', err);
  }
  return null;
}

/**
 * Checks canvas image pixels for dummy solid black/white/blank fraud
 */
function analyzeImageLuminanceAndEntropy(canvas: HTMLCanvasElement): {
  isDummy: boolean;
  luminance: number;
  entropy: number;
} {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { isDummy: false, luminance: 128, entropy: 1 };

  // Sample low-res 64x64 grid to analyze pixel distributions fast
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = 64;
  sampleCanvas.height = 64;
  const sampleCtx = sampleCanvas.getContext('2d');
  if (!sampleCtx) return { isDummy: false, luminance: 128, entropy: 1 };

  sampleCtx.drawImage(canvas, 0, 0, 64, 64);
  const imgData = sampleCtx.getImageData(0, 0, 64, 64);
  const data = imgData.data;

  let totalLuminance = 0;
  const pixelCount = data.length / 4;
  const histogram: Record<number, number> = {};

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    totalLuminance += lum;
    histogram[lum] = (histogram[lum] || 0) + 1;
  }

  const avgLuminance = totalLuminance / pixelCount;

  // Calculate Shannon entropy (variety in pixels)
  let entropy = 0;
  for (const count of Object.values(histogram)) {
    const p = count / pixelCount;
    entropy -= p * Math.log2(p);
  }

  // Pure black (lum < 15) or pure white (lum > 245) or near-zero entropy (solid color)
  const isDummy = avgLuminance < 12 || avgLuminance > 248 || entropy < 1.2;

  return { isDummy, luminance: avgLuminance, entropy };
}

/**
 * Main EXIF & Image Anti-Cheat Validator
 */
export async function validateProofImage(
  fileOrDataUrl: File | string,
  canvasElement?: HTMLCanvasElement
): Promise<ExifValidationResult> {
  const flags: string[] = [];
  let captureDate: Date | undefined;
  let isRecent = true;

  if (fileOrDataUrl instanceof File) {
    try {
      const buffer = await fileOrDataUrl.arrayBuffer();
      const parsedDate = extractExifDate(buffer);
      if (parsedDate) {
        captureDate = parsedDate;
        const now = new Date();
        const diffHours = Math.abs(now.getTime() - parsedDate.getTime()) / (1000 * 3600);

        // Check if photo is older than 36 hours
        if (diffHours > 36) {
          isRecent = false;
          flags.push(`Photo EXIF timestamp is ${Math.round(diffHours / 24)} days old.`);
        }
      }
    } catch {
      // Fallback
    }
  }

  // Check canvas luminance/entropy if canvas available
  let isDummyBlackOrBlank = false;
  let luminanceScore = 128;
  let entropyScore = 5.0;

  if (canvasElement) {
    const analysis = analyzeImageLuminanceAndEntropy(canvasElement);
    isDummyBlackOrBlank = analysis.isDummy;
    luminanceScore = Math.round(analysis.luminance);
    entropyScore = parseFloat(analysis.entropy.toFixed(2));

    if (isDummyBlackOrBlank) {
      flags.push('Suspicious solid or blank image detected (zero pixel entropy).');
    }
  }

  let fraudRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (isDummyBlackOrBlank) {
    fraudRisk = 'HIGH';
  } else if (!isRecent) {
    fraudRisk = 'MEDIUM';
  }

  return {
    isValid: fraudRisk !== 'HIGH',
    captureDate,
    captureDateFormatted: captureDate ? captureDate.toLocaleDateString() : undefined,
    isRecent,
    isDummyBlackOrBlank,
    luminanceScore,
    entropyScore,
    fraudRisk,
    flags,
  };
}
