import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CONTACT } from '../data/catalogue';
import { cleanMobile, isMobile } from '../lib/forms';

const WANTS = ['Electric van', 'Electric car', 'Electric scooter', 'Petrol bike'];
const WHENS = ['Within a week', 'Within a month', 'In two months', 'After six months'];

/* Remembered so the card asks once and then leaves people alone. A dismissal
   is worth less than an answer, so it lapses sooner. */
const KEY = 'tb.lead';
const AGAIN_AFTER = { answered: 180, dismissed: 14 }; // days

function suppressed() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const { at, how } = JSON.parse(raw);
    const days = (Date.now() - at) / 86400000;
    return days < (AGAIN_AFTER[how] ?? 14);
  } catch {
    /* Private mode, or storage disabled. Better to ask than to crash. */
    return false;
  }
}

function remember(how) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), how }));
  } catch {
    /* Nothing to do; the card simply may appear again next visit. */
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

    /* Waits until the reader has committed to the page rather than firing on
       arrival, which is the behaviour everyone has learned to dismiss. */
    const check = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const depth = scrolled / document.body.scrollHeight;
      if (depth > 0.38) {
        opener.current = document.activeElement;
        setOpen(true);
        window.removeEventListener('scroll', check);
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [welcome]);

  /* Escape closes, as it must for anything that appears uninvited. */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* Focus moves to the card so a keyboard reader is not left behind on the
     page, and returns where it came from on the way out. */
  useEffect(() => {
    if (open && card.current) card.current.focus();
  }, [open]);

  const close = (how) => {
    remember(how);
    setOpen(false);
    if (opener.current && opener.current.focus) opener.current.focus();
  };

  const dismiss = () => close('dismissed');

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
    }, 2600);
  };

  if (!open) return null;

  /* "an electric scooter", not "a electric scooter". */
  const article = /^[aeiou]/i.test(want) ? 'an' : 'a';
  const waText = encodeURIComponent(
    `Hello TapaikoBazar, I am looking for ${article} ${want.toLowerCase()} ${when.toLowerCase()}. My number is ${cleanMobile(phone)}.`
  );

  return (
    <aside
      className={`lead${sent ? ' lead--sent' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby="lead-title"
      tabIndex={-1}
      ref={card}
    >
      <button className="lead__close" onClick={dismiss} aria-label="Close">
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
  );
}
