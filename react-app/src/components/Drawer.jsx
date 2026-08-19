import { useEffect } from 'react';

/* The filter sidebar and the mobile menu are the same panel, hinged on
   opposite sides. */
export default function Drawer({ open, onClose, title, side = 'left', foot, children }) {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('is-drawer-open');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-drawer-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div className={`drawer${side === 'right' ? ' drawer--right' : ''}${open ? ' is-open' : ''}`}>
      <div className="drawer__scrim" onClick={onClose} />
      <aside className="drawer__panel" role="dialog" aria-label={title} aria-hidden={!open}>
        <div className="drawer__head">
          <span className="drawer__title">{title}</span>
          <button className="drawer__close" onClick={onClose} aria-label={`Close ${title}`}>
            ×
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        {foot ? <div className="drawer__foot">{foot}</div> : null}
      </aside>
    </div>
  );
}
