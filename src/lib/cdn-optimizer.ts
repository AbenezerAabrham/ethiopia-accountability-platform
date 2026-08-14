/**
 * CDN & Edge Image Optimization Utility
 * 
 * Generates responsive WebP/AVIF CDN URLs backed by Cloudflare R2,
 * Supabase Storage, or ImageKit with automatic Data Saver fallbacks.
 */

export interface ImageOptimizationParams {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'auto';
  blur?: number;
  isDataSaverActive?: boolean;
}

/**
 * Returns an edge-optimized CDN URL with resizing, format conversion, and bandwidth limits.
 */
export function getOptimizedImageUrl(
  originalUrl: string | undefined | null,
  params: ImageOptimizationParams = {}
): string {
  if (!originalUrl) {
    return '/placeholder-avatar.svg';
  }

  // If already a base64 data URL (e.g. offline compressed proof), return as is
  if (originalUrl.startsWith('data:image/')) {
    return originalUrl;
  }

  const {
    width = 800,
    height,
    quality = 80,
    format = 'webp',
    isDataSaverActive = false,
  } = params;

  // Under Data Saver mode: drastically downscale resolution & quality to save user mobile data
  const targetWidth = isDataSaverActive ? Math.min(width, 360) : width;
  const targetQuality = isDataSaverActive ? Math.min(quality, 50) : quality;

  try {
    // Handling Unsplash images in mock/demo data
    if (originalUrl.includes('images.unsplash.com')) {
      const url = new URL(originalUrl);
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('w', String(targetWidth));
      if (height) url.searchParams.set('h', String(height));
      url.searchParams.set('q', String(targetQuality));
      if (format !== 'auto') url.searchParams.set('fm', format);
      return url.toString();
    }

    // Handling Supabase storage URLs: /storage/v1/render/image/public/...
    if (originalUrl.includes('supabase.co/storage/v1/object/public/')) {
      return originalUrl.replace(
        '/storage/v1/object/public/',
        `/storage/v1/render/image/public/?width=${targetWidth}&quality=${targetQuality}&format=${format}`
      );
    }

    // Custom Cloudflare R2 / ImageKit transformation wrapper
    if (originalUrl.includes('cloudinary.com') || originalUrl.includes('imagekit.io')) {
      const separator = originalUrl.includes('?') ? '&' : '?';
      return `${originalUrl}${separator}tr=w-${targetWidth},q-${targetQuality},f-${format}`;
    }

    return originalUrl;
  } catch {
    return originalUrl;
  }
}
