/* Veta demo · pantallas · reparto.js · paquete D (Dirección)
   G5 · Reparto · #/reparto — los clientes de Teresa (de baja): una sola decisión. Dos tarjetas (lo que pasa y, en oro, lo que haría Veta)
   y un botón. “Más” (hoja d-reparto-mas): elegir a otra persona · clientes con dos chats · enseñarle a Veta con este caso.
   Los contactos que nadie lleva ya no salen aquí (D4): cada uno es una decisión de Inicio.
   Al pasarlos, el final de toda la app (D12): “✓ Pasados a Laura · 9:41 · Deshacer” arriba y “Siguiente: …” en el pie.
   G5b · Pasar la cartera · #/reparto/confirmar — de quién, a quién, cuánto y qué cambia, antes de tocar nada. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;
  const BAJA = '2026-11-16', VISITA = '2026-11-26T10:00';   // desde cuándo está de baja Teresa · su próxima visita

  const destino = a => a === 'dos' ? 'Laura and Anna' : X.persona(a).corto;
  const lineaCartera = a => a === 'dos' ? 'Sharing out 12 clients from Teresa between Laura and Anna' : 'Handing over 12 clients from Teresa to ' + destino(a);
  const propone = a => ({
    de: a === 'laura' ? 'I\'d pass them to Laura' : a === 'anna' ? 'You chose Anna' : 'You chose to share them between Laura and Anna',
    texto: a === 'dos' ? 'They work in Gràcia, like Teresa: split evenly.' : 'She works in Gràcia, like Teresa.'});

  VETA.pantalla('G5', {
    titulo: 'Allocation',
    sub: () => X.cartera() ? 'When Teresa\'s back, you return them from here.' : '',
    nota: () => X.cartera() ? '' : 'I\'ll tell you who I\'d pass them to. You decide.',
    mas: () => X.cartera() ? null : 'd-reparto-mas',
    casoDictado: () => ({de: 'reparto', quien: 'teresa', titulo: 'Teresa\'s clients', texto: propone(X.carteraA()).de + '. ' + propone(X.carteraA()).texto}),
    pinta: () => {
      const hecha = X.cartera(), a = X.carteraA();
      return (hecha ? r7.hecho({texto: a === 'dos' ? 'Shared between Laura and Anna' : 'Passed on to  ' + destino(a), hora: hecha.hora ? VETA.fecha.hora(hecha.hora) : '', deshacer: 'deshacer-cartera', vt: 'd-teresa'}) : '') +
        r7.tarjeta({de: 'Teresa Gil, on leave since  ' + VETA.fecha.corta(BAJA, {frase: true}), texto: '12 clients to share out, with 3 visits this week.', vt: 'cola-d-teresa', i: 0}) +
        (hecha ? '' : r7.tarjeta(Object.assign({veta: true, i: 1}, propone(a))));
    },
    botonFijo: () => {
      if (X.cartera()) return r7.sigue(VETA.d1.siguiente());
      const a = X.carteraA();
      return r7.botones({texto: a === 'dos' ? 'Split them between the two' : 'Give them to ' + destino(a), ir: 'reparto/confirmar'});
    },
    acciones: {
      'deshacer-cartera'() { M.deshaz('d-teresa'); VETA.repinta({hecho: 'd-teresa'}); VETA.d1.numeros(); },
      'd-sigue': (ev, el) => VETA.d1.sigue(ev, el)
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
        `<span class="d-tr-via"><i class="d-tr-linea"></i><span class="d-tr-n">12</span></span>` +
        `<span class="d-tr-p${dos ? ' d-tr-dos' : ''}"><span class="d-tr-avs">${para}</span><b>${esc(destino(a))}</b></span></div>`;
      // “Qué cambia” va primero, justo bajo el dibujo; “De quién / A quién” repiten el dibujo y en el móvil no salen
      h += `<dl class="d-confirma" data-i="1">` +
        `<div><dt>What changes</dt><dd>${dos ? 'Laura and Anna will see them tomorrow in their Home' : esc(destino(a)) + ' will see them tomorrow in her Home'}. Clients get nothing: ${dos ? 'each of them decides' : esc(destino(a)) + ' decides'} when to write to each one.</dd></div>` +
        `<div><dt>How much</dt><dd>12 clients to share out, with 3 visits this week. The next one: ${esc(VETA.fecha.corta(VISITA, {frase: true}))}, with Ramon Pujol.</dd></div>` +
        `<div class="d-solo-ancho"><dt>From whom</dt><dd>Teresa Gil, on leave since ${esc(VETA.fecha.corta(BAJA, {frase: true}))}.</dd></div>` +
        `<div class="d-solo-ancho"><dt>Who</dt><dd>${dos ? 'Laura Martí and Anna Costa, Gràcia office: split evenly.' : esc(X.persona(a).nombre) + ', Gràcia office.'}</dd></div></dl>`;
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
        X.vuelve(); VETA.d1.numeros();   // vuelve al Reparto, que ya enseña su “hecho” con “Deshacer”: sin aviso negro
      }
    }
  });
})();
