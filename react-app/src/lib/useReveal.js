import { useEffect } from 'react';

/* Reveals anything carrying data-reveal as it comes into view.

   The observer is the primary mechanism, but it is not trusted on its own: a
   [data-reveal] element starts at opacity 0, so anything that stops the reveal
   firing would leave the catalogue invisible. A decoration must never be able
   to hide content. So a cheap in-view sweep backs it up, runs off scroll
   frames, and takes itself off the moment everything has been revealed.

   Elements only ever move by transform and opacity, both of which the
   compositor handles without laying the page out again. */
export default function useReveal(deps = []) {
  useEffect(() => {
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = () => document.querySelectorAll('[data-reveal]:not(.is-in)');

    /* Reduced motion: show everything and leave. */
    if (quiet) {
      targets().forEach((el) => el.classList.add('is-in'));
      return undefined;
    }

    let io = null;
    const show = (el) => {
      el.classList.add('is-in');
      if (io) io.unobserve(el);
    };

    /* Fires a little before the top edge arrives, so the movement has settled
       by the time the element is properly in view. */
    const inView = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.94 && r.bottom > 0;
    };

    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && show(e.target)),
        { rootMargin: '0px 0px -6% 0px', threshold: 0.02 }
      );
      targets().forEach((el) => io.observe(el));
    }

    /* Throttled on a timestamp rather than an animation frame. The frame loop
       is the very thing an observer failure would implicate, so the backstop
       must not depend on it too. */
    let last = 0;
    const sweep = () => {
      last = Date.now();
      targets().forEach((el) => inView(el) && show(el));
      if (targets().length === 0) detach();
    };
    const onScroll = () => {
      if (Date.now() - last < 90) return;
      sweep();
    };

    function detach() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* The first screenful should not wait for a scroll that may never come,
       and images settling can move things into view after mount. */
    sweep();
    const settles = [120, 400, 1000].map((t) => setTimeout(sweep, t));

    return () => {
      settles.forEach(clearTimeout);
      detach();
      if (io) io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
