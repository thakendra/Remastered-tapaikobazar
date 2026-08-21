import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Section from '../components/Section';
import VehicleCard from '../components/VehicleCard';
import { BrandPills, TypeChips, VanFilterBar } from '../components/Filters';
import {
  CONTACT, RECONDITION, HOW_TO_BUY,
} from '../data/catalogue';
import { useFilters } from '../lib/filtersContext';
import useReveal from '../lib/useReveal';
import { ALL_CARS, ALL_TW, ALL_VANS } from '../lib/vehicles';
import { TW_PREVIEW, npr } from '../lib/format';
import { MAKES, YEARS, cleanMobile, estimateRecondition, isMobile } from '../lib/forms';

function HowToBuy() {
  return (
    <div className="howto">
      <div className="howto__head" data-reveal="fade">
        <span className="panel__eyebrow">Simple and fast</span>
        <h2 className="howto__title">How to buy from TapaikoBazar</h2>
        <p className="howto__lede">
          From browsing to driving away. Most files finish inside three working days.
        </p>
      </div>
      <div className="howto__steps">
        {HOW_TO_BUY.map(([name, text], i) => (
          <div className="howto__step" key={name} data-reveal style={{ '--d': `${i * 70}ms` }}>
            <div className="howto__num">{i + 1}</div>
            <div className="howto__name">{name}</div>
            <p className="howto__text">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReconditionAndVisit() {
  return (
    <div className="twoup" id="recondition">
      <ReconditionPanel />
      <VisitPanel />
    </div>
  );
}

/* A valuation request: brand, year, distance, photographs and a number.

   The site has no backend, so the photographs genuinely cannot be uploaded —
   pretending otherwise would lose someone's pictures silently. They are read
   locally for the preview only, and the handoff asks for them on WhatsApp,
   where they will actually arrive. The instant estimate still runs for the
   brands the model knows. */
function ReconditionPanel() {
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
    <div className="panel panel--white" data-reveal>
      <span className="panel__eyebrow">{RECONDITION.title}</span>
      <h2 className="panel__title">Your old vehicle counts toward the down</h2>
      <p className="panel__lede panel__lede--narrow">{RECONDITION.lede}</p>
      <div className="recondition__points">
        {RECONDITION.points.map(([name, note]) => (
          <div className="recondition__point" key={name}>
            <span className="recondition__point-name">{name}</span>
            <span className="recondition__point-note">{note}</span>
          </div>
        ))}
      </div>

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

/* Confirm used to be an anchor to "#": it scrolled you to the top of the page
   and threw the number away. */
function VisitPanel() {
  const times = ['Within a week', 'Within a month', 'In two months', 'After six months'];
  const [when, setWhen] = useState(times[0]);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isMobile(phone)) {
      setError('Enter a ten digit mobile starting 98 or 97.');
      return;
    }
    setError('');
    setSent(true);
  };

  const waText = encodeURIComponent(
    `Hello TapaikoBazar, I am planning to buy ${when.toLowerCase()}. My number is ${cleanMobile(phone)}.`
  );

  return (
    <div className="panel" data-reveal style={{ '--d': '90ms' }}>
      <span className="panel__eyebrow">Visit</span>
      <h2 className="panel__title">Pick a slot, we will keep it ready</h2>
      <p className="panel__lede panel__lede--narrower">
        Tell us when you are planning to buy and we will have the vehicle charged,
        cleaned and ready when you come in.
      </p>

      {sent ? (
        <div className="formdone" role="status">
          <div className="formdone__tick">✓</div>
          <div>
            <p className="formdone__title">
              Noted — {when.toLowerCase()}, on {cleanMobile(phone)}.
            </p>
            <p className="formdone__note">
              The counter calls between 9am and 7pm. Want it faster? Send the same
              details on WhatsApp.
            </p>
            <div className="formdone__actions">
              <a
                className="btn btn--red"
                href={`https://wa.me/${CONTACT.whatsapp}?text=${waText}`}
                target="_blank"
                rel="noopener"
              >
                Send on WhatsApp
              </a>
              <button
                type="button"
                className="linkbtn"
                onClick={() => { setSent(false); setPhone(''); }}
              >
                Use a different number
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="visit__legend" id="visit-when">When are you planning to buy</div>
          <div className="visit__times" role="group" aria-labelledby="visit-when">
            {times.map((t) => (
              <button
                type="button"
                key={t}
                className={`visit__time${when === t ? ' is-on' : ''}`}
                aria-pressed={when === t}
                onClick={() => setWhen(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <form className="visit__signup" onSubmit={onSubmit} noValidate>
            <input
              type="tel"
              className="field"
              placeholder="Your phone number"
              aria-label="Your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'visit-error' : undefined}
            />
            <button type="submit" className="btn btn--red visit__confirm">Confirm</button>
          </form>
          {error ? (
            <p className="formnote formnote--bad" id="visit-error" role="alert">{error}</p>
          ) : null}
        </>
      )}

      <div className="visit__address">
        <div className="visit__line"><span>Showroom</span>{CONTACT.address}</div>
        <div className="visit__line"><span>Open</span>{CONTACT.hours}</div>
        <div className="visit__line">
          <span>Landline</span>
          {CONTACT.landlines.map((n, i) => (
            <span key={n}>{i > 0 ? ' · ' : ''}<a href={`tel:${n}`}>{n}</a></span>
          ))}
        </div>
        <div className="visit__line">
          <span>Mobile</span>
          {CONTACT.mobiles.map((n, i) => (
            <span key={n}>{i > 0 ? ' · ' : ''}<a href={`tel:${n}`}>{n}</a></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Browse() {
  const f = useFilters();
  const twShown = f.tw.slice(0, TW_PREVIEW);

  /* Re-run when a filter changes: the cards that just appeared have never been
     observed, and without this they would sit invisible at opacity zero. */
  useReveal([f.vans.length, f.cars.length, twShown.length]);

  return (
    <>
      <Hero />

      <div id="browse">
        <Section
          id="sec-vans"
          group="van"
          index="Section one"
          title="Electric vans"
          note="Eleven to sixteen seats, financed in-house over five years. This is what most people come to Panipokhari for."
          activeCount={f.activeCount('van')}
          resultCount={f.vans.length}
          filters={
            <div className="sechead__filter">
              <span className="sechead__filter-label">Brand</span>
              <BrandPills
                list={f.allVans}
                current={f.brandVan}
                onPick={f.setBrandVan}
                className="brandpills--vans"
              />
            </div>
          }
          bar={<VanFilterBar />}
        >
          <div className="grid-wrap">
            <div className="cardgrid">
              {f.vans.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
            </div>
            {f.vans.length === 0 ? (
              <div className="empty">
                <div className="empty__title">No van matches that</div>
                <p className="empty__note">Raise the price ceiling or clear the brand filter.</p>
              </div>
            ) : null}
          </div>
        </Section>

        <Section
          id="sec-cars"
          group="car"
          index="Section two"
          title="Electric cars"
          note="Private cars and SUVs, from the Naami mini up to the Xpeng G6. Two of them are still on pre-booking."
          tint
          activeCount={f.activeCount('car')}
          resultCount={f.cars.length}
          filters={
            <div className="sechead__filter">
              <span className="sechead__filter-label">Brand</span>
              <BrandPills
                list={f.allCars}
                current={f.brandCar}
                onPick={f.setBrandCar}
                className="brandpills--cars"
              />
            </div>
          }
        >
          <div className="grid-wrap">
            <div className="cardgrid">
              {f.cars.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
            </div>
          </div>
        </Section>

        <Section
          id="sec-tw"
          group="tw"
          index="Section three"
          title="Two wheelers"
          note="Electric scooters and petrol bikes. The cheapest way onto the road, and everything here is financed too."
          activeCount={f.activeCount('tw')}
          resultCount={f.tw.length}
          filters={
            <div className="sechead__filter">
              <span className="sechead__filter-label">Type</span>
              <TypeChips />
              <span className="sechead__filter-label">Brand</span>
              <BrandPills
                list={f.allTw}
                current={f.brandTw}
                onPick={f.setBrandTw}
                className="brandpills--tw"
              />
            </div>
          }
        >
          <div className="grid-wrap">
            <div className="cardgrid">
              {twShown.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
            </div>
            <Link className="browseall" to="/two-wheelers">
              <span className="browseall__label">Browse all two wheelers</span>
              <span className="browseall__count">
                {f.tw.length > TW_PREVIEW
                  ? `Showing ${TW_PREVIEW} of ${f.tw.length}`
                  : `All ${f.tw.length} shown`}
              </span>
            </Link>
          </div>
        </Section>
      </div>

      <HowToBuy />
      <ReconditionAndVisit />
    </>
  );
}
