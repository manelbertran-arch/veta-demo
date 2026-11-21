/* Veta demo · pantallas · reparto.js · paquete D (Dirección)
   G5 · Reparto · #/reparto — la cartera de Teresa (de baja) y los contactos que nadie lleva. No se toca su estructura.
   G5b · Pasar la cartera · #/reparto/confirmar — de quién, a quién, cuánto y qué cambia, antes de tocar nada. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;

  const destino = a => a === 'dos' ? 'Laura y Anna' : X.persona(a).corto;
  const lineaCartera = a => a === 'dos' ? '34 conversaciones de Teresa, repartidas entre Laura y Anna' : '34 conversaciones de Teresa, pasadas a ' + destino(a);

  const contactoFila = c => {
    const as = X.asignado(c.id);
    if (as) return UI.lineaHecho({texto: as.linea, hora: as.hora, vt: 'contacto-' + c.id, boton: {texto: 'Deshacer', accion: 'deshacer-contacto', de: c.id}});
    return UI.fila({titulo: c.nombre, sub: 'Yo se lo daría a ' + X.persona(c.propone).corto + ' · ' + c.cuando.replace('hoy, ', 'hoy ').replace('ayer, ', 'ayer ').replace(', 13:20', ''),
      av: c.id, ir: 'asunto/' + c.id, vt: 'contacto-' + c.id, focoFoto: true});
  };

  VETA.pantalla('G5', {
    titulo: 'Reparto',
    guia: ['Aquí Veta te enseña el trabajo que se ha quedado sin nadie: una cartera de baja y los contactos sin dueño.', 'Tú decides a quién pasa cada cosa.', 'Así ningún cliente espera porque alguien no está.'],
    pinta: () => {
      const hecha = X.cartera(), a = X.carteraA();
      const sin = (VETA.datos.contactos || []).filter(c => c.sinDueno);
      const quedan = sin.filter(c => !X.asignado(c.id)).length;
      let h = `<h2 class="bloque-t d-sec" data-i="0">Clientes de Teresa, sin atender</h2>`;
      h += `<div class="tarjeta d-cartera" data-i="1" data-vt="cola-d-teresa">` +
        `<div class="d-persona">${VETA.av('teresa', 64)}<span class="d-persona-c"><b>Teresa Gil</b><span>de baja desde el lunes 16</span></span></div>` +
        `<div class="d-tres">${[['34', 'Chats abiertos'], ['12', 'Clientes activos'], ['3', 'Visitas esta semana']].map(([n, t]) => `<div class="d-tres-c"><b>${n}</b><span>${t}</span></div>`).join('')}</div>`;
      if (hecha) {
        h += UI.lineaHecho({texto: (hecha.extra && hecha.extra.linea) || lineaCartera(a), hora: hecha.hora, boton: {texto: 'Deshacer', accion: 'deshacer-cartera'}}) +
          `<p class="bloque-sub">${esc(destino((hecha.extra && hecha.extra.a) || a))} las verá mañana en su Hoy. Cuando Teresa vuelva, se las devuelves desde aquí.</p>`;
      } else {
        h += `<p class="d-propone">${VETA.ic('rayo', 20)}<span>${a === 'laura' ? 'Yo se los pasaría a Laura Martí: misma oficina.' : a === 'anna' ? 'Has elegido a Anna Costa: misma oficina.' : 'Has elegido repartirla entre Laura y Anna: 17 y 17.'}</span></p>`;
      }
      h += '</div>';
      h += UI.bloque({titulo: 'Contactos que nadie lleva · ' + quedan, i: 2, html: `<div class="lista">${sin.map(contactoFila).join('')}</div>`});
      h += UI.lista([{titulo: 'Clientes con dos chats', sub: '2 unidos esta semana', icono: 'chat', hoja: 'h40'}], {i: 3});
      return h;
    },
    botonFijo: () => {
      if (X.cartera()) return '';
      const a = X.carteraA();
      return UI.boton({texto: a === 'dos' ? 'Repartir sus clientes entre Laura y Anna' : 'Pasar los clientes de Teresa a ' + destino(a), ir: 'reparto/confirmar'}) +
        UI.botones([{texto: 'Elegir a otra persona', hoja: 'h35', datos: {para: 'cartera'}}]);
    },
    acciones: {
      'deshacer-cartera'() { M.deshaz('d-teresa'); VETA.repinta({hecho: 'd-teresa'}); },
      'deshacer-contacto'(ev, el) { X.desasigna(el.dataset.de); VETA.repinta({hecho: 'contacto-' + el.dataset.de}); }
    }
  });

  VETA.pantalla('G5b', {
    titulo: 'Pasar sus clientes',
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
      return UI.boton({texto: a === 'dos' ? 'Repartir 34 conversaciones entre Laura y Anna' : 'Pasar 34 conversaciones de Teresa a ' + destino(a), accion: 'pasar'}) +
        UI.botones([{texto: 'Cancelar', atras: true}]);
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
