import { useEffect, useState } from 'react';

/* Not every model on the price list has been photographed yet, and the remote
   photographs we do have can go away without warning. Both cases land on the
   same placeholder. */
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
    <img
      src={img}
      alt={vehicle.name}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}
