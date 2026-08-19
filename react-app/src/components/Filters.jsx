import { useFilters } from '../lib/filtersContext';
import { ALL_VANS, brandKeys } from '../lib/vehicles';
import { npr, VAN_PRICE_MAX, VAN_PRICE_MIN } from '../lib/format';

export function BrandPills({ list, current, onPick, className = '' }) {
  return (
    <div className={`brandpills ${className}`}>
      {brandKeys(list).map((b) => (
        <button
          key={b.key}
          className={`pill${current === b.key ? ' is-on' : ''}`}
          onClick={() => onPick(b.key)}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

const TYPES = [
  ['all', 'All'],
  ['scooter', 'Electric'],
  ['bike', 'Petrol'],
];

export function TypeChips() {
  const { twType, setTwType } = useFilters();
  return (
    <div className="typechips">
      {TYPES.map(([key, label]) => (
        <button
          key={key}
          className={`pill${twType === key ? ' is-on' : ''}`}
          onClick={() => setTwType(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const SEATS = [
  ['all', 'Any'],
  ['11', '11'],
  ['14', '14'],
  ['15', '15–16'],
  ['17', '17+'],
];

export function VanFilterBar() {
  const {
    maxPrice, setMaxPrice,
    seats, setSeats,
    acOnly, setAcOnly,
    vans, resetVans,
  } = useFilters();

  return (
    <div className="filterbar">
      <div className="filterbar__price">
        <div className="filterbar__price-row">
          <span className="filterbar__legend">Price up to</span>
          <span className="filterbar__amount">NPR {npr(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={VAN_PRICE_MIN}
          max={VAN_PRICE_MAX}
          step={50000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
        />
      </div>

      <div>
        <div className="filterbar__group-label">Seats</div>
        <div className="filterbar__chips">
          {SEATS.map(([key, label]) => (
            <button
              key={key}
              className={`chip${seats === key ? ' is-on' : ''}`}
              onClick={() => setSeats(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="filterbar__group-label">Comfort</div>
        <button
          className={`toggle${acOnly ? ' is-on' : ''}`}
          onClick={() => setAcOnly((v) => !v)}
          aria-pressed={acOnly}
        >
          <span className="toggle__track">
            <span className="toggle__knob" />
          </span>
          <span className="toggle__label">Air conditioned only</span>
        </button>
      </div>

      <div className="filterbar__tail">
        <span className="filterbar__count">
          <strong>{vans.length}</strong> of {ALL_VANS.length} vans
        </span>
        <button className="filterbar__reset" onClick={resetVans}>
          Reset
        </button>
      </div>
    </div>
  );
}
