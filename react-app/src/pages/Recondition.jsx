import { Link } from 'react-router-dom';
import ReconditionForm from '../components/ReconditionForm';
import { CONTACT, RECONDITION } from '../data/catalogue';
import useReveal from '../lib/useReveal';

/* What happens after the form, in the order it happens. Written from what the
   counter already does rather than invented as a process. */
const STEPS = [
  ['Send it across', 'Brand, year, distance and a few photographs. Two minutes on a phone.'],
  ['We come back with a range', 'Same working day, on the number you leave. Photographs let us do it before you travel.'],
  ['Bring it to Panipokhari', 'The counter checks it over and confirms the figure, or tells you why it differs.'],
  ['It comes off the down', 'The agreed amount goes straight against the downpayment on whatever you are buying.'],
];

export default function Recondition() {
  useReveal([]);

  return (
    <>
      <div className="crumbs">
        <Link to="/">Browse</Link>
        <span>/</span>
        <span className="crumbs__here">Recondition</span>
      </div>

      <div className="sechead">
        <div data-reveal="fade">
          <div className="sechead__index">{RECONDITION.title}</div>
          <h1 className="sechead__title">Your old vehicle counts toward the down</h1>
          <p className="sechead__note">{RECONDITION.lede}</p>
        </div>
      </div>

      <div className="recondition__page">
        <div className="recondition__main" data-reveal>
          <ReconditionForm />
        </div>

        <aside className="recondition__aside">
          <div className="recondition__points recondition__points--stack" data-reveal>
            {RECONDITION.points.map(([name, note]) => (
              <div className="recondition__point" key={name}>
                <span className="recondition__point-name">{name}</span>
                <span className="recondition__point-note">{note}</span>
              </div>
            ))}
          </div>

          <div className="recondition__steps" data-reveal style={{ '--d': '90ms' }}>
            <div className="detail__block-label">How it goes</div>
            {STEPS.map(([name, note], i) => (
              <div className="recondition__step" key={name}>
                <span className="recondition__step-num">{i + 1}</span>
                <span>
                  <span className="recondition__step-name">{name}</span>
                  <span className="recondition__step-note">{note}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="recondition__help" data-reveal style={{ '--d': '150ms' }}>
            <p className="recondition__help-title">Rather just bring it in?</p>
            <p className="recondition__help-note">
              {CONTACT.address} {CONTACT.hours}.
            </p>
            <div className="recondition__help-actions">
              <a
                className="btn btn--red"
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
                  'I want a valuation on my old vehicle.'
                )}`}
                target="_blank"
                rel="noopener"
              >
                Ask on WhatsApp
              </a>
              <a className="btn btn--outline-navy" href={`tel:${CONTACT.mobiles[0]}`}>
                Call {CONTACT.mobiles[0]}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
