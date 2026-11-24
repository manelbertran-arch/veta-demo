/* Veta demo · pantallas · antes-ahora.js · carril C (Veta y cuenta)
   A20 · #/antes-ahora · “Antes y ahora” (pantalla de resultado; PLAN_R8.md, 8.2): una cifra con su frase (las cosas por semana que ya
   hace Veta), dos barras (cuando empezamos y la semana pasada) y una lista. Cifras: VETA.datos.r6.veta.antesAhora. */
(function () {
  'use strict';
  const M = VETA.modelo, C = VETA.c;

  VETA.pantalla('A20', {
    titulo: 'Before and now',
    sub: () => (M.lee('tiempos', null) ? 'Since 3 September. Hours, with your times.' : 'Since 3 September. The hours are an example.'),
    pinta: () => {
      const R = VETA.r7, a = C.r6().antesAhora;
      const t = M.lee('tiempos', null), min = M.minutosLaura(t || {mensajes: 4, actas: 12, avisos: 2});
      return R.cifra({valor: a.antes.valor - a.ahora.valor, frase: `things a week I now do. You used to have ${a.antes.valor}; now, ${a.ahora.valor}.`, i: 0}) +
        R.barras([{valor: a.antes.valor, fecha: a.antes.rotulo}, {valor: a.ahora.valor, fecha: a.ahora.rotulo}], {etiqueta: 'Your things per week', i: 1}) +
        R.lista([
          {nombre: 'What changed', hoja: 'c-lee', datos: {que: 'cambio'}},
          {nombre: 'The time I save you', dato: VETA.horas(min), hoja: 'h24'},
          {nombre: 'You corrected me 4 times', ir: 'aprendido'}
        ], {i: 2});
    }
  });
})();
