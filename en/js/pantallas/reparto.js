/* Veta demo · pantallas · reparto.js · paquete D (Dirección)
   G5 · Reparto · #/reparto — la cartera de Teresa (de baja) y los contactos que nadie lleva. No se toca su estructura.
   G5b · Pasar la cartera · #/reparto/confirmar — de quién, a quién, cuánto y qué cambia, antes de tocar nada. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;

  const destino = a => a === 'dos' ? 'Laura and Anna' : X.persona(a).corto;
  const lineaCartera = a => a === 'dos' ? 'Teresa\'s 34 conversations, split between Laura and Anna' : 'Teresa\'s 34 conversations, passed to ' + destino(a);

  const contactoFila = c => {
    const as = X.asignado(c.id);
    if (as) return UI.lineaHecho({texto: as.linea, hora: as.hora, vt: 'contacto-' + c.id, boton: {texto: 'Undo', accion: 'deshacer-contacto', de: c.id}});
    return UI.fila({titulo: c.nombre, sub: 'I would give it to ' + X.persona(c.propone).corto + ' · ' + c.cuando.replace('today, ', 'today ').replace('yesterday, ', 'yesterday ').replace(', 13:20', ''),
      av: c.id, ir: 'asunto/' + c.id, vt: 'contacto-' + c.id, focoFoto: true});
  };

  VETA.pantalla('G5', {
    titulo: 'Allocation',
    guia: ['Here Veta shows you the work left without anyone: a portfolio on leave and the unowned contacts.', 'You decide who each thing goes to.', 'That way no client waits because someone isn\'t there.'],
    pinta: () => {
      const hecha = X.cartera(), a = X.carteraA();
      const sin = (VETA.datos.contactos || []).filter(c => c.sinDueno);
      const quedan = sin.filter(c => !X.asignado(c.id)).length;
      let h = `<h2 class="bloque-t d-sec" data-i="0">Teresa's clients, not looked after</h2>`;
      h += `<div class="tarjeta d-cartera" data-i="1" data-vt="cola-d-teresa">` +
        `<div class="d-persona">${VETA.av('teresa', 64)}<span class="d-persona-c"><b>Teresa Gil</b><span>on leave since Monday 16</span></span></div>` +
        `<div class="d-tres">${[['34', 'Open chats'], ['12', 'Active clients'], ['3', 'Viewings this week']].map(([n, t]) => `<div class="d-tres-c"><b>${n}</b><span>${t}</span></div>`).join('')}</div>`;
      if (hecha) {
        h += UI.lineaHecho({texto: (hecha.extra && hecha.extra.linea) || lineaCartera(a), hora: hecha.hora, boton: {texto: 'Undo', accion: 'deshacer-cartera'}}) +
          `<p class="bloque-sub">${esc(destino((hecha.extra && hecha.extra.a) || a))} will see them tomorrow in their Today. When Teresa is back, you give them back from here.</p>`;
      } else {
        h += `<p class="d-propone">${VETA.ic('rayo', 20)}<span>${a === 'laura' ? 'I would pass them to Laura Martí: same office.' : a === 'anna' ? 'You\'ve chosen Anna Costa: same office.' : 'You\'ve chosen to split it between Laura and Anna: 17 and 17.'}</span></p>`;
      }
      h += '</div>';
      h += UI.bloque({titulo: 'Contacts nobody handles · ' + quedan, i: 2, html: `<div class="lista">${sin.map(contactoFila).join('')}</div>`});
      h += UI.lista([{titulo: 'Clients with two chats', sub: '2 put together last week', icono: 'chat', hoja: 'h40'}], {i: 3});
      return h;
    },
    botonFijo: () => {
      if (X.cartera()) return '';
      const a = X.carteraA();
      return UI.boton({texto: a === 'dos' ? 'Split her clients between Laura and Anna' : 'Pass Teresa\'s clients to ' + destino(a), ir: 'reparto/confirmar'}) +
        UI.botones([{texto: 'Choose someone else', hoja: 'h35', datos: {para: 'cartera'}}]);
    },
    acciones: {
      'deshacer-cartera'() { M.deshaz('d-teresa'); VETA.repinta({hecho: 'd-teresa'}); },
      'deshacer-contacto'(ev, el) { X.desasigna(el.dataset.de); VETA.repinta({hecho: 'contacto-' + el.dataset.de}); }
    }
  });

  VETA.pantalla('G5b', {
    titulo: 'Pass her clients',
    guia: ['Here Veta tells you exactly what\'s going to happen before touching someone else\'s work.', 'You read it and confirm, or cancel.', 'That way nobody gets a surprise: neither the team nor the clients.'],
    pinta: () => {
      const a = X.carteraA(), dos = a === 'dos';
      const para = dos ? `${VETA.av('laura', 64)}${VETA.av('anna', 64)}` : VETA.av(a, 64);
      let h = `<div class="d-traspaso" data-i="0" aria-hidden="true">` +
        `<span class="d-tr-p">${VETA.av('teresa', 64)}<b>Teresa</b></span>` +
        `<span class="d-tr-via"><i class="d-tr-linea"></i><span class="d-tr-n">34</span></span>` +
        `<span class="d-tr-p${dos ? ' d-tr-dos' : ''}"><span class="d-tr-avs">${para}</span><b>${esc(destino(a))}</b></span></div>`;
      // “Qué cambia” va primero, justo bajo el dibujo; “De quién / A quién” repiten el dibujo y en el móvil no salen
      h += `<dl class="d-confirma" data-i="1">` +
        `<div><dt>What changes</dt><dd>${dos ? 'Laura and Anna will see them' : esc(destino(a)) + ' will see them'} tomorrow in their Today. Clients receive nothing: ${dos ? 'each of them decides' : esc(destino(a)) + ' decides'} when to write to each one.</dd></div>` +
        `<div><dt>How much</dt><dd>34 conversations from 12 active clients, with 3 viewings this week. The next one: Thursday 26, 10:00, with Ramon Pujol.</dd></div>` +
        `<div class="d-solo-ancho"><dt>From whom</dt><dd>Teresa Gil, on leave since Monday 16.</dd></div>` +
        `<div class="d-solo-ancho"><dt>Who</dt><dd>${dos ? 'Laura Martí and Anna Costa, Gràcia office: 17 conversations each.' : esc(X.persona(a).nombre) + ', Gràcia office.'}</dd></div></dl>`;
      h += UI.nota({texto: 'When Teresa is back, you give them back from Allocation.', icono: 'info', clase: 'nota-gris'});
      return h;
    },
    botonFijo: () => {
      const a = X.carteraA();
      return UI.boton({texto: a === 'dos' ? 'Split 34 conversations between Laura and Anna' : 'Pass 34 conversations from Teresa to ' + destino(a), accion: 'pasar'}) +
        UI.botones([{texto: 'Cancel', atras: true}]);
    },
    acciones: {
      pasar() {
        const a = X.carteraA();
        M.marca('d-teresa', 'hecha', {a, linea: lineaCartera(a)});
        X.vuelve();
      }
    }
  });
})();
