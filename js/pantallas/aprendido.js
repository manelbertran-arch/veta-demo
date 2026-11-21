/* Veta demo · pantallas · aprendido.js · paquete C (Veta, cuenta y entrada)
   - A13 · Lo que he aprendido · #/aprendido
   - A13b · Proponer una mejora · #/mejora */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  const D = () => VETA.datos.c;

  // ---- A13 · Lo que he aprendido ----
  VETA.pantalla('A13', {
    titulo: 'Lo que he aprendido',
    guia: ['Aquí ves lo que Veta ha aprendido de tus chats, con de dónde lo sacó.', 'Tú le dices que lo olvide si no es así.', 'Así lo que sabe de ti siempre lo puedes ver y quitar.'],
    pinta: () => {
      const olv = C.lee('olvidados', []), queda = C.aprendidoQueda();
      const items = D().aprendido.map(a => olv.includes(a.id)
        ? UI.lineaHecho({texto: 'Olvidado: ' + a.corto, boton: {texto: 'Deshacer', accion: 'recordar'}, de: a.id, vt: 'c-apr-' + a.id})
        : `<div class="c-aprendi" data-vt="c-apr-${esc(a.id)}"><div class="c-aprendi-c"><p class="c-aprendi-t">${esc(a.texto)}</p><p class="c-aprendi-o">${esc(a.origen)}</p></div>` +
          UI.boton({tipo: 'texto', texto: 'Olvidar', accion: 'olvidar', de: a.id, ancho: false, g: 'Olvidar|Veta deja de usarlo. Lo puedes deshacer.'}) + '</div>').join('');
      return UI.bloque({titulo: queda ? `Esta semana · ${queda} ${queda === 1 ? 'cosa nueva' : 'cosas nuevas'}` : 'Esta semana', i: 0,
          html: (queda ? '' : UI.vacio({titulo: 'Todavía no he aprendido nada nuevo de tus chats.', icono: 'aprende'})) + `<div class="c-aprendidos">${items}</div>`}) +
        UI.bloque({titulo: 'Cómo me va', i: 1, html: UI.lista([
          {titulo: '4 correcciones tuyas aplicadas', icono: 'check'},
          {titulo: '6 de 31 mensajes los retocaste antes de enviar', icono: 'editar'},
          {titulo: '1 orden que no supe convertir', icono: 'orden', ir: 'entendido/no-entendida'}])}) +
        UI.bloque({titulo: 'De tu oficina', i: 2, html: `<ul class="c-dice">${D().oficinaDice.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` + UI.lista([
          {titulo: 'Cómo trabajamos', icono: 'libro', ir: 'oficina/practicas'},
          {titulo: 'Lo que sabe tu oficina', icono: 'ojo', ir: 'oficina/sabe'},
          {titulo: 'Proponer una mejora', icono: 'estrella', ir: 'mejora'}])});
    },
    acciones: {
      olvidar(ev, el) { C.pon('olvidados', C.lee('olvidados', []).concat(el.dataset.de)); VETA.repinta({hecho: 'c-apr-' + el.dataset.de}); },
      recordar(ev, el) { C.pon('olvidados', C.lee('olvidados', []).filter(x => x !== el.dataset.de)); VETA.repinta({hecho: 'c-apr-' + el.dataset.de}); }
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
