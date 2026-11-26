/* Veta demo · tanda V · pantallas · visitas.js · carril visitas
   A21 · Visitas · #/visitas (raíz). Una agenda: tira de días que se toca; de cada día, sus visitas con la foto del piso y la hora
   grande; debajo, “Con el acta enviada”. La de hoy, mientras le falte algo, lleva el botón de lo que toca (“Abrir la visita”,
   “Abrir el acta”, “Abrir el informe”). Los días y las visitas salen de los datos: no se inventa ninguna. */
(function () {
  'use strict';
  const r7 = VETA.r7, V = () => VETA.v, A2 = () => VETA.a2, esc = VETA.esc;
  let sel = null;   // día elegido (AAAA-MM-DD); aguanta el repintado al volver de una visita

  // lo que toca con la visita de hoy: contarla, enviar el acta o enviar el informe
  const toca = v => {
    const f = A2().est(v.id).contada ? A2().falta(v.id) : 'contar';
    return f === 'contar' ? {texto: 'Open the viewing', ir: 'visita/' + v.id} : f === 'acta' ? {texto: 'Open the notes', ir: 'acta/' + v.id} : f === 'informe' ? {texto: 'Open the report', ir: 'informe/' + v.id} : null;
  };
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const diaDe = v => String(v.iso).slice(0, 10);
  const foto = v => { const p = (VETA.datos.pisos || {})[v.piso]; return p && p.fotos && p.fotos[0] || null; };
  const miniatura = v => { const f = foto(v); return f ? ` style="--v-img:url(${new URL('assets/pisos/' + esc(f) + '.webp', document.baseURI).href})"` : ''; };

  // una visita con foto y hora grande. Con botón (la de hoy pendiente) o sin él (una pasada: lleva el sello)
  const hero = (v, b, hoy) => `<div class="vi-h" data-ir="visita/${esc(v.id)}">` + V().hero({
    hora: VETA.fecha.hora(v.iso), nombre: v.nombre, donde: v.fila, persona: v.cliente, foto: foto(v),
    boton: b && b.texto, ir: b && b.ir, pasada: !b, sello: !b && A2().estadoActa(v) === 'Notes sent',
    chapa: hoy && b ? {tono: 'urg', texto: 'Today'} : null
  }) + '</div>';

  // “Con el acta enviada”: miniatura del piso, quién, cuándo y el sello como estado
  const fila = v => { const e = A2().estadoActa(v), ok = e === 'Notes sent';
    return `<button type="button" class="vi-fila" data-ir="visita/${esc(v.id)}"><span class="vi-mini${foto(v) ? '' : ' vi-mini-sf'}"${miniatura(v)} aria-hidden="true"></span>` +
      `<span class="vi-tx"><span class="vi-nom">${esc(v.nombre)}</span><span class="vi-cuando">${esc(v.cuando)}</span>${ok ? V().sello() : e ? `<span class="vi-est">${esc(e)}</span>` : ''}</span></button>`; };

  VETA.pantalla('A21', {
    titulo: 'Viewings',
    sub: 'Here you see what\'s coming and open the viewing that\'s next.',
    pinta: () => {
      const l = A2().visitas();
      if (!l.length) return r7.vacio('No visits yet.');
      const hoyISO = VETA.datos.fecha.hoyISO, [y, m, d] = hoyISO.split('-').map(Number);
      const dias = []; for (let k = 6; k >= 0; k--) dias.push(iso(new Date(y, m - 1, d - k)));
      if (!sel || !dias.includes(sel)) sel = hoyISO;
      const hechas = l.filter(v => !(v.hoy && toca(v)));   // las de hoy con algo por hacer van arriba, no en la lista
      const tira = '<div class="v-dias" role="tablist" aria-label="Days">' + dias.map(f => {
        const vs = l.filter(v => diaDe(v) === f), hoy = f === hoyISO, pend = vs.some(v => v.hoy && toca(v));
        const [dn, n] = VETA.fecha.corta(f, {dia: true}).split(' ');
        return `<button type="button" role="tab" class="v-dia${hoy ? ' v-hoy' : ''}${vs.length ? (pend ? ' vi-pend' : ' v-pasa') : ''}${f === sel ? ' v-sel' : ''}" data-v-dia="${f}" aria-selected="${f === sel}" aria-label="${esc(dn + ' ' + n)}"><span>${esc(dn)}</span><b>${esc(n)}</b><u></u></button>`;
      }).join('') + '</div>';
      const seccion = f => {
        const vs = l.filter(v => diaDe(v) === f), hoy = f === hoyISO;
        const arriba = vs.filter(v => hoy ? v.hoy && toca(v) : true);
        const resto = hechas.filter(v => !arriba.includes(v));
        return `<section class="vi-dia" data-dia="${f}"${f === sel ? '' : ' hidden'}>` +
          `<p class="vi-et">${hoy ? 'Coming up' : esc(VETA.fecha.corta(f, {dia: true}))}</p>` +
          (arriba.length ? arriba.map(v => hero(v, v.hoy ? toca(v) : null, hoy)).join('') : `<p class="v-vacio">${hoy && vs.length ? 'No viewings left to open today.' : 'No viewings this day.'}</p>`) +
          (resto.length ? `<p class="vi-et">Notes sent</p><div class="vi-lista">${resto.map(fila).join('')}</div>` : '') + '</section>';
      };
      return tira + dias.slice().reverse().map(seccion).join('');
    },
    alMontar: el => {
      const dias = el.querySelectorAll('.v-dia');
      dias.forEach(b => b.addEventListener('click', () => {
        sel = b.dataset.vDia;
        dias.forEach(x => { x.classList.toggle('v-sel', x === b); x.setAttribute('aria-selected', String(x === b)); });
        el.querySelectorAll('.vi-dia').forEach(s => { s.hidden = s.dataset.dia !== sel; });
      }));
    }
  });
})();
