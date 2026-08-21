/* Lakh grouping: 41,99,000 rather than 4,199,000. */
export function npr(n) {
  n = Math.round(n);
  const s = String(n);
  if (s.length <= 3) return s;
  const last = s.slice(-3);
  let rest = s.slice(0, -3);
  let out = '';
  while (rest.length > 2) {
    out = ',' + rest.slice(-2) + out;
    rest = rest.slice(0, -2);
  }
  return rest + out + ',' + last;
}

export function emi(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  if (r <= 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export function priceText(v, fallback) {
  if (v.priceLabel) return v.priceLabel;
  return v.price != null ? 'NPR ' + npr(v.price) : fallback;
}

export function catOf(v) {
  return v.type === 'van' ? 'van' : v.type === 'car' ? 'car' : 'tw';
}

export function seatLabel(v) {
  return v.seatsMin === v.seatsMax
    ? v.seatsMin + ' seats'
    : v.seatsMin + '–' + v.seatsMax + ' seats';
}

export function termText(term) {
  return term / 12 + (term === 12 ? ' year' : ' years');
}

/* The Kinglong 19 seater tops the floor at NPR 81,00,000. */
export const VAN_PRICE_MIN = 4000000;
export const VAN_PRICE_MAX = 8500000;

/* How many two wheelers the browse page shows before handing off to the
   dedicated listing. */
export const TW_PREVIEW = 12;

/* "28 July 2026" — unambiguous, and no reliance on the reader's locale to
   decide whether 07/28 is a month or a day. */
export function longDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
