/* Veta demo · pantallas · semana.js · carril C (Veta y cuenta)
   - A14 · Tu semana · #/semana   (pantalla de resultado: una cifra con su frase y listas de una línea; PLAN_R8.md, 8.2)
   La cifra es la suma de lo que te dejé listo (mensajes, actas y promesas): la misma que dirección ve de ti.
   Sin horas hasta que la persona pone sus tiempos (h24). Lo que cerré sola se abre otra vez desde su hoja (c-cerre). */
(function () {
  'use strict';
  const M = VETA.modelo, C = VETA.c;

  VETA.pantalla('A14', {
    titulo: 'Your week',
    pinta: () => {
      const R = VETA.r7, s = C.semanaDe(), dir = VETA.yo().papel === 'direccion';
      const cifra = R.cifra({valor: s.preparados + s.actas + s.promesas, frase: 'things I left ready for you.', i: 0});
      const hice = [
        {nombre: 'Messages I wrote for you', pasa: `You sent ${s.enviados} · you tweaked ${s.retocados}`, dato: s.preparados},
        {nombre: s.actas === 1 ? 'Viewing notes saved' : 'Viewing notes saved', dato: s.actas},
        {nombre: 'Promises noted', dato: s.promesas}];
      // dirección: solo lo suyo; lo del equipo está en Veta de la oficina
      if (dir) return cifra + R.lista(hice, {rotulo: 'What I did', i: 1}) + R.lista([
        {nombre: 'What others see', hoja: 'c-lee', datos: {que: 'ven'}},
        {nombre: 'The team\'s week', ir: 'semana-equipo'}], {rotulo: 'Also', i: 2});
      const t = M.lee('tiempos', null), n = C.cerradas().length;
      return cifra +
        R.lista([n ? {nombre: 'What I closed on my own', dato: n, hoja: 'c-cerre'} : null].concat(hice), {rotulo: 'What I did', i: 1}) +
        R.lista([
          t ? {nombre: 'Time I saved you', dato: VETA.horas(M.minutosLaura(t)), hoja: 'h24'} : {nombre: 'Your times', hoja: 'h24'},
          {nombre: 'What you still do by hand', dato: VETA.datos.c.aMano.length, hoja: 'c-mano'},
          {nombre: 'Previous weeks', hoja: 'h25'}], {rotulo: 'Also', i: 2});
    }
  });
})();
