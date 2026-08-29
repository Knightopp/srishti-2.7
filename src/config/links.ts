/**
 * External Application Endpoints & Portals
 * Centralized links to standalone hosts/repositories.
 */

// URL for the dedicated standalone Registration & Passes host
export const REGISTRATION_PORTAL_URL = 
  import.meta.env.VITE_REGISTRATION_URL || 'https://srishti-registration-gamma.vercel.app';

/**
 * Helper to build registration URL with optional pre-selected event
 */
export const getRegistrationUrl = (eventId?: string): string => {
  if (!eventId) return REGISTRATION_PORTAL_URL;
  return `${REGISTRATION_PORTAL_URL}?event=${encodeURIComponent(eventId)}`;
};

/**
 * Helper to build pass verification URL
 */
export const getPassVerificationUrl = (passId?: string): string => {
  if (!passId) return `${REGISTRATION_PORTAL_URL}?pass=`;
  return `${REGISTRATION_PORTAL_URL}?pass=${encodeURIComponent(passId)}`;
};

/**
 * Seamlessly open or navigate to the registration portal
 */
export const openRegistrationPortal = (eventId?: string) => {
  const url = getRegistrationUrl(eventId);
  window.open(url, '_blank', 'noopener,noreferrer');
};
