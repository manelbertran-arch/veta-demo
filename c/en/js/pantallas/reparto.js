/* Veta demo · pantallas · reparto.js · paquete D (Dirección)
   G5 · Reparto · #/reparto — la cartera de Teresa (de baja) y los contactos que nadie lleva. Ronda 8: dos tarjetas (lo que pasa y, en oro,
   lo que haría Veta), la lista de contactos sin pastillas y un botón. “Más” (hoja d-reparto-mas): elegir a otra persona · clientes con dos chats.
   G5b · Pasar la cartera · #/reparto/confirmar — de quién, a quién, cuánto y qué cambia, antes de tocar nada. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;

  const destino = a => a === 'dos' ? 'Laura and Anna' : X.persona(a).corto;
  const lineaCartera = a => a === 'dos' ? 'Teresa\'s 34 conversations, split between Laura and Anna' : 'Teresa\'s 34 conversations, passed to ' + destino(a);

  // cada contacto que nadie lleva: sin pastilla (las tres dirían lo mismo); la segunda línea dice a quién se lo daría Veta
  const contactoFila = c => {
    const as = X.asignado(c.id), ap = X.aparcado(c.id);
    return {cara: c.id, nombre: c.nombre, ir: 'asunto/' + c.id, datos: {vt: 'contacto-' + c.id},
      pasa: as ? (as.a === VETA.yo().id ? 'You have it now' : 'Now with ' + X.persona(as.a).corto) : ap ? (ap.que === 'luego' ? 'You left it for later' : 'You dismissed it') : 'I\'d pick ' + X.persona(c.propone).corto};
  };
  const propone = a => ({
    de: a === 'laura' ? 'I\'d pass them to Laura' : a === 'anna' ? 'You chose Anna' : 'You chose to share them between Laura and Anna',
    texto: a === 'dos' ? 'They work in Gràcia, like Teresa: 17 conversations each.' : 'She works in Gràcia, like Teresa.'});

  VETA.pantalla('G5', {
    titulo: 'Allocation',
    sub: () => X.cartera() ? 'When Teresa\'s back, you return them from here.' : '',
    nota: () => X.cartera() ? '' : 'I\'ll tell you who I\'d pass them to. You decide.',
    mas: () => X.cartera() ? null : 'd-reparto-mas',
    casoDictado: () => ({de: 'reparto', quien: 'teresa', titulo: 'Teresa\'s clients', texto: propone(X.carteraA()).de + '. ' + propone(X.carteraA()).texto}),
    pinta: () => {
      const hecha = X.cartera(), a = X.carteraA();
      const sin = (VETA.datos.contactos || []).filter(c => c.sinDueno);
      let h = r7.tarjeta({de: 'Teresa Gil, on leave since Monday 16', texto: '34 conversations with 12 clients. 3 viewings this week.', vt: 'cola-d-teresa', i: 0});
      h += hecha ? r7.tarjeta({de: 'Decided' + (hecha.hora ? ' at ' + hecha.hora : ''), texto: (hecha.extra && hecha.extra.linea) || lineaCartera(a), i: 1})
        : r7.tarjeta(Object.assign({veta: true, i: 1}, propone(a)));
      h += r7.lista(sin.map(contactoFila), {i: 2});
      return h;
    },
    botonFijo: () => {
      if (X.cartera()) return r7.botones(null, {texto: 'Undo', accion: 'deshacer-cartera'});
      const a = X.carteraA();
      return r7.botones({texto: a === 'dos' ? 'Split them between the two' : 'Give them to ' + destino(a), ir: 'reparto/confirmar'});
    },
    acciones: {
      'deshacer-cartera'() { M.deshaz('d-teresa'); VETA.repinta({hecho: 'd-teresa'}); VETA.d1.numeros(); }
    }
  });

  VETA.pantalla('G5b', {
    titulo: 'Pass her clients',
    sub: 'This is what will happen. Read it and confirm.',
    nota: 'When Teresa\'s back, you return them.',
    pinta: () => {
      const a = X.carteraA(), dos = a === 'dos';
      const para = dos ? `${VETA.av('laura', 64)}${VETA.av('anna', 64)}` : VETA.av(a, 64);
      let h = `<div class="d-traspaso" data-i="0" aria-hidden="true">` +
        `<span class="d-tr-p">${VETA.av('teresa', 64)}<b>Teresa</b></span>` +
        `<span class="d-tr-via"><i class="d-tr-linea"></i><span class="d-tr-n">34</span></span>` +
        `<span class="d-tr-p${dos ? ' d-tr-dos' : ''}"><span class="d-tr-avs">${para}</span><b>${esc(destino(a))}</b></span></div>`;
      // “Qué cambia” va primero, justo bajo el dibujo; “De quién / A quién” repiten el dibujo y en el móvil no salen
      h += `<dl class="d-confirma" data-i="1">` +
        `<div><dt>What changes</dt><dd>${dos ? 'Laura and Anna will see them' : esc(destino(a)) + ' will see them'} tomorrow in their Home. Clients get nothing: ${dos ? 'each of them decides' : esc(destino(a)) + ' decides'} when to write to each one.</dd></div>` +
        `<div><dt>How much</dt><dd>34 conversations from 12 active clients, with 3 viewings this week. The next one: Thursday 26, 10:00, with Ramon Pujol.</dd></div>` +
        `<div class="d-solo-ancho"><dt>From whom</dt><dd>Teresa Gil, on leave since Monday 16.</dd></div>` +
        `<div class="d-solo-ancho"><dt>Who</dt><dd>${dos ? 'Laura Martí and Anna Costa, Gràcia office: 17 conversations each.' : esc(X.persona(a).nombre) + ', Gràcia office.'}</dd></div></dl>`;
      return h;
    },
    botonFijo: () => {
      const a = X.carteraA();
      return r7.botones({texto: a === 'dos' ? 'Split them between the two' : 'Give them to ' + destino(a), accion: 'pasar'});
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
