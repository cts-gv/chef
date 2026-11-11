// Small, dependency-free browser script. Everything is plain DOM: no framework.
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var DATA = JSON.parse($('#site-data').textContent);

  // ---------- footer year ----------
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---------- navbar ----------
  var header = $('#site-header');
  var menuToggle = $('#menu-toggle');
  var mobileMenu = $('#mobile-menu');
  var iconMenu = $('#icon-menu');
  var iconClose = $('#icon-close');

  function setScrolled(on) {
    var bg = ['bg-[#FFFCF7]/95', 'backdrop-blur-md', 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]'];
    bg.forEach(function (c) { header.classList.toggle(c, on); });
    header.classList.toggle('bg-transparent', !on);
    $$('[data-nav-text]').forEach(function (el) {
      el.classList.toggle('text-[#1A1A1A]', on);
      el.classList.toggle('text-white', !on);
    });
    $$('[data-nav-link]').forEach(function (el) {
      el.classList.toggle('text-[#3A3A3A]', on);
      el.classList.toggle('text-white/90', !on);
    });
    $$('svg', menuToggle).forEach(function (el) {
      el.classList.toggle('text-[#1A1A1A]', on);
      el.classList.toggle('text-white', !on);
    });
  }
  function onScroll() { setScrolled(window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    iconMenu.hidden = open;
    iconClose.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
  }
  menuToggle.addEventListener('click', function () { setMenu(mobileMenu.classList.contains('hidden')); });
  $$('a', mobileMenu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  // ---------- chef video (plays only when the visitor presses play) ----------
  // NOTE: the play overlay uses Tailwind's "flex" class, which overrides the HTML
  // `hidden` attribute, so we hide it with inline display instead. Otherwise it stays
  // on top of the video and blocks the native controls (pause, volume, seek bar).
  var chefVideo = $('#chef-video');
  var chefPlay = $('#chef-play');
  if (chefVideo && chefPlay) {
    chefVideo.volume = parseFloat(chefVideo.getAttribute('data-volume') || '0.5');
    var setStarted = function (on) {
      chefVideo.controls = on;
      chefPlay.style.display = on ? 'none' : '';
    };
    chefPlay.addEventListener('click', function () {
      setStarted(true);
      var p = chefVideo.play();
      if (p && p.catch) p.catch(function () { setStarted(false); });
    });
    chefVideo.addEventListener('play', function () { setStarted(true); });
    chefVideo.addEventListener('ended', function () { setStarted(false); });
  }

  // ---------- monthly special lightbox (works for every flyer) ----------
  var lb = $('#special-lightbox');
  if (lb) {
    var lbImg = $('#special-lightbox-img');
    var prevOverflow = '';
    var closeLb = function () {
      lb.hidden = true;
      lb.classList.remove('flex');
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onLbKey);
    };
    var onLbKey = function (e) { if (e.key === 'Escape') closeLb(); };
    $$('[data-special-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        lbImg.src = btn.getAttribute('data-src');
        lbImg.alt = btn.getAttribute('data-alt') || '';
        prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        lb.hidden = false;
        lb.classList.add('flex');
        document.addEventListener('keydown', onLbKey);
      });
    });
    $('#special-close').addEventListener('click', closeLb);
    lb.addEventListener('click', closeLb);
    lbImg.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  // ---------- reveal phone / email (decoded only after a real tap) ----------
  var ICONS = {};
  $$('[data-reveal]').forEach(function (btn) {
    var type = btn.getAttribute('data-reveal');
    ICONS[type] = btn.querySelector('svg').outerHTML;
    btn.addEventListener('click', function (e) {
      if (!e.isTrusted) return; // ignore script-generated clicks
      var encoded = type === 'phone' ? DATA.phoneEncoded : DATA.emailEncoded;
      var value = '';
      try { value = atob(encoded); } catch (err) { value = ''; }
      if (!value) return;
      var a = document.createElement('a');
      a.href = type === 'phone' ? 'tel:' + value.replace(/[^\d+]/g, '') : 'mailto:' + value;
      a.className = 'flex items-center gap-2 ' + btn.getAttribute('data-class');
      a.innerHTML = ICONS[type];
      a.appendChild(document.createTextNode(value));
      btn.replaceWith(a);
    });
  });

  // ---------- date picker ----------
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var toISO = function (y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }; // m is 0-based
  var blocked = new Set(DATA.blockedDates);
  var isBlocked = function (iso) { return blocked.has(iso); };

  var dp = {
    wrap: $('#date-picker'), btn: $('#date-btn'), pop: $('#date-pop'), grid: $('#date-grid'),
    title: $('#date-title'), prev: $('#date-prev'), next: $('#date-next'), clear: $('#date-clear'),
    value: '', year: 0, month: 0,
  };
  var now = new Date();
  dp.year = now.getFullYear();
  dp.month = now.getMonth();

  function dpRender() {
    var todayISO = toISO(now.getFullYear(), now.getMonth(), now.getDate());
    dp.title.textContent = MONTHS[dp.month] + ' ' + dp.year;
    dp.prev.disabled = dp.year === now.getFullYear() && dp.month === now.getMonth();
    var first = new Date(dp.year, dp.month, 1).getDay();
    var days = new Date(dp.year, dp.month + 1, 0).getDate();
    dp.grid.innerHTML = '';
    for (var i = 0; i < first; i++) dp.grid.appendChild(document.createElement('div'));
    for (var d = 1; d <= days; d++) {
      (function (day) {
        var iso = toISO(dp.year, dp.month, day);
        var isBlk = isBlocked(iso);
        var disabled = isBlk || iso < todayISO;
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = day;
        b.disabled = disabled;
        if (isBlk) b.title = 'Unavailable';
        b.className = 'h-9 rounded-lg text-sm transition-colors ' + (
          iso === dp.value ? 'bg-[#B8742C] text-white font-semibold'
          : disabled ? 'text-[#C4C4C4] bg-[#F1EEE9] line-through cursor-not-allowed'
          : 'text-[#1A1A1A] hover:bg-[#F3E6D3]');
        b.addEventListener('click', function () { dpSet(iso); dpClose(); });
        dp.grid.appendChild(b);
      })(d);
    }
    dp.clear.hidden = !dp.value;
  }
  function dpSet(iso) {
    dp.value = iso;
    if (iso) {
      dp.btn.textContent = new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      dp.btn.classList.add('text-[#1A1A1A]');
      dp.btn.classList.remove('text-[#8A8A8A]');
    } else {
      dp.btn.textContent = 'Select a date...';
      dp.btn.classList.remove('text-[#1A1A1A]');
      dp.btn.classList.add('text-[#8A8A8A]');
    }
  }
  function onDocDown(e) { if (!dp.wrap.contains(e.target)) dpClose(); }
  function onDocKey(e) { if (e.key === 'Escape') dpClose(); }
  function dpOpen() {
    if (dp.value) { var v = new Date(dp.value + 'T00:00:00'); dp.year = v.getFullYear(); dp.month = v.getMonth(); }
    dpRender();
    dp.pop.hidden = false;
    dp.btn.setAttribute('aria-expanded', 'true');
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onDocKey);
  }
  function dpClose() {
    dp.pop.hidden = true;
    dp.btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', onDocDown);
    document.removeEventListener('keydown', onDocKey);
  }
  function dpShift(delta) {
    var d = new Date(dp.year, dp.month + delta, 1);
    dp.year = d.getFullYear();
    dp.month = d.getMonth();
    dpRender();
  }
  dp.btn.addEventListener('click', function () { dp.pop.hidden ? dpOpen() : dpClose(); });
  dp.prev.addEventListener('click', function () { dpShift(-1); });
  dp.next.addEventListener('click', function () { dpShift(1); });
  dp.clear.addEventListener('click', function () { dpSet(''); dpClose(); });

  // ---------- quote form ----------
  var form = $('#quote-form');
  var fields = $('#form-fields');
  var success = $('#form-success');
  var errBox = $('#form-error');
  var errText = $('#form-error-text');
  var typeEl = $('#f-type');
  var guestsEl = $('#f-guests');
  var submitBtn = $('#form-submit');
  var pricing = DATA.quotePricing;

  function limits() { return (typeEl.value && pricing[typeEl.value]) || {}; }

  function calcQuote() {
    var p = pricing[typeEl.value];
    if (!typeEl.value || !guestsEl.value || !p) return null;
    var n = parseInt(guestsEl.value, 10);
    if (isNaN(n) || n < 1) return null;
    if (p.minGuests !== undefined && n < p.minGuests) return null;
    if (p.maxGuests !== undefined && n > p.maxGuests) return null;
    return p.perGuest * n + p.baseFee;
  }

  function updateQuote() {
    var q = calcQuote();
    $('#quote-empty').hidden = q !== null;
    $('#quote-result').hidden = q === null;
    if (q !== null) $('#quote-amount').textContent = '$' + q.toLocaleString();
  }

  function updateGuestLimits() {
    var l = limits();
    if (l.minGuests !== undefined) guestsEl.min = l.minGuests; else guestsEl.removeAttribute('min');
    if (l.maxGuests !== undefined) guestsEl.max = l.maxGuests; else guestsEl.removeAttribute('max');
    guestsEl.required = l.minGuests !== undefined;
    $('#guests-star').hidden = l.minGuests === undefined;
    var hint = $('#guests-hint');
    if (l.minGuests !== undefined || l.maxGuests !== undefined) {
      hint.textContent =
        (l.minGuests !== undefined ? 'Minimum ' + l.minGuests : '') +
        (l.minGuests !== undefined && l.maxGuests !== undefined ? ', ' : '') +
        (l.maxGuests !== undefined ? 'maximum ' + l.maxGuests : '') +
        ' guests for this event type.';
      hint.hidden = false;
    } else {
      hint.hidden = true;
    }
  }

  typeEl.addEventListener('change', function () {
    // Start the guest count at the minimum and keep it within the allowed range
    var l = limits();
    var cur = parseInt(guestsEl.value, 10);
    if (l.minGuests !== undefined && (isNaN(cur) || cur < l.minGuests)) guestsEl.value = String(l.minGuests);
    else if (l.maxGuests !== undefined && cur > l.maxGuests) guestsEl.value = String(l.maxGuests);
    updateGuestLimits();
    updateQuote();
  });
  guestsEl.addEventListener('input', updateQuote);

  function showError(msg) { errText.textContent = msg; errBox.hidden = false; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var honeypot = $('#f-gotcha').value;
    // A bot filled the hidden field: pretend it worked, send nothing.
    if (honeypot) { fields.hidden = true; success.hidden = false; return; }

    var name = $('#f-name').value, email = $('#f-email').value, phone = $('#f-phone').value;
    var phoneOk = $('#c-phone').checked, emailOk = $('#c-email').checked, offersOk = $('#c-offers').checked;
    if (!name || !email || !phone || !typeEl.value || !phoneOk || !emailOk) {
      return showError('Please fill in all required fields and agree to phone and email communication.');
    }
    if (dp.value && isBlocked(dp.value)) {
      return showError('Sorry, that date is already booked. Please choose another date.');
    }
    var l = limits();
    var label = pricing[typeEl.value].label;
    var n = parseInt(guestsEl.value, 10);
    if (l.minGuests !== undefined && (isNaN(n) || n < l.minGuests)) {
      return showError(label + ' requires a minimum of ' + l.minGuests + ' guests.');
    }
    if (l.maxGuests !== undefined && n > l.maxGuests) {
      return showError(label + ' allows a maximum of ' + l.maxGuests + ' guests. Please call us for larger events.');
    }

    errBox.hidden = true;
    submitBtn.disabled = true;
    $('#submit-label').hidden = true;
    $('#submit-busy').hidden = false;
    var q = calcQuote();

    fetch(DATA.formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        event_type: label,
        event_date: dp.value || 'Not provided',
        guests: guestsEl.value || 'Not provided',
        message: $('#f-message').value || 'Not provided',
        quote_estimate: q !== null ? '$' + q.toLocaleString() : 'Not calculated',
        phone_communication_consent: phoneOk ? 'Yes' : 'No',
        email_communication_consent: emailOk ? 'Yes' : 'No',
        special_offers_consent: offersOk ? 'Yes' : 'No',
        _gotcha: honeypot,
        _subject: 'New ' + label + ' inquiry from ' + name,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        form.reset();
        dpSet('');
        updateGuestLimits();
        updateQuote();
        fields.hidden = true;
        success.hidden = false;
      })
      .catch(function () {
        showError('Something went wrong. Please try again or call us directly.');
      })
      .then(function () {
        submitBtn.disabled = false;
        $('#submit-label').hidden = false;
        $('#submit-busy').hidden = true;
      });
  });

  $('#form-again').addEventListener('click', function () {
    success.hidden = true;
    fields.hidden = false;
    errBox.hidden = true;
  });

  updateGuestLimits();
  updateQuote();
})();
