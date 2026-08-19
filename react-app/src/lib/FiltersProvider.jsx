import { useMemo, useState } from 'react';
import { FiltersContext } from './filtersContext';
import { VAN_PRICE_MAX } from './format';
import { ALL_CARS, ALL_TW, ALL_VANS, seatsMatch } from './vehicles';

/* One source of truth for the filters, so a choice made in the browse section
   still holds on the two wheeler page and the other way round. */
export default function FiltersProvider({ children }) {
  const [brandVan, setBrandVan] = useState('all');
  const [brandCar, setBrandCar] = useState('all');
  const [brandTw, setBrandTw] = useState('all');
  const [twType, setTwType] = useState('all');
  const [twSort, setTwSort] = useState('default');
  const [maxPrice, setMaxPrice] = useState(VAN_PRICE_MAX);
  const [seats, setSeats] = useState('all');
  const [acOnly, setAcOnly] = useState(false);

  const vans = useMemo(
    () =>
      ALL_VANS.filter((v) => {
        if (brandVan !== 'all' && v.brand !== brandVan) return false;
        if (v.price > maxPrice) return false;
        if (acOnly && !v.ac) return false;
        return seatsMatch(v, seats);
      }),
    [brandVan, maxPrice, acOnly, seats]
  );

  const cars = useMemo(
    () => ALL_CARS.filter((v) => brandCar === 'all' || v.brand === brandCar),
    [brandCar]
  );

  const tw = useMemo(
    () =>
      ALL_TW.filter((v) => {
        if (brandTw !== 'all' && v.brand !== brandTw) return false;
        return twType === 'all' || v.type === twType;
      }),
    [brandTw, twType]
  );

  const twSorted = useMemo(() => {
    const list = tw.slice();
    if (twSort === 'price-asc' || twSort === 'price-desc') {
      const dir = twSort === 'price-desc' ? -1 : 1;
      list.sort((a, b) => {
        /* Anything priced at the counter sits at the end either way. */
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return (a.price - b.price) * dir;
      });
    }
    return list;
  }, [tw, twSort]);

  const value = useMemo(() => {
    const resetVans = () => {
      setBrandVan('all');
      setMaxPrice(VAN_PRICE_MAX);
      setSeats('all');
      setAcOnly(false);
    };

    /* How many filters are away from their default, for the sidebar button. */
    const activeCount = (group) => {
      if (group === 'van') {
        return (
          (brandVan !== 'all' ? 1 : 0) +
          (maxPrice !== VAN_PRICE_MAX ? 1 : 0) +
          (seats !== 'all' ? 1 : 0) +
          (acOnly ? 1 : 0)
        );
      }
      if (group === 'car') return brandCar !== 'all' ? 1 : 0;
      return (brandTw !== 'all' ? 1 : 0) + (twType !== 'all' ? 1 : 0);
    };

    return {
      brandVan, setBrandVan,
      brandCar, setBrandCar,
      brandTw, setBrandTw,
      twType, setTwType,
      twSort, setTwSort,
      maxPrice, setMaxPrice,
      seats, setSeats,
      acOnly, setAcOnly,
      vans, cars, tw, twSorted,
      resetVans, activeCount,
    };
  }, [brandVan, brandCar, brandTw, twType, twSort, maxPrice, seats, acOnly, vans, cars, tw, twSorted]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}
