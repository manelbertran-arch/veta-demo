/* Veta demo · pantallas · semana.js · carril C (Veta y cuenta)
   - A14 · Tu semana · #/semana   (pantalla de resultado: una cifra con su frase y listas de una línea; PLAN_R8.md, 8.2)
   La cifra es la suma de lo que te dejé listo (mensajes, actas y promesas): la misma que dirección ve de ti.
   Sin horas hasta que la persona pone sus tiempos (h24). Lo que cerré sola se abre otra vez desde su hoja (c-cerre). */
(function () {
  'use strict';
  const M = VETA.modelo, C = VETA.c;

  VETA.pantalla('A14', {
    titulo: 'Tu semana',
    pinta: () => {
      const R = VETA.r7, s = C.semanaDe(), dir = VETA.yo().papel === 'direccion';
      const cifra = R.cifra({valor: s.preparados + s.actas + s.promesas, frase: 'cosas que te dejé listas.', i: 0});
      const hice = [
        {nombre: 'Mensajes que te dejé escritos', pasa: `Enviaste ${s.enviados} · retocaste ${s.retocados}`, dato: s.preparados},
        {nombre: s.actas === 1 ? 'Acta de visita guardada' : 'Actas de visita guardadas', dato: s.actas},
        {nombre: 'Promesas apuntadas', dato: s.promesas}];
      // dirección: solo lo suyo; lo del equipo está en Veta de la oficina
      if (dir) return cifra + R.lista(hice, {rotulo: 'Lo que hice', i: 1}) + R.lista([
        {nombre: 'Lo que ven los demás', hoja: 'c-lee', datos: {que: 'ven'}},
        {nombre: 'La semana del equipo', ir: 'semana-equipo'}], {rotulo: 'Además', i: 2});
      const t = M.lee('tiempos', null), n = C.cerradas().length;
      return cifra +
        R.lista([n ? {nombre: 'Lo que cerré yo sola', dato: n, hoja: 'c-cerre'} : null].concat(hice), {rotulo: 'Lo que hice', i: 1}) +
        R.lista([
          t ? {nombre: 'Tiempo que te ahorré', dato: VETA.horas(M.minutosLaura(t)), hoja: 'h24'} : {nombre: 'Tus tiempos', hoja: 'h24'},
          {nombre: 'Lo que aún haces a mano', dato: VETA.datos.c.aMano.length, hoja: 'c-mano'},
          {nombre: 'Semanas anteriores', hoja: 'h25'}], {rotulo: 'Además', i: 2});
    }
  });
})();
