/* Veta demo · pantallas · oficina-que-hace.js · ronda 6 · paquete D (P3)
   G15 · #/oficina-que-hace · «Qué hace Veta por tu oficina», como la del agente: empieza con la escena en que Veta lee un chat
   (ronda 7: la escena se quita) y sigue con una lista: lo que hago yo, lo que decides tú y lo que aún no sé. */
(function () {
  'use strict';
  const UI = VETA.UI, X = VETA.dir;
  // ronda 7 · D2: una sola lista (R2). La segunda línea dice de quién es: «Lo hago yo» (icono en oro), «Lo decides tú» o «Aún no».
  VETA.pantalla('G15', {
    titulo: 'Lo que ya hago por la oficina',
    frase: 'Lo que hago sola, lo que he aprendido de vosotros y lo que aún no hago.',
    // arreglo FD (defecto 2): aquí dentro va lo que antes eran filas sueltas de «Veta» (oficina): lo aprendido, cómo trabajamos,
    // lo que aún no hago (es lo mismo que pide el equipo: los 43 de G12, así que va en una fila). Fuera las filas «Lo decides tú» (están en Decidir) y «Cada operación» (Operaciones).
    pinta: () => {
      const n = VETA.datos.numeros, par = X.paradas().length, esc = VETA.esc, pide = (VETA.datos.r6.direccion || {}).pide || [];
      return VETA.r7.lista([
        {icono: 'entra', oro: true, nombre: 'Aviso de cada contacto nuevo', pasa: 'Leo el WhatsApp de la oficina', ir: 'entra'},
        {icono: 'mano', oro: true, nombre: 'Apunto lo que se promete', pasa: 'Jordi espera el informe del piso', ir: 'operacion/jordi'},
        {icono: 'pausa', oro: true, nombre: 'Vigilo las que se paran', pasa: `${par} llevan más de 7 días quietas`, ir: 'operaciones'},
        {icono: 'check', oro: true, nombre: 'Os dejo listos mensajes y tareas', pasa: `${n['7d'][1]} la semana pasada`, ir: 'semana-equipo'},
        {icono: 'libro', nombre: 'Lo que sabe tu oficina', pasa: 'Lo que veo que se repite en los chats', ir: 'oficina/sabe', clase: 'd1-sep'},
        {icono: 'aprende', nombre: 'Lo que aprende la oficina', pasa: 'Dónde se paran las operaciones', ir: 'oficina/aprende'},
        {icono: 'equipo', nombre: 'Cómo trabajamos', pasa: 'Lo que hacéis todos igual', ir: 'oficina/practicas'},
        {icono: 'candado', nombre: 'Lo que Veta aún no hace', pasa: `Lo hacéis a mano: ${pide.reduce((a, x) => a + x.veces, 0)} veces`, ir: 'oficina/falta'}], {i: 0});
    }
  });
})();
