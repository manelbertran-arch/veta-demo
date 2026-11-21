/* Veta demo · pantallas · operaciones.js · ronda 6 · paquete D (P3) · pulido C
   G17 · Operaciones · #/operaciones — todas las operaciones de la oficina, con nombres (decisión de Manel, 21-nov).
   En el móvil, dos líneas por operación: “Marta Puig · Compra en Gràcia” / “Laura · Contacto (1 de 5) · Toca: contestar a Marta”.
   Los cuatro rótulos (Quién la lleva, Cómo va, Lo último que pasó, Qué toca ahora) van solo dentro de la operación (G18) y,
   en ordenador, en la cabecera de la tabla. Se abre en “Hay que mirarlas”: solo lo que pide que alguien haga algo hoy
   (sin contestar, una queja, parada o sin nadie). Las demás, plegadas tras “Ver las otras N” o en el filtro “Todas”.
   Las de Teresa tienen dueña (está de baja): filtro propio, no “No la lleva nadie”. Datos y cuentas: js/datos/r6-direccion.js. */
(function () {
  'use strict';
  const esc = VETA.esc, X = VETA.dir, UI = VETA.UI;
  let filtro = 'mirar', otras = false;
  const FILTROS = [['mirar', 'Need a look'], ['todas', 'All'], ['nadie', 'Nobody is handling it'], ['teresa', 'Teresa\'s, off sick'], ['persona', 'By person']];

  // “Toca: contestar a Marta” (en minúscula, salvo si empieza por el nombre de alguien del equipo)
  const tocaDe = o => {
    const t = String(o.tocaCorto || o.toca || '').replace(/\.$/, '');
    if (!t || /^Nada\b/.test(t)) return '';
    const propio = Object.keys(VETA.datos.personas || {}).some(id => t.indexOf(X.persona(id).corto + ' ') === 0);
    return 'Next: ' + (propio ? t : t.charAt(0).toLowerCase() + t.slice(1));
  };
  // lo que pasa, solo en las que hay que mirar y en las de Teresa: rojo si alguien espera respuesta; lo demás, neutro
  // si quien la lleva ya contestó, una nota gris en su lugar (“Laura le contestó hoy, 9:41”): se ve que contestó y cuándo, nunca el mensaje
  const pasa = (o, cls) => (o.mirar || o.deBaja) && o.aviso ? `<span class="${cls} d-tono-${o.aviso.tono}">${VETA.ic(o.aviso.tono === 'rojo' ? 'aviso' : 'reloj', 18)}<span>${esc(o.aviso.texto)}</span></span>`
    : o.nota ? `<span class="${cls} d-tono-neutro d-op-nota">${VETA.ic('check', 18)}<span>${esc(o.nota)}</span></span>` : '';

  // móvil: dos líneas por operación (y una tercera, corta, solo si hay que mirarla)
  const linea = (o, conQuien) => {
    const quien = conQuien === false ? '' : (o.persona ? esc(o.persona.corto) + (o.lleva === VETA.yo().id ? ' (you)' : '') : 'Nobody');
    const dos = [quien, esc(o.comoCorto), esc(tocaDe(o))].filter(Boolean).join(' · ');
    return `<button type="button" class="d-op d-op-m" data-ir="operacion/${esc(o.id)}">${VETA.av(o.id, 40, {nombre: o.nombre})}` +
      `<span class="d-op-tc"><span class="d-op-1"><b>${esc(o.nombre)}</b> · ${esc(o.texto)}</span><span class="d-op-2">${dos}</span>${pasa(o, 'd-op-que')}</span>` +
      `<span class="fila-chev">${VETA.ic('chev', 16)}</span></button>`;
  };
  // ordenador: una fila de tabla por operación; los rótulos van en la cabecera
  const fila = (o, conQuien) => {
    const quien = o.persona ? `${VETA.av(o.lleva, 32)}<span>${esc(o.persona.nombre)}${o.lleva === VETA.yo().id ? ' (you)' : ''}</span>` : `<span class="d-op-nadie">Nobody</span>`;
    return `<button type="button" class="d-op" data-ir="operacion/${esc(o.id)}">` +
      `<span class="d-op-cab"><span class="d-op-tc"><span class="d-op-n">${esc(o.nombre)}</span><span class="d-op-q">${esc(o.texto)}</span></span></span>` +
      `<span class="d-op-d">` +
      (conQuien !== false ? `<span class="d-op-c d-op-lleva"><span class="d-op-v d-op-quien">${quien}</span></span>` : '') +
      `<span class="d-op-c"><span class="d-op-v">${esc(o.como)}</span></span>` +
      `<span class="d-op-c"><span class="d-op-v">${o.ultimo ? `<b>${esc(o.ultimo.cuando)}</b> · ${esc(o.ultimo.texto)}` : '—'}</span></span>` +
      `<span class="d-op-c"><span class="d-op-v">${esc(o.toca || '—')}</span></span></span>` +
      (o.nota ? '' : pasa(o, 'd-op-aviso')) + `</button>`;   // en la tabla, “Lo último que pasó” ya dice que contestó y cuándo
  };
  const cabecera = conQuien => `<div class="d-op-th" aria-hidden="true"><span>Deal</span>${conQuien !== false ? '<span>Who handles it</span>' : ''}<span>How it is going</span><span>What happened last</span><span>What is next</span></div>`;
  const lista = (l, conQuien) => {
    const ord = VETA.ordenador();
    return `<div class="d-ops${ord ? '' : ' d-ops-m'}${conQuien === false ? ' d-ops-sinq' : ''}">${ord ? cabecera(conQuien) : ''}${l.map(o => (ord ? fila : linea)(o, conQuien)).join('')}</div>`;
  };

  VETA.pantalla('G17', {
    titulo: 'Deals',
    ancha: true,
    guia: ['Here you see the office\'s deals. First, the ones to look at today.', 'You tap one to see who handles it, how it is going and what has happened.', 'This way you know how each one is going without having to ask.'],
    pinta: () => {
      const todas = X.ops(), ojo = todas.filter(o => o.mirar), resto = todas.filter(o => !o.mirar);
      const nadie = todas.filter(o => !o.lleva), teresa = todas.filter(o => o.deBaja);
      const N = {mirar: ojo.length, todas: todas.length, nadie: nadie.length, teresa: teresa.length};
      if (filtro === 'teresa' && !teresa.length) filtro = 'mirar';
      // una línea, la misma frase que en Equipo; lo de Teresa se explica en su filtro
      let h = `<p class="d-ops-intro" data-i="0"><b>${todas.length} deals</b> · ${ojo.length ? `<b>${ojo.length}</b> ${ojo.length === 1 ? 'needs a look' : 'need a look'} today` : 'none to look at today'}</p>`;
      h += `<div class="d-filtros" role="group" aria-label="Which deals to see" data-i="0">${FILTROS.filter(([id]) => id !== 'teresa' || teresa.length).map(([id, t]) =>
        `<button type="button" class="d-filtro" data-accion="filtro" data-valor="${id}" aria-pressed="${filtro === id}">${esc(t)}${N[id] != null ? ` <b>${N[id]}</b>` : ''}</button>`).join('')}</div>`;
      if (filtro === 'persona') {
        const grupos = {};
        todas.forEach(o => { const k = o.lleva || '_'; (grupos[k] = grupos[k] || []).push(o); });
        const claves = Object.keys(grupos).sort((a, b) => a === '_' ? -1 : b === '_' ? 1 : X.persona(a).nombre.localeCompare(X.persona(b).nombre, 'es'));
        h += claves.map((k, n) => {
          const p = k === '_' ? null : X.persona(k), l = grupos[k], baja = l.some(o => o.deBaja);
          const tit = p ? `<button type="button" class="d-op-gt" data-ir="persona/${esc(k)}">${VETA.av(k, 32)}<span>${esc(p.nombre)}${k === VETA.yo().id ? ' (you)' : ''}${baja ? ' · off sick' : ''} · ${l.length}</span><span class="fila-chev">${VETA.ic('chev', 16)}</span></button>`
            : `<h2 class="d-op-gt d-op-gt-q">Nobody is handling it · ${l.length}</h2>`;
          return `<section class="d-op-grupo" data-i="${Math.min(4, n + 1)}">${tit}${lista(l, false)}</section>`;
        }).join('');
      } else if (filtro === 'mirar') {
        h += ojo.length ? `<div data-i="1">${lista(ojo)}</div>` : UI.vacio({titulo: 'None to look at today.', texto: 'Nobody is waiting for a reply and none is stalled.', icono: 'check'});
        // las demás siguen en la página, plegadas: se abren aquí mismo o con “Todas”
        if (resto.length) h += `<div class="d-ops-otras" data-i="2"><button type="button" class="d-ops-mas" data-accion="otras" aria-expanded="${otras}"><span>See the other ${resto.length}</span>` +
          `<span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button><div class="d-ops-resto"${otras ? '' : ' hidden'}>${lista(resto)}</div></div>`;
      } else {
        const l = filtro === 'nadie' ? nadie : filtro === 'teresa' ? teresa : todas;
        h += l.length ? `<div data-i="1">${lista(l)}</div>` : UI.vacio({titulo: 'None.', texto: 'There are no deals like this right now.', icono: 'check'});
        if (filtro === 'teresa') h += `<div class="d-ops-teresa" data-i="2">` + UI.nota({texto: 'Teresa has been off sick since Monday 16. Until you pass on her clients, nobody looks at these deals.', icono: 'info'}) +
          UI.boton({tipo: 'secundario', texto: 'Pass her clients to someone else', ir: 'reparto'}) + `</div>`;
      }
      h += UI.nota({icono: 'candado', texto: 'You see how each deal is going. You do not see what is written with the client or each person\'s notes.', clase: 'd-ops-pie'});
      return h;
    },
    acciones: {
      filtro(ev, el) { filtro = el.dataset.valor; otras = false; VETA.repinta(); },
      otras(ev, el) {
        otras = !otras;
        el.setAttribute('aria-expanded', String(otras));
        const l = el.parentNode.querySelector('.d-ops-resto'); if (l) l.hidden = !otras;
        const s = el.querySelector('span'); if (s) s.textContent = (otras ? 'Hide the others ' : 'See the other ') + (l ? l.querySelectorAll('.d-op').length : '');
      }
    }
  });
})();
