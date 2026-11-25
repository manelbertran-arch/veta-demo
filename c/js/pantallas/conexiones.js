/* Veta demo · ronda 8 · pantallas · conexiones.js · carril D
   G7 · Conexiones y ajustes · #/conexiones — qué escucha Veta (interruptores) y una lista con lo demás. Sin iconos y sin botón.
   G7b · Qué ve cada uno · #/confianza — dos plegables (lo que ves tú, lo que ve cada uno) y la lista «Además» (cada fila abre H29)
   G7c · Parte diario del piloto · #/piloto */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, X = VETA.dir, D = VETA.datos, r7 = VETA.r7;
  const escucha = () => X.lee('escucha', {});                    // {id: false} = apagado

  VETA.pantalla('G7', {
    titulo: 'Conexiones y ajustes',
    sub: 'Cada persona elige qué chats leo.',
    pinta: () => {
      const e = escucha();
      return r7.lista(D.escucha.map(c => UI.interruptor({texto: c.texto, on: e[c.id] !== false, accion: 'escucha', de: c.id})), {i: 0}) +
        r7.lista([
          {nombre: 'Lo último que he leído', dato: `Hoy, ${VETA.ahora(-3)}`, hoja: 'h04', datos: {quien: 'equipo'}},
          {nombre: 'Qué ve cada uno', ir: 'confianza'},
          {nombre: 'Parte diario del piloto', ir: 'piloto'},
          {nombre: 'Seguridad', ir: 'cuenta/seguridad'}], {i: 1});
    },
    acciones: {
      escucha(ev, el) {
        const id = el.dataset.de, on = el.getAttribute('aria-checked') === 'true', c = D.escucha.find(x => x.id === id) || {texto: id};
        const t = escucha(); t[id] = on; X.guarda('escucha', t);
        if (!on) VETA.aviso('Dejo de leer ' + c.texto + '.', {deshacer: () => { const u = escucha(); u[id] = true; X.guarda('escucha', u); VETA.repinta(); }});
        else VETA.aviso('Veta vuelve a escuchar ' + c.texto + '.');
      }
    }
  });

  // dirección ve nombres (decisión de Manel, 21-nov), no chats. Nadie se compara
  VETA.pantalla('G7b', {
    titulo: 'Qué ve cada uno',
    sub: VETA.PROMESA.chats + ' Nadie se compara.',
    pinta: () => r7.lista([
        {nombre: 'Lo que ves tú', pasa: 'Operaciones y personas, sin sus chats',
          abre: '<p>Ves cada operación: quién la lleva, cómo va, lo último que pasó y qué toca. Y a cada persona: sus operaciones y lo que Veta hace por ella, sin cifras.</p>' +
            '<p>No ves lo que escribe con sus clientes, sus notas ni sus chats personales.</p>'},
        {nombre: 'Lo que ve cada uno', pasa: 'Lo suyo entero; de los demás, nada',
          abre: '<p>Ve sus operaciones y sus clientes enteros, con sus chats, y lo mismo que tú ves de ella.</p>' +
            '<p>No ve las operaciones de los demás por dentro. Listas de quién vende más no existen.</p>'}], {i: 0}) +
      r7.lista([
        {nombre: 'Qué puedes ver y qué no', hoja: 'h29', datos: {texto: 'ver'}},
        {nombre: 'Cómo cuida Veta los datos', hoja: 'h29', datos: {texto: 'resumen'}},
        {nombre: 'Qué se guarda y qué se borra', hoja: 'h29', datos: {texto: 'borrado'}},
        {nombre: 'Qué se ha leído y qué sale', hoja: 'h29', datos: {texto: 'leido'}},
        {nombre: 'Quién ha dicho que sí', hoja: 'h29', datos: {texto: 'consentimientos'}}], {rotulo: 'Sobre los datos', i: 1})
  });

  VETA.pantalla('G7c', {
    titulo: 'Parte diario del piloto',
    sub: 'Cada tarde, hasta el ' + VETA.fecha.corta('2026-12-15', {frase: true}) + '.',
    pinta: () => r7.tarjeta({veta: true, i: 0, de: `Hoy · ${D.fecha.hoyTexto}`, texto: 'Leídos 41 chats. Detectados 27 casos; preparados 22; completados 9 (a las 9:38). Esperan aprobación 19.'}) +
      r7.lista([{nombre: 'Partes anteriores', dato: (D.partesPiloto || []).length, hoja: 'd-partes'}], {i: 1})
  });
})();
