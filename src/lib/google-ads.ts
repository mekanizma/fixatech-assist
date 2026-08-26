export const GOOGLE_ADS_ID = "AW-18394616928";

/** Contact conversion — Google Ads event send_to */
export const GOOGLE_ADS_CONTACT_CONVERSION = "AW-18394616928/7Cg-CK742OQcEOConsNE";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire Google Ads conversion event (Contact). Safe if gtag is not yet loaded. */
export function trackGoogleAdsContactConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_CONTACT_CONVERSION,
  });
}
