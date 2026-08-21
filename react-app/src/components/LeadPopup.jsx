import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CONTACT } from '../data/catalogue';
import { cleanMobile, isMobile } from '../lib/forms';

const WANTS = ['Electric van', 'Electric car', 'Electric scooter', 'Petrol bike'];
const WHENS = ['Within a week', 'Within a month', 'In two months', 'After six months'];

/* Long enough that the reader has settled into the page, short enough that
   they are still on it. */
const AFTER_MS = 20000;
const AT_DEPTH = 0.45;

/* Remembered so the card asks once and then leaves people alone. A dismissal
   is worth less than an answer, so it lapses sooner. */
const KEY = 'tb.lead';
const AGAIN_AFTER = { answered: 180, dismissed: 14 }; // days

function suppressed() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const { at, how } = JSON.parse(raw);
    return (Date.now() - at) / 86400000 < (AGAIN_AFTER[how] ?? 14);
  } catch {
    /* Private mode, or storage disabled. Better to ask than to crash. */
    return false;
  }
}

function remember(how) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), how }));
  } catch {
    /* Nothing to do; the card may simply appear again next visit. */
  }
}

export default function LeadPopup() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [want, setWant] = useState(WANTS[0]);
  const [when, setWhen] = useState(WHENS[0]);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const card = useRef(null);
  const opener = useRef(null);

  /* Never interrupt the finance flow: anyone in there is already further along
     than this card is trying to get them. */
  const welcome = !pathname.startsWith('/finance');

  useEffect(() => {
    if (!welcome || suppressed()) return undefined;

    const show = () => {
      opener.current = document.activeElement;
      setOpen(true);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };

    /* A timer rather than scroll alone, because a page short enough not to
       scroll fires no scroll events at all and the card would never appear. */
    const timer = setTimeout(show, AFTER_MS);

    /* Someone who has read halfway down has shown their interest sooner than
       the clock would. */
    function onScroll() {
      const seen = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (seen > AT_DEPTH) show();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [welcome]);

  /* It sits over the page, so the page must not scroll behind it. */
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        close('dismissed');
        return;
      }
      if (e.key !== 'Tab') return;

      /* A modal must not let focus wander off behind it. */
      const focusable = card.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || !focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* Focus moves in so a keyboard reader is not left behind on the page, and
     goes back where it came from on the way out. */
  useEffect(() => {
    if (open && card.current) card.current.focus();
  }, [open]);

  const close = (how) => {
    remember(how);
    setOpen(false);
    if (opener.current && opener.current.focus) opener.current.focus();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isMobile(phone)) {
      setError('Enter a ten digit mobile starting 98 or 97.');
      return;
    }
    setError('');
    setSent(true);
    remember('answered');
    /* Long enough to read the confirmation, short enough not to linger. */
    setTimeout(() => {
      setOpen(false);
      if (opener.current && opener.current.focus) opener.current.focus();
    }, 2800);
  };

  if (!open) return null;

  const article = /^[aeiou]/i.test(want) ? 'an' : 'a';
  const waText = encodeURIComponent(
    `Hello TapaikoBazar, I am looking for ${article} ${want.toLowerCase()} ${when.toLowerCase()}. My number is ${cleanMobile(phone)}.`
  );

  return (
    <div className="leadwrap">
      {/* Dismissing by clicking away is the behaviour people expect of
          anything that appears over what they were reading. */}
      <div className="leadwrap__scrim" onClick={() => close('dismissed')} />

      <aside
        className="lead"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
        tabIndex={-1}
        ref={card}
      >
        <button className="lead__close" onClick={() => close('dismissed')} aria-label="Close">
          ×
        </button>

        {sent ? (
          <div className="lead__done" role="status">
            <div className="lead__tick">✓</div>
            <p className="lead__title">We will call {cleanMobile(phone)}.</p>
            <p className="lead__note">
              Between 9am and 7pm. Want it now?{' '}
              <a href={`https://wa.me/${CONTACT.whatsapp}?text=${waText}`} target="_blank" rel="noopener">
                Send it on WhatsApp
              </a>
              .
            </p>
          </div>
        ) : (
          <>
            <p className="lead__title" id="lead-title">
              Planning to buy?
            </p>
            <p className="lead__note">Tell us what and when — the counter calls you back.</p>

            <form onSubmit={onSubmit} noValidate>
              <fieldset className="lead__set">
                <legend className="lead__legend">What are you after</legend>
                <div className="lead__chips">
                  {WANTS.map((w) => (
                    <button
                      type="button"
                      key={w}
                      className={`lead__chip${want === w ? ' is-on' : ''}`}
                      aria-pressed={want === w}
                      onClick={() => setWant(w)}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="lead__set">
                <legend className="lead__legend">When</legend>
                <div className="lead__chips">
                  {WHENS.map((w) => (
                    <button
                      type="button"
                      key={w}
                      className={`lead__chip${when === w ? ' is-on' : ''}`}
                      aria-pressed={when === w}
                      onClick={() => setWhen(w)}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="lead__row">
                <input
                  type="tel"
                  className="field"
                  placeholder="98XXXXXXXX"
                  aria-label="Your mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? 'lead-error' : undefined}
                />
                <button type="submit" className="btn btn--red">
                  Request a call
                </button>
              </div>
              {error ? (
                <p className="formnote formnote--bad" id="lead-error" role="alert">
                  {error}
                </p>
              ) : null}
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
