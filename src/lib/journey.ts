/**
 * El recorrido de un lead (marca "Capas", 2026-11-11): un anuncio de Instagram
 * abre WhatsApp, el agente califica a Lucía, agenda el test drive y la ficha
 * del lead se completa sola. Es interfaz de producto, no una imagen.
 *
 * Una sola fuente para las dos mitades:
 * - El build (Journey.astro) imprime el estado FINAL: lo que ve quien tiene
 *   JavaScript apagado o `prefers-reduced-motion`, y lo que lee un buscador.
 * - El script del cliente (src/scripts/journey.ts) arma el estado inicial y lo
 *   anima paso a paso.
 *
 * Todo es un ejemplo ilustrativo (Automotores Demo, Lucía, Carla): ningún dato
 * de un cliente real. Reglas del gate: sin porcentajes, sin precios, tuteo.
 */

/** [rótulo del paso, frase grande, explicación]. */
export const STEPS: ReadonlyArray<readonly [string, string, string]> = [
  ['Anuncio', 'Lucía ve el anuncio en Instagram a las 23:40.', 'El anuncio de la SUV 2026 aparece en su feed.'],
  ['Clic a WhatsApp', 'Toca Enviar mensaje y cae en WhatsApp.', 'El anuncio abre el chat con el auto ya cargado.'],
  ['Responde', 'El agente responde en 4 segundos.', 'Sin esperar al lunes ni a un vendedor libre.'],
  ['Califica', 'Pregunta lo que el vendedor necesita saber.', 'Nombre, versión, forma de pago y urgencia.'],
  ['Agenda', 'Ofrece horarios y agenda el test drive.', 'Con vendedora asignada y dirección.'],
  ['Meta aprende', 'Meta recibe el test drive y optimiza la campaña.', 'La campaña busca gente que agenda, no solo clics.'],
  ['Recuerda', 'Recordatorio por mail y por WhatsApp.', 'Un día antes, por los dos canales.'],
  ['Confirma', 'Lucía confirma con un botón. Carla la espera.', 'El test drive llega confirmado al tablero.'],
];

/** Duración de cada paso en ms (barras de progreso del layout C). */
export const STEP_MS = [2200, 1800, 3600, 9800, 5200, 2600, 5200, 3200];

/** [clave, rótulo, valor] de la ficha del lead. */
export const FIELDS: ReadonlyArray<readonly [string, string, string]> = [
  ['origen', 'Origen', 'Anuncio IG · SUV 2026'],
  ['nombre', 'Nombre', 'Lucía'],
  ['modelo', 'Modelo', 'SUV 2026 automática'],
  ['pago', 'Pago', 'Financiado'],
  ['urgencia', 'Urgencia', 'Este mes'],
  ['interes', 'Interés', '<span class="st">Caliente</span>'],
  ['test', 'Test drive', 'Sáb 10:00'],
  ['vend', 'Vendedora', 'Carla'],
  ['meta', 'Meta', 'Evento Schedule enviado'],
  ['recor', 'Recordatorio', 'Mail y WhatsApp'],
  ['estado', 'Estado', '<span class="st">Confirmado</span>'],
];

const T = (t: string) => `<span class="t">${t}</span>`;

/** Los últimos mensajes de la conversación (estado final). */
const FINAL_MESSAGES = [
  `<div class="b ag on">Listo, Lucía. Te esperamos el sábado a las 10:00 en Av. Demo 1234. Te atiende Carla.${T('23:43')}</div>`,
  `<div class="day on">Viernes</div>`,
  `<div class="b ag on">Hola, Lucía. Mañana a las 10:00 es tu test drive de la SUV 2026.<span class="btns"><span class="hit">Confirmar</span><span>Reprogramar</span></span>${T('18:00')}</div>`,
  `<div class="b me on">Confirmar${T('18:02')}</div>`,
  `<div class="b ag on">Confirmado. Carla te espera el sábado a las 10:00.${T('18:02')}</div>`,
].join('');

export function phoneHTML(final = false): string {
  return `<div class="phone"><div class="scr">
 <div class="sbar"><span class="clock">${final ? '18:02' : '23:40'}</span><i></i></div>
 <div class="app ig"><div class="ah">Instagram<span class="k">Patrocinado</span></div>
  <div class="ph"><span class="av">AD</span><span><b>automotoresdemo</b><small>Publicidad</small></span></div>
  <div class="ad"><div><p class="k">Automotores Demo</p><p class="big">SUV<br>2026</p><p class="sub">Automática. Financiación en 36 cuotas.</p></div>
   <div class="row"><span class="tag">TEST DRIVE ESTE FINDE</span><span class="spec"><span>1.5 TURBO</span><span>CVT</span></span></div></div>
  <div class="cta"><span>Enviar mensaje de WhatsApp</span><span>›</span></div>
  <div class="capt"><b>automotoresdemo</b> <span>Escríbenos y agenda tu test drive.</span></div></div>
 <div class="app wa"><div class="ah"><span class="back">‹</span><span class="av">AD</span><span><b>Automotores Demo</b><small>Cuenta de empresa</small></span></div>
  <div class="msgs">${final ? FINAL_MESSAGES : '<div class="sp"></div>'}<div class="typing"><i></i><i></i><i></i></div></div>
  <div class="inp">Mensaje</div></div>
 <div class="notif"><p class="k"><span>Mail</span><span>ahora</span></p><b>Automotores Demo</b>Tu test drive es mañana a las 10:00. Te atiende Carla.</div>
 <span class="tap"></span>
</div></div>`;
}

export function recHTML(final = false): string {
  const rows = FIELDS.map(
    ([k, label, value]) =>
      `<div class="r${final ? ' on' : ''}" data-f="${k}"><span class="k">${label}</span><span class="v">${final ? value : '-'}</span></div>`,
  ).join('');
  return `<div class="rec"><div class="rh"><b>Lead 4821</b><span class="k">Ficha en vivo</span></div><div class="rows">${rows}</div></div>`;
}

function bigHTML(final = false): string {
  const i = final ? STEPS.length - 1 : 0;
  const [label, cap, exp] = STEPS[i];
  const last = FIELDS[FIELDS.length - 1];
  return `<div class="big"><p class="num">${String(i + 1).padStart(2, '0')} / 08 · ${label.toUpperCase()}</p><p class="cap">${cap}</p><p class="exp">${exp}</p><div class="bars">${STEPS.map(() => `<i${final ? ' class="done"' : ''}></i>`).join('')}</div><p class="last"><span class="k">Capturado</span><span class="lv">${final ? `${last[1]}: ${last[2]}` : '-'}</span></p></div>`;
}

/** Layout A = teléfono + ficha (héroe). Layout C = una frase por paso + teléfono (Cómo funciona). */
export function journeyHTML(layout: 'A' | 'C', final = false): string {
  return layout === 'A' ? phoneHTML(final) + recHTML(final) : bigHTML(final) + phoneHTML(final);
}
