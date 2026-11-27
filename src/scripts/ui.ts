/** Interactions globales — réinitialisées à chaque navigation (View Transitions). */
let cleanups: Array<() => void> = [];

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function header() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const onScroll = () => el.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));

  const btn = document.getElementById('menu-toggle');
  const html = document.documentElement;
  html.classList.remove('menu-open');
  const toggle = (force?: boolean) => {
    const open = html.classList.toggle('menu-open', force);
    btn?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  btn?.addEventListener('click', () => toggle());
  document.querySelectorAll('#mobile-menu a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && toggle(false);
  window.addEventListener('keydown', onKey);
  cleanups.push(() => {
    window.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
  });
}

/** Découpe les titres [data-split] en mots animés */
function splitWords() {
  document.querySelectorAll<HTMLElement>('[data-split]:not([data-split-done])').forEach((el) => {
    const base = Number(el.dataset.splitDelay ?? 0);
    let i = 0;
    const walk = (node: Node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          (child.textContent ?? '').split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.append(document.createTextNode(part));
            const outer = document.createElement('span');
            outer.className = 'split-word';
            const inner = document.createElement('span');
            inner.textContent = part;
            inner.style.setProperty('--delay', `${base + i++ * 55}ms`);
            outer.append(inner);
            frag.append(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    el.dataset.splitDone = '';
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal-split', '');
  });
}

function reveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-split], [data-count]');
  if (reduceMotion()) {
    targets.forEach((t) => t.classList.add('is-visible'));
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add('is-visible');
        if (el.dataset.count !== undefined) countUp(el);
        io.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  targets.forEach((t) => io.observe(t));
  cleanups.push(() => io.disconnect());
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const decimals = Number(el.dataset.decimals ?? 0);
  const fmt = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  if (reduceMotion()) return (el.textContent = fmt.format(target));
  const start = performance.now();
  const dur = 1800;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = fmt.format(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Halo lumineux qui suit le curseur sur les cartes */
function spotlight() {
  const onMove = (e: PointerEvent) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.spotlight');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  document.addEventListener('pointermove', onMove, { passive: true });
  cleanups.push(() => document.removeEventListener('pointermove', onMove));
}

/** Boutons « magnétiques » et inclinaison 3D */
function magnetic() {
  if (reduceMotion() || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = () => (el.style.transform = '');
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
  });
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    };
    const leave = () => (el.style.transform = '');
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
  });
}

/** Parallaxe légère */
function parallax() {
  if (reduceMotion()) return;
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (!items.length) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    items.forEach((el) => {
      const speed = Number(el.dataset.parallax);
      el.style.translate = `0 ${window.scrollY * speed}px`;
    });
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));
}

/** Ligne de progression du processus */
function progressLines() {
  document.querySelectorAll<HTMLElement>('[data-progress]').forEach((wrap) => {
    const bar = wrap.querySelector<HTMLElement>('[data-progress-bar]');
    if (!bar) return;
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.65 - r.top) / r.height));
      bar.style.transform = `scaleY(${p})`;
      wrap.querySelectorAll<HTMLElement>('[data-step]').forEach((s) => {
        const sr = s.getBoundingClientRect();
        s.classList.toggle('is-active', sr.top < vh * 0.65);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', onScroll));
  });
}

export function initUI() {
  cleanups.forEach((c) => c());
  cleanups = [];
  header();
  splitWords();
  reveal();
  spotlight();
  magnetic();
  parallax();
  progressLines();
}
