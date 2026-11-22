/* Veta demo · pantallas · reparto.js · paquete D (Dirección)
   G5 · Reparto · #/reparto — la cartera de Teresa (de baja) y los contactos que nadie lleva. Ronda 7 (D1): ficha + oro + lista, frase y botones r7.
   G5b · Pasar la cartera · #/reparto/confirmar — de quién, a quién, cuánto y qué cambia, antes de tocar nada. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;

  const destino = a => a === 'dos' ? 'Laura and Anna' : X.persona(a).corto;
  const lineaCartera = a => a === 'dos' ? 'Teresa\'s 34 conversations, split between Laura and Anna' : 'Teresa\'s 34 conversations, passed to ' + destino(a);

  // ronda 7 · D1: una ficha (R2) con lo que pasa y, en oro, lo que haría Veta; debajo, una lista con los contactos que nadie lleva
  const contactoFila = c => {
    const as = X.asignado(c.id);
    return VETA.d1.fila({cara: c.id, nombre: c.nombre, pasa: as ? (as.a === VETA.yo().id ? 'You have it now' : 'Now with ' + X.persona(as.a).corto) : 'I would give it to ' + X.persona(c.propone).corto,
      pastilla: as ? 'Done' : 'No one has it', tono: as ? 'gris' : 'rojo', ir: 'asunto/' + c.id, datos: {vt: 'contacto-' + c.id}});
  };

  VETA.pantalla('G5', {
    titulo: 'Allocation',
    frase: () => X.cartera() ? 'They are already passed on. When Teresa comes back, you give them back from here.'
      : 'Teresa is off sick. I tell you who I would give her clients to. You decide.',
    guia: ['Here you see the work that has been left with no one.', 'You decide who each thing goes to.', 'That way no client waits because someone isn\'t there.'],
    pinta: () => {
      const hecha = X.cartera(), a = X.carteraA();
      const sin = (VETA.datos.contactos || []).filter(c => c.sinDueno);
      let h = `<div class="r7-ficha" data-vt="cola-d-teresa"><span class="r7-ficha-de">Teresa Gil, off sick since Monday 16</span><p>34 conversations with 12 clients. 3 viewings this week.</p></div>`;
      if (hecha) h += `<div class="r7-ficha d1-hecho"><span class="r7-ficha-de">Decided${hecha.hora ? ' at ' + esc(hecha.hora) : ''}</span><p>${VETA.ic('check', 18)} ${esc((hecha.extra && hecha.extra.linea) || lineaCartera(a))}</p></div>`;
      else h += `<div class="r7-ficha r7-oro"><span class="r7-ficha-de">${a === 'laura' ? 'I would give them to Laura' : a === 'anna' ? 'You chose Anna' : 'You chose to share them between Laura and Anna'}</span>` +
        `<p>${a === 'dos' ? 'They work in Gràcia, like Teresa: 17 conversations each.' : 'She works in Gràcia, like Teresa.'} ${a === 'dos' ? 'Each one decides' : destino(a) + ' decides'} when to write to each client.</p>${VETA.r7.ensena({texto: 'Show me how you would do it'})}</div>`;
      h += VETA.r7.lista(sin.map(contactoFila).concat([{icono: 'chat', nombre: 'Clients with two chats', pasa: '2 put together last week', hoja: 'h40'}]));
      return `<div class="d1-asunto">${h}</div>`;
    },
    botonFijo: () => {
      if (X.cartera()) return VETA.r7.botones(null, [{texto: 'Undo', accion: 'deshacer-cartera'}]);
      const a = X.carteraA();
      return VETA.r7.botones({texto: a === 'dos' ? 'Share them between Laura and Anna' : 'Give them to ' + destino(a), ir: 'reparto/confirmar'},
        [{texto: 'Choose someone else', hoja: 'h35', datos: {para: 'cartera'}}]);
    },
    acciones: {
      'deshacer-cartera'() { M.deshaz('d-teresa'); VETA.repinta({hecho: 'd-teresa'}); VETA.d1.numeros(); }
    }
  });

  VETA.pantalla('G5b', {
    titulo: 'Pass her clients',
    frase: 'This is what will happen. Read it and confirm.',
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
      return VETA.r7.botones({texto: a === 'dos' ? 'Share them between Laura and Anna' : 'Give them to ' + destino(a), accion: 'pasar'});
    },
    acciones: {
      pasar() {
        const a = X.carteraA();
        M.marca('d-teresa', 'hecha', {a, linea: lineaCartera(a)});
        X.vuelve(); VETA.d1.numeros();
        setTimeout(() => VETA.aviso(lineaCartera(a) + '.', {deshacer: () => { M.deshaz('d-teresa'); VETA.repinta(); VETA.d1.numeros(); }}), 60);
      }
    }
  });
})();
