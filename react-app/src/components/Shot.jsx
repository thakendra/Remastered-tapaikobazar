import { useEffect, useState } from 'react';

/* One component renders every vehicle photograph on the site, so the watermark
   goes on here and lands everywhere automatically — cards, the vehicle page,
   the gallery, the related rows, the finance summary. Nothing to remember when
   a new surface starts showing stock.

   Not every model on the price list has been photographed yet, and the remote
   photographs we do have can go away without warning. Both cases land on the
   same placeholder, which needs no watermark: it is our own artwork already. */
export default function Shot({ vehicle, src, loading = 'lazy' }) {
  const img = src !== undefined ? src : vehicle.img;
  const [failed, setFailed] = useState(false);

  /* A new vehicle deserves a fresh attempt at its photograph. */
  useEffect(() => setFailed(false), [img]);

  if (!img || failed) {
    return (
      <span className="shot-none">
        <span className="shot-none__brand">{vehicle.brand}</span>
        <span className="shot-none__name">{vehicle.name}</span>
        <span className="shot-none__note">Photograph coming</span>
      </span>
    );
  }

  return (
    <>
      <img src={img} alt={vehicle.name} loading={loading} onError={() => setFailed(true)} />
      {/* Decorative: the brand is already in the masthead and the alt text, so
          this must not be announced again. */}
      <span className="shot-mark" aria-hidden="true" />
    </>
  );
}
