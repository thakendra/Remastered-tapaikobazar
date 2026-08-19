import { Link } from 'react-router-dom';
import { TYPE_LABEL } from '../data/catalogue';
import { priceText, seatLabel } from '../lib/format';
import Shot from './Shot';

/* A real anchor, not a button that navigates. That buys open-in-new-tab,
   copy-link-address, the status bar URL preview, "link" rather than "button"
   in a screen reader, and a crawlable path to all 77 vehicles. */
export default function VehicleCard({ vehicle: v }) {
  const isVan = v.type === 'van';

  const quick = isVan
    ? `${seatLabel(v)} · ${v.ac ? 'air conditioned' : 'no AC'} · warranty`
    : v.specs.slice(0, 3).map((x) => x[1]).join(' · ');

  return (
    <Link className="card" to={`/vehicle/${v.id}`}>
      <div className="card__shot">
        <Shot vehicle={v} />
        <span className="card__tag">{TYPE_LABEL[v.type]}</span>
      </div>
      <div className="card__body">
        <div className="card__brand">{v.brand}</div>
        <div className="card__name">{v.name}</div>
        <div className="card__specs">{quick}</div>
        <div className="card__foot">
          <div className="card__price">{priceText(v, 'Price at the counter')}</div>
          <div className="card__sub">{v.status || 'EMI financing available'}</div>
        </div>
      </div>
    </Link>
  );
}
