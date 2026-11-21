/* Veta demo · pantallas · aprendido.js · paquete C (Veta, cuenta y entrada)
   - A13 · Lo que he aprendido · #/aprendido
   - A13b · Proponer una mejora · #/mejora */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  const D = () => VETA.datos.c;

  // ---- A13 · Lo que he aprendido ----
  // ronda 6: cada cosa con quién la pidió, cuándo, cuántas veces la he usado y cuántas me corregiste,
  // en qué paso está, si la uso o no (interruptor) y «Olvidar». Lo enseñado hoy («Sí, siempre» en Hoy) va el primero.
  const pausadas = () => C.lee('pausados', []);
  const abiertas = new Set();   // ronda 7 · las que se han abierto al tocarlas (mientras dure la visita a la pantalla)
  function tarjeta(x) {
    const on = !pausadas().includes(x.id);
    const usos = x.hechas ? `Lo he usado <b>${x.hechas}</b> ${x.hechas === 1 ? 'vez' : 'veces'} · me ${x.corregidas === 1 ? 'corregiste 1' : x.corregidas ? 'corregiste ' + x.corregidas : 'corregiste 0'}` : esc(x.usos || '');
    const abierta = abiertas.has(x.id);
    return `<article class="c-ap-fila${x.hoy ? ' c-ap-hoy' : ''}${on ? '' : ' c-ap-off'}" data-vt="c-apr-${esc(x.id)}">` +
      `<button type="button" class="c-ap-cab" data-accion="abre" data-de="${esc(x.id)}" aria-expanded="${abierta}"><span class="c-ap-cab-c">` +
      (x.hoy ? `<span class="c-ap-cuando">${VETA.vivo.pastilla('Hoy' + (x.hora ? ', ' + x.hora : ''), 'reloj')}</span>` : '') +
      `<span class="c-ap-t">${x.hoy ? VETA.vivo.oro(x.texto, {clave: 'ap-hoy'}) : esc(x.texto)}</span>` +
      `<span class="c-ap-q">${esc(x.quien)} ${esc(x.cuando)}${on ? '' : ' · en pausa'}</span></span><span class="c-ap-ch">${VETA.ic('chev', 16)}</span></button>` +
      `<div class="c-ap-det"${abierta ? '' : ' hidden'}>` +
      (x.antes ? `<p class="c-ap-cambio"><s>${esc(x.antes)}</s><span>${esc(x.ahora)}</span></p>` : '') +
      `<p class="c-ap-n">${x.hechas ? VETA.vivo.anillo({van: x.hechas - x.corregidas, de: x.hechas, tam: 's'}) : ''}<span>${usos}</span></p>` +
      `<p class="c-ap-paso">${VETA.vivo.escalera({nivel: x.paso, mini: true})}</p>` +
      `<div class="c-ap-acc">${UI.interruptor({texto: 'Lo uso', sub: on ? 'Sí' : 'En pausa: no lo uso', on, accion: 'usar', de: x.id})}` +
      UI.boton({tipo: 'texto', texto: 'Olvidar', accion: 'olvidar', de: x.id, ancho: false, g: 'Olvidar|Dejo de usarlo. Lo puedes deshacer.'}) + `</div></div></article>`;
  }
  VETA.pantalla('A13', {
    titulo: 'Lo que he aprendido de ti',
    guia: ['Aquí ves lo que he aprendido de ti: quién me lo dijo, cuándo y cuántas veces lo he usado.', 'Tú lo pones en pausa o me dices que lo olvide.', 'Así lo que sé de ti siempre lo puedes ver y quitar.'],
    pinta: () => {
      const olv = C.lee('olvidados', []), r6 = C.r6().aprendido, hoy = VETA.r6.siempre();
      const items = [];
      if (hoy) items.push(tarjeta({id: 'siempre', hoy: true, hora: hoy.cuando, texto: hoy.regla, antes: hoy.antes, ahora: hoy.ahora,
        quien: 'Me lo enseñaste tú al cambiar un mensaje,', cuando: 'hoy', usos: 'Todavía no lo he usado: lo verás en el próximo mensaje de visita.', paso: 2}));
      else if (C.lee('siempreOlvidado', null)) items.push(UI.lineaHecho({texto: 'Olvidado: ' + C.lee('siempreOlvidado', {}).regla, boton: {texto: 'Deshacer', accion: 'recordar'}, de: 'siempre', vt: 'c-apr-siempre'}));
      D().aprendido.forEach(a => {
        const x = Object.assign({id: a.id}, r6[a.id] || {texto: a.texto, quien: a.origen, cuando: '', paso: 2});
        items.push(olv.includes(a.id) ? UI.lineaHecho({texto: 'Olvidado: ' + a.corto, boton: {texto: 'Deshacer', accion: 'recordar'}, de: a.id, vt: 'c-apr-' + a.id}) : tarjeta(x));
      });
      const n = C.aprendidoQueda() + (hoy ? 1 : 0);
      return (n ? '' : `<p class="intro" data-i="0">Ahora mismo no uso nada de lo que he aprendido.</p>`) +
        `<div class="c-aprendidos" data-i="1">${items.join('')}</div>` +
        UI.bloque({titulo: 'Cuando me corriges', i: 2, html: UI.lista([
          {titulo: '4 veces me corregiste y lo he cambiado', icono: 'check'},
          {titulo: '6 de 31 mensajes los cambiaste antes de enviarlos', icono: 'editar'},
          {titulo: '1 cosa que me dijiste y no entendí', icono: 'orden', ir: 'entendido/no-entendida'}])}) +
        UI.bloque({titulo: 'De tu oficina', i: 3, html: `<ul class="c-dice">${D().oficinaDice.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` + UI.lista([
          {titulo: 'Cómo trabajamos', icono: 'libro', ir: 'oficina/practicas'},
          {titulo: 'Lo que sabe tu oficina', icono: 'ojo', ir: 'oficina/sabe'},
          {titulo: 'Proponer una mejora', icono: 'estrella', ir: 'mejora'}])});
    },
    acciones: {
      abre(ev, el) {
        const id = el.dataset.de, abre = !abiertas.has(id);
        if (abre) abiertas.add(id); else abiertas.delete(id);
        el.setAttribute('aria-expanded', String(abre));
        const d = el.parentNode.querySelector('.c-ap-det'); if (d) d.hidden = !abre;
      },
      olvidar(ev, el) {
        const id = el.dataset.de;
        if (id === 'siempre') { C.pon('siempreOlvidado', VETA.r6.siempre()); VETA.r6.olvida(); }
        else C.pon('olvidados', C.lee('olvidados', []).concat(id));
        VETA.repinta({hecho: 'c-apr-' + id});
      },
      recordar(ev, el) {
        const id = el.dataset.de;
        if (id === 'siempre') { const x = C.lee('siempreOlvidado', null); if (x) VETA.est.pon('r6_siempre', x); C.pon('siempreOlvidado', null); }
        else C.pon('olvidados', C.lee('olvidados', []).filter(x => x !== id));
        VETA.repinta({hecho: 'c-apr-' + id});
      },
      usar(ev, el) {
        const id = el.dataset.de, on = el.getAttribute('aria-checked') === 'true', p = pausadas().filter(x => x !== id);
        if (!on) p.push(id); C.pon('pausados', p);
        const f = el.closest('.c-ap-fila'); if (f) f.classList.toggle('c-ap-off', !on);
        const s = el.querySelector('.interr-s'); if (s) s.textContent = on ? 'Sí' : 'En pausa: no lo uso';
      }
    }
  });

  // ---- A13b · Proponer una mejora ----
  let texto = '', busca = null;
  const conCasos = t => D().mejoras.some(m => m.toLowerCase() === String(t).trim().toLowerCase());
  VETA.pantalla('A13b', {
    titulo: 'Proponer una mejora',
    guia: ['Aquí propones a la oficina una forma mejor de hacer algo.', 'Tú lo escribes; Veta busca si ya ha pasado en tus chats.', 'Así dirección decide con casos, no con opiniones.'],
    pinta: () => {
      const env = C.lee('mejoraEnviada', null);
      if (env) return UI.lineaHecho({texto: 'Propuesta enviada. Dirección decide si se prueba.', hora: env.hora, boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-mejora', i: 0}) +
        `<blockquote class="cita c-cita-quieta" data-i="1"><span class="cita-t">«${esc(env.texto)}»</span><span class="cita-o">Tu propuesta · hoy</span></blockquote>`;
      return `<div data-i="0" data-vt="c-mejora">${UI.campo({id: 'c-mejora', etiqueta: '¿Qué haríais mejor?', area: true, filas: 3, valor: texto, placeholder: 'Por ejemplo: llamar en 48 horas a quien pide ver un piso'})}</div>` +
        UI.bloque({titulo: 'Ejemplos', i: 1, html: `<div class="c-chips">${D().mejoras.map((m, k) => `<button type="button" class="c-chip" data-accion="ejemplo" data-n="${k}">${esc(m)}</button>`).join('')}</div>`}) +
        `<div data-i="2">${UI.boton({tipo: 'secundario', texto: 'Buscar en nuestros casos', accion: 'buscar', icono: 'pregunta'})}</div>` +
        (busca ? `<div class="c-hallado" data-i="3">${UI.nota({texto: busca, icono: 'info', caja: true})}</div>` : '');
    },
    botonFijo: () => (C.lee('mejoraEnviada', null) ? '' : UI.boton({texto: 'Proponerlo a la oficina', accion: 'proponer'})),
    alMontar: el => { const t = el.querySelector('#c-mejora'); if (t) t.addEventListener('input', () => { texto = t.value; }); },
    acciones: {
      ejemplo(ev, el) { texto = D().mejoras[Number(el.dataset.n)]; busca = null; const t = document.getElementById('c-mejora'); if (t) t.value = texto; const h = document.querySelector('.c-hallado'); if (h) h.remove(); },
      buscar() {
        const t = document.getElementById('c-mejora'); texto = t ? t.value : texto;
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('Escribe primero qué haríais mejor.'); return; }
        busca = conCasos(texto) ? 'Lo que he encontrado: lo has hecho 11 veces en seis meses; en 8 el cliente pidió una visita.' : 'Todavía no encuentro casos en tus chats. Lo guardo y lo miro cuando lleguen.';
        VETA.repinta();
      },
      proponer() {
        const t = document.getElementById('c-mejora'); texto = t ? t.value : texto;
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('Escribe primero qué haríais mejor.'); return; }
        C.pon('mejoraEnviada', {texto: texto.trim(), hora: VETA.ahora()}); VETA.repinta({hecho: 'c-mejora'});
      },
      deshacer() { const e = C.lee('mejoraEnviada', null); if (e) texto = e.texto; C.pon('mejoraEnviada', null); VETA.repinta({hecho: 'c-mejora'}); }
    }
  });
})();
