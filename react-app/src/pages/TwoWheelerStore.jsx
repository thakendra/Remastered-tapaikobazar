import { useNavigate } from 'react-router-dom';
import { BrandPills, TypeChips } from '../components/Filters';
import VehicleCard from '../components/VehicleCard';
import { useFilters } from '../lib/filtersContext';
import { ALL_TW } from '../lib/vehicles';

export default function TwoWheelerStore() {
  const navigate = useNavigate();
  const f = useFilters();
  const results = f.twSorted;

  return (
    <>
      <div className="crumbs">
        <button onClick={() => navigate('/')}>Browse</button>
        <span>/</span>
        <span className="crumbs__here">Two wheelers</span>
      </div>

      <div className="sechead">
        <div>
          <div className="sechead__index">Every model on the floor</div>
          <h1 className="sechead__title">Bikes and scooters</h1>
          <p className="sechead__note">
            Electric scooters and petrol bikes from Honda, TVS, Yamaha, Bajaj, Sarathi,
            Ecooter, Luyuan and Garow. Everything here is financed.
          </p>
        </div>
        <div className="sechead__filter">
          <span className="sechead__filter-label">Type</span>
          <TypeChips />
        </div>
      </div>

      <div className="storebar">
        <div className="storebar__brands">
          <BrandPills list={ALL_TW} current={f.brandTw} onPick={f.setBrandTw} />
        </div>
        <div className="storebar__tail">
          <label className="storebar__sortlabel" htmlFor="tw-sort">Sort</label>
          <select
            className="field storebar__sort"
            id="tw-sort"
            value={f.twSort}
            onChange={(e) => f.setTwSort(e.target.value)}
          >
            <option value="default">Featured first</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
          <span className="storebar__count">
            <strong>{results.length}</strong> of {ALL_TW.length}
          </span>
        </div>
      </div>

      <div className="grid-wrap">
        <div className="cardgrid">
          {results.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
        {results.length === 0 ? (
          <div className="empty">
            <div className="empty__title">Nothing matches that</div>
            <p className="empty__note">Clear the brand or switch back to all types.</p>
          </div>
        ) : null}
      </div>
    </>
  );
}
