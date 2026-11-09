// ============================================================
//  BUILD SCRIPT — turns site.config.js into a plain static site in /dist
//  Run:  npm run build      (then open dist/index.html or upload /dist)
//  The client only ever edits site.config.js (and drops files in /public).
// ============================================================
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const site = require('./site.config.js');

const SITE_URL = (process.env.SITE_URL || 'https://YOUR-DOMAIN.com').replace(/\/$/, '');
const DIST = path.join(__dirname, 'dist');

// ---------- helpers ----------
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const iconDir = path.join(__dirname, 'node_modules', 'lucide-static', 'icons');
function icon(name, cls = '', opts = {}) {
  const raw = fs.readFileSync(path.join(iconDir, `${name}.svg`), 'utf8');
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');
  const sw = opts.strokeWidth ?? 2;
  const fill = opts.fill ?? 'none';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${inner}</svg>`;
}

// "Smith Wedding 1/27/2027" -> "2027-01-27". Notes are dropped, so client names never reach the page.
const pad = (n) => String(n).padStart(2, '0');
const blockedDates = [];
for (const entry of site.blockedDates || []) {
  const m = String(entry).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) blockedDates.push(`${m[3]}-${pad(m[1])}-${pad(m[2])}`);
  else console.warn(`WARNING blockedDates: no M/D/YYYY date found in "${entry}"`);
}

// ---------- sections ----------
const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
];

const navbar = () => `
<header id="site-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
  <nav class="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20" aria-label="Main">
    <a href="#hero" class="flex items-center gap-2 group text-center">
      ${icon('wine', 'w-7 h-7 sm:w-8 sm:h-8 text-[#B8742C] transition-transform group-hover:scale-110', { strokeWidth: 2.2 })}
      <span data-nav-text class="font-serif text-lg sm:text-xl font-bold tracking-tight transition-colors text-white">${esc(site.business.name)}</span>
    </a>

    <div class="hidden md:flex items-center gap-8">
      ${navLinks
        .map(
          (l) =>
            `<a href="${l.href}" data-nav-link class="text-center text-sm font-medium tracking-wide transition-colors hover:text-[#B8742C] text-white/90">${l.label}</a>`
        )
        .join('\n      ')}
      <a href="#contact" class="text-center bg-[#B8742C] hover:bg-[#A06420] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105">Get a Quote</a>
    </div>

    <button id="menu-toggle" type="button" class="md:hidden" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu">
      <span id="icon-menu">${icon('menu', 'w-6 h-6 text-white', {})}</span>
      <span id="icon-close" hidden>${icon('x', 'w-6 h-6 text-white', {})}</span>
    </button>
  </nav>

  <div id="mobile-menu" class="hidden md:hidden bg-[#FFFCF7] border-t border-[#E0D5C3]">
    <div class="px-5 py-4 flex flex-col gap-3">
      ${navLinks
        .map(
          (l) =>
            `<a href="${l.href}" class="text-left text-[#3A3A3A] font-medium py-2 hover:text-[#B8742C] transition-colors">${l.label}</a>`
        )
        .join('\n      ')}
      <a href="#contact" class="bg-[#B8742C] text-white font-semibold px-5 py-3 rounded-full mt-2 text-center">Get a Quote</a>
    </div>
  </div>
</header>`;

const hero = () => `
<section id="hero" class="relative h-screen min-h-[640px] w-full overflow-hidden">
  <video class="absolute inset-0 w-full h-full object-cover" autoplay muted loop playsinline poster="${esc(site.hero.posterImage)}">
    <source src="${esc(site.hero.videoSrc)}" type="video/mp4" />
  </video>
  <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
  <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
    <div class="max-w-3xl mx-auto animate-[fadeInUp_1s_ease-out]">
      <p class="text-[#E8B86D] font-sans text-sm sm:text-base tracking-[0.3em] uppercase mb-4 sm:mb-6">${esc(site.business.tagline)}</p>
      <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl text-white font-bold leading-[1.1] tracking-tight mb-6">${esc(site.hero.title)}</h1>
      <p class="text-white/85 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">${esc(site.hero.subtitle)}</p>
      <a href="#${esc(site.hero.ctaScrollTarget || 'contact')}" class="inline-block text-center bg-[#B8742C] hover:bg-[#A06420] text-white font-semibold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105">${esc(site.hero.ctaText)}</a>
    </div>
  </div>
  <a href="#about" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors animate-bounce" aria-label="Scroll down">
    ${icon('chevron-down', 'w-7 h-7')}
  </a>
</section>`;

const about = () => {
  const v = site.about.video;
  const videoBlock = v && v.src
    ? `
    <div class="mt-20 sm:mt-28 max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">${esc(v.title)}</h3>
        ${v.caption ? `<p class="text-[#4A4A4A] text-base sm:text-lg">${esc(v.caption)}</p>` : ''}
      </div>
      <div class="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-[#1A1A1A]">
        <video id="chef-video" class="absolute inset-0 w-full h-full object-cover" preload="metadata" playsinline data-volume="${v.volume ?? 0.5}"${v.poster ? ` poster="${esc(v.poster)}"` : ''}>
          <source src="${esc(v.src)}" type="video/mp4" />
        </video>
        <button id="chef-play" type="button" aria-label="Play video: ${esc(v.title)}" class="group absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition-colors">
          <span class="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#B8742C] text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
            ${icon('play', 'w-9 h-9 sm:w-10 sm:h-10 ml-1', { fill: 'currentColor' })}
          </span>
        </button>
      </div>
    </div>`
    : '';

  return `
<section id="about" class="py-20 sm:py-28 bg-[#FFFCF7]">
  <div class="max-w-6xl mx-auto px-5 sm:px-8">
    <div class="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div class="relative order-2 md:order-1">
        <div class="absolute -top-4 -left-4 w-full h-full border-2 border-[#E0D5C3] rounded-2xl"></div>
        <img src="${esc(site.about.image)}" alt="${esc(site.about.title)}" class="relative w-full h-[420px] sm:h-[520px] object-cover rounded-2xl shadow-xl" />
        <div class="absolute -bottom-5 -right-2 sm:right-6 bg-[#B8742C] text-white rounded-xl px-5 py-4 shadow-lg">
          <p class="font-serif text-3xl font-bold leading-none">${esc(site.business.yearsInBusiness)}</p>
          <p class="text-xs tracking-wider uppercase mt-1 text-white/85">Years Cooking</p>
        </div>
      </div>
      <div class="order-1 md:order-2">
        <p class="text-[#B8742C] font-sans text-sm tracking-[0.2em] uppercase mb-3">Our Story</p>
        <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-6">${esc(site.about.title)}</h2>
        <div class="space-y-4">
          ${site.about.paragraphs.map((p) => `<p class="text-[#4A4A4A] text-base sm:text-lg leading-[1.7]">${esc(p)}</p>`).join('\n          ')}
        </div>
      </div>
    </div>${videoBlock}
  </div>
</section>`;
};

const stats = () => `
<section class="py-14 sm:py-16 bg-[#1A1A1A]">
  <div class="max-w-6xl mx-auto px-5 sm:px-8">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      ${site.stats
        .map(
          (s) => `<div class="text-center group">
        <p class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E8B86D] mb-2 group-hover:scale-110 transition-transform duration-300">${esc(s.value)}</p>
        <p class="text-white/70 text-xs sm:text-sm tracking-wide uppercase">${esc(s.label)}</p>
      </div>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;

const events = () => `
<section id="events" class="py-20 sm:py-28 bg-[#F5EDE0]">
  <div class="max-w-7xl mx-auto px-5 sm:px-8">
    <div class="text-center mb-12 sm:mb-16">
      <p class="text-[#B8742C] font-sans text-sm tracking-[0.2em] uppercase mb-3">Event Portfolio</p>
      <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-4">Catering for Every Occasion</h2>
      <p class="text-[#4A4A4A] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">From grand celebrations to intimate dinners, we bring exceptional food and service to every event.</p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${site.eventTypes
        .map(
          (e) => `<article class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div class="relative h-56 overflow-hidden">
          <img src="${esc(e.image)}" alt="${esc(e.title)}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        <div class="p-6">
          <h3 class="font-serif text-xl font-bold text-[#1A1A1A] mb-2">${esc(e.title)}</h3>
          <p class="text-[#6A6A6A] text-sm leading-relaxed mb-4">${esc(e.description)}</p>
          <div class="flex items-center gap-2 text-[#B8742C]">
            ${icon('users', 'w-4 h-4')}
            <span class="text-sm font-semibold">${esc(e.stat)}</span>
          </div>
        </div>
      </article>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;

// Bento layout for exactly 5 images (same classes as the React version).
const tileClasses = [
  'col-span-2 aspect-[3/2] sm:col-span-6',
  'col-span-2 aspect-[3/2] sm:col-span-6',
  'sm:col-span-4 aspect-[4/5]',
  'sm:col-span-4',
  'col-span-2 aspect-[4/5] sm:col-span-4 sm:aspect-auto',
];
const gallery = () => {
  const g = site.gallery;
  return `
<section id="gallery" class="py-20 sm:py-28 bg-[#1A1A1A]">
  <div class="max-w-6xl mx-auto px-5 sm:px-8">
    <div class="text-center mb-12 sm:mb-16">
      <p class="text-[#E8B86D] font-sans text-sm tracking-[0.2em] uppercase mb-3">${esc(g.eyebrow)}</p>
      <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">${esc(g.heading)}</h2>
      <p class="text-white/75 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">${esc(g.intro)}</p>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-12 gap-3 sm:gap-4">
      ${g.images
        .slice(0, 5)
        .map(
          (img, i) => `<figure class="group relative overflow-hidden rounded-2xl bg-[#2A2A2A] ${tileClasses[i]}">
        <img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </figure>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;
};

const iconMap = { ChefHat: 'chef-hat', Leaf: 'leaf', Users: 'users', Flame: 'flame', CalendarHeart: 'calendar-heart', Award: 'award' };
const whyUs = () => `
<section id="why-us" class="py-20 sm:py-28 bg-[#FFFCF7]">
  <div class="max-w-7xl mx-auto px-5 sm:px-8">
    <div class="text-center mb-12 sm:mb-16">
      <p class="text-[#B8742C] font-sans text-sm tracking-[0.2em] uppercase mb-3">Why Choose Us</p>
      <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight">The Gabe Difference</h2>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${site.whyUs
        .map(
          (item) => `<div class="group bg-[#F5EDE0] hover:bg-white rounded-2xl p-7 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-[#E0D5C3]">
        <div class="w-12 h-12 rounded-xl bg-[#B8742C]/10 flex items-center justify-center mb-5 group-hover:bg-[#B8742C] transition-colors duration-300">
          ${icon(iconMap[item.icon] || 'chef-hat', 'w-6 h-6 text-[#B8742C] group-hover:text-white transition-colors duration-300')}
        </div>
        <h3 class="font-serif text-lg font-bold text-[#1A1A1A] mb-2">${esc(item.title)}</h3>
        <p class="text-[#6A6A6A] text-sm leading-relaxed">${esc(item.description)}</p>
      </div>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;

const monthlySpecial = () => {
  const s = site.monthlySpecial;
  const ctaHref = s.ctaTarget.startsWith('#') ? s.ctaTarget : `#${s.ctaTarget}`;
  return `
<section id="monthly-special" class="relative overflow-hidden py-20 sm:py-28 bg-[#1A1A1A]">
  <div class="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#B8742C]/20 blur-3xl" aria-hidden="true"></div>
  <div class="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#E8B86D]/10 blur-3xl" aria-hidden="true"></div>
  <div class="relative max-w-7xl mx-auto px-5 sm:px-8">
    <div class="text-center mb-10 sm:mb-14">
      <p class="text-[#E8B86D] font-sans text-sm tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2">${icon('sparkles', 'w-4 h-4')} ${esc(s.eyebrow)}</p>
      <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">${esc(s.heading)}</h2>
      <p class="mt-4 text-white/65 max-w-2xl mx-auto leading-relaxed">${esc(s.intro)}</p>
    </div>

    <div class="grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl transition-all duration-500 hover:border-[#E8B86D]/40 hover:shadow-[#B8742C]/10">
      <div class="flex items-center justify-center p-4 sm:p-6">
        <button type="button" id="special-open" aria-label="View larger: ${esc(s.imageAlt)}" class="group block overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10 cursor-zoom-in">
          <img src="${esc(s.image)}" alt="${esc(s.imageAlt)}" loading="lazy" class="block w-auto max-w-full max-h-[520px] sm:max-h-[560px] transition-transform duration-500 group-hover:scale-[1.03]" />
        </button>
      </div>
      <div class="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        <div class="mb-5">
          <div class="inline-flex items-center gap-2 rounded-full bg-[#E8B86D] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">${icon('calendar-heart', 'w-4 h-4')} ${esc(s.badge)}</div>
        </div>
        <p class="text-[#E8B86D] text-xs font-semibold tracking-[0.2em] uppercase mb-3">${esc(s.monthLabel)}</p>
        <h3 class="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">${esc(s.title)}</h3>
        <p class="text-white/70 leading-relaxed mb-5">${esc(s.description)}</p>
        ${s.offerDetails ? `<p class="text-white/45 text-sm mb-7">${esc(s.offerDetails)}</p>` : ''}
        <a href="${esc(ctaHref)}" class="inline-flex w-fit items-center justify-center rounded-xl bg-[#B8742C] px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A06420] hover:shadow-lg hover:shadow-[#B8742C]/20">${esc(s.ctaText)}</a>
      </div>
    </div>
  </div>

  <div id="special-lightbox" hidden role="dialog" aria-modal="true" aria-label="Enlarged image" class="fixed inset-0 z-[100] items-center justify-center bg-black/90 p-4">
    <button type="button" id="special-close" aria-label="Close" class="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
      ${icon('x', 'w-6 h-6')}
    </button>
    <img src="${esc(s.image)}" alt="${esc(s.imageAlt)}" id="special-lightbox-img" class="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl" />
  </div>
</section>`;
};

const revealBtn = (type, cls, iconCls = 'w-4 h-4') => {
  const label = type === 'phone' ? 'Tap to show phone number' : 'Tap to show email';
  return `<button type="button" data-reveal="${type}" data-class="${esc(cls)}" data-icon-class="${esc(iconCls)}" class="flex items-center gap-2 text-left underline decoration-dotted underline-offset-4 ${cls}">${icon(type === 'phone' ? 'phone' : 'mail', iconCls)}${label}</button>`;
};

const fieldLabel = (iconName, text, required) =>
  `<label class="block text-sm font-medium text-[#3A3A3A] mb-1.5"><span class="flex items-center gap-1.5">${icon(iconName, 'w-4 h-4')}${text}${required ? '<span class="text-red-500">*</span>' : ''}</span></label>`;
const inputCls =
  'w-full bg-[#F8F5F0] border border-[#E0D5C3] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B8742C]/40 focus:border-[#B8742C] transition-all';

const contact = () => `
<section id="contact" class="py-20 sm:py-28 bg-[#F5EDE0]">
  <div class="max-w-5xl mx-auto px-5 sm:px-8">
    <div class="text-center mb-10 sm:mb-14">
      <p class="text-[#B8742C] font-sans text-sm tracking-[0.2em] uppercase mb-3">Get In Touch</p>
      <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-4">Plan Your Event</h2>
      <p class="text-[#4A4A4A] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">Tell us about your event and get an instant quote. We'll review your request and get back to you shortly.</p>
    </div>

    <div class="grid lg:grid-cols-5 gap-6 lg:gap-8">
      <div class="lg:col-span-2 order-2 lg:order-1">
        <div class="bg-[#1A1A1A] rounded-2xl p-7 h-full flex flex-col justify-center">
          <h3 class="font-serif text-xl font-bold text-white mb-2">Instant Quote Estimate</h3>
          <p class="text-white/60 text-sm mb-6 leading-relaxed">Select your event type and number of guests to see an estimated range. Final pricing is customized to your specific needs.</p>
          <div class="bg-white/5 rounded-xl p-6 text-center">
            <div id="quote-empty">
              <p class="text-white/40 text-sm leading-relaxed py-4">Fill in the event type and guest count to see your estimated quote.</p>
            </div>
            <div id="quote-result" hidden>
              <p class="text-white/50 text-xs tracking-wider uppercase mb-2">Estimated Total</p>
              <p id="quote-amount" class="font-serif text-4xl sm:text-5xl font-bold text-[#E8B86D]"></p>
              <p class="text-white/40 text-xs mt-3">Includes base fee + per-guest pricing. Final quote may vary based on menu selections and logistics.</p>
            </div>
          </div>
          <div class="mt-6 space-y-3 text-sm">
            ${revealBtn('phone', 'text-white/70 hover:text-[#E8B86D] transition-colors', 'w-4 h-4 text-[#E8B86D]')}
            ${revealBtn('email', 'text-white/70 hover:text-[#E8B86D] transition-colors', 'w-4 h-4 text-[#E8B86D]')}
          </div>
        </div>
      </div>

      <div class="lg:col-span-3 order-1 lg:order-2">
        <form id="quote-form" class="bg-white rounded-2xl p-7 shadow-md space-y-5">
          <div id="form-success" hidden class="text-center py-10">
            ${icon('circle-check', 'w-16 h-16 text-green-600 mx-auto mb-4')}
            <h3 class="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">Inquiry Submitted!</h3>
            <p class="text-[#6A6A6A] text-sm leading-relaxed max-w-sm mx-auto">We've received your details. Gabe will personally review your request and respond within 24 hours.</p>
            <button type="button" id="form-again" class="mt-6 text-[#B8742C] font-semibold text-sm hover:underline">Submit another inquiry</button>
          </div>

          <div id="form-fields" class="space-y-5">
            <div id="form-error" hidden>
              <div class="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                ${icon('circle-alert', 'w-5 h-5 text-red-600 flex-shrink-0')}
                <p id="form-error-text" class="text-red-700 text-sm" role="alert"></p>
              </div>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                ${fieldLabel('user', 'Full Name', true)}
                <input id="f-name" name="name" type="text" required placeholder="Jane Doe" class="${inputCls}" />
              </div>
              <div>
                ${fieldLabel('phone', 'Phone', true)}
                <input id="f-phone" name="phone" type="tel" required placeholder="(555) 123-4567" class="${inputCls}" />
              </div>
            </div>

            <div>
              ${fieldLabel('mail', 'Email', true)}
              <input id="f-email" name="email" type="email" required placeholder="jane@email.com" class="${inputCls}" />
            </div>

            <div class="space-y-3 rounded-xl border border-[#E0D5C3] bg-[#FFFCF7] p-4">
              <p class="text-sm font-semibold text-[#1A1A1A]">Communication preferences</p>
              <label class="flex items-start gap-3 text-sm leading-relaxed text-[#4A4A4A]">
                <input id="c-phone" type="checkbox" required class="mt-1 h-4 w-4 accent-[#B8742C]" />
                <span>I agree to be contacted by phone or text about this inquiry and event arrangements. <span class="text-red-600">*</span></span>
              </label>
              <label class="flex items-start gap-3 text-sm leading-relaxed text-[#4A4A4A]">
                <input id="c-email" type="checkbox" required class="mt-1 h-4 w-4 accent-[#B8742C]" />
                <span>I agree to receive emails about this inquiry, quotes, and event arrangements. <span class="text-red-600">*</span></span>
              </label>
              <label class="flex items-start gap-3 text-sm leading-relaxed text-[#4A4A4A]">
                <input id="c-offers" type="checkbox" class="mt-1 h-4 w-4 accent-[#B8742C]" />
                <span>Yes, I’d also like occasional emails about monthly specials, seasonal offers, and promotions. This is optional and I can unsubscribe at any time.</span>
              </label>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label for="f-type" class="block text-sm font-medium text-[#3A3A3A] mb-1.5">Event Type <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select id="f-type" name="event_type" required class="${inputCls} appearance-none cursor-pointer">
                    <option value="">Select event type...</option>
                    ${Object.entries(site.quotePricing)
                      .map(([k, p]) => `<option value="${esc(k)}">${esc(p.label)}</option>`)
                      .join('\n                    ')}
                  </select>
                </div>
              </div>

              <div id="date-picker" class="relative">
                ${fieldLabel('calendar', 'Event Date', false)}
                <button type="button" id="date-btn" aria-haspopup="dialog" aria-expanded="false" class="w-full text-left bg-[#F8F5F0] border border-[#E0D5C3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8742C]/40 focus:border-[#B8742C] transition-all text-[#8A8A8A]">Select a date...</button>
                <div id="date-pop" hidden role="dialog" aria-label="Choose event date" class="absolute z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white border border-[#E0D5C3] rounded-2xl shadow-xl p-4">
                  <div class="flex items-center justify-between mb-3">
                    <button type="button" id="date-prev" aria-label="Previous month" class="p-1.5 rounded-lg hover:bg-[#F8F5F0] disabled:opacity-30 disabled:hover:bg-transparent">${icon('chevron-left', 'w-4 h-4')}</button>
                    <span id="date-title" class="text-sm font-semibold text-[#1A1A1A]"></span>
                    <button type="button" id="date-next" aria-label="Next month" class="p-1.5 rounded-lg hover:bg-[#F8F5F0]">${icon('chevron-right', 'w-4 h-4')}</button>
                  </div>
                  <div class="grid grid-cols-7 gap-1 text-center text-xs text-[#6A6A6A] mb-1">
                    ${['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => `<div>${d}</div>`).join('')}
                  </div>
                  <div id="date-grid" class="grid grid-cols-7 gap-1"></div>
                  <button type="button" id="date-clear" hidden class="mt-3 text-xs text-[#6A6A6A] hover:text-[#B8742C] underline">Clear date</button>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#3A3A3A] mb-1.5"><span class="flex items-center gap-1.5">${icon('users', 'w-4 h-4')}Number of Guests<span id="guests-star" hidden class="text-red-500">*</span></span></label>
              <input id="f-guests" name="guests" type="number" placeholder="e.g. 75" class="${inputCls}" />
              <p id="guests-hint" hidden class="text-xs text-[#6A6A6A] mt-1.5"></p>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#3A3A3A] mb-1.5"><span class="flex items-center gap-1.5">${icon('message-square', 'w-4 h-4')}Additional Details</span></label>
              <textarea id="f-message" name="message" rows="4" placeholder="Tell us about your event vision, dietary preferences, specific requests..." class="w-full bg-[#F8F5F0] border border-[#E0D5C3] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B8742C]/40 focus:border-[#B8742C] transition-all resize-none"></textarea>
            </div>

            <button id="form-submit" type="submit" class="w-full bg-[#B8742C] hover:bg-[#A06420] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2">
              <span id="submit-label">Get My Quote &amp; Submit</span>
              <span id="submit-busy" hidden><span class="flex items-center gap-2">${icon('loader-circle', 'w-5 h-5 animate-spin')}Submitting...</span></span>
            </button>
            <noscript><p class="text-sm text-red-700">This form needs JavaScript. Please enable it, or reach us through Instagram.</p></noscript>
          </div>

          <!-- Honeypot field for spam bots - keep hidden, do not remove -->
          <div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden">
            <label>Leave this field empty
              <input id="f-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off" />
            </label>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>`;

const footer = () => {
  const areas = site.business.serviceAreas;
  const list = areas.length > 1 ? `${areas.slice(0, -1).join(', ')} and ${areas[areas.length - 1]}` : areas.join('');
  return `
<footer class="bg-[#1A1A1A] py-12 sm:py-16">
  <div class="max-w-7xl mx-auto px-5 sm:px-8">
    <div class="flex flex-col items-center text-center">
      <div class="flex items-center gap-2 mb-4">
        ${icon('flame', 'w-7 h-7 text-[#B8742C]', { strokeWidth: 2.2 })}
        <span class="font-serif text-xl font-bold text-white">${esc(site.business.name)}</span>
      </div>
      <p class="text-white/60 text-sm max-w-md leading-relaxed mb-6">${esc(site.footer.text)}</p>
      <p class="text-white/50 text-sm max-w-lg leading-relaxed mb-6">Serving ${esc(list)}, plus surrounding areas.</p>
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-6 text-sm">
        ${revealBtn('phone', 'text-white/70 hover:text-[#E8B86D] transition-colors')}
        ${revealBtn('email', 'text-white/70 hover:text-[#E8B86D] transition-colors')}
      </div>
      <div class="flex gap-4 mb-6">
        <a href="${esc(site.business.instagram)}" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/10 hover:bg-[#B8742C] flex items-center justify-center transition-colors" aria-label="Instagram">
          ${icon('instagram', 'w-5 h-5 text-white')}
        </a>
      </div>
      <div class="w-full border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p class="text-white/40 text-xs">&copy; <span id="year">${new Date().getFullYear()}</span> ${esc(site.business.name)}. All rights reserved.</p>
        <p class="text-white/40 text-xs">🌶️Site made spicy by🌶️: <a href="https://ctechsolution.tech" target="_blank" rel="noopener noreferrer" class="hover:underline transition-colors hover:text-white/70">Community Tech Solutions</a></p>
      </div>
    </div>
  </div>
</footer>`;
};

// ---------- head / SEO ----------
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  additionalType: 'https://schema.org/CateringService',
  name: site.business.name,
  alternateName: `${site.business.name} Private Chef & Catering`,
  description:
    'Private chef, event catering, custom meal prep, and private event bar services for weddings, quinceañeras, corporate events, and intimate gatherings.',
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og-image.jpg`,
  logo: `${SITE_URL}/og-image.jpg`,
  sameAs: [site.business.instagram],
  servesCuisine: ['Mexican', 'Southern', 'Mediterranean', 'Asian'],
  priceRange: '$$',
  foundingDate: '2013',
  areaServed: site.business.serviceAreas.map((c) => ({ '@type': 'City', name: `${c}, Washington` })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: ['Event Catering', 'Custom Meal Prep', 'Private/Personal Chef Experience', 'Private Event Bar Services'].map((n) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: n },
    })),
  },
};

const title = 'Chef Who Drinks Whiskey | Private Chef & Catering in Yakima Valley, Tri-Cities & Walla Walla';
const shortTitle = 'Chef Who Drinks Whiskey | Private Chef & Catering';

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="wine.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#1A1A1A" />
    <title>${esc(title)}</title>
    <meta name="description" content="Private chef, event catering, and custom meal prep in the Yakima Valley, Tri-Cities and Walla Walla. Weddings, quinceañeras, corporate events, and intimate gatherings. Get a free quote today." />
    <link rel="canonical" href="${SITE_URL}/" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(site.business.name)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${SITE_URL}/" />
    <meta property="og:title" content="${esc(shortTitle)}" />
    <meta property="og:description" content="Private chef, event catering, and meal prep for weddings, quinceañeras, corporate events, and intimate gatherings in the Yakima Valley and Tri-Cities." />
    <meta property="og:image" content="${SITE_URL}/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(site.business.name)} private chef and catering" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(shortTitle)}" />
    <meta name="twitter:description" content="Private chef, event catering, and meal prep in the Yakima Valley and Tri-Cities. Get a free quote." />
    <meta name="twitter:image" content="${SITE_URL}/og-image.jpg" />

    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="min-h-screen bg-[#FFFCF7] overflow-x-hidden">
      ${navbar()}
      <main>
        ${hero()}
        ${about()}
        ${stats()}
        ${events()}
        ${gallery()}
        ${whyUs()}
        ${monthlySpecial()}
        ${contact()}
      </main>
      ${footer()}
    </div>

    <script id="site-data" type="application/json">${JSON.stringify({
      formspreeEndpoint: site.formspree.endpoint,
      phoneEncoded: site.business.phoneEncoded,
      emailEncoded: site.business.emailEncoded,
      quotePricing: site.quotePricing,
      blockedDates,
    }).replace(/</g, '\\u003c')}</script>
    <script src="main.js" defer></script>
  </body>
</html>
`;

// ---------- write /dist ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(__dirname, 'public'), DIST, { recursive: true });
fs.rmSync(path.join(DIST, 'PLACE-VIDEO-HERE.txt'), { force: true });
fs.writeFileSync(path.join(DIST, 'index.html'), page);
fs.copyFileSync(path.join(__dirname, 'src', 'client.js'), path.join(DIST, 'main.js'));

// sitemap/robots: keep your domain in sync if SITE_URL is set
for (const f of ['sitemap.xml', 'robots.txt']) {
  const p = path.join(DIST, f);
  if (fs.existsSync(p)) fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/https:\/\/YOUR-DOMAIN\.com/g, SITE_URL));
}

execSync(
  `npx tailwindcss -c tailwind.config.js -i src/input.css -o dist/styles.css --minify`,
  { cwd: __dirname, stdio: 'inherit' }
);

console.log(`\nBuilt ${path.relative(process.cwd(), DIST) || 'dist'}/  (${blockedDates.length} blocked date${blockedDates.length === 1 ? '' : 's'})`);
