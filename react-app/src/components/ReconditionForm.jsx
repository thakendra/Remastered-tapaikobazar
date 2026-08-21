import { useEffect, useState } from 'react';
import { CONTACT } from '../data/catalogue';
import { npr } from '../lib/format';
import { MAKES, YEARS, cleanMobile, estimateRecondition, isMobile } from '../lib/forms';

/* A valuation request: brand, year, distance, photographs and a number.

   The site has no backend, so the photographs genuinely cannot be uploaded —
   pretending otherwise would lose someone's pictures silently. They are read
   locally for the preview only, and the handoff asks for them on WhatsApp,
   where they will actually arrive. The instant estimate still runs for the
   brands the model knows. */
export default function ReconditionForm() {
  const [brand, setBrand] = useState(MAKES[0]);
  const [year, setYear] = useState(String(YEARS[6]));
  const [km, setKm] = useState('');
  const [phone, setPhone] = useState('');
  const [photos, setPhotos] = useState([]);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const known = brand !== 'Other';

  /* Object URLs are a browser resource, not garbage. Released when the
     selection changes and on the way out. */
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos]);

  const onPick = (e) => {
    const picked = Array.from(e.target.files || []);
    photos.forEach((p) => URL.revokeObjectURL(p.url));

    const tooBig = picked.filter((f) => f.size > 8 * 1024 * 1024);
    const images = picked.filter((f) => f.type.startsWith('image/') && f.size <= 8 * 1024 * 1024);

    setErrors((prev) => ({
      ...prev,
      photos: tooBig.length ? 'Some photographs are over 8MB. Pick smaller ones.' : '',
    }));
    setPhotos(images.slice(0, 6).map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const kms = Number(km);
    const next = {};

    if (km.trim() === '' || !Number.isFinite(kms) || kms < 0) {
      next.km = 'Enter the kilometres run, as a number.';
    } else if (kms > 500000) {
      next.km = 'That looks too high — check the odometer.';
    }
    if (!isMobile(phone)) next.phone = 'Ten digits, starting 98 or 97.';

    setErrors((prev) => ({ ...prev, km: next.km || '', phone: next.phone || '' }));
    if (Object.values(next).some(Boolean)) {
      setResult(null);
      return;
    }

    setResult(known ? estimateRecondition({ make: brand, year, km: kms }) : null);
    setSent(true);
  };

  const waText = encodeURIComponent(
    'Hello TapaikoBazar, I want a valuation. ' +
      brand + ' ' + year + ', ' + km + ' km. My number is ' + cleanMobile(phone) + '.' +
      (photos.length ? ' Sending ' + photos.length + ' photographs now.' : '')
  );

  return (
    <div className="valuation">
      {sent ? (
        <div className="formdone" role="status">
          <div className="formdone__tick">✓</div>
          <div>
            <p className="formdone__title">
              Got it — {brand} {year}, {km} km.
            </p>
            {result ? (
              <p className="formdone__note">
                Indicative range <strong>NPR {npr(result.low)} – {npr(result.high)}</strong>. The
                counter confirms it the same day and applies it to your downpayment.
              </p>
            ) : (
              <p className="formdone__note">
                The counter values this one on sight rather than by formula, so bring it in or
                send the photographs across.
              </p>
            )}
            <p className="formdone__note">
              We will call {cleanMobile(phone)}. Photographs help us value it before you travel,
              and WhatsApp is where they reach us.
            </p>
            <div className="formdone__actions">
              <a
                className="btn btn--red"
                href={'https://wa.me/' + CONTACT.whatsapp + '?text=' + waText}
                target="_blank"
                rel="noopener"
              >
                {photos.length ? 'Send the photographs' : 'Continue on WhatsApp'}
              </a>
              <button type="button" className="linkbtn" onClick={() => setSent(false)}>
                Change something
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form className="recondition__form" onSubmit={onSubmit} noValidate>
          <label className="field-wrap">
            <span className="field-label">Brand</span>
            <select className="field" value={brand} onChange={(e) => setBrand(e.target.value)}>
              {MAKES.map((m) => <option key={m}>{m}</option>)}
              <option>Other</option>
            </select>
          </label>

          <label className="field-wrap">
            <span className="field-label">Buy year</span>
            <select className="field" value={year} onChange={(e) => setYear(e.target.value)}>
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>

          <label className="field-wrap">
            <span className="field-label">Kilometres run</span>
            <input
              type="text"
              inputMode="numeric"
              className="field"
              placeholder="e.g. 42000"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              aria-invalid={errors.km ? true : undefined}
            />
            {errors.km ? <span className="field-error">{errors.km}</span> : null}
          </label>

          <label className="field-wrap">
            <span className="field-label">Your mobile</span>
            <input
              type="tel"
              className="field"
              placeholder="98XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={errors.phone ? true : undefined}
            />
            {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
          </label>

          <div className="field-wrap recondition__photos">
            <span className="field-label">Photographs of the vehicle</span>
            <label className="dropzone">
              <input type="file" accept="image/*" multiple onChange={onPick} />
              <span className="dropzone__cue">
                {photos.length ? 'Choose different photographs' : 'Choose photographs'}
              </span>
              <span className="dropzone__hint">
                Up to six. Front, back, both sides and the odometer help most.
              </span>
            </label>

            {photos.length ? (
              <ul className="thumbs">
                {photos.map((p) => (
                  <li className="thumbs__item" key={p.url}>
                    <img src={p.url} alt={p.name} />
                  </li>
                ))}
              </ul>
            ) : null}

            {errors.photos ? (
              <span className="field-error" role="alert">{errors.photos}</span>
            ) : null}
          </div>

          <button type="submit" className="btn btn--navy recondition__submit">
            Request a valuation
          </button>
        </form>
      )}
    </div>
  );
}
