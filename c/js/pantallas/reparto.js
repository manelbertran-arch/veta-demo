/* Veta demo · pantallas · reparto.js · paquete D (Dirección)
   G5 · Reparto · #/reparto — la cartera de Teresa (de baja) y los contactos que nadie lleva. Ronda 7 (D1): ficha + oro + lista, frase y botones r7.
   G5b · Pasar la cartera · #/reparto/confirmar — de quién, a quién, cuánto y qué cambia, antes de tocar nada. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;

  const destino = a => a === 'dos' ? 'Laura y Anna' : X.persona(a).corto;
  const lineaCartera = a => a === 'dos' ? '34 conversaciones de Teresa, repartidas entre Laura y Anna' : '34 conversaciones de Teresa, pasadas a ' + destino(a);

  // ronda 7 · D1: una ficha (R2) con lo que pasa y, en oro, lo que haría Veta; debajo, una lista con los contactos que nadie lleva
  const contactoFila = c => {
    const as = X.asignado(c.id);
    return VETA.d1.fila({cara: c.id, nombre: c.nombre, pasa: as ? (as.a === VETA.yo().id ? 'Ahora lo llevas tú' : 'Ahora con ' + X.persona(as.a).corto) : 'Yo se lo daría a ' + X.persona(c.propone).corto,
      pastilla: as ? 'Hecho' : 'Nadie la lleva', tono: as ? 'gris' : 'rojo', ir: 'asunto/' + c.id, datos: {vt: 'contacto-' + c.id}});
  };

  VETA.pantalla('G5', {
    titulo: 'Reparto',
    frase: () => X.cartera() ? 'Ya están pasados. Cuando Teresa vuelva, se los devuelves desde aquí.'
      : 'Teresa está de baja. Te digo a quién pasaría sus clientes. Tú decides.',
    guia: ['Aquí ves el trabajo que se ha quedado sin nadie.', 'Tú decides a quién pasa cada cosa.', 'Así ningún cliente espera porque alguien no está.'],
    pinta: () => {
      const hecha = X.cartera(), a = X.carteraA();
      const sin = (VETA.datos.contactos || []).filter(c => c.sinDueno);
      let h = `<div class="r7-ficha" data-vt="cola-d-teresa"><span class="r7-ficha-de">Teresa Gil, de baja desde el lunes 16</span><p>34 conversaciones con 12 clientes. 3 visitas esta semana.</p></div>`;
      if (hecha) h += `<div class="r7-ficha d1-hecho"><span class="r7-ficha-de">Decidido${hecha.hora ? ' a las ' + esc(hecha.hora) : ''}</span><p>${VETA.ic('check', 18)} ${esc((hecha.extra && hecha.extra.linea) || lineaCartera(a))}</p></div>`;
      else h += `<div class="r7-ficha r7-oro"><span class="r7-ficha-de">${a === 'laura' ? 'Yo se los pasaría a Laura' : a === 'anna' ? 'Has elegido a Anna' : 'Has elegido repartirlos entre Laura y Anna'}</span>` +
        `<p>${a === 'dos' ? 'Trabajan en Gràcia, como Teresa: 17 conversaciones cada una.' : 'Trabaja en Gràcia, como Teresa.'} ${a === 'dos' ? 'Cada una decide' : destino(a) + ' decide'} cuándo escribe a cada cliente.</p>${VETA.r7.ensena({texto: 'Enséñame cómo lo harías tú'})}</div>`;
      h += VETA.r7.lista(sin.map(contactoFila).concat([{icono: 'chat', nombre: 'Clientes con dos chats', pasa: '2 unidos la semana pasada', hoja: 'h40'}]));
      return `<div class="d1-asunto">${h}</div>`;
    },
    botonFijo: () => {
      if (X.cartera()) return VETA.r7.botones(null, [{texto: 'Deshacer', accion: 'deshacer-cartera'}]);
      const a = X.carteraA();
      return VETA.r7.botones({texto: a === 'dos' ? 'Repartirlos entre Laura y Anna' : 'Pasárselos a ' + destino(a), ir: 'reparto/confirmar'},
        [{texto: 'Elegir a otra persona', hoja: 'h35', datos: {para: 'cartera'}}]);
    },
    acciones: {
      'deshacer-cartera'() { M.deshaz('d-teresa'); VETA.repinta({hecho: 'd-teresa'}); VETA.d1.numeros(); }
    }
  });

  VETA.pantalla('G5b', {
    titulo: 'Pasar sus clientes',
    frase: 'Esto es lo que va a pasar. Léelo y confirma.',
    fraseCuerpo: true,
    guia: ['Aquí Veta te dice exactamente qué va a pasar antes de tocar el trabajo de otra persona.', 'Tú lo lees y confirmas, o cancelas.', 'Así nadie se lleva una sorpresa: ni el equipo ni los clientes.'],
    pinta: () => {
      const a = X.carteraA(), dos = a === 'dos';
      const para = dos ? `${VETA.av('laura', 64)}${VETA.av('anna', 64)}` : VETA.av(a, 64);
      let h = `<div class="d-traspaso" data-i="0" aria-hidden="true">` +
        `<span class="d-tr-p">${VETA.av('teresa', 64)}<b>Teresa</b></span>` +
        `<span class="d-tr-via"><i class="d-tr-linea"></i><span class="d-tr-n">34</span></span>` +
        `<span class="d-tr-p${dos ? ' d-tr-dos' : ''}"><span class="d-tr-avs">${para}</span><b>${esc(destino(a))}</b></span></div>`;
      // «Qué cambia» va primero, justo bajo el dibujo; «De quién / A quién» repiten el dibujo y en el móvil no salen
      h += `<dl class="d-confirma" data-i="1">` +
        `<div><dt>Qué cambia</dt><dd>${dos ? 'Laura y Anna las verán' : esc(destino(a)) + ' las verá'} mañana en su Hoy. Los clientes no reciben nada: ${dos ? 'cada una decide' : esc(destino(a)) + ' decide'} cuándo escribe a cada uno.</dd></div>` +
        `<div><dt>Cuánto</dt><dd>34 conversaciones de 12 clientes activos, con 3 visitas esta semana. La próxima: jueves 26, 10:00, con Ramon Pujol.</dd></div>` +
        `<div class="d-solo-ancho"><dt>De quién</dt><dd>Teresa Gil, de baja desde el lunes 16.</dd></div>` +
        `<div class="d-solo-ancho"><dt>A quién</dt><dd>${dos ? 'Laura Martí y Anna Costa, oficina de Gràcia: 17 conversaciones cada una.' : esc(X.persona(a).nombre) + ', oficina de Gràcia.'}</dd></div></dl>`;
      h += UI.nota({texto: 'Cuando Teresa vuelva, se las devuelves desde Reparto.', icono: 'info', clase: 'nota-gris'});
      return h;
    },
    botonFijo: () => {
      const a = X.carteraA();
      return VETA.r7.botones({texto: a === 'dos' ? 'Repartirlos entre Laura y Anna' : 'Pasárselos a ' + destino(a), accion: 'pasar'});
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
