/* Veta demo · pantallas · reparto.js · paquete D (Dirección)
   G5 · Reparto · #/reparto — los clientes de Teresa (de baja): una sola decisión. Dos tarjetas (lo que pasa y, en oro, lo que haría Veta)
   y un botón. «Más» (hoja d-reparto-mas): elegir a otra persona · clientes con dos chats · enseñarle a Veta con este caso.
   Los contactos que nadie lleva ya no salen aquí (D4): cada uno es una decisión de Inicio.
   Al pasarlos, el final de toda la app (D12): «✓ Pasados a Laura · 9:41 · Deshacer» arriba y «Siguiente: …» en el pie.
   G5b · Pasar la cartera · #/reparto/confirmar — de quién, a quién, cuánto y qué cambia, antes de tocar nada. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;
  const BAJA = '2026-11-16', VISITA = '2026-11-26T10:00';   // desde cuándo está de baja Teresa · su próxima visita

  const destino = a => a === 'dos' ? 'Laura y Anna' : X.persona(a).corto;
  const lineaCartera = a => a === 'dos' ? 'Se reparten 12 clientes de Teresa entre Laura y Anna' : 'Pasan 12 clientes de Teresa a ' + destino(a);
  const propone = a => ({
    de: a === 'laura' ? 'Yo se los pasaría a Laura' : a === 'anna' ? 'Has elegido a Anna' : 'Has elegido repartirlos entre Laura y Anna',
    texto: a === 'dos' ? 'Trabajan en Gràcia, como Teresa: a partes iguales.' : 'Trabaja en Gràcia, como Teresa.'});

  VETA.pantalla('G5', {
    titulo: 'Reparto',
    sub: () => X.cartera() ? 'Cuando Teresa vuelva, se los devuelves desde aquí.' : '',
    nota: () => X.cartera() ? '' : 'Te digo a quién se los pasaría. Tú decides.',
    mas: () => X.cartera() ? null : 'd-reparto-mas',
    casoDictado: () => ({de: 'reparto', quien: 'teresa', titulo: 'Los clientes de Teresa', texto: propone(X.carteraA()).de + '. ' + propone(X.carteraA()).texto}),
    pinta: () => {
      const hecha = X.cartera(), a = X.carteraA();
      return (hecha ? r7.hecho({texto: a === 'dos' ? 'Repartidos entre Laura y Anna' : 'Pasados a ' + destino(a), hora: hecha.hora ? VETA.fecha.hora(hecha.hora) : '', deshacer: 'deshacer-cartera', vt: 'd-teresa'}) : '') +
        r7.tarjeta({de: 'Teresa Gil, de baja desde el ' + VETA.fecha.corta(BAJA, {frase: true}), texto: '12 clientes por repartir, con 3 visitas esta semana.', vt: 'cola-d-teresa', i: 0}) +
        (hecha ? '' : r7.tarjeta(Object.assign({veta: true, i: 1}, propone(a))));
    },
    botonFijo: () => {
      if (X.cartera()) return r7.sigue(VETA.d1.siguiente());
      const a = X.carteraA();
      return r7.botones({texto: a === 'dos' ? 'Repartirlos entre las dos' : 'Pasárselos a ' + destino(a), ir: 'reparto/confirmar'});
    },
    acciones: {
      'deshacer-cartera'() { M.deshaz('d-teresa'); VETA.repinta({hecho: 'd-teresa'}); VETA.d1.numeros(); },
      'd-sigue': (ev, el) => VETA.d1.sigue(ev, el)
    }
  });

  VETA.pantalla('G5b', {
    titulo: 'Pasar sus clientes',
    sub: 'Esto es lo que va a pasar. Léelo y confirma.',
    nota: 'Cuando Teresa vuelva, se las devuelves.',
    pinta: () => {
      const a = X.carteraA(), dos = a === 'dos';
      const para = dos ? `${VETA.av('laura', 64)}${VETA.av('anna', 64)}` : VETA.av(a, 64);
      let h = `<div class="d-traspaso" data-i="0" aria-hidden="true">` +
        `<span class="d-tr-p">${VETA.av('teresa', 64)}<b>Teresa</b></span>` +
        `<span class="d-tr-via"><i class="d-tr-linea"></i><span class="d-tr-n">12</span></span>` +
        `<span class="d-tr-p${dos ? ' d-tr-dos' : ''}"><span class="d-tr-avs">${para}</span><b>${esc(destino(a))}</b></span></div>`;
      // «Qué cambia» va primero, justo bajo el dibujo; «De quién / A quién» repiten el dibujo y en el móvil no salen
      h += `<dl class="d-confirma" data-i="1">` +
        `<div><dt>Qué cambia</dt><dd>${dos ? 'Laura y Anna las verán' : esc(destino(a)) + ' las verá'} mañana en su Inicio. Los clientes no reciben nada: ${dos ? 'cada una decide' : esc(destino(a)) + ' decide'} cuándo escribe a cada uno.</dd></div>` +
        `<div><dt>Cuánto</dt><dd>12 clientes por repartir, con 3 visitas esta semana. La próxima: ${esc(VETA.fecha.corta(VISITA, {frase: true}))}, con Ramon Pujol.</dd></div>` +
        `<div class="d-solo-ancho"><dt>De quién</dt><dd>Teresa Gil, de baja desde el ${esc(VETA.fecha.corta(BAJA, {frase: true}))}.</dd></div>` +
        `<div class="d-solo-ancho"><dt>A quién</dt><dd>${dos ? 'Laura Martí y Anna Costa, oficina de Gràcia: a partes iguales.' : esc(X.persona(a).nombre) + ', oficina de Gràcia.'}</dd></div></dl>`;
      return h;
    },
    botonFijo: () => {
      const a = X.carteraA();
      return r7.botones({texto: a === 'dos' ? 'Repartirlos entre las dos' : 'Pasárselos a ' + destino(a), accion: 'pasar'});
    },
    acciones: {
      pasar() {
        const a = X.carteraA();
        M.marca('d-teresa', 'hecha', {a, linea: lineaCartera(a)});
        X.vuelve(); VETA.d1.numeros();   // vuelve al Reparto, que ya enseña su «hecho» con «Deshacer»: sin aviso negro
      }
    }
  });
})();
