/* Veta demo · pantallas · oficina-que-hace.js · ronda 6 · paquete D (P3)
   G15 · #/oficina-que-hace · “Qué hace Veta por tu oficina”, como la del agente: empieza con la escena en que Veta lee un chat
   (ronda 7: la escena se quita) y sigue con una lista: lo que hago yo, lo que decides tú y lo que aún no sé. */
(function () {
  'use strict';
  const UI = VETA.UI, X = VETA.dir;
  // ronda 7 · D2: una sola lista (R2). La segunda línea dice de quién es: “Lo hago yo” (icono en oro), “Lo decides tú” o “Aún no”.
  VETA.pantalla('G15', {
    titulo: 'What I do for the office',
    frase: 'What I do on my own, what I have learned from you all and what I do not do yet.',
    // arreglo FD (defecto 2): aquí dentro va lo que antes eran filas sueltas de “Veta” (oficina): lo aprendido, cómo trabajamos,
    // lo que aún no hago (es lo mismo que pide el equipo: los 43 de G12, así que va en una fila). Fuera las filas “Lo decides tú” (están en Decidir) y “Cada operación” (Operaciones).
    pinta: () => {
      const n = VETA.datos.numeros, par = X.paradas().length, esc = VETA.esc, pide = (VETA.datos.r6.direccion || {}).pide || [];
      return VETA.r7.lista([
        {icono: 'entra', oro: true, nombre: 'I flag each new contact', pasa: 'I read the office WhatsApp', ir: 'entra'},
        {icono: 'mano', oro: true, nombre: 'I note what is promised', pasa: 'Jordi is waiting for the flat report', ir: 'operacion/jordi'},
        {icono: 'pausa', oro: true, nombre: 'I watch the ones that stop', pasa: `${par} still for over 7 days`, ir: 'operaciones'},
        {icono: 'check', oro: true, nombre: 'I leave messages and tasks', pasa: `${n['7d'][1]} last week`, ir: 'semana-equipo'},
        {icono: 'libro', nombre: 'What your office knows', pasa: 'What I see repeated in the chats', ir: 'oficina/sabe', clase: 'd1-sep'},
        {icono: 'aprende', nombre: 'What the office learns', pasa: 'Where deals stall', ir: 'oficina/aprende'},
        {icono: 'equipo', nombre: 'How we work', pasa: 'What you all do the same way', ir: 'oficina/practicas'},
        {icono: 'candado', nombre: 'What Veta doesn\'t do yet', pasa: `You do it by hand: ${pide.reduce((a, x) => a + x.veces, 0)} times`, ir: 'oficina/falta'}], {i: 0});
    }
  });
})();
