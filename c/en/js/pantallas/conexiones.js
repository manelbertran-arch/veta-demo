/* Veta demo · ronda 8 · pantallas · conexiones.js · carril D
   G7 · Conexiones y ajustes · #/conexiones — qué escucha Veta (interruptores) y una lista con lo demás. Sin iconos y sin botón.
   G7b · Qué ve cada uno · #/confianza — dos plegables (lo que ves tú, lo que ve cada uno) y la lista “Además” (cada fila abre H29)
   G7c · Parte diario del piloto · #/piloto */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, X = VETA.dir, D = VETA.datos, r7 = VETA.r7;
  const escucha = () => X.lee('escucha', {});                    // {id: false} = apagado

  VETA.pantalla('G7', {
    titulo: 'Connections and settings',
    sub: 'Each person chooses which chats I read.',
    pinta: () => {
      const e = escucha();
      return r7.lista(D.escucha.map(c => UI.interruptor({texto: c.texto, on: e[c.id] !== false, accion: 'escucha', de: c.id})), {i: 0}) +
        r7.lista([
          {nombre: 'The last thing I read', dato: `Today, ${VETA.ahora(-3)}`, hoja: 'h04', datos: {quien: 'equipo'}},
          {nombre: 'What each one sees', ir: 'confianza'},
          {nombre: 'Daily pilot wrap-up', ir: 'piloto'},
          {nombre: 'Security', ir: 'cuenta/seguridad'}], {i: 1});
    },
    acciones: {
      escucha(ev, el) {
        const id = el.dataset.de, on = el.getAttribute('aria-checked') === 'true', c = D.escucha.find(x => x.id === id) || {texto: id};
        const t = escucha(); t[id] = on; X.guarda('escucha', t);
        if (!on) VETA.aviso('I stop reading ' + c.texto + '.', {deshacer: () => { const u = escucha(); u[id] = true; X.guarda('escucha', u); VETA.repinta(); }});
        else VETA.aviso('Veta listens again to ' + c.texto + '.');
      }
    }
  });

  // dirección ve nombres (decisión de Manel, 21-nov), no chats. Nadie se compara
  VETA.pantalla('G7b', {
    titulo: 'What each one sees',
    sub: VETA.PROMESA.chats + ' Nobody is compared.',
    pinta: () => r7.lista([
        {nombre: 'What you see', pasa: 'Deals and people, without their chats',
          abre: '<p>You see every deal: who handles it, how it\'s going, what happened last and what\'s next. And each person: their deals and what Veta does for them, with no figures.</p>' +
            '<p>You don\'t see what they write to clients, their notes or their personal chats.</p>'},
        {nombre: 'What each one sees', pasa: 'Their own, in full; others\', nothing',
          abre: '<p>They see their own deals and clients in full, with their chats, and the same things you see about them.</p>' +
            '<p>They don\'t see inside other people\'s deals. There are no lists of who sells most.</p>'}], {i: 0}) +
      r7.lista([
        {nombre: 'What you can and can\'t see', hoja: 'h29', datos: {texto: 'ver'}},
        {nombre: 'How Veta looks after data', hoja: 'h29', datos: {texto: 'resumen'}},
        {nombre: 'What\'s kept and what\'s deleted', hoja: 'h29', datos: {texto: 'borrado'}},
        {nombre: 'What\'s been read and what goes out', hoja: 'h29', datos: {texto: 'leido'}},
        {nombre: 'Who said yes', hoja: 'h29', datos: {texto: 'consentimientos'}}], {rotulo: 'About the data', i: 1})
  });

  VETA.pantalla('G7c', {
    titulo: 'Daily pilot wrap-up',
    sub: 'Every afternoon, until  ' + VETA.fecha.corta('2026-12-15', {frase: true}) + '.',
    pinta: () => r7.tarjeta({veta: true, i: 0, de: `Today · ${D.fecha.hoyTexto}`, texto: '41 chats read. 27 cases found; 22 prepared; 9 completed (at 9:38). 19 awaiting approval.'}) +
      r7.lista([{nombre: 'Previous wrap-ups', dato: (D.partesPiloto || []).length, hoja: 'd-partes'}], {i: 1})
  });
})();
