import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_SLIDES } from '../data/catalogue';
import { findVehicle } from '../lib/vehicles';
import { priceText } from '../lib/format';

const INTERVAL = 5500;

export default function Hero() {
  const navigate = useNavigate();
  const [at, setAt] = useState(0);
  const timer = useRef(null);

  const slides = HERO_SLIDES.map((s) => ({ ...s, v: findVehicle(s.id) })).filter((s) => s.v);

  const go = useCallback(
    (n) => setAt(((n % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  /* Restarted on every manual move so the clock never fights the reader. */
  const start = useCallback(() => {
    clearInterval(timer.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (slides.length < 2) return;
    timer.current = setInterval(() => setAt((n) => (n + 1) % slides.length), INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    start();
    return () => clearInterval(timer.current);
  }, [start]);

  const step = (d) => {
    go(at + d);
    start();
  };

  /* The arrows are hidden on a phone, so the slider has to answer to a swipe. */
  const touch = useRef({ x: 0, y: 0 });
  const onTouchStart = (e) => {
    touch.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    /* Ignore anything that reads as a vertical scroll or a tap. */
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    step(dx < 0 ? 1 : -1);
  };

  const scrollToBrowse = () => {
    const el = document.getElementById('browse');
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <div className="hero" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="hero__stage">
        {slides.map((s, i) => {
          const on = i === at;
          return (
            <div
              key={s.id}
              className={`hero__slide${on ? ' is-on' : ''}`}
              aria-hidden={!on}
            >
              <img
                className="hero__img"
                src={s.v.img}
                alt={s.v.name}
                loading={i === 0 ? undefined : 'lazy'}
              />
              <div className="hero__scrim" />
              <div className="hero__body">
                <span className="hero__eyebrow">{s.eyebrow}</span>
                <h1 className="hero__title">
                  {s.titleLines.map((line, n) => (
                    <span key={n}>
                      {line}
                      {n < s.titleLines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </h1>
                <span className="hero__rule" />
                <p className="hero__short">{s.short}</p>
                <div className="hero__meta">
                  <span className="hero__badge">{s.v.name}</span>
                  <span className="hero__badge hero__badge--price">
                    {priceText(s.v, 'Price at the counter')}
                  </span>
                </div>
                <div className="hero__actions">
                  <button
                    className="btn btn--red btn--md"
                    onClick={() => navigate(`/vehicle/${s.v.id}`)}
                  >
                    View details
                  </button>
                  {s.v.price != null ? (
                    <button
                      className="btn btn--outline-light btn--md"
                      onClick={() => navigate(`/finance/${s.v.id}`)}
                    >
                      Get finance
                    </button>
                  ) : (
                    <button
                      className="btn btn--outline-light btn--md"
                      onClick={() => navigate(`/vehicle/${s.v.id}`)}
                    >
                      Ask the price
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="hero__arrow hero__arrow--prev"
        onClick={() => step(-1)}
        aria-label="Previous vehicle"
      />
      <button
        className="hero__arrow hero__arrow--next"
        onClick={() => step(1)}
        aria-label="Next vehicle"
      />

      <div className="hero__dots" role="tablist" aria-label="Featured vehicles">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`hero__dot${i === at ? ' is-on' : ''}`}
            onClick={() => {
              go(i);
              start();
            }}
            role="tab"
            aria-selected={i === at}
            aria-label={s.eyebrow}
          />
        ))}
      </div>

      <button className="hero__scroll" onClick={scrollToBrowse} aria-label="Scroll to the vehicles">
        <span className="hero__scroll-track">
          <span className="hero__scroll-fill" />
        </span>
        <span className="hero__scroll-word">Scroll</span>
      </button>
    </div>
  );
}
