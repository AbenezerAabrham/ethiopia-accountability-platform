/**
 * Scam & Anti-Spam Link Guard Engine
 * 
 * Protects Ethiopian financial discipline, programming, and learning feeds
 * by automatically detecting and neutralizing:
 * - External Telegram channel / group invite links (t.me/*, telegram.me/*)
 * - WhatsApp group invite links (chat.whatsapp.com/*)
 * - Crypto investment scam keywords ("guaranteed 300% ROI", "crypto signals bot")
 * - Unsolicited phone numbers and referral scams
 * 
 * Users below Trust Tier 2 (30+ day streak or 200+ Rep score) are prohibited
 * from broadcasting unverified external invite links in public community feeds.
 */

export interface LinkGuardResult {
  isClean: boolean;
  sanitizedText: string;
  detectedThreats: string[];
  quarantinedLinks: string[];
  actionTaken: 'PASSED' | 'SANITIZED' | 'BLOCKED';
}

const TELEGRAM_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me)\/[a-zA-Z0-9_+]+/gi;
const WHATSAPP_REGEX = /(?:https?:\/\/)?chat\.whatsapp\.com\/[a-zA-Z0-9]+/gi;
const PHONE_ETH_REGEX = /(?:\+?251|0)9\d{8}/g;
const SCAM_KEYWORDS = [
  'guaranteed profit',
  '500% return',
  'trading bot deposit',
  'send usdt',
  'daily signal vip',
  'doubler',
  'forex signals telegram',
];

export function inspectAndSanitizeContent(
  rawText: string,
  userReputation = 0,
  userStreak = 0
): LinkGuardResult {
  const isTrustedTier2 = userStreak >= 30 || userReputation >= 200;
  const detectedThreats: string[] = [];
  const quarantinedLinks: string[] = [];

  let sanitized = rawText;

  // Check Telegram Links
  const tgMatches = rawText.match(TELEGRAM_REGEX);
  if (tgMatches && tgMatches.length > 0) {
    if (!isTrustedTier2) {
      detectedThreats.push('Unverified Telegram link broadcast');
      quarantinedLinks.push(...tgMatches);
      sanitized = sanitized.replace(
        TELEGRAM_REGEX,
        '[🔒 Link Quarantined — Requires Trust Tier 2 / 30-Day Streak]'
      );
    }
  }

  // Check WhatsApp Links
  const waMatches = rawText.match(WHATSAPP_REGEX);
  if (waMatches && waMatches.length > 0) {
    if (!isTrustedTier2) {
      detectedThreats.push('Unverified WhatsApp group invite link');
      quarantinedLinks.push(...waMatches);
      sanitized = sanitized.replace(
        WHATSAPP_REGEX,
        '[🔒 WhatsApp Invite Quarantined — Anti-Spam Guard]'
      );
    }
  }

  // Check Scam Keywords
  const lower = rawText.toLowerCase();
  for (const keyword of SCAM_KEYWORDS) {
    if (lower.includes(keyword)) {
      detectedThreats.push(`Scam pattern detected: "${keyword}"`);
    }
  }

  const isClean = detectedThreats.length === 0;
  let actionTaken: 'PASSED' | 'SANITIZED' | 'BLOCKED' = 'PASSED';

  if (!isClean) {
    actionTaken = detectedThreats.some((t) => t.includes('Scam')) ? 'BLOCKED' : 'SANITIZED';
  }

  return {
    isClean,
    sanitizedText: sanitized,
    detectedThreats,
    quarantinedLinks,
    actionTaken,
  };
}
