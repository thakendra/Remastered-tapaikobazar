import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Shot from '../components/Shot';
import { DOCS, FINANCE_DEFAULTS } from '../data/catalogue';
import { findVehicle } from '../lib/vehicles';
import { emi, npr, priceText, termText } from '../lib/format';

const STEPS = [
  ['Step one', 'Set your terms'],
  ['Step two', 'Your details'],
  ['Step three', 'Documents'],
];

export default function Finance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const v = findVehicle(id);

  const [step, setStep] = useState(1);
  const [docs, setDocs] = useState([]);
  const [rate, setRate] = useState(FINANCE_DEFAULTS.interestRate);
  const [tenure, setTenure] = useState(FINANCE_DEFAULTS.vanTermMonths);
  const [down, setDown] = useState(() =>
    v ? v.down || Math.round((v.price || 0) * 0.25) : 0
  );

  const figures = useMemo(() => {
    if (!v) return null;
    const isVan = v.type === 'van';
    const basePrice = v.price != null ? v.price : 0;
    const loan = Math.max(basePrice - down, 0);
    const term = isVan ? tenure : Math.min(tenure, 36);
    const monthly = loan > 0 ? emi(loan, rate, term) : 0;
    return {
      isVan,
      basePrice,
      downMin: v.down || Math.round(basePrice * 0.15),
      downMax: Math.round(basePrice * 0.8) || 1,
      loan,
      term,
      monthly,
      interest: Math.max(monthly * term - loan, 0),
    };
  }, [v, down, rate, tenure]);

  if (!v || v.price == null) {
    return (
      <div className="grid-wrap">
        <div className="empty">
          <div className="empty__title">That one is priced at the counter</div>
          <p className="empty__note">
            <Link to="/">Back to browsing</Link>
          </p>
        </div>
      </div>
    );
  }

  const toggleDoc = (docId) =>
    setDocs((d) => (d.includes(docId) ? d.filter((x) => x !== docId) : d.concat(docId)));

  return (
    <>
      <div className="crumbs">
        <button onClick={() => navigate('/')}>Browse</button>
        <span>/</span>
        <button onClick={() => navigate(`/vehicle/${v.id}`)}>{v.name}</button>
        <span>/</span>
        <span className="crumbs__here">Finance</span>
      </div>

      <div className="finance">
        <div className="finance__main">
          <div className="steps">
            {STEPS.map(([index, name], i) => (
              <div className={`step${step === i + 1 ? ' is-on' : ''}`} key={name}>
                <div className="step__index">{index}</div>
                <div className="step__name">{name}</div>
              </div>
            ))}
          </div>

          {step === 1 ? (
            <div>
              <h1 className="finance__title">What can you put down?</h1>
              <p className="finance__lede">
                Move the three sliders until the monthly figure looks right. Nothing here
                is binding — the bank sets the final rate once your papers are checked at
                the counter.
              </p>

              <div className="sliders">
                <div className="slider">
                  <div className="slider__row">
                    <span className="slider__label">Downpayment</span>
                    <span className="slider__value">NPR {npr(down)}</span>
                  </div>
                  <input
                    type="range"
                    min={figures.downMin}
                    max={figures.downMax}
                    step={25000}
                    value={down}
                    onChange={(e) => setDown(Number(e.target.value))}
                    aria-label="Downpayment"
                  />
                  <div className="slider__note">
                    {figures.isVan
                      ? 'No collateral is needed when you put down 20 to 40 percent.'
                      : 'Two wheeler terms run up to three years.'}
                  </div>
                </div>

                <div className="slider">
                  <div className="slider__row">
                    <span className="slider__label">Interest rate</span>
                    <span className="slider__value">{rate}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={9}
                    step={0.5}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    aria-label="Interest rate"
                  />
                  <div className="slider__note">
                    Our partner banks quote between 5% and 9% depending on your profile.
                  </div>
                </div>

                <div className="slider">
                  <div className="slider__row">
                    <span className="slider__label">Term</span>
                    <span className="slider__value">{termText(figures.term)}</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={60}
                    step={12}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    aria-label="Term"
                  />
                  <div className="slider__note">
                    Five years is the longest term available on electric vans.
                  </div>
                </div>
              </div>

              <button
                className="btn btn--red btn--lg"
                style={{ marginTop: 44 }}
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h1 className="finance__title">Who are we financing?</h1>
              <p className="finance__lede">
                Enough for us to start the file. A person from our counter calls you the
                same working day.
              </p>
              <div className="applicant">
                <input type="text" className="field" placeholder="Full name" />
                <input type="tel" className="field" placeholder="Mobile number" />
                <select className="field" aria-label="Employment" defaultValue="Employment — Salaried">
                  <option>Employment — Salaried</option>
                  <option>Self employed / business</option>
                  <option>Transport operator</option>
                  <option>Farming</option>
                </select>
                <select className="field" aria-label="Monthly income" defaultValue="Monthly income — 50,000 to 1,00,000">
                  <option>Monthly income — 50,000 to 1,00,000</option>
                  <option>Under 50,000</option>
                  <option>1,00,000 to 2,00,000</option>
                  <option>Over 2,00,000</option>
                </select>
                <input type="text" className="field" placeholder="District" />
                <select className="field" aria-label="Preferred bank" defaultValue="Preferred bank — no preference">
                  <option>Preferred bank — no preference</option>
                  <option>NIMB</option>
                  <option>Nabil</option>
                  <option>Global IME</option>
                </select>
              </div>
              <div className="stepnav">
                <button className="btn btn--outline-navy btn--lg-narrow" onClick={() => setStep(1)}>
                  Back
                </button>
                <button className="btn btn--red btn--lg" onClick={() => setStep(3)}>
                  Continue
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h1 className="finance__title">Bring these to the counter</h1>
              <p className="finance__lede">
                Tick what you already have. Anything missing, we will tell you how to get
                it — most people are approved within three working days.
              </p>
              <div className="doclist">
                {DOCS.map((d) => {
                  const on = docs.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      className={`doc${on ? ' is-on' : ''}`}
                      onClick={() => toggleDoc(d.id)}
                    >
                      <span className="doc__box">{on ? '✓' : ''}</span>
                      <span>
                        <span className="doc__label" style={{ display: 'block' }}>{d.label}</span>
                        <span className="doc__note" style={{ display: 'block' }}>{d.note}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="stepnav">
                <button className="btn btn--outline-navy btn--lg-narrow" onClick={() => setStep(2)}>
                  Back
                </button>
                <button className="btn btn--red btn--lg" onClick={() => setStep(4)}>
                  Send my application
                </button>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="done">
              <div className="done__tick">✓</div>
              <h1 className="finance__title">We have your file</h1>
              <p className="done__lede">
                Someone from the Panipokhari counter calls you today between 9am and 7pm.
                Bring the documents you ticked and we can usually finish the paperwork in
                one visit.
              </p>
              <div className="done__card">
                <div className="done__card-label">While you wait</div>
                <p>
                  Book a test ride on the {v.name} so it is charged and parked out front
                  when you arrive.
                </p>
                <a href="#" className="btn btn--red">Book a test ride</a>
              </div>
              <button className="done__back" onClick={() => navigate('/')}>
                Back to browsing
              </button>
            </div>
          ) : null}
        </div>

        <aside className="summary">
          <div className="summary__eyebrow">Financing</div>
          <div className="summary__shot">
            <Shot vehicle={v} loading="eager" />
          </div>
          <div className="summary__name">{v.name}</div>

          <SummaryRow label="Showroom price" value={priceText(v, 'Ask at the counter')} />
          <SummaryRow label="Downpayment" value={`NPR ${npr(down)}`} />
          <SummaryRow label="Loan amount" value={`NPR ${npr(figures.loan)}`} />
          <SummaryRow label="Rate and term" value={`${rate}% for ${termText(figures.term)}`} />
          <SummaryRow label="Total interest" value={`NPR ${npr(figures.interest)}`} />

          <div className="summary__total">
            <span className="summary__total-label">Monthly payment</span>
            <span className="summary__total-value">NPR {npr(figures.monthly)}</span>
          </div>
          <p className="summary__fineprint">
            Indicative. Final approval and rate come from the bank after your documents
            are verified at Panipokhari.
          </p>
        </aside>
      </div>
    </>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="summary__row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
