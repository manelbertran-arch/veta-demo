/* Veta demo · pantallas · oficina-que-hace.js · ronda 6 · paquete D (P3)
   G15 · #/oficina-que-hace · «Qué hace Veta por tu oficina», como la del agente: empieza con la escena en que Veta lee un chat
   (el WhatsApp de la oficina: Carmen López) y sigue con tres grupos: «Esto ya lo hago yo» · «Esto lo hacemos entre los dos» ·
   «Esto todavía no lo sé hacer». Cada fila, con un ejemplo de la oficina y «Verlo», que lleva a su sitio. */
(function () {
  'use strict';
  const UI = VETA.UI, X = VETA.dir;
  const grupo = (titulo, i, filas) => UI.bloque({titulo, i, html: UI.lista(filas.map(f => Object.assign({derecha: f.ir ? 'Verlo' : null}, f)))});
  VETA.pantalla('G15', {
    guia: ['Aquí ves todo lo que Veta hace por la oficina, con ejemplos de verdad.', 'Tú tocas «Verlo» para ir a su sitio en la app.', 'Así sabes qué hago yo, qué decides tú y qué no sé hacer todavía.'],
    pinta: () => {
      const n = VETA.datos.numeros, ops = X.ops(), par = X.paradas().length, sin = X.sinDueno().length;
      let h = `<div data-i="0">${VETA.vivo.escena({clave: 'oficina-que-hace', ir: 'operacion/carmen', boton: 'Verla en Operaciones',
        mensajes: [{quien: 'Carmen López', texto: 'Hola, buenas tardes'}, {quien: 'Carmen López', texto: 'Busco piso de 3 habitaciones en Gràcia, hasta 450.000 €', clave: true}],
        frase: '3 habitaciones en Gràcia', tarjeta: {av: 'carmen', nombre: 'Carmen López', quienEs: 'Contacto nuevo · no la lleva nadie', origen: 'WhatsApp de la oficina · ayer, 19:10', hecho: 'Te propongo que la lleve Laura, que lleva Gràcia. Decides tú.'}})}</div>`;
      h += grupo('Esto ya lo hago yo', 1, [
        {titulo: 'Leo el WhatsApp de la oficina y os aviso de cada contacto nuevo', sub: sin ? `Ahora hay ${sin} que no lleva nadie` : 'Ahora todos tienen quien los lleve', icono: 'entra', ir: 'entra'},
        {titulo: 'Apunto lo que se promete y aviso si no llega', sub: 'Jordi Ferrer espera el informe del piso antes del jueves', icono: 'mano', ir: 'operacion/jordi'},
        {titulo: 'Vigilo las operaciones que se paran', sub: `${par} llevan más de 7 días sin moverse`, icono: 'pausa', ir: 'operaciones'},
        {titulo: 'Os dejo listos los mensajes y las tareas', sub: `${n['7d'][1]} la semana pasada`, icono: 'check', ir: 'semana-equipo'}]);
      h += grupo('Esto lo hacemos entre los dos', 2, [
        {titulo: 'Te propongo quién lleva cada contacto nuevo', sub: 'Tú eliges. Carmen López: te propongo a Laura', icono: 'usuario', ir: 'asunto/carmen'},
        {titulo: 'Te propongo cosas que hacer igual en toda la oficina', sub: 'El informe del piso al día siguiente. Lo decides tú', icono: 'aprende', ir: 'regla-oficina/dossier'},
        {titulo: 'Preparo el resumen de la semana', sub: 'Lo envías tú al equipo', icono: 'enviar', ir: 'semana-equipo/resumen'},
        {titulo: `Te enseño cada operación (${ops.length}) y a cada persona`, sub: 'Sin leer sus chats ni sus notas', icono: 'equipo', ir: 'operaciones'}]);
      h += grupo('Esto todavía no lo sé hacer', 3, [
        {titulo: 'Contestar yo a los contactos nuevos', sub: 'Lo habéis hecho a mano 23 veces. Puedes enseñarme', icono: 'mic', ir: 'dictar/orden'},
        {titulo: 'Enviar mensajes sin que nadie los mire', sub: 'Durante el piloto, Veta no envía nada sin vuestra aprobación', icono: 'candado'},
        {titulo: 'Leer el correo, el calendario o el programa de la oficina', sub: 'Solo leo WhatsApp', icono: 'info'}]);
      return h;
    }
  });
})();
