import { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Section from '../components/Section';
import VehicleCard from '../components/VehicleCard';
import { BrandPills, TypeChips, VanFilterBar } from '../components/Filters';
import {
  CONTACT, EXCHANGE, HOW_TO_BUY,
} from '../data/catalogue';
import { useFilters } from '../lib/filtersContext';
import useReveal from '../lib/useReveal';
import { ALL_CARS, ALL_TW, ALL_VANS } from '../lib/vehicles';
import { TW_PREVIEW, npr } from '../lib/format';
import { MAKES, YEARS, cleanMobile, estimateExchange, isMobile } from '../lib/forms';

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

function ExchangeAndVisit() {
  return (
    <div className="twoup" id="exchange">
      <ExchangePanel />
      <VisitPanel />
    </div>
  );
}

/* Was three inputs and an anchor to "#" printing one hardcoded range. Now the
   estimate answers what you type, and the counter still has the final word. */
function ExchangePanel() {
  const [make, setMake] = useState(MAKES[0]);
  const [year, setYear] = useState(String(YEARS[6]));
  const [km, setKm] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const kms = Number(km);
    if (km.trim() === '' || !Number.isFinite(kms) || kms < 0) {
      setError('Enter the kilometres driven, as a number.');
      setResult(null);
      return;
    }
    if (kms > 500000) {
      setError('That looks too high — check the odometer reading.');
      setResult(null);
      return;
    }
    setError('');
    setResult(estimateExchange({ make, year, km: kms }));
  };

  return (
    <div className="panel panel--white" data-reveal>
      <span className="panel__eyebrow">{EXCHANGE.title}</span>
      <h2 className="panel__title">Your old vehicle counts toward the down</h2>
      <p className="panel__lede panel__lede--narrow">{EXCHANGE.lede}</p>
      <div className="exchange__points">
        {EXCHANGE.points.map(([name, note]) => (
          <div className="exchange__point" key={name}>
            <span className="exchange__point-name">{name}</span>
            <span className="exchange__point-note">{note}</span>
          </div>
        ))}
      </div>

      <form className="exchange__form" onSubmit={onSubmit} noValidate>
        <label className="field-wrap">
          <span className="field-label">Make</span>
          <select className="field" value={make} onChange={(e) => setMake(e.target.value)}>
            {MAKES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label className="field-wrap">
          <span className="field-label">Year</span>
          <select className="field" value={year} onChange={(e) => setYear(e.target.value)}>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
        <label className="field-wrap">
          <span className="field-label">Kilometres driven</span>
          <input
            type="text"
            inputMode="numeric"
            className="field"
            placeholder="e.g. 42000"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'exchange-error' : undefined}
          />
        </label>
        <button type="submit" className="btn btn--navy exchange__submit">Estimate</button>
      </form>

      {error ? (
        <p className="formnote formnote--bad" id="exchange-error" role="alert">{error}</p>
      ) : null}

      <div className="exchange__result">
        <div className="exchange__result-label">Estimated range</div>
        <div className="exchange__range">
          {result ? `NPR ${npr(result.low)} – ${npr(result.high)}` : 'Fill the three fields'}
        </div>
        {result ? (
          <p className="formnote">
            Indicative only. Bring it to Panipokhari and the counter confirms the same
            day, then applies it to your downpayment.
          </p>
        ) : null}
      </div>
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
      <ExchangeAndVisit />
    </>
  );
}
