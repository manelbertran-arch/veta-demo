/* Veta demo · pantallas · operaciones.js · ronda 6 · paquete D (P3) · pulido C
   G17 · Operaciones · #/operaciones — todas las operaciones de la oficina, con nombres (decisión de Manel, 21-nov).
   En el móvil, dos líneas por operación: «Marta Puig · Compra en Gràcia» / «Laura · Contacto (1 de 5) · Toca: contestar a Marta».
   Los cuatro rótulos (Quién la lleva, Cómo va, Lo último que pasó, Qué toca ahora) van solo dentro de la operación (G18) y,
   en ordenador, en la cabecera de la tabla. Se abre en «Hay que mirarlas»: solo lo que pide que alguien haga algo hoy
   (sin contestar, una queja, parada o sin nadie). Las demás, plegadas tras «Ver las otras N» o en el filtro «Todas».
   Las de Teresa tienen dueña (está de baja): filtro propio, no «No la lleva nadie». Datos y cuentas: js/datos/r6-direccion.js. */
(function () {
  'use strict';
  const esc = VETA.esc, X = VETA.dir, UI = VETA.UI;
  let filtro = 'mirar', otras = false;
  const FILTROS = [['mirar', 'Hay que mirarlas'], ['todas', 'Todas'], ['nadie', 'No la lleva nadie'], ['teresa', 'De Teresa, de baja'], ['persona', 'Por persona']];

  // «Toca: contestar a Marta» (en minúscula, salvo si empieza por el nombre de alguien del equipo)
  const tocaDe = o => {
    const t = String(o.tocaCorto || o.toca || '').replace(/\.$/, '');
    if (!t || /^Nada\b/.test(t)) return '';
    const propio = Object.keys(VETA.datos.personas || {}).some(id => t.indexOf(X.persona(id).corto + ' ') === 0);
    return 'Toca: ' + (propio ? t : t.charAt(0).toLowerCase() + t.slice(1));
  };
  // lo que pasa, solo en las que hay que mirar y en las de Teresa: rojo si alguien espera respuesta; lo demás, neutro
  // si quien la lleva ya contestó, una nota gris en su lugar («Laura le contestó hoy, 9:41»): se ve que contestó y cuándo, nunca el mensaje
  const pasa = (o, cls) => (o.mirar || o.deBaja) && o.aviso ? `<span class="${cls} d-tono-${o.aviso.tono}">${VETA.ic(o.aviso.tono === 'rojo' ? 'aviso' : 'reloj', 18)}<span>${esc(o.aviso.texto)}</span></span>`
    : o.nota ? `<span class="${cls} d-tono-neutro d-op-nota">${VETA.ic('check', 18)}<span>${esc(o.nota)}</span></span>` : '';

  // móvil: dos líneas por operación (y una tercera, corta, solo si hay que mirarla)
  const linea = (o, conQuien) => {
    const quien = conQuien === false ? '' : (o.persona ? esc(o.persona.corto) + (o.lleva === VETA.yo().id ? ' (tú)' : '') : 'Nadie');
    const dos = [quien, esc(o.comoCorto), esc(tocaDe(o))].filter(Boolean).join(' · ');
    return `<button type="button" class="d-op d-op-m" data-ir="operacion/${esc(o.id)}">${VETA.av(o.id, 40, {nombre: o.nombre})}` +
      `<span class="d-op-tc"><span class="d-op-1"><b>${esc(o.nombre)}</b> · ${esc(o.texto)}</span><span class="d-op-2">${dos}</span>${pasa(o, 'd-op-que')}</span>` +
      `<span class="fila-chev">${VETA.ic('chev', 16)}</span></button>`;
  };
  // ordenador: una fila de tabla por operación; los rótulos van en la cabecera
  const fila = (o, conQuien) => {
    const quien = o.persona ? `${VETA.av(o.lleva, 32)}<span>${esc(o.persona.nombre)}${o.lleva === VETA.yo().id ? ' (tú)' : ''}</span>` : `<span class="d-op-nadie">Nadie</span>`;
    return `<button type="button" class="d-op" data-ir="operacion/${esc(o.id)}">` +
      `<span class="d-op-cab"><span class="d-op-tc"><span class="d-op-n">${esc(o.nombre)}</span><span class="d-op-q">${esc(o.texto)}</span></span></span>` +
      `<span class="d-op-d">` +
      (conQuien !== false ? `<span class="d-op-c d-op-lleva"><span class="d-op-v d-op-quien">${quien}</span></span>` : '') +
      `<span class="d-op-c"><span class="d-op-v">${esc(o.como)}</span></span>` +
      `<span class="d-op-c"><span class="d-op-v">${o.ultimo ? `<b>${esc(o.ultimo.cuando)}</b> · ${esc(o.ultimo.texto)}` : '—'}</span></span>` +
      `<span class="d-op-c"><span class="d-op-v">${esc(o.toca || '—')}</span></span></span>` +
      (o.nota ? '' : pasa(o, 'd-op-aviso')) + `</button>`;   // en la tabla, «Lo último que pasó» ya dice que contestó y cuándo
  };
  const cabecera = conQuien => `<div class="d-op-th" aria-hidden="true"><span>Operación</span>${conQuien !== false ? '<span>Quién la lleva</span>' : ''}<span>Cómo va</span><span>Lo último que pasó</span><span>Qué toca ahora</span></div>`;
  const lista = (l, conQuien) => {
    const ord = VETA.ordenador();
    return `<div class="d-ops${ord ? '' : ' d-ops-m'}${conQuien === false ? ' d-ops-sinq' : ''}">${ord ? cabecera(conQuien) : ''}${l.map(o => (ord ? fila : linea)(o, conQuien)).join('')}</div>`;
  };

  VETA.pantalla('G17', {
    titulo: 'Operaciones',
    ancha: true,
    guia: ['Aquí ves las operaciones de la oficina. Primero, las que hay que mirar hoy.', 'Tú tocas una para ver quién la lleva, cómo va y lo que ha pasado.', 'Así sabes cómo va cada una sin tener que preguntar.'],
    pinta: () => {
      const todas = X.ops(), ojo = todas.filter(o => o.mirar), resto = todas.filter(o => !o.mirar);
      const nadie = todas.filter(o => !o.lleva), teresa = todas.filter(o => o.deBaja);
      const N = {mirar: ojo.length, todas: todas.length, nadie: nadie.length, teresa: teresa.length};
      if (filtro === 'teresa' && !teresa.length) filtro = 'mirar';
      // una línea, la misma frase que en Equipo; lo de Teresa se explica en su filtro
      let h = `<p class="d-ops-intro" data-i="0"><b>${todas.length} operaciones</b> · ${ojo.length ? `<b>${ojo.length}</b> hay que mirar${ojo.length === 1 ? 'la' : 'las'} hoy` : 'hoy no hay que mirar ninguna'}</p>`;
      h += `<div class="d-filtros" role="group" aria-label="Qué operaciones ver" data-i="0">${FILTROS.filter(([id]) => id !== 'teresa' || teresa.length).map(([id, t]) =>
        `<button type="button" class="d-filtro" data-accion="filtro" data-valor="${id}" aria-pressed="${filtro === id}">${esc(t)}${N[id] != null ? ` <b>${N[id]}</b>` : ''}</button>`).join('')}</div>`;
      if (filtro === 'persona') {
        const grupos = {};
        todas.forEach(o => { const k = o.lleva || '_'; (grupos[k] = grupos[k] || []).push(o); });
        const claves = Object.keys(grupos).sort((a, b) => a === '_' ? -1 : b === '_' ? 1 : X.persona(a).nombre.localeCompare(X.persona(b).nombre, 'es'));
        h += claves.map((k, n) => {
          const p = k === '_' ? null : X.persona(k), l = grupos[k], baja = l.some(o => o.deBaja);
          const tit = p ? `<button type="button" class="d-op-gt" data-ir="persona/${esc(k)}">${VETA.av(k, 32)}<span>${esc(p.nombre)}${k === VETA.yo().id ? ' (tú)' : ''}${baja ? ' · de baja' : ''} · ${l.length}</span><span class="fila-chev">${VETA.ic('chev', 16)}</span></button>`
            : `<h2 class="d-op-gt d-op-gt-q">No la lleva nadie · ${l.length}</h2>`;
          return `<section class="d-op-grupo" data-i="${Math.min(4, n + 1)}">${tit}${lista(l, false)}</section>`;
        }).join('');
      } else if (filtro === 'mirar') {
        h += ojo.length ? `<div data-i="1">${lista(ojo)}</div>` : UI.vacio({titulo: 'Hoy no hay que mirar ninguna.', texto: 'Nadie espera respuesta y ninguna está parada.', icono: 'check'});
        // las demás siguen en la página, plegadas: se abren aquí mismo o con «Todas»
        if (resto.length) h += `<div class="d-ops-otras" data-i="2"><button type="button" class="d-ops-mas" data-accion="otras" aria-expanded="${otras}"><span>Ver las otras ${resto.length}</span>` +
          `<span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button><div class="d-ops-resto"${otras ? '' : ' hidden'}>${lista(resto)}</div></div>`;
      } else {
        const l = filtro === 'nadie' ? nadie : filtro === 'teresa' ? teresa : todas;
        h += l.length ? `<div data-i="1">${lista(l)}</div>` : UI.vacio({titulo: 'Ninguna.', texto: 'Ahora mismo no hay operaciones así.', icono: 'check'});
        if (filtro === 'teresa') h += `<div class="d-ops-teresa" data-i="2">` + UI.nota({texto: 'Teresa está de baja desde el lunes 16. Mientras no pases sus clientes, nadie mira estas operaciones.', icono: 'info'}) +
          UI.boton({tipo: 'secundario', texto: 'Pasar sus clientes a otra persona', ir: 'reparto'}) + `</div>`;
      }
      h += UI.nota({icono: 'candado', texto: 'Ves cómo va cada operación. No ves lo que se escriben con el cliente ni las notas de cada persona.', clase: 'd-ops-pie'});
      return h;
    },
    acciones: {
      filtro(ev, el) { filtro = el.dataset.valor; otras = false; VETA.repinta(); },
      otras(ev, el) {
        otras = !otras;
        el.setAttribute('aria-expanded', String(otras));
        const l = el.parentNode.querySelector('.d-ops-resto'); if (l) l.hidden = !otras;
        const s = el.querySelector('span'); if (s) s.textContent = (otras ? 'Ocultar las otras ' : 'Ver las otras ') + (l ? l.querySelectorAll('.d-op').length : '');
      }
    }
  });
})();
