import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HERO_SLIDES } from '../data/catalogue';
import { findVehicle } from '../lib/vehicles';
import { priceText } from '../lib/format';

const INTERVAL = 5500;

/* The showroom's own line, off the logo. It stays put while the vehicles
   rotate under it, so the promise reads as constant rather than as a caption
   on whichever van happens to be showing. */
const HEADLINE = ['Buy,', 'Sell', 'and', 'Finance'];

export default function Hero() {
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

  const slide = slides[at];

  const scrollToBrowse = () => {
    const el = document.getElementById('browse');
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <div className="hero" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Photographs cross-fade; one scrim sits over the lot so two of them
          never stack up and double-darken mid transition. */}
      <div className="hero__stage">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`hero__slide${i === at ? ' is-on' : ''}`}
            aria-hidden={i !== at}
          >
            <img
              className="hero__img"
              src={s.v.img}
              alt={s.v.name}
              loading={i === 0 ? undefined : 'lazy'}
            />
          </div>
        ))}
      </div>
      <div className="hero__scrim" />

      <div className="hero__body">
        <h1 className="hero__title">
          {HEADLINE.map((word, i) => (
            <Fragment key={word}>
              <span
                className={`hero__word${i === HEADLINE.length - 1 ? ' hero__word--accent' : ''}`}
                style={{ animationDelay: `${0.14 + i * 0.09}s` }}
              >
                {word}
              </span>
              {/* A real space, so the line reads as words rather than one
                  run-together string when copied or read aloud. */}
              {i < HEADLINE.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </h1>
        <span className="hero__rule" />

        {/* Keyed on the slide so React remounts it and the entrance replays. */}
        <div className="hero__vehicle" key={slide.id}>
          <span className="hero__eyebrow">{slide.eyebrow}</span>
          <div className="hero__meta">
            <span className="hero__badge">{slide.v.name}</span>
            <span className="hero__badge hero__badge--price">
              {priceText(slide.v, 'Price at the counter')}
            </span>
          </div>
          <div className="hero__actions">
            <Link className="btn btn--red btn--md" to={`/vehicle/${slide.v.id}`}>
              View details
            </Link>
            {slide.v.price != null ? (
              <Link className="btn btn--outline-light btn--md" to={`/finance/${slide.v.id}`}>
                Get finance
              </Link>
            ) : (
              <Link className="btn btn--outline-light btn--md" to={`/vehicle/${slide.v.id}`}>
                Ask the price
              </Link>
            )}
          </div>
        </div>
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
