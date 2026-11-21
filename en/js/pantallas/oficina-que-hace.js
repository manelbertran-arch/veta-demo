/* Veta demo · pantallas · oficina-que-hace.js · ronda 6 · paquete D (P3)
   G15 · #/oficina-que-hace · “Qué hace Veta por tu oficina”, como la del agente: empieza con la escena en que Veta lee un chat
   (el WhatsApp de la oficina: Carmen López) y sigue con tres grupos: “Esto ya lo hago yo” · “Esto lo hacemos entre los dos” ·
   “Esto todavía no lo sé hacer”. Cada fila, con un ejemplo de la oficina y “Verlo”, que lleva a su sitio. */
(function () {
  'use strict';
  const UI = VETA.UI, X = VETA.dir;
  const grupo = (titulo, i, filas) => UI.bloque({titulo, i, html: UI.lista(filas.map(f => Object.assign({derecha: f.ir ? 'See it' : null}, f)))});
  VETA.pantalla('G15', {
    guia: ['Here you see everything Veta does for the office, with real examples.', 'You tap “See it” to go to its place in the app.', 'This way you know what I do, what you decide and what I cannot do yet.'],
    pinta: () => {
      const n = VETA.datos.numeros, ops = X.ops(), par = X.paradas().length, sin = X.sinDueno().length;
      let h = `<div data-i="0">${VETA.vivo.escena({clave: 'oficina-que-hace', ir: 'operacion/carmen', boton: 'See her in Deals',
        mensajes: [{quien: 'Carmen López', texto: 'Hello, good afternoon'}, {quien: 'Carmen López', texto: 'Looking for a 3-bedroom flat in Gràcia, up to €450,000', clave: true}],
        frase: '3 bedrooms in Gràcia', tarjeta: {av: 'carmen', nombre: 'Carmen López', quienEs: 'New contact · nobody is handling her', origen: 'Office WhatsApp · yesterday, 19:10', hecho: 'I suggest that Laura handles her, as she looks after Gràcia. You decide.'}})}</div>`;
      h += grupo('This I already do', 1, [
        {titulo: 'I read the office WhatsApp and alert you to every new contact', sub: sin ? `Right now there are ${sin} that nobody is handling` : 'Right now everyone has someone handling them', icono: 'entra', ir: 'entra'},
        {titulo: 'I note what is promised and alert you if it does not arrive', sub: 'Jordi Ferrer is waiting for the flat report before Thursday', icono: 'mano', ir: 'operacion/jordi'},
        {titulo: 'I watch the deals that stall', sub: `${par} have not moved for more than 7 days`, icono: 'pausa', ir: 'operaciones'},
        {titulo: 'I get messages and tasks ready for you', sub: `${n['7d'][1]} last week`, icono: 'check', ir: 'semana-equipo'}]);
      h += grupo('This we do together', 2, [
        {titulo: 'I suggest who handles each new contact', sub: 'You choose. Carmen López: I suggest Laura', icono: 'usuario', ir: 'asunto/carmen'},
        {titulo: 'I suggest things to do the same way across the whole office', sub: 'The flat report the next day. You decide', icono: 'aprende', ir: 'regla-oficina/dossier'},
        {titulo: 'I prepare the summary of the week', sub: 'You send it to the team', icono: 'enviar', ir: 'semana-equipo/resumen'},
        {titulo: `I show you every deal (${ops.length}) and every person`, sub: 'Without reading their chats or their notes', icono: 'equipo', ir: 'operaciones'}]);
      h += grupo('This I cannot do yet', 3, [
        {titulo: 'Replying to new contacts myself', sub: 'You have done it by hand 23 times. You can teach me', icono: 'mic', ir: 'dictar/orden'},
        {titulo: 'Sending messages without anyone checking them', sub: 'During the trial, Veta sends nothing without your approval', icono: 'candado'},
        {titulo: 'Reading email, the calendar or the office software', sub: 'I only read WhatsApp', icono: 'info'}]);
      return h;
    }
  });
})();
