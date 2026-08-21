import { useState } from 'react';
import { NARROW, useMediaQuery } from '../lib/useMediaQuery';
import Drawer from './Drawer';

const NOUN = {
  van: ['van', 'vans'],
  car: ['car', 'cars'],
  tw: ['two wheeler', 'two wheelers'],
};

/* Above the breakpoint the filters sit in the navy header. Below it they move
   into a sidebar. The controls are the same components either way, and their
   state lives in context, so nothing is lost in the move. */
export default function Section({
  id,
  group,
  index,
  title,
  note,
  tint,
  filters,
  bar,
  resultCount,
  activeCount,
  children,
}) {
  const narrow = useMediaQuery(NARROW);
  const [open, setOpen] = useState(false);

  const noun = NOUN[group][resultCount === 1 ? 0 : 1];

  return (
    <div id={id} className={`section${tint ? ' section--tint' : ''}`}>
      <div className="sechead">
        <div data-reveal="fade">
          <div className="sechead__index">{index}</div>
          <h2 className="sechead__title">{title}</h2>
          <p className="sechead__note">{note}</p>
          {narrow ? (
            <button className="sechead__filters" onClick={() => setOpen(true)}>
              Filters
              {activeCount > 0 ? (
                <span className="sechead__filters-badge">{activeCount}</span>
              ) : null}
            </button>
          ) : null}
        </div>
        {!narrow ? <div className="sechead__filter-home">{filters}</div> : null}
      </div>

      {!narrow && bar ? bar : null}

      {narrow ? (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title={`Filter ${NOUN[group][1]}`}
          foot={
            <button className="btn btn--red btn--block" onClick={() => setOpen(false)}>
              Show {resultCount} {noun}
            </button>
          }
        >
          {filters}
          {bar}
        </Drawer>
      ) : null}

      {children}
    </div>
  );
}
