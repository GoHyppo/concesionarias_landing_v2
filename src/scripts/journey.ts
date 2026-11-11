/**
 * Motor del recorrido animado (portado de BRAND/web/index.html de la marca
 * "Capas"). Arranca cada [data-journey] con el estado inicial y lo reproduce
 * en loop. Se pausa fuera de pantalla y con la pestaña oculta.
 *
 * Con `prefers-reduced-motion: reduce` no hace nada: queda el estado final que
 * imprime el build (Journey.astro).
 */
import { FIELDS, STEPS, STEP_MS, journeyHTML } from '../lib/journey';

type Layout = 'A' | 'C';

function player(root: HTMLElement) {
  const layout = (root.dataset.journey as Layout) || 'A';
  const q = <T extends Element = HTMLElement>(s: string) => root.querySelector(s) as T | null;
  const qa = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s));
  let run = 0;
  let visible = false;

  new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
  }).observe(root);

  const sleep = (ms: number, id: number) =>
    new Promise<void>((res, rej) => {
      let left = ms;
      const t = setInterval(() => {
        if (id !== run) {
          clearInterval(t);
          rej(new Error('stale'));
          return;
        }
        if (visible && !document.hidden) left -= 50;
        if (left <= 0) {
          clearInterval(t);
          res();
        }
      }, 50);
    });

  function step(i: number) {
    const cap = q('.cap');
    if (!cap) return;
    cap.textContent = STEPS[i][1];
    const exp = q('.exp');
    if (exp) exp.textContent = STEPS[i][2];
    const num = q('.num');
    if (num) num.textContent = `${String(i + 1).padStart(2, '0')} / 08 · ${STEPS[i][0].toUpperCase()}`;
    qa('.bars i').forEach((b, j) => {
      b.className = j < i ? 'done' : j === i ? 'on' : '';
      b.style.setProperty('--d', `${STEP_MS[i]}ms`);
    });
  }

  function field(k: string) {
    const f = FIELDS.find((x) => x[0] === k);
    if (!f) return;
    const r = q(`.r[data-f="${k}"]`);
    if (r) {
      const v = r.querySelector('.v');
      if (v) v.innerHTML = f[2];
      r.classList.add('on', 'flash');
      setTimeout(() => r.classList.remove('flash'), 900);
    }
    const lv = q('.lv');
    if (lv) lv.innerHTML = `${f[1]}: ${f[2]}`;
  }

  function tapAt(el: Element | null | undefined) {
    const scr = q('.scr');
    const t = q('.tap');
    if (!el || !scr || !t) return;
    const ph = scr.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    t.style.left = `${r.left - ph.left + r.width / 2}px`;
    t.style.top = `${r.top - ph.top + r.height / 2}px`;
    t.classList.remove('go');
    void t.offsetWidth;
    t.classList.add('go');
    el.classList.add('hit');
  }

  const msgs = () => q('.msgs') as HTMLElement;
  const typing = () => q('.typing') as HTMLElement;
  const scroll = () => {
    const m = msgs();
    m.scrollTo({ top: m.scrollHeight, behavior: 'smooth' });
  };
  function add(html: string, cls: string) {
    const b = document.createElement('div');
    b.className = `b ${cls}`;
    b.innerHTML = html;
    msgs().insertBefore(b, typing());
    requestAnimationFrame(() => b.classList.add('on'));
    scroll();
    return b;
  }
  const T = (t: string) => `<span class="t">${t}</span>`;
  async function agent(id: number, html: string, t: string, wait = 900) {
    typing().classList.add('on');
    msgs().appendChild(typing());
    scroll();
    await sleep(wait, id);
    typing().classList.remove('on');
    return add(html + T(t), 'ag');
  }

  async function play() {
    const id = ++run;
    root.classList.remove('is-final');
    root.innerHTML = journeyHTML(layout, false);
    try {
      const ig = q('.ig') as HTMLElement;
      const wa = q('.wa') as HTMLElement;
      step(0);
      await sleep(1900, id);
      tapAt(q('.cta'));
      await sleep(450, id);
      ig.style.transform = 'translateX(-30%)';
      wa.style.transform = 'none';
      step(1);
      field('origen');
      await sleep(600, id);
      add(
        `<span class="ref"><i></i><small>Anuncio · SUV 2026 automática</small></span><span style="display:block">Hola, quiero más info de la SUV 2026</span>${T('23:40')}`,
        'me',
      );
      await sleep(700, id);
      step(2);
      await agent(id, 'Hola, soy el asistente de Automotores Demo. La SUV 2026 está disponible en 2 versiones. ¿Cómo te llamas?', '23:40', 1200);
      await sleep(1600, id);
      step(3);
      add(`Lucía${T('23:41')}`, 'me');
      field('nombre');
      await sleep(500, id);
      await agent(id, 'Gracias, Lucía. ¿La buscas automática o manual?', '23:41');
      await sleep(900, id);
      add(`Automática${T('23:41')}`, 'me');
      field('modelo');
      await sleep(500, id);
      const pay = await agent(
        id,
        '¿Cómo piensas pagarla?<span class="btns"><span>Contado</span><span>Financiado</span><span>Usado como parte de pago</span></span>',
        '23:41',
      );
      await sleep(1100, id);
      tapAt(pay.querySelectorAll('.btns span')[1]);
      await sleep(450, id);
      add(`Financiado${T('23:42')}`, 'me');
      field('pago');
      await sleep(500, id);
      await agent(id, 'Con anticipo, financias el resto en 36 cuotas. ¿Para cuándo la necesitas?', '23:42');
      await sleep(1000, id);
      add(`Este mes${T('23:42')}`, 'me');
      field('urgencia');
      await sleep(500, id);
      field('interes');
      step(4);
      const slot = await agent(
        id,
        '¿Quieres probarla? Tengo estos horarios:<span class="btns"><span>Sáb 10:00</span><span>Sáb 11:30</span><span>Lun 18:00</span></span>',
        '23:42',
      );
      await sleep(1100, id);
      tapAt(slot.querySelectorAll('.btns span')[0]);
      await sleep(450, id);
      add(`Sáb 10:00${T('23:43')}`, 'me');
      field('test');
      await sleep(400, id);
      await agent(id, 'Listo, Lucía. Te esperamos el sábado a las 10:00 en Av. Demo 1234. Te atiende Carla.', '23:43');
      field('vend');
      await sleep(1400, id);
      step(5);
      field('meta');
      await sleep(2600, id);
      step(6);
      const clock = q('.clock');
      if (clock) clock.textContent = '18:00';
      const d = document.createElement('div');
      d.className = 'day';
      d.textContent = 'Viernes';
      msgs().insertBefore(d, typing());
      requestAnimationFrame(() => d.classList.add('on'));
      scroll();
      q('.notif')?.classList.add('on');
      field('recor');
      await sleep(2200, id);
      q('.notif')?.classList.remove('on');
      await sleep(300, id);
      const rem = await agent(
        id,
        'Hola, Lucía. Mañana a las 10:00 es tu test drive de la SUV 2026.<span class="btns"><span>Confirmar</span><span>Reprogramar</span></span>',
        '18:00',
        500,
      );
      await sleep(1300, id);
      step(7);
      tapAt(rem.querySelectorAll('.btns span')[0]);
      await sleep(450, id);
      add(`Confirmar${T('18:02')}`, 'me');
      await sleep(400, id);
      await agent(id, 'Confirmado. Carla te espera el sábado a las 10:00.', '18:02', 700);
      field('estado');
      await sleep(4200, id);
      play();
    } catch {
      /* corrida cancelada: otra la reemplazó */
    }
  }

  return { play };
}

function start() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-journey]').forEach((el) => player(el).play());
}

start();
