/* Veta demo · ronda 8 · pantallas · oficina-que-hace.js · carril D
   G15 · Lo que ya hago · #/oficina-que-hace — vuelven los tres grupos de la versión A (capacidad 19), como tres listas con rótulo:
   «Ya lo hago yo», «Lo hacemos entre los dos» y «Todavía no lo sé hacer», cada fila con un ejemplo de la oficina y su sitio.
   Y «Sobre Veta»: Cómo trabajamos · Lo que Veta aún no hace. */
(function () {
  'use strict';
  const X = VETA.dir, r7 = VETA.r7;
  VETA.pantalla('G15', {
    titulo: 'Lo que ya hago',
    pinta: () => {
      const n = VETA.datos.numeros, par = X.paradas().length, sin = X.sinDueno().length;
      const yo = [
        {nombre: 'Aviso de cada contacto nuevo', pasa: sin ? `Ahora hay ${sin} sin dueño` : 'Todos tienen quien los lleve', ir: 'entra'},
        {nombre: 'Apunto lo que se promete', pasa: 'Jordi espera el informe', ir: 'operacion/jordi'},
        {nombre: 'Vigilo las que se paran', pasa: `${par} llevan más de 7 días paradas`, ir: 'operaciones'},
        {nombre: 'Os dejo mensajes y tareas', pasa: `${n['7d'][1]} la semana pasada`, ir: 'semana-equipo'}];
      const dos = [
        {nombre: 'Quién lleva cada contacto', pasa: 'Propongo y tú eliges', ir: 'asunto/carmen'},
        {nombre: 'Trabajos iguales para todos', pasa: 'Lo decides tú', ir: 'regla-oficina/dossier'},
        {nombre: 'El resumen de la semana', pasa: 'Lo preparo y lo envías tú', ir: 'semana-equipo/resumen'},
        {nombre: 'Cada operación y persona', pasa: 'Sin leer sus chats', ir: 'operaciones'}];
      const aun = [
        {nombre: 'Contestar a contactos nuevos', pasa: 'Lo hacéis a mano', ir: 'dictar/orden'},
        {nombre: 'Enviar sin que nadie lo mire', pasa: 'En el piloto, nunca'}];
      return r7.lista(yo, {rotulo: 'Ya lo hago yo · ' + yo.length, i: 0}) +
        r7.lista(dos, {rotulo: 'Lo hacemos entre los dos · ' + dos.length, i: 1}) +
        r7.lista(aun, {rotulo: 'Todavía no lo sé hacer · ' + aun.length, i: 2}) +
        r7.lista([{nombre: 'Cómo trabajamos', ir: 'oficina/practicas'}, {nombre: 'Lo que Veta aún no hace', ir: 'oficina/falta'}], {rotulo: 'Sobre Veta', i: 3});
    }
  });
})();
