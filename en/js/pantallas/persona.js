/* Veta demo · pantallas · persona.js · ronda 6 · paquete D (P3)
   G19 · Una persona del equipo · #/persona/:id — lo que lleva, lo que tiene pendiente, cuánto tarda en contestar,
   lo que Veta ya hace por ella y lo que Veta ha aprendido de ella. Sin podio ni puntuación, y sin comparar con nadie:
   cada cifra es suya. La persona ve en su app esto mismo. Datos: js/datos/r6-direccion.js (VETA.dir.personaOps). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, X = VETA.dir, M = VETA.modelo;
  const ESTADO = {activa: 'I already do it', 'a-prueba': 'I\'m trying it', propuesta: 'I have suggested it'};
  // en rojo solo cuando alguien espera respuesta; un papel con fecha o una operación que espera es trabajo normal y va en neutro
  const etq = a => a.tono === 'rojo' ? 'sin-responder' : 'esperando';

  VETA.pantalla('G19', {
    titulo: p => { const x = X.persona(p.id); return p.id === VETA.yo().id ? 'You' : (x.nombre || 'A person'); },
    guia: ['Here you see a person on the team: what they handle, what is waiting for them and what Veta already does for them.', 'You tap a deal to see it in full.', 'This way you know where to lend a hand. They see this same thing in their app.'],
    pinta: p => {
      if (!VETA.datos.personas[p.id]) return UI.vacio({titulo: 'I cannot find this person.', icono: 'usuario', boton: {texto: 'Back', atras: true}});
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, ella = x.p.corto;
      let h = `<div class="d-opd-cab" data-i="0">${VETA.av(p.id, 64, {foco: 'foto'})}<div><p class="d-opd-n" data-foco="nombre">${esc(x.p.nombre)}${yo ? ' (you)' : ''}</p>` +
        `<p class="d-opd-q">${esc((x.p.papel === 'direccion' ? 'Management; also sells' : 'Agent') + ' · ' + X.zona(p.id))}</p></div></div>`;
      if (x.baja) h += `<p class="d-op-aviso d-opd-aviso d-tono-rojo" data-i="0">${VETA.ic('aviso', 20)}<span>${esc(x.baja)} · ${x.pendientes} conversations not looked after</span></p>` +
        `<div data-i="0">${UI.boton({texto: 'Pass her clients to someone else', ir: 'reparto'})}</div>`;
      // lo que lleva
      const filas = x.ops.map(o => ({titulo: o.nombre, sub: o.texto + ' · ' + o.como, av: o.id, ir: 'operacion/' + o.id,
        etiqueta: o.aviso ? etq(o.aviso) : o.nota ? 'al-dia' : null, etiquetaTexto: o.aviso ? o.aviso.texto.replace(' · Teresa is off sick', '') : o.nota || null}));
      h += UI.bloque({titulo: yo ? 'What you handle' : 'What ' + ella + ' handles', texto: x.ops.length ? x.resumen : (yo ? 'You have no deals at the moment.' : ella + ' has no deals at the moment.'),
        i: 1, html: x.ops.length ? UI.lista(filas) : ''});
      // lo que tiene pendiente
      const pend = x.baja ? `${x.pendientes} conversations are waiting for someone.` : x.pendientes ? VETA.dir.tocanTexto(x, yo) : (yo ? 'Nothing is waiting for you today.' : 'Nothing is waiting for ' + ella + ' today.');
      h += UI.bloque({titulo: yo ? 'What is waiting for you' : 'What is waiting for ' + ella, i: 2, html: `<p class="d-per-p">${esc(pend)}</p>`});
      // cuánto tarda en contestar: lo que decimos y lo que pasa
      if (x.tarda) h += UI.bloque({titulo: 'How long they take to reply', i: 2, html: `<p class="d-per-p"><b>${esc(X.tardaTexto(x, yo))}</b></p>` +
        `<p class="d-per-pie">${UI.etiqueta('ejemplo')} We say “We reply the same day”. I count from when the client writes until ${yo ? 'you reply' : 'they reply'}, last week.</p>`});
      // lo que Veta ya hace por ella
      const hace = x.hace;
      h += UI.bloque({titulo: 'What Veta already does for ' + (yo ? 'you' : ella), i: 3, html: x.total
        ? `<p class="d-per-cifra">${VETA.vivo.cuenta({de: 0, a: x.total, clave: 'd-per-' + p.id})}<span>things I got ready for ${yo ? 'you' : 'them'} last week</span></p>` +
          `<p class="d-per-p">${hace.mensajes} messages, ${hace.actas} ${hace.actas === 1 ? 'viewing note' : 'viewing notes'} and ${hace.avisos} alerts.</p>`
        : `<p class="d-per-p">Not last week, because she is off sick.</p>`});
      // lo que Veta ha aprendido de ella
      const ap = x.aprendido.map(([id, t]) => {
        const r = id ? M.regla(id) : null, est = r ? r.estado : 'activa';
        return {titulo: t, sub: ESTADO[est] || ESTADO.activa, icono: 'aprende'};
      });
      const hoy = p.id === 'laura' && VETA.r6 && VETA.r6.siempre ? VETA.r6.siempre() : null;
      if (hoy) ap.unshift({titulo: hoy.regla, sub: 'They showed me today · I already do it this way', icono: 'aprende'});
      if (ap.length) h += UI.bloque({titulo: 'What I\'ve learned from ' + (yo ? 'you' : ella), i: 3, html: UI.lista(ap)});
      h += UI.nota({icono: 'candado', texto: yo ? 'Each person on the team sees the same as you see of them.' : `${ella} sees this same thing in their app. You do not see their chats or their notes.`});
      return h;
    }
  });
})();
