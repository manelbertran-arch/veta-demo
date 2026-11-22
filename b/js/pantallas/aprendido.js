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
  // ronda 7: cada cosa en una fila; al tocarla se abre con quién la pidió, cuántas veces la he usado y «Pararlo» u «Olvidarlo»
  const boton = (t, accion, id) => `<button type="button" class="r7c-caso" data-accion="${accion}" data-de="${esc(id)}"><span><b>${esc(t)}</b></span>${VETA.ic('chev', 16)}</button>`;
  function fila(x) {
    const on = !pausadas().includes(x.id);
    const usos = x.hechas ? `Lo he usado ${x.hechas} ${x.hechas === 1 ? 'vez' : 'veces'} y me corregiste ${x.corregidas || 0}.` : (x.usos || '');
    return {icono: 'estrella', oro: on, nombre: x.corto || x.texto, pasa: x.hoy ? 'Me lo enseñaste hoy' : on ? (x.hechas ? `Lo he usado ${x.hechas} veces` : 'Lo uso') : 'En pausa: no lo uso',
      abre: `<p>${esc(x.texto)}</p><p>${esc(x.quien)} ${esc(x.cuando)}. ${esc(usos)}</p>` + boton(on ? 'Pararlo un tiempo' : 'Volver a usarlo', 'usar', x.id) + boton('Olvidarlo', 'olvidar', x.id)};
  }
  VETA.pantalla('A13', {
    titulo: 'Lo he aprendido de ti',
    frase: () => { const n = C.aprendidoN(); return n ? `${n} ${n === 1 ? 'cosa que hago' : 'cosas que hago'} como tú me enseñaste. Toca una para verla.` : 'Ahora no uso nada de lo que he aprendido.'; },
    pinta: () => {
      const olv = C.lee('olvidados', []), r6 = C.r6().aprendido, hoy = VETA.r6.siempre();
      const arriba = [], filas = [];
      // lo que me enseñaste con «Enséñale a Veta» y no es un trabajo de la lista: el primero
      C.ensenados().filter(x => !x.regla).reverse().forEach(x => filas.push({icono: 'mic', oro: true, nombre: x.que || x.texto, pasa: 'Me lo enseñaste hoy, ' + x.hora,
        abre: `<p>${esc(x.texto)}</p>` + boton('Olvidarlo', 'olvida-ensenado', x.id)}));
      if (hoy) filas.push(fila({id: 'siempre', hoy: true, texto: hoy.regla, corto: hoy.regla, quien: 'Me lo enseñaste tú al cambiar un mensaje,', cuando: 'hoy' + (hoy.cuando ? ' a las ' + hoy.cuando : ''), usos: 'Lo verás en el próximo mensaje de visita.'}));
      else if (C.lee('siempreOlvidado', null)) arriba.push(UI.lineaHecho({texto: 'Olvidado: ' + C.lee('siempreOlvidado', {}).regla, boton: {texto: 'Deshacer', accion: 'recordar'}, de: 'siempre', vt: 'c-apr-siempre'}));
      D().aprendido.forEach(a => {
        if (olv.includes(a.id)) { arriba.push(UI.lineaHecho({texto: 'Olvidado: ' + a.corto, boton: {texto: 'Deshacer', accion: 'recordar'}, de: a.id, vt: 'c-apr-' + a.id})); return; }
        filas.push(fila(Object.assign({id: a.id, corto: a.corto}, r6[a.id] || {texto: a.texto, quien: a.origen, cuando: ''})));
      });
      const ir = (t, r) => `<button type="button" class="r7c-prop" data-ir="${r}"><span><b>${esc(t)}</b></span>${VETA.ic('chev', 16)}</button>`;
      filas.push({icono: 'editar', nombre: 'Me corregiste 4 veces', pasa: 'Y lo he cambiado', abre: '<p>4 veces me corregiste y ahora lo hago como tú.</p><p>6 de 31 mensajes los cambiaste antes de enviarlos.</p>'});
      filas.push({icono: 'orden', nombre: '1 cosa que no entendí', pasa: 'Dime qué querías', ir: 'entendido/no-entendida'});
      filas.push({icono: 'equipo', nombre: 'Lo que dice tu oficina', pasa: 'Cómo trabajáis todos', abre: `<p>${D().oficinaDice.map(esc).join(' ')}</p><div class="r7c-props">${ir('Cómo trabajamos', 'oficina/practicas')}${ir('Lo que sabe tu oficina', 'oficina/sabe')}${ir('Proponer una mejora', 'mejora')}</div>`});
      return arriba.join('') + VETA.r7.lista(filas, {i: 0});
    },
    acciones: {
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
      'olvida-ensenado'(ev, el) { VETA.r7e.olvida(el.dataset.de); VETA.repinta(); VETA.aviso('Vale. Lo he olvidado.'); },
      usar(ev, el) {
        const id = el.dataset.de, p = pausadas(), on = !p.includes(id);
        C.pon('pausados', on ? p.concat(id) : p.filter(x => x !== id)); VETA.repinta(); VETA.aviso(on ? 'Vale. No lo uso hasta que me lo digas.' : 'Vale. Lo vuelvo a usar.');
      }
    }
  });

  // ---- A13b · Proponer una mejora ----
  let texto = '', busca = null;
  const conCasos = t => D().mejoras.some(m => m.toLowerCase() === String(t).trim().toLowerCase());
  VETA.pantalla('A13b', {
    titulo: 'Proponer una mejora',
    frase: 'Escribe qué haríais mejor. Busco casos en tus chats y Montse decide.',
    pinta: () => {
      const env = C.lee('mejoraEnviada', null);
      if (env) return UI.lineaHecho({texto: 'Propuesta enviada. Dirección decide si se prueba.', hora: env.hora, boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-mejora', i: 0}) +
        `<blockquote class="cita c-cita-quieta" data-i="1"><span class="cita-t">«${esc(env.texto)}»</span><span class="cita-o">Tu propuesta · hoy</span></blockquote>`;
      return `<div data-i="0" data-vt="c-mejora">${UI.campo({id: 'c-mejora', etiqueta: '¿Qué haríais mejor?', area: true, filas: 3, valor: texto, placeholder: 'Por ejemplo: llamar en 48 horas a quien pide ver un piso'})}</div>` +
        `<div class="c-chips" data-i="1">${D().mejoras.map((m, k) => `<button type="button" class="c-chip" data-accion="ejemplo" data-n="${k}">${esc(m)}</button>`).join('')}</div>` +
        (busca ? `<div class="c-hallado" data-i="3">${UI.nota({texto: busca, icono: 'info', caja: true})}</div>` : '');
    },
    botonFijo: () => (C.lee('mejoraEnviada', null) ? '' : VETA.r7.botones({texto: 'Proponerlo a la oficina', accion: 'proponer'}, [{texto: 'Buscar casos', accion: 'buscar'}])),
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
