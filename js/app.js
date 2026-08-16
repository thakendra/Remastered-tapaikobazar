/* TapaikoBazar — browse, detail and finance, all on one page. */

(function () {
  'use strict';

  var view = document.getElementById('view');

  /* ------------------------------------------------------------- formatting */

  /* Lakh grouping: 41,99,000 rather than 4,199,000. */
  function npr(n) {
    n = Math.round(n);
    var s = String(n);
    if (s.length <= 3) return s;
    var last = s.slice(-3);
    var rest = s.slice(0, -3);
    var out = '';
    while (rest.length > 2) {
      out = ',' + rest.slice(-2) + out;
      rest = rest.slice(0, -2);
    }
    return rest + out + ',' + last;
  }

  function emi(principal, annualRate, months) {
    var r = annualRate / 100 / 12;
    if (r <= 0) return principal / months;
    var f = Math.pow(1 + r, months);
    return principal * r * f / (f - 1);
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function catOf(v) {
    return v.type === 'van' ? 'van' : v.type === 'car' ? 'car' : 'tw';
  }

  function priceText(v, fallback) {
    if (v.priceLabel) return v.priceLabel;
    return v.price != null ? 'NPR ' + npr(v.price) : fallback;
  }

  function find(id) {
    for (var i = 0; i < CATALOGUE.length; i++) {
      if (CATALOGUE[i].id === id) return CATALOGUE[i];
    }
    return null;
  }

  /* The Kinglong 19 seater tops the floor at NPR 81,00,000. */
  var VAN_PRICE_MIN = 4000000;
  var VAN_PRICE_MAX = 8500000;

  function seatLabel(v) {
    return v.seatsMin === v.seatsMax
      ? v.seatsMin + ' seats'
      : v.seatsMin + '–' + v.seatsMax + ' seats';
  }

  var ALL_VANS = CATALOGUE.filter(function (v) { return catOf(v) === 'van'; });
  var ALL_CARS = CATALOGUE.filter(function (v) { return catOf(v) === 'car'; });
  var ALL_TW = CATALOGUE.filter(function (v) { return catOf(v) === 'tw'; });

  /* ------------------------------------------------------------------ state */

  var state = {
    view: 'browse',
    brandVan: 'all',
    brandCar: 'all',
    brandTw: 'all',
    maxPrice: VAN_PRICE_MAX,
    seats: 'all',
    acOnly: false,
    vehicleId: null,
    galleryIndex: 0,
    step: 1,
    finDown: null,
    finRate: FINANCE_DEFAULTS.interestRate,
    finTenure: FINANCE_DEFAULTS.vanTermMonths,
    docs: []
  };

  function toTop() { window.scrollTo({ top: 0 }); }

  function jump(id, offset) {
    var el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
  }

  /* ------------------------------------------------------------- filtering */

  /* Some vans are sold in a range of layouts, so a seat filter matches if the
     wanted size falls anywhere inside that range. */
  function seatsMatch(v) {
    switch (state.seats) {
      case '11': return v.seatsMin <= 11 && v.seatsMax >= 11;
      case '14': return v.seatsMin <= 14 && v.seatsMax >= 14;
      case '15': return v.seatsMin <= 16 && v.seatsMax >= 15;
      case '17': return v.seatsMax >= 17;
      default: return true;
    }
  }

  function vanResults() {
    return ALL_VANS.filter(function (v) {
      if (state.brandVan !== 'all' && v.brand !== state.brandVan) return false;
      if (v.price > state.maxPrice) return false;
      if (state.acOnly && !v.ac) return false;
      return seatsMatch(v);
    });
  }

  function carResults() {
    return ALL_CARS.filter(function (v) {
      return state.brandCar === 'all' || v.brand === state.brandCar;
    });
  }

  function twResults() {
    return ALL_TW.filter(function (v) {
      return state.brandTw === 'all' || v.brand === state.brandTw;
    });
  }

  function brandKeys(list) {
    var names = [];
    list.forEach(function (v) {
      if (names.indexOf(v.brand) === -1) names.push(v.brand);
    });
    return [{ label: 'All brands', key: 'all' }].concat(names.map(function (b) {
      return { label: b, key: b };
    }));
  }

  /* ----------------------------------------------------------- card markup */

  function cardHTML(v) {
    var isVan = v.type === 'van';
    var quick = isVan
      ? seatLabel(v) + ' · ' + (v.ac ? 'air conditioned' : 'no AC') + ' · warranty'
      : v.specs.slice(0, 3).map(function (x) { return x[1]; }).join(' · ');

    return '' +
      '<button class="card" data-open="' + esc(v.id) + '">' +
        '<div class="card__shot">' +
          '<img src="' + esc(v.img) + '" alt="' + esc(v.name) + '" loading="lazy" />' +
          '<span class="card__tag">' + esc(TYPE_LABEL[v.type]) + '</span>' +
        '</div>' +
        '<div class="card__body">' +
          '<div class="card__brand">' + esc(v.brand) + '</div>' +
          '<div class="card__name">' + esc(v.name) + '</div>' +
          '<div class="card__specs">' + esc(quick) + '</div>' +
          '<div class="card__foot">' +
            '<div class="card__price">' + esc(priceText(v, 'Price at the counter')) + '</div>' +
            '<div class="card__sub">' + esc(v.status || 'EMI financing available') + '</div>' +
          '</div>' +
        '</div>' +
      '</button>';
  }

  function pillsHTML(list, current) {
    return brandKeys(list).map(function (b) {
      return '<button class="pill' + (current === b.key ? ' is-on' : '') +
        '" data-brand="' + esc(b.key) + '">' + esc(b.label) + '</button>';
    }).join('');
  }

  /* ------------------------------------------------------------ browse view */

  function browseHTML() {
    return '' +
    '<div class="hero">' +
      '<img class="hero__img" src="' + esc(HERO_IMG) + '" alt="Electric vans at the showroom" />' +
      '<div class="hero__scrim"></div>' +
      '<div class="hero__body">' +
        '<span class="hero__eyebrow">Vans first, then cars, then two wheelers</span>' +
        '<h1 class="hero__title">Sit in it before<br />you finance it.</h1>' +
        '<p class="hero__lede">Every van, scooter and bike we list is parked at Panipokhari. ' +
          'Filter by brand and budget below, then come drive the one you like.</p>' +
        '<div class="hero__actions">' +
          '<a href="#" class="btn btn--red btn--md">Book a test ride</a>' +
          '<button class="btn btn--outline-light btn--md" data-scroll-browse>Browse the floor</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="stats">' +
      TRUST_STATS.map(function (s) { return statCell(s[0], s[1]); }).join('') +
    '</div>' +

    '<div id="browse">' +

      '<div id="sec-vans" class="section" data-section="van">' +
        sectionHead('Section one', 'Electric vans',
          'Eleven to sixteen seats, financed in-house over five years. ' +
          'This is what most people come to Panipokhari for.',
          'van', ALL_VANS, state.brandVan, 'brandpills--vans') +

        '<div data-home="bar-van"><div class="filterbar" data-filter-block="bar-van">' +
          '<div class="filterbar__price">' +
            '<div class="filterbar__price-row">' +
              '<span class="filterbar__legend">Price up to</span>' +
              '<span class="filterbar__amount" data-max-price-text>NPR ' + npr(state.maxPrice) + '</span>' +
            '</div>' +
            '<input type="range" min="' + VAN_PRICE_MIN + '" max="' + VAN_PRICE_MAX +
              '" step="50000" value="' + state.maxPrice + '" data-max-price aria-label="Maximum price" />' +
          '</div>' +
          '<div>' +
            '<div class="filterbar__group-label">Seats</div>' +
            '<div class="filterbar__chips" data-seats>' + seatChips() + '</div>' +
          '</div>' +
          '<div>' +
            '<div class="filterbar__group-label">Comfort</div>' +
            '<button class="toggle' + (state.acOnly ? ' is-on' : '') + '" data-ac aria-pressed="' + state.acOnly + '">' +
              '<span class="toggle__track"><span class="toggle__knob"></span></span>' +
              '<span class="toggle__label">Air conditioned only</span>' +
            '</button>' +
          '</div>' +
          '<div class="filterbar__tail">' +
            '<span class="filterbar__count"><strong data-van-count>' + vanResults().length + '</strong> of ' +
              ALL_VANS.length + ' vans</span>' +
            '<button class="filterbar__reset" data-reset-vans>Reset</button>' +
          '</div>' +
        '</div></div>' +

        '<div class="grid-wrap">' +
          '<div class="cardgrid" data-grid="van"></div>' +
          '<div data-van-empty></div>' +
        '</div>' +
      '</div>' +

      '<div id="sec-cars" class="section section--tint" data-section="car">' +
        sectionHead('Section two', 'Electric cars',
          'Private cars and SUVs, from the Naami mini up to the Xpeng G6. ' +
          'Two of them are still on pre-booking.',
          'car', ALL_CARS, state.brandCar, 'brandpills--cars') +
        '<div class="grid-wrap"><div class="cardgrid" data-grid="car"></div></div>' +
      '</div>' +

      '<div id="sec-tw" class="section" data-section="tw">' +
        sectionHead('Section three', 'Two wheelers',
          'Electric scooters and petrol bikes. The cheapest way onto the road, ' +
          'and everything here is financed too.',
          'tw', ALL_TW, state.brandTw, 'brandpills--tw') +
        '<div class="grid-wrap">' +
          '<div class="cardgrid" data-grid="tw"></div>' +
          priceListHTML() +
        '</div>' +
      '</div>' +

    '</div>' +

    howToBuyHTML() +
    testimonialsHTML() +

    drawerHTML('van', 'Filter vans') +
    drawerHTML('car', 'Filter cars') +
    drawerHTML('tw', 'Filter two wheelers') +

    exchangeAndVisitHTML();
  }

  function sectionHead(index, title, note, group, list, current, pillsClass) {
    return '<div class="sechead">' +
      '<div>' +
        '<div class="sechead__index">' + index + '</div>' +
        '<h2 class="sechead__title">' + title + '</h2>' +
        '<p class="sechead__note">' + note + '</p>' +
        '<button class="sechead__filters" data-open-filters="' + group + '">Filters' +
          '<span class="sechead__filters-badge" data-filter-badge="' + group + '" hidden></span>' +
        '</button>' +
      '</div>' +
      '<div class="sechead__filter-home" data-home="brand-' + group + '">' +
        '<div class="sechead__filter" data-filter-block="brand-' + group + '">' +
          '<span class="sechead__filter-label">Brand</span>' +
          '<div class="brandpills ' + pillsClass + '" data-pills="' + group + '">' +
            pillsHTML(list, current) +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  var GROUP_NOUN = { van: ['van', 'vans'], car: ['car', 'cars'], tw: ['two wheeler', 'two wheelers'] };

  function drawerHTML(group, title) {
    return '<div class="drawer" data-drawer="' + group + '">' +
      '<div class="drawer__scrim" data-drawer-close></div>' +
      '<aside class="drawer__panel" role="dialog" aria-label="' + title + '">' +
        '<div class="drawer__head">' +
          '<span class="drawer__title">' + title + '</span>' +
          '<button class="drawer__close" data-drawer-close aria-label="Close filters">×</button>' +
        '</div>' +
        '<div class="drawer__body" data-drawer-body="' + group + '"></div>' +
        '<div class="drawer__foot">' +
          '<button class="btn btn--red btn--block" data-drawer-close ' +
            'data-drawer-apply="' + group + '">Show results</button>' +
        '</div>' +
      '</aside>' +
    '</div>';
  }

  function statCell(figure, label) {
    return '<div class="stats__cell">' +
      '<div class="stats__figure">' + esc(figure) + '</div>' +
      '<div class="stats__label">' + esc(label) + '</div>' +
    '</div>';
  }

  function seatChip(key, label) {
    return '<button class="chip' + (state.seats === key ? ' is-on' : '') +
      '" data-seat="' + key + '">' + esc(label) + '</button>';
  }

  function seatChips() {
    return seatChip('all', 'Any') + seatChip('11', '11') + seatChip('14', '14') +
      seatChip('15', '15–16') + seatChip('17', '17+');
  }

  /* The full showroom price list, collapsed by default — it is long. */
  function priceListHTML() {
    var count = BIKE_PRICE_LIST.reduce(function (n, g) { return n + g.models.length; }, 0);

    return '<div class="pricelist">' +
      '<button class="pricelist__toggle" data-pricelist>' +
        '<span data-pricelist-label>See the full price list — all ' + count + ' models</span>' +
      '</button>' +
      '<div class="pricelist__body" data-pricelist-body hidden>' +
        BIKE_PRICE_LIST.map(function (g) {
          return '<div class="pricelist__group">' +
            '<div class="pricelist__brand">' + esc(g.brand) + '</div>' +
            '<div class="pricelist__scroll"><table class="pricelist__table">' +
              '<thead><tr><th>Model</th><th>Price (NPR)</th><th>Specs</th></tr></thead>' +
              '<tbody>' + g.models.map(function (m) {
                return '<tr><td>' + esc(m[0]) + '</td><td>' + esc(m[1]) + '</td><td>' + esc(m[2]) + '</td></tr>';
              }).join('') + '</tbody>' +
            '</table></div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function howToBuyHTML() {
    return '<div class="howto">' +
      '<div class="howto__head">' +
        '<span class="panel__eyebrow">Simple and fast</span>' +
        '<h2 class="howto__title">How to buy from TapaikoBazar</h2>' +
        '<p class="howto__lede">From browsing to driving away. Most files finish inside three working days.</p>' +
      '</div>' +
      '<div class="howto__steps">' +
        HOW_TO_BUY.map(function (s, i) {
          return '<div class="howto__step">' +
            '<div class="howto__num">' + (i + 1) + '</div>' +
            '<div class="howto__name">' + esc(s[0]) + '</div>' +
            '<p class="howto__text">' + esc(s[1]) + '</p>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function testimonialsHTML() {
    return '<div class="voices">' +
      '<div class="voices__head">' +
        '<span class="panel__eyebrow">From the counter</span>' +
        '<h2 class="howto__title">What people say afterwards</h2>' +
      '</div>' +
      '<div class="voices__grid">' +
        TESTIMONIALS.map(function (t) {
          return '<figure class="voice">' +
            '<blockquote class="voice__text">' + esc(t[0]) + '</blockquote>' +
            '<figcaption class="voice__who">' +
              '<span class="voice__name">' + esc(t[1]) + '</span>' +
              '<span class="voice__role">' + esc(t[2]) + '</span>' +
            '</figcaption>' +
          '</figure>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function exchangeAndVisitHTML() {
    return '' +
    '<div class="twoup">' +
      '<div class="panel panel--white">' +
        '<span class="panel__eyebrow">' + esc(EXCHANGE.title) + '</span>' +
        '<h2 class="panel__title">Your old vehicle counts toward the down</h2>' +
        '<p class="panel__lede panel__lede--narrow">' + esc(EXCHANGE.lede) + '</p>' +
        '<div class="exchange__points">' +
          EXCHANGE.points.map(function (p) {
            return '<div class="exchange__point">' +
              '<span class="exchange__point-name">' + esc(p[0]) + '</span>' +
              '<span class="exchange__point-note">' + esc(p[1]) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="exchange__form">' +
          '<select class="field" aria-label="Make">' +
            '<option>Make — Honda</option><option>Toyota</option><option>Hyundai</option><option>Suzuki</option>' +
          '</select>' +
          '<select class="field" aria-label="Year">' +
            '<option>Year — 2018</option><option>2020</option><option>2015</option>' +
          '</select>' +
          '<input type="text" class="field" placeholder="Kilometres driven" />' +
          '<a href="#" class="btn btn--navy exchange__submit">Estimate</a>' +
        '</div>' +
        '<div class="exchange__result">' +
          '<div class="exchange__result-label">Estimated range</div>' +
          '<div class="exchange__range">NPR 8,20,000 – 9,60,000</div>' +
        '</div>' +
      '</div>' +

      '<div class="panel">' +
        '<span class="panel__eyebrow">Visit</span>' +
        '<h2 class="panel__title">Pick a slot, we will keep it ready</h2>' +
        '<p class="panel__lede panel__lede--narrower">Tell us when you are planning to buy and we will have ' +
          'the vehicle charged, cleaned and ready when you come in.</p>' +
        '<div class="visit__legend">When are you planning to buy</div>' +
        '<div class="visit__times" data-visit-times>' +
          '<button class="visit__time is-on">Within a week</button>' +
          '<button class="visit__time">Within a month</button>' +
          '<button class="visit__time">In two months</button>' +
          '<button class="visit__time">After six months</button>' +
        '</div>' +
        '<div class="visit__signup">' +
          '<input type="tel" class="field" placeholder="Your phone number" />' +
          '<a href="#" class="btn btn--red visit__confirm">Confirm</a>' +
        '</div>' +
        '<div class="visit__address">' +
          '<div class="visit__line"><span>Showroom</span>' + esc(CONTACT.address) + '</div>' +
          '<div class="visit__line"><span>Open</span>' + esc(CONTACT.hours) + '</div>' +
          '<div class="visit__line"><span>Landline</span>' + CONTACT.landlines.map(function (n) {
            return '<a href="tel:' + esc(n) + '">' + esc(n) + '</a>';
          }).join(' · ') + '</div>' +
          '<div class="visit__line"><span>Mobile</span>' + CONTACT.mobiles.map(function (n) {
            return '<a href="tel:' + esc(n) + '">' + esc(n) + '</a>';
          }).join(' · ') + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function paintVans() {
    var results = vanResults();
    view.querySelector('[data-grid="van"]').innerHTML = results.map(cardHTML).join('');
    view.querySelector('[data-van-count]').textContent = results.length;
    view.querySelector('[data-van-empty]').innerHTML = results.length ? '' :
      '<div class="empty">' +
        '<div class="empty__title">No van matches that</div>' +
        '<p class="empty__note">Raise the price ceiling or clear the brand filter.</p>' +
      '</div>';
    paintFilterMeta('van', results.length);
  }

  function paintCars() {
    var results = carResults();
    view.querySelector('[data-grid="car"]').innerHTML = results.map(cardHTML).join('');
    paintFilterMeta('car', results.length);
  }

  function paintTw() {
    var results = twResults();
    view.querySelector('[data-grid="tw"]').innerHTML = results.map(cardHTML).join('');
    paintFilterMeta('tw', results.length);
  }

  /* How many filters are away from their default, for the sidebar button. */
  function activeFilters(group) {
    if (group === 'van') {
      return (state.brandVan !== 'all' ? 1 : 0) +
             (state.maxPrice !== VAN_PRICE_MAX ? 1 : 0) +
             (state.seats !== 'all' ? 1 : 0) +
             (state.acOnly ? 1 : 0);
    }
    return (group === 'car' ? state.brandCar : state.brandTw) !== 'all' ? 1 : 0;
  }

  function paintFilterMeta(group, count) {
    var badge = view.querySelector('[data-filter-badge="' + group + '"]');
    if (badge) {
      var n = activeFilters(group);
      badge.textContent = n;
      badge.hidden = n === 0;
    }
    var apply = view.querySelector('[data-drawer-apply="' + group + '"]');
    if (apply) {
      apply.textContent = 'Show ' + count + ' ' + GROUP_NOUN[group][count === 1 ? 0 : 1];
    }
  }

  function repaintPills(group, list, current) {
    var box = view.querySelector('[data-pills="' + group + '"]');
    if (box) box.innerHTML = pillsHTML(list, current);
  }

  function mountBrowse() {
    view.innerHTML = browseHTML();
    paintVans();
    paintCars();
    paintTw();

    view.querySelector('[data-scroll-browse]').addEventListener('click', function () {
      jump('browse', 80);
    });

    /* Brand filters */
    bindPills('van');
    bindPills('car');
    bindPills('tw');

    /* Price ceiling */
    var slider = view.querySelector('[data-max-price]');
    slider.addEventListener('input', function () {
      state.maxPrice = Number(slider.value);
      view.querySelector('[data-max-price-text]').textContent = 'NPR ' + npr(state.maxPrice);
      paintVans();
    });

    /* Seat count */
    view.querySelector('[data-seats]').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-seat]');
      if (!btn) return;
      state.seats = btn.getAttribute('data-seat');
      view.querySelector('[data-seats]').innerHTML =
        seatChips();
      paintVans();
    });

    /* Air conditioning */
    var acBtn = view.querySelector('[data-ac]');
    acBtn.addEventListener('click', function () {
      state.acOnly = !state.acOnly;
      acBtn.classList.toggle('is-on', state.acOnly);
      acBtn.setAttribute('aria-pressed', String(state.acOnly));
      paintVans();
    });

    /* Reset */
    view.querySelector('[data-reset-vans]').addEventListener('click', function () {
      state.brandVan = 'all';
      state.maxPrice = VAN_PRICE_MAX;
      state.seats = 'all';
      state.acOnly = false;
      slider.value = state.maxPrice;
      view.querySelector('[data-max-price-text]').textContent = 'NPR ' + npr(state.maxPrice);
      view.querySelector('[data-seats]').innerHTML =
        seatChips();
      acBtn.classList.remove('is-on');
      acBtn.setAttribute('aria-pressed', 'false');
      repaintPills('van', ALL_VANS, state.brandVan);
      paintVans();
    });

    /* Planning-to-buy chips */
    var times = view.querySelector('[data-visit-times]');
    times.addEventListener('click', function (e) {
      var btn = e.target.closest('.visit__time');
      if (!btn) return;
      times.querySelectorAll('.visit__time').forEach(function (b) { b.classList.remove('is-on'); });
      btn.classList.add('is-on');
    });

    relocateFilters();
  }

  /* -------------------------------------------------------- mobile menu ---

     Lives on <body> rather than inside #view so it survives a view change.
     It borrows the .drawer markup and styling from the filter sidebar. */

  function mountNav() {
    var nav = document.createElement('div');
    nav.className = 'drawer drawer--right';
    nav.setAttribute('data-drawer', 'nav');
    nav.innerHTML = '' +
      '<div class="drawer__scrim" data-drawer-close></div>' +
      '<aside class="drawer__panel" role="dialog" aria-label="Menu">' +
        '<div class="drawer__head">' +
          '<span class="drawer__title">Menu</span>' +
          '<button class="drawer__close" data-drawer-close aria-label="Close menu">×</button>' +
        '</div>' +
        '<div class="drawer__body navmenu">' +
          '<button class="navmenu__item" data-jump="sec-vans">Electric vans</button>' +
          '<button class="navmenu__item" data-jump="sec-cars">Electric cars</button>' +
          '<button class="navmenu__item" data-jump="sec-tw">Two wheelers</button>' +
          '<button class="navmenu__item" data-go="browse">Exchange</button>' +
          '<button class="navmenu__item" data-go="about">About us</button>' +

          '<div class="navmenu__contact">' +
            '<div class="navmenu__label">Showroom</div>' +
            '<p>' + esc(CONTACT.address) + '</p>' +
            '<p>' + esc(CONTACT.hours) + '</p>' +
            '<div class="navmenu__label">Call us</div>' +
            '<p>' + CONTACT.landlines.concat(CONTACT.mobiles).map(function (n) {
              return '<a href="tel:' + esc(n) + '">' + esc(n) + '</a>';
            }).join(' · ') + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="drawer__foot navmenu__foot">' +
          '<a href="#" class="btn btn--red btn--block">Book a test ride</a>' +
          '<a href="https://wa.me/' + esc(CONTACT.whatsapp) + '" target="_blank" rel="noopener" ' +
            'class="btn btn--outline-navy btn--block">WhatsApp us</a>' +
        '</div>' +
      '</aside>';
    document.body.appendChild(nav);
  }

  function openNav() {
    var nav = document.querySelector('[data-drawer="nav"]');
    if (!nav) return;
    nav.classList.add('is-open');
    document.body.classList.add('is-drawer-open');
    var burger = document.querySelector('[data-open-nav]');
    if (burger) burger.setAttribute('aria-expanded', 'true');
  }

  /* ---------------------------------------------------- filter sidebar */

  var narrow = window.matchMedia('(max-width: 980px)');

  /* Below the breakpoint the filter blocks live in the sidebar, above it they
     sit in the section header. The same nodes are moved either way, so state
     and listeners survive the trip. */
  function place(node, parent) {
    if (node && parent && node.parentNode !== parent) parent.appendChild(node);
  }

  function relocateFilters() {
    if (state.view !== 'browse') return;
    var toSidebar = narrow.matches;

    ['van', 'car', 'tw'].forEach(function (group) {
      var body = view.querySelector('[data-drawer-body="' + group + '"]');
      if (!body) return;

      place(view.querySelector('[data-filter-block="brand-' + group + '"]'),
        toSidebar ? body : view.querySelector('[data-home="brand-' + group + '"]'));

      if (group === 'van') {
        place(view.querySelector('[data-filter-block="bar-van"]'),
          toSidebar ? body : view.querySelector('[data-home="bar-van"]'));
      }
    });

    if (!toSidebar) closeDrawers();
  }

  function openDrawer(group) {
    relocateFilters();
    var drawer = view.querySelector('[data-drawer="' + group + '"]');
    if (!drawer) return;
    drawer.classList.add('is-open');
    document.body.classList.add('is-drawer-open');
  }

  function closeDrawers() {
    document.querySelectorAll('.drawer.is-open').forEach(function (d) {
      d.classList.remove('is-open');
    });
    document.body.classList.remove('is-drawer-open');
    var burger = document.querySelector('[data-open-nav]');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  narrow.addEventListener('change', relocateFilters);

  /* A resize observer on the document is the dependable trigger: it runs off
     layout rather than window events, which some embedded browsers never
     deliver. place() makes the extra calls free. */
  if (window.ResizeObserver) {
    new ResizeObserver(relocateFilters).observe(document.documentElement);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawers();
  });

  function bindPills(group) {
    var box = view.querySelector('[data-pills="' + group + '"]');
    box.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-brand]');
      if (!btn) return;
      var key = btn.getAttribute('data-brand');
      if (group === 'van') {
        state.brandVan = key;
        repaintPills('van', ALL_VANS, key);
        paintVans();
      } else if (group === 'car') {
        state.brandCar = key;
        repaintPills('car', ALL_CARS, key);
        paintCars();
      } else {
        state.brandTw = key;
        repaintPills('tw', ALL_TW, key);
        paintTw();
      }
    });
  }

  /* ------------------------------------------------------------- about view */

  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('');
  }

  function facePic(name, img, cls) {
    return img
      ? '<div class="' + cls + '"><img src="' + esc(img) + '" alt="' + esc(name) + '" loading="lazy" /></div>'
      : '<div class="' + cls + ' ' + cls + '--initials">' + esc(initials(name)) + '</div>';
  }

  function mountAbout() {
    var c = COMPANY;

    view.innerHTML = '' +
      '<div class="crumbs">' +
        '<button data-go="browse">Browse</button>' +
        '<span>/</span>' +
        '<span class="crumbs__here">About us</span>' +
      '</div>' +

      '<div class="about__intro">' +
        '<div>' +
          '<span class="panel__eyebrow">Since an 81 square foot stall</span>' +
          '<h1 class="about__title">' + esc(c.storyTitle) + '</h1>' +
          c.story.map(function (p) { return '<p class="about__para">' + esc(p) + '</p>'; }).join('') +
          '<blockquote class="about__quote">' + esc(c.quote) +
            '<cite>' + esc(c.quoteBy) + '</cite>' +
          '</blockquote>' +
        '</div>' +
        '<div class="about__shot">' +
          '<img src="' + esc(c.gallery[0][0]) + '" alt="' + esc(c.gallery[0][1]) + '" />' +
          '<div class="about__caption">' + esc(c.gallery[0][1]) + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="stats">' +
        TRUST_STATS.map(function (s) { return statCell(s[0], s[1]); }).join('') +
      '</div>' +

      '<div class="about__block">' +
        '<span class="panel__eyebrow">What we stand for</span>' +
        '<h2 class="about__h2">Six things we do not bend on</h2>' +
        '<div class="values">' +
          c.values.map(function (v) {
            return '<div class="value">' +
              '<div class="value__name">' + esc(v[0]) + '</div>' +
              '<p class="value__text">' + esc(v[1]) + '</p>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<div class="about__block about__block--tint">' +
        '<span class="panel__eyebrow">The people behind it</span>' +
        '<h2 class="about__h2">Meet the team</h2>' +
        '<div class="leaders">' +
          c.leaders.map(function (l) {
            return '<div class="leader">' +
              facePic(l.name, l.img, 'leader__pic') +
              '<div class="leader__body">' +
                '<div class="leader__role">' + esc(l.role) + '</div>' +
                '<div class="leader__name">' + esc(l.name) + '</div>' +
                '<p class="leader__bio">' + esc(l.bio) + '</p>' +
                (l.note ? '<div class="leader__note">' + esc(l.note) + '</div>' : '') +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="team">' +
          c.team.map(function (t) {
            return '<div class="member">' +
              facePic(t[0], t[2], 'member__pic') +
              '<div class="member__name">' + esc(t[0]) + '</div>' +
              '<div class="member__role">' + esc(t[1]) + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<div class="about__block">' +
        '<span class="panel__eyebrow">Press and media</span>' +
        '<h2 class="about__h2">' + esc(c.press.title) + '</h2>' +
        '<div class="press">' +
          '<div class="press__shot"><img src="' + esc(c.press.img) + '" alt="' + esc(c.press.title) + '" loading="lazy" /></div>' +
          '<p class="press__text">' + esc(c.press.text) + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="about__block about__block--tint">' +
        '<span class="panel__eyebrow">At Panipokhari</span>' +
        '<h2 class="about__h2">Around the showroom</h2>' +
        '<div class="gallery">' +
          c.gallery.map(function (g) {
            return '<figure class="shot">' +
              '<img src="' + esc(g[0]) + '" alt="' + esc(g[1]) + '" loading="lazy" />' +
              '<figcaption>' + esc(g[1]) + '</figcaption>' +
            '</figure>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  /* ------------------------------------------------------------ detail view */

  function currentVehicle() {
    return find(state.vehicleId) || CATALOGUE[0];
  }

  function shotsOf(v) {
    return v.gallery && v.gallery.length ? v.gallery : [v.img];
  }

  function mountDetail() {
    var v = currentVehicle();
    var isVan = v.type === 'van';
    var shots = shotsOf(v);
    var mainImg = shots[state.galleryIndex] || v.img;

    var related = CATALOGUE.filter(function (x) {
      return x.type === v.type && x.id !== v.id;
    }).slice(0, 3);

    var emiLabel = isVan ? 'From, per month' : (v.status ? 'Status' : 'EMI');
    var emiValue = isVan
      ? 'NPR ' + npr(emi(v.price - v.down, FINANCE_DEFAULTS.interestRate, FINANCE_DEFAULTS.vanTermMonths))
      : (v.status || 'Available');

    view.innerHTML = '' +
      '<div class="crumbs">' +
        '<button data-go="browse">Browse</button>' +
        '<span>/</span>' +
        '<span>' + esc(v.brand) + '</span>' +
        '<span>/</span>' +
        '<span class="crumbs__here">' + esc(v.name) + '</span>' +
      '</div>' +

      '<div class="detail">' +
        '<div class="detail__left">' +
          '<div class="detail__hero"><img src="' + esc(mainImg) + '" alt="' + esc(v.name) + '" /></div>' +
          (shots.length > 1
            ? '<div class="detail__thumbs">' + shots.map(function (src, i) {
                return '<button class="detail__thumb' + (i === state.galleryIndex ? ' is-on' : '') +
                  '" data-shot="' + i + '"><img src="' + esc(src) + '" alt="' + esc(v.name) + '" /></button>';
              }).join('') + '</div>'
            : '') +
          '<div class="detail__caption">Showroom photographs, Panipokhari.</div>' +

          '<h2 class="detail__h2">Specification</h2>' +
          '<div class="spectable">' +
            v.specs.map(function (sp) {
              return '<div class="spectable__row">' +
                '<span class="spectable__label">' + esc(sp[0]) + '</span>' +
                '<span class="spectable__value">' + esc(sp[1]) + '</span>' +
              '</div>';
            }).join('') +
          '</div>' +

          '<div class="visitnote">' +
            '<div class="visitnote__title">See it at Panipokhari</div>' +
            '<p>This one is on the floor right now. Opposite NIMB Bank, Sunday to Friday 9am to 7pm. ' +
              'Ask for a test drive at the counter — no appointment needed, though a slot saves you the wait.</p>' +
          '</div>' +
        '</div>' +

        '<div class="detail__right">' +
          '<div class="detail__brand">' + esc(v.brand) + '</div>' +
          '<h1 class="detail__name">' + esc(v.name) + '</h1>' +
          '<p class="detail__blurb">' + esc(v.blurb) + '</p>' +

          '<div class="pricebox">' +
            '<div class="pricebox__row pricebox__row--top">' +
              '<span class="pricebox__label">Showroom price</span>' +
              '<span class="pricebox__value">' + esc(priceText(v, 'Ask at the counter')) + '</span>' +
            '</div>' +
            '<div class="pricebox__row pricebox__row--bottom">' +
              '<span class="pricebox__label">' + esc(emiLabel) + '</span>' +
              '<span class="pricebox__value pricebox__value--emi">' + esc(emiValue) + '</span>' +
            '</div>' +
          '</div>' +

          '<div class="detail__cta">' +
            '<button class="btn btn--red btn--block" data-finance>' +
              (v.price != null ? 'Get finance on this' : 'Ask for the price') +
            '</button>' +
            '<a href="#" class="btn btn--outline-navy btn--block">Book a test ride</a>' +
          '</div>' +

          '<div class="detail__block">' +
            '<div class="detail__block-label">Why people buy this one</div>' +
            '<div class="highlights">' +
              v.highlights.map(function (h) {
                return '<div class="highlight"><span class="highlight__dot"></span>' +
                  '<span class="highlight__text">' + esc(h) + '</span></div>';
              }).join('') +
            '</div>' +
          '</div>' +

          '<div class="detail__block">' +
            '<div class="detail__block-label">Also worth a look</div>' +
            '<div class="related">' +
              related.map(function (r) {
                return '<button class="related__item" data-open="' + esc(r.id) + '">' +
                  '<span class="related__shot"><img src="' + esc(r.img) + '" alt="' + esc(r.name) + '" /></span>' +
                  '<span class="related__meta">' +
                    '<span class="related__name">' + esc(r.name) + '</span>' +
                    '<span class="related__price">' + esc(priceText(r, 'Price at the counter')) + '</span>' +
                  '</span>' +
                '</button>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* Narrow screens only: keeps the price and the next step in reach
         without scrolling back up the page. */
      '<div class="actionbar">' +
        '<div class="actionbar__price">' +
          '<span class="actionbar__label">Showroom price</span>' +
          '<span class="actionbar__value">' + esc(priceText(v, 'Ask at the counter')) + '</span>' +
        '</div>' +
        '<button class="btn btn--red actionbar__cta" data-finance>' +
          (v.price != null ? 'Get finance' : 'Ask the price') +
        '</button>' +
      '</div>';

    view.querySelectorAll('[data-shot]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.galleryIndex = Number(btn.getAttribute('data-shot'));
        mountDetail();
      });
    });

    /* Two of these on narrow screens: the panel button and the sticky bar. */
    view.querySelectorAll('[data-finance]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (v.price == null) return;
        state.view = 'finance';
        state.step = 1;
        state.finDown = v.down || Math.round(v.price * 0.25);
        render();
        toTop();
      });
    });
  }

  /* ----------------------------------------------------------- finance view */

  function financeFigures(v) {
    var isVan = v.type === 'van';
    var basePrice = v.price != null ? v.price : 0;
    var down = state.finDown == null ? (v.down || Math.round(basePrice * 0.25)) : state.finDown;
    var loan = Math.max(basePrice - down, 0);
    var term = isVan ? state.finTenure : Math.min(state.finTenure, 36);
    var monthly = loan > 0 ? emi(loan, state.finRate, term) : 0;
    return {
      isVan: isVan,
      basePrice: basePrice,
      down: down,
      downMin: v.down || Math.round(basePrice * 0.15),
      downMax: Math.round(basePrice * 0.8) || 1,
      loan: loan,
      term: term,
      monthly: monthly,
      interest: Math.max(monthly * term - loan, 0)
    };
  }

  function termText(term) {
    return (term / 12) + (term === 12 ? ' year' : ' years');
  }

  function mountFinance() {
    var v = currentVehicle();

    view.innerHTML = '' +
      '<div class="crumbs">' +
        '<button data-go="browse">Browse</button>' +
        '<span>/</span>' +
        '<button data-back-detail>' + esc(v.name) + '</button>' +
        '<span>/</span>' +
        '<span class="crumbs__here">Finance</span>' +
      '</div>' +
      '<div class="finance">' +
        '<div class="finance__main">' +
          '<div class="steps" data-steps></div>' +
          '<div data-step-body></div>' +
        '</div>' +
        '<aside class="summary" data-summary></aside>' +
      '</div>';

    view.querySelector('[data-back-detail]').addEventListener('click', function () {
      state.view = 'detail';
      render();
      toTop();
    });

    paintSteps();
    paintStepBody();
    paintSummary();
  }

  function paintSteps() {
    var names = [['Step one', 'Set your terms'], ['Step two', 'Your details'], ['Step three', 'Documents']];
    view.querySelector('[data-steps]').innerHTML = names.map(function (n, i) {
      return '<div class="step' + (state.step === i + 1 ? ' is-on' : '') + '">' +
        '<div class="step__index">' + n[0] + '</div>' +
        '<div class="step__name">' + n[1] + '</div>' +
      '</div>';
    }).join('');
  }

  function paintSummary() {
    var v = currentVehicle();
    var f = financeFigures(v);

    view.querySelector('[data-summary]').innerHTML = '' +
      '<div class="summary__eyebrow">Financing</div>' +
      '<div class="summary__shot"><img src="' + esc(shotsOf(v)[state.galleryIndex] || v.img) +
        '" alt="' + esc(v.name) + '" /></div>' +
      '<div class="summary__name">' + esc(v.name) + '</div>' +
      summaryRow('Showroom price', priceText(v, 'Ask at the counter')) +
      summaryRow('Downpayment', 'NPR ' + npr(f.down)) +
      summaryRow('Loan amount', 'NPR ' + npr(f.loan)) +
      summaryRow('Rate and term', state.finRate + '% for ' + termText(f.term)) +
      summaryRow('Total interest', 'NPR ' + npr(f.interest)) +
      '<div class="summary__total">' +
        '<span class="summary__total-label">Monthly payment</span>' +
        '<span class="summary__total-value">NPR ' + npr(f.monthly) + '</span>' +
      '</div>' +
      '<p class="summary__fineprint">Indicative. Final approval and rate come from the bank after your ' +
        'documents are verified at Panipokhari.</p>';
  }

  function summaryRow(label, value) {
    return '<div class="summary__row"><span>' + esc(label) + '</span><span>' + esc(value) + '</span></div>';
  }

  function paintStepBody() {
    var v = currentVehicle();
    var f = financeFigures(v);
    var box = view.querySelector('[data-step-body]');

    if (state.step === 1) {
      box.innerHTML = '' +
        '<h1 class="finance__title">What can you put down?</h1>' +
        '<p class="finance__lede">Move the three sliders until the monthly figure looks right. Nothing here ' +
          'is binding — the bank sets the final rate once your papers are checked at the counter.</p>' +
        '<div class="sliders">' +
          '<div class="slider">' +
            '<div class="slider__row">' +
              '<span class="slider__label">Downpayment</span>' +
              '<span class="slider__value" data-down-text>NPR ' + npr(f.down) + '</span>' +
            '</div>' +
            '<input type="range" min="' + f.downMin + '" max="' + f.downMax + '" step="25000" value="' +
              f.down + '" data-fin-down aria-label="Downpayment" />' +
            '<div class="slider__note">' + (f.isVan
              ? 'No collateral is needed when you put down 20 to 40 percent.'
              : 'Two wheeler terms run up to three years.') + '</div>' +
          '</div>' +
          '<div class="slider">' +
            '<div class="slider__row">' +
              '<span class="slider__label">Interest rate</span>' +
              '<span class="slider__value" data-rate-text>' + state.finRate + '%</span>' +
            '</div>' +
            '<input type="range" min="5" max="9" step="0.5" value="' + state.finRate + '" data-fin-rate aria-label="Interest rate" />' +
            '<div class="slider__note">Our partner banks quote between 5% and 9% depending on your profile.</div>' +
          '</div>' +
          '<div class="slider">' +
            '<div class="slider__row">' +
              '<span class="slider__label">Term</span>' +
              '<span class="slider__value" data-term-text>' + termText(f.term) + '</span>' +
            '</div>' +
            '<input type="range" min="12" max="60" step="12" value="' + state.finTenure + '" data-fin-term aria-label="Term" />' +
            '<div class="slider__note">Five years is the longest term available on electric vans.</div>' +
          '</div>' +
        '</div>' +
        '<button class="btn btn--red btn--lg" style="margin-top:44px;" data-next>Continue</button>';

      bindSlider('[data-fin-down]', function (val) {
        state.finDown = val;
        view.querySelector('[data-down-text]').textContent = 'NPR ' + npr(val);
      });
      bindSlider('[data-fin-rate]', function (val) {
        state.finRate = val;
        view.querySelector('[data-rate-text]').textContent = val + '%';
      });
      bindSlider('[data-fin-term]', function (val) {
        state.finTenure = val;
        view.querySelector('[data-term-text]').textContent = termText(financeFigures(currentVehicle()).term);
      });

    } else if (state.step === 2) {
      box.innerHTML = '' +
        '<h1 class="finance__title">Who are we financing?</h1>' +
        '<p class="finance__lede">Enough for us to start the file. A person from our counter calls you ' +
          'the same working day.</p>' +
        '<div class="applicant">' +
          '<input type="text" class="field" placeholder="Full name" />' +
          '<input type="tel" class="field" placeholder="Mobile number" />' +
          '<select class="field" aria-label="Employment">' +
            '<option>Employment — Salaried</option><option>Self employed / business</option>' +
            '<option>Transport operator</option><option>Farming</option>' +
          '</select>' +
          '<select class="field" aria-label="Monthly income">' +
            '<option>Monthly income — 50,000 to 1,00,000</option><option>Under 50,000</option>' +
            '<option>1,00,000 to 2,00,000</option><option>Over 2,00,000</option>' +
          '</select>' +
          '<input type="text" class="field" placeholder="District" />' +
          '<select class="field" aria-label="Preferred bank">' +
            '<option>Preferred bank — no preference</option><option>NIMB</option>' +
            '<option>Nabil</option><option>Global IME</option>' +
          '</select>' +
        '</div>' +
        '<div class="stepnav">' +
          '<button class="btn btn--outline-navy btn--lg-narrow" data-prev>Back</button>' +
          '<button class="btn btn--red btn--lg" data-next>Continue</button>' +
        '</div>';

    } else if (state.step === 3) {
      box.innerHTML = '' +
        '<h1 class="finance__title">Bring these to the counter</h1>' +
        '<p class="finance__lede">Tick what you already have. Anything missing, we will tell you how to get ' +
          'it — most people are approved within three working days.</p>' +
        '<div class="doclist" data-docs>' + docsHTML() + '</div>' +
        '<div class="stepnav">' +
          '<button class="btn btn--outline-navy btn--lg-narrow" data-prev>Back</button>' +
          '<button class="btn btn--red btn--lg" data-submit>Send my application</button>' +
        '</div>';

      view.querySelector('[data-docs]').addEventListener('click', function (e) {
        var row = e.target.closest('[data-doc]');
        if (!row) return;
        var id = row.getAttribute('data-doc');
        var at = state.docs.indexOf(id);
        if (at === -1) state.docs.push(id); else state.docs.splice(at, 1);
        view.querySelector('[data-docs]').innerHTML = docsHTML();
      });

    } else {
      box.innerHTML = '' +
        '<div class="done">' +
          '<div class="done__tick">✓</div>' +
          '<h1 class="finance__title">We have your file</h1>' +
          '<p class="done__lede">Someone from the Panipokhari counter calls you today between 9am and 7pm. ' +
            'Bring the documents you ticked and we can usually finish the paperwork in one visit.</p>' +
          '<div class="done__card">' +
            '<div class="done__card-label">While you wait</div>' +
            '<p>Book a test ride on the ' + esc(v.name) + ' so it is charged and parked out front when you arrive.</p>' +
            '<a href="#" class="btn btn--red">Book a test ride</a>' +
          '</div>' +
          '<button class="done__back" data-go="browse">Back to browsing</button>' +
        '</div>';
    }

    var next = box.querySelector('[data-next]');
    if (next) next.addEventListener('click', function () { goStep(Math.min(state.step + 1, 4)); });

    var prev = box.querySelector('[data-prev]');
    if (prev) prev.addEventListener('click', function () { goStep(Math.max(state.step - 1, 1)); });

    var submit = box.querySelector('[data-submit]');
    if (submit) submit.addEventListener('click', function () { goStep(4); });
  }

  function goStep(n) {
    state.step = n;
    paintSteps();
    paintStepBody();
    paintSummary();
  }

  function docsHTML() {
    return DOCS.map(function (d) {
      var on = state.docs.indexOf(d.id) !== -1;
      return '<button class="doc' + (on ? ' is-on' : '') + '" data-doc="' + esc(d.id) + '">' +
        '<span class="doc__box">' + (on ? '✓' : '') + '</span>' +
        '<span>' +
          '<span class="doc__label" style="display:block;">' + esc(d.label) + '</span>' +
          '<span class="doc__note" style="display:block;">' + esc(d.note) + '</span>' +
        '</span>' +
      '</button>';
    }).join('');
  }

  function bindSlider(selector, onChange) {
    var el = view.querySelector(selector);
    el.addEventListener('input', function () {
      onChange(Number(el.value));
      paintSummary();
    });
  }

  /* --------------------------------------------------------------- routing */

  function render() {
    closeDrawers();
    /* The detail view's sticky action bar needs room at the foot of the page. */
    document.body.classList.toggle('is-detail', state.view === 'detail');
    if (state.view === 'detail') mountDetail();
    else if (state.view === 'finance') mountFinance();
    else if (state.view === 'about') mountAbout();
    else mountBrowse();
  }

  function openVehicle(id) {
    var v = find(id);
    if (!v) return;
    state.view = 'detail';
    state.vehicleId = id;
    state.galleryIndex = 0;
    state.step = 1;
    state.docs = [];
    state.finDown = v.down || Math.round(v.price * 0.25);
    render();
    toTop();
  }

  function goBrowse() {
    state.view = 'browse';
    render();
    toTop();
  }

  function togglePriceList(btn) {
    var body = view.querySelector('[data-pricelist-body]');
    var open = body.hidden;
    body.hidden = !open;
    btn.classList.toggle('is-open', open);
    view.querySelector('[data-pricelist-label]').textContent = open
      ? 'Hide the full price list'
      : 'See the full price list — all ' +
        BIKE_PRICE_LIST.reduce(function (n, g) { return n + g.models.length; }, 0) + ' models';
  }

  /* Vehicle cards and "Browse" crumbs live inside re-rendered markup, so both
     are handled by one delegated listener rather than per-element bindings. */
  document.addEventListener('click', function (e) {
    var filters = e.target.closest('[data-open-filters]');
    if (filters) { openDrawer(filters.getAttribute('data-open-filters')); return; }

    if (e.target.closest('[data-drawer-close]')) { closeDrawers(); return; }

    if (e.target.closest('[data-open-nav]')) { openNav(); return; }

    var toggle = e.target.closest('[data-pricelist]');
    if (toggle) { togglePriceList(toggle); return; }

    var open = e.target.closest('[data-open]');
    if (open) { openVehicle(open.getAttribute('data-open')); return; }

    var go = e.target.closest('[data-go="browse"]');
    if (go) { goBrowse(); return; }

    var about = e.target.closest('[data-go="about"]');
    if (about) { state.view = 'about'; render(); toTop(); return; }

    var jumpTo = e.target.closest('[data-jump]');
    if (jumpTo) {
      var id = jumpTo.getAttribute('data-jump');
      closeDrawers();
      if (state.view !== 'browse') {
        goBrowse();
        setTimeout(function () { jump(id, 96); }, 60);
      } else {
        jump(id, 96);
      }
    }
  });

  mountNav();
  render();
})();
