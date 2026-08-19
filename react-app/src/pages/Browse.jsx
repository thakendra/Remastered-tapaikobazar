import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Section from '../components/Section';
import VehicleCard from '../components/VehicleCard';
import { BrandPills, TypeChips, VanFilterBar } from '../components/Filters';
import {
  CONTACT, EXCHANGE, HOW_TO_BUY, TESTIMONIALS, TRUST_STATS,
} from '../data/catalogue';
import { useFilters } from '../lib/filtersContext';
import { ALL_CARS, ALL_TW, ALL_VANS } from '../lib/vehicles';
import { TW_PREVIEW } from '../lib/format';

function Stats() {
  return (
    <div className="stats">
      {TRUST_STATS.map(([figure, label]) => (
        <div className="stats__cell" key={label}>
          <div className="stats__figure">{figure}</div>
          <div className="stats__label">{label}</div>
        </div>
      ))}
    </div>
  );
}

function HowToBuy() {
  return (
    <div className="howto">
      <div className="howto__head">
        <span className="panel__eyebrow">Simple and fast</span>
        <h2 className="howto__title">How to buy from TapaikoBazar</h2>
        <p className="howto__lede">
          From browsing to driving away. Most files finish inside three working days.
        </p>
      </div>
      <div className="howto__steps">
        {HOW_TO_BUY.map(([name, text], i) => (
          <div className="howto__step" key={name}>
            <div className="howto__num">{i + 1}</div>
            <div className="howto__name">{name}</div>
            <p className="howto__text">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <div className="voices">
      <div className="voices__head">
        <span className="panel__eyebrow">From the counter</span>
        <h2 className="howto__title">What people say afterwards</h2>
      </div>
      <div className="voices__grid">
        {TESTIMONIALS.map(([text, name, role]) => (
          <figure className="voice" key={name}>
            <blockquote className="voice__text">{text}</blockquote>
            <figcaption className="voice__who">
              <span className="voice__name">{name}</span>
              <span className="voice__role">{role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function ExchangeAndVisit() {
  const times = ['Within a week', 'Within a month', 'In two months', 'After six months'];
  return (
    <div className="twoup">
      <div className="panel panel--white">
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
        <div className="exchange__form">
          <select className="field" aria-label="Make" defaultValue="Make — Honda">
            <option>Make — Honda</option>
            <option>Toyota</option>
            <option>Hyundai</option>
            <option>Suzuki</option>
          </select>
          <select className="field" aria-label="Year" defaultValue="Year — 2018">
            <option>Year — 2018</option>
            <option>2020</option>
            <option>2015</option>
          </select>
          <input type="text" className="field" placeholder="Kilometres driven" />
          <a href="#" className="btn btn--navy exchange__submit">Estimate</a>
        </div>
        <div className="exchange__result">
          <div className="exchange__result-label">Estimated range</div>
          <div className="exchange__range">NPR 8,20,000 – 9,60,000</div>
        </div>
      </div>

      <div className="panel">
        <span className="panel__eyebrow">Visit</span>
        <h2 className="panel__title">Pick a slot, we will keep it ready</h2>
        <p className="panel__lede panel__lede--narrower">
          Tell us when you are planning to buy and we will have the vehicle charged,
          cleaned and ready when you come in.
        </p>
        <div className="visit__legend">When are you planning to buy</div>
        <VisitTimes options={times} />
        <div className="visit__signup">
          <input type="tel" className="field" placeholder="Your phone number" />
          <a href="#" className="btn btn--red visit__confirm">Confirm</a>
        </div>
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
    </div>
  );
}

function VisitTimes({ options }) {
  const [picked, setPicked] = useState(options[0]);
  return (
    <div className="visit__times">
      {options.map((t) => (
        <button
          key={t}
          className={`visit__time${picked === t ? ' is-on' : ''}`}
          onClick={() => setPicked(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function Browse() {
  const navigate = useNavigate();
  const f = useFilters();
  const twShown = f.tw.slice(0, TW_PREVIEW);

  return (
    <>
      <Hero />
      <Stats />

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
                list={ALL_VANS}
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
              {f.vans.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
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
                list={ALL_CARS}
                current={f.brandCar}
                onPick={f.setBrandCar}
                className="brandpills--cars"
              />
            </div>
          }
        >
          <div className="grid-wrap">
            <div className="cardgrid">
              {f.cars.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
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
                list={ALL_TW}
                current={f.brandTw}
                onPick={f.setBrandTw}
                className="brandpills--tw"
              />
            </div>
          }
        >
          <div className="grid-wrap">
            <div className="cardgrid">
              {twShown.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
            <button className="browseall" onClick={() => navigate('/two-wheelers')}>
              <span className="browseall__label">Browse all two wheelers</span>
              <span className="browseall__count">
                {f.tw.length > TW_PREVIEW
                  ? `Showing ${TW_PREVIEW} of ${f.tw.length}`
                  : `All ${f.tw.length} shown`}
              </span>
            </button>
          </div>
        </Section>
      </div>

      <HowToBuy />
      <Testimonials />
      <ExchangeAndVisit />
    </>
  );
}
