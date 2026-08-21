/* Validation and the recondition estimate.
   Nothing here talks to a server — the site has no backend — so every form
   ends in something a person can act on: a confirmation and a WhatsApp
   handoff to the counter. */

/* Nepali mobiles are ten digits and start 97 or 98. */
export function isMobile(value) {
  return /^9[78]\d{8}$/.test(String(value).replace(/[\s-]/g, ''));
}

export function cleanMobile(value) {
  return String(value).replace(/[\s-]/g, '');
}

/* PLACEHOLDER VALUATION MODEL.
   These are stand-in figures so the estimator responds honestly to what is
   typed rather than printing one hardcoded range. Replace BASE and the two
   rates with the counter's real numbers before this goes near a customer. */
const BASE = {
  Honda: 1450000,
  Toyota: 2600000,
  Hyundai: 1700000,
  Suzuki: 1250000,
};

const DEPRECIATION_PER_YEAR = 0.09;
const WEAR_PER_10000_KM = 0.012;
const FLOOR = 0.22; // never values a vehicle below this share of its base

export function estimateRecondition({ make, year, km }) {
  const base = BASE[make];
  const kms = Number(km);
  const built = Number(year);

  if (!base || !Number.isFinite(kms) || kms < 0) return null;
  if (!Number.isFinite(built)) return null;

  const age = Math.max(0, new Date().getFullYear() - built);
  const wear = (kms / 10000) * WEAR_PER_10000_KM;
  const kept = Math.max(FLOOR, 1 - age * DEPRECIATION_PER_YEAR - wear);
  const mid = base * kept;

  /* A range rather than a single figure: the counter sets the final number. */
  return { low: Math.round(mid * 0.92), high: Math.round(mid * 1.08) };
}

export const MAKES = Object.keys(BASE);

export const YEARS = (() => {
  const now = new Date().getFullYear();
  const out = [];
  for (let y = now; y >= now - 24; y -= 1) out.push(y);
  return out;
})();
