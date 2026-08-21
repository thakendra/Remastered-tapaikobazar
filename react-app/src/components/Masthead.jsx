import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CONTACT } from '../data/catalogue';
import Drawer from './Drawer';

const SECTIONS = [
  ['sec-vans', 'Electric vans'],
  ['sec-cars', 'Electric cars'],
  ['sec-tw', 'Two wheelers'],
];

export default function Masthead() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [solid, setSolid] = useState(true);

  const onBrowse = location.pathname === '/';

  /* Transparent over the hero, solid once past it. Views without a hero get
     the solid treatment from the start. */
  useEffect(() => {
    const paint = () => {
      const hero = document.querySelector('.hero');
      setSolid(!hero || window.scrollY > hero.offsetHeight - 90);
    };
    paint();
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    return () => {
      window.removeEventListener('scroll', paint);
      window.removeEventListener('resize', paint);
    };
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('has-hero', onBrowse);
  }, [onBrowse]);

  const jump = (id) => {
    setMenu(false);
    if (!onBrowse) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 96, behavior: 'smooth' });
      }, 60);
      return;
    }
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 96, behavior: 'smooth' });
  };

  const goFinance = () => jump('sec-vans');

  return (
    <>
      <header className={`masthead${solid ? ' is-solid' : ''}`}>
        <Link className="masthead__logo" to="/" aria-label="TapaikoBazar home">
          <img src="/assets/logo.png" alt="Tapaiko Bazar" />
        </Link>

        <nav className="masthead__nav">
          {SECTIONS.map(([id, label]) => (
            <button key={id} onClick={() => jump(id)}>
              {label}
            </button>
          ))}
          <Link to="/#recondition">Recondition</Link>
          <Link to="/about">About us</Link>
        </nav>

        <div className="masthead__actions">
          <a href={`tel:${CONTACT.whatsappDisplay}`} className="masthead__phone">
            {CONTACT.whatsappDisplay}
          </a>
          <button className="btn btn--red btn--sm" onClick={goFinance}>
            Get finance
          </button>
        </div>

        <div className="masthead__compact">
          <a href={`tel:${CONTACT.whatsappDisplay}`} className="iconbtn" aria-label="Call the showroom">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.2 2.2Z" />
            </svg>
          </a>
          <button
            className="burger"
            onClick={() => setMenu(true)}
            aria-label="Open menu"
            aria-expanded={menu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <Drawer
        open={menu}
        onClose={() => setMenu(false)}
        title="Menu"
        side="right"
        foot={
          <div className="navmenu__foot">
            <button className="btn btn--red btn--block" onClick={goFinance}>
              Get finance
            </button>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener"
              className="btn btn--outline-navy btn--block"
            >
              WhatsApp us
            </a>
          </div>
        }
      >
        <div className="navmenu">
          {SECTIONS.map(([id, label]) => (
            <button key={id} className="navmenu__item" onClick={() => jump(id)}>
              {label}
            </button>
          ))}
          <Link className="navmenu__item" to="/#recondition" onClick={() => setMenu(false)}>
            Recondition
          </Link>
          <Link className="navmenu__item" to="/about" onClick={() => setMenu(false)}>
            About us
          </Link>

          <div className="navmenu__contact">
            <div className="navmenu__label">Showroom</div>
            <p>{CONTACT.address}</p>
            <p>{CONTACT.hours}</p>
            <div className="navmenu__label">Call us</div>
            <p>
              {CONTACT.landlines.concat(CONTACT.mobiles).map((n, i) => (
                <span key={n}>
                  {i > 0 ? ' · ' : ''}
                  <a href={`tel:${n}`}>{n}</a>
                </span>
              ))}
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
}
