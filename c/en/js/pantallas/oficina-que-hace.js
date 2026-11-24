/* Veta demo · ronda 8 · pantallas · oficina-que-hace.js · carril D
   G15 · Lo que ya hago · #/oficina-que-hace — vuelven los tres grupos de la versión A (capacidad 19), como tres listas con rótulo:
   “Ya lo hago yo”, “Lo hacemos entre los dos” y “Todavía no lo sé hacer”, cada fila con un ejemplo de la oficina y su sitio.
   Y “Además”: Cómo trabajamos · Lo que Veta aún no hace. */
(function () {
  'use strict';
  const X = VETA.dir, r7 = VETA.r7;
  VETA.pantalla('G15', {
    titulo: 'What I already do',
    pinta: () => {
      const n = VETA.datos.numeros, par = X.paradas().length, sin = X.sinDueno().length;
      const yo = [
        {nombre: 'I flag each new contact', pasa: sin ? `${sin} have no owner right now` : 'Everyone has an owner right now', ir: 'entra'},
        {nombre: 'I note what is promised', pasa: 'Jordi is waiting for the flat report', ir: 'operacion/jordi'},
        {nombre: 'I watch the ones that stop', pasa: `${par} still for over 7 days`, ir: 'operaciones'},
        {nombre: 'I get messages and tasks ready', pasa: `${n['7d'][1]} last week`, ir: 'semana-equipo'}];
      const dos = [
        {nombre: 'Who takes each contact', pasa: 'I suggest, you choose', ir: 'asunto/carmen'},
        {nombre: 'Jobs everyone does the same', pasa: 'The flat report. You decide', ir: 'regla-oficina/dossier'},
        {nombre: 'The weekly summary', pasa: 'I prepare it, you send it', ir: 'semana-equipo/resumen'},
        {nombre: 'Every deal and person', pasa: 'Without reading their chats or notes', ir: 'operaciones'}];
      const aun = [
        {nombre: 'Reply to new contacts', pasa: 'You do it by hand. You can teach me', ir: 'dictar/orden'},
        {nombre: 'Send without anyone checking', pasa: 'In the pilot I send nothing without you'},
        {nombre: 'Read email or calendar', pasa: 'I only read WhatsApp'}];
      return r7.lista(yo, {rotulo: 'I already do it · ' + yo.length, i: 0}) +
        r7.lista(dos, {rotulo: 'We do it together · ' + dos.length, i: 1}) +
        r7.lista(aun, {rotulo: 'I can\'t do it yet · ' + aun.length, i: 2}) +
        r7.lista([{nombre: 'How we work', ir: 'oficina/practicas'}, {nombre: 'What Veta doesn\'t do yet', ir: 'oficina/falta'}], {rotulo: 'Also', i: 3});
    }
  });
})();
