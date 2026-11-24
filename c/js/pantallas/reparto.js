/* Veta demo · pantallas · reparto.js · paquete D (Dirección)
   G5 · Reparto · #/reparto — la cartera de Teresa (de baja) y los contactos que nadie lleva. Ronda 8: dos tarjetas (lo que pasa y, en oro,
   lo que haría Veta), la lista de contactos sin pastillas y un botón. «Más» (hoja d-reparto-mas): elegir a otra persona · clientes con dos chats.
   G5b · Pasar la cartera · #/reparto/confirmar — de quién, a quién, cuánto y qué cambia, antes de tocar nada. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;

  const destino = a => a === 'dos' ? 'Laura y Anna' : X.persona(a).corto;
  const lineaCartera = a => a === 'dos' ? '34 conversaciones de Teresa, repartidas entre Laura y Anna' : '34 conversaciones de Teresa, pasadas a ' + destino(a);

  // cada contacto que nadie lleva: sin pastilla (las tres dirían lo mismo); la segunda línea dice a quién se lo daría Veta
  const contactoFila = c => {
    const as = X.asignado(c.id), ap = X.aparcado(c.id);
    return {cara: c.id, nombre: c.nombre, ir: 'asunto/' + c.id, datos: {vt: 'contacto-' + c.id},
      pasa: as ? (as.a === VETA.yo().id ? 'Ahora lo llevas tú' : 'Ahora con ' + X.persona(as.a).corto) : ap ? (ap.que === 'luego' ? 'Lo dejaste para luego' : 'Lo descartaste') : 'Yo se lo daría a ' + X.persona(c.propone).corto};
  };
  const propone = a => ({
    de: a === 'laura' ? 'Yo se los pasaría a Laura' : a === 'anna' ? 'Has elegido a Anna' : 'Has elegido repartirlos entre Laura y Anna',
    texto: a === 'dos' ? 'Trabajan en Gràcia, como Teresa: 17 conversaciones cada una.' : 'Trabaja en Gràcia, como Teresa.'});

  VETA.pantalla('G5', {
    titulo: 'Reparto',
    sub: () => X.cartera() ? 'Cuando Teresa vuelva, se los devuelves desde aquí.' : '',
    nota: () => X.cartera() ? '' : 'Te digo a quién se los pasaría. Tú decides.',
    mas: () => X.cartera() ? null : 'd-reparto-mas',
    casoDictado: () => ({de: 'reparto', quien: 'teresa', titulo: 'Los clientes de Teresa', texto: propone(X.carteraA()).de + '. ' + propone(X.carteraA()).texto}),
    pinta: () => {
      const hecha = X.cartera(), a = X.carteraA();
      const sin = (VETA.datos.contactos || []).filter(c => c.sinDueno);
      let h = r7.tarjeta({de: 'Teresa Gil, de baja desde el lunes 16', texto: '34 conversaciones con 12 clientes. 3 visitas esta semana.', vt: 'cola-d-teresa', i: 0});
      h += hecha ? r7.tarjeta({de: 'Decidido' + (hecha.hora ? ' a las ' + hecha.hora : ''), texto: (hecha.extra && hecha.extra.linea) || lineaCartera(a), i: 1})
        : r7.tarjeta(Object.assign({veta: true, i: 1}, propone(a)));
      h += r7.lista(sin.map(contactoFila), {i: 2});
      return h;
    },
    botonFijo: () => {
      if (X.cartera()) return r7.botones(null, {texto: 'Deshacer', accion: 'deshacer-cartera'});
      const a = X.carteraA();
      return r7.botones({texto: a === 'dos' ? 'Repartirlos entre las dos' : 'Pasárselos a ' + destino(a), ir: 'reparto/confirmar'});
    },
    acciones: {
      'deshacer-cartera'() { M.deshaz('d-teresa'); VETA.repinta({hecho: 'd-teresa'}); VETA.d1.numeros(); }
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
        `<span class="d-tr-via"><i class="d-tr-linea"></i><span class="d-tr-n">34</span></span>` +
        `<span class="d-tr-p${dos ? ' d-tr-dos' : ''}"><span class="d-tr-avs">${para}</span><b>${esc(destino(a))}</b></span></div>`;
      // «Qué cambia» va primero, justo bajo el dibujo; «De quién / A quién» repiten el dibujo y en el móvil no salen
      h += `<dl class="d-confirma" data-i="1">` +
        `<div><dt>Qué cambia</dt><dd>${dos ? 'Laura y Anna las verán' : esc(destino(a)) + ' las verá'} mañana en su Inicio. Los clientes no reciben nada: ${dos ? 'cada una decide' : esc(destino(a)) + ' decide'} cuándo escribe a cada uno.</dd></div>` +
        `<div><dt>Cuánto</dt><dd>34 conversaciones de 12 clientes activos, con 3 visitas esta semana. La próxima: jueves 26, 10:00, con Ramon Pujol.</dd></div>` +
        `<div class="d-solo-ancho"><dt>De quién</dt><dd>Teresa Gil, de baja desde el lunes 16.</dd></div>` +
        `<div class="d-solo-ancho"><dt>A quién</dt><dd>${dos ? 'Laura Martí y Anna Costa, oficina de Gràcia: 17 conversaciones cada una.' : esc(X.persona(a).nombre) + ', oficina de Gràcia.'}</dd></div></dl>`;
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
        X.vuelve(); VETA.d1.numeros();
        setTimeout(() => VETA.aviso(lineaCartera(a) + '.', {deshacer: () => { M.deshaz('d-teresa'); VETA.repinta(); VETA.d1.numeros(); }}), 60);
      }
    }
  });
})();
