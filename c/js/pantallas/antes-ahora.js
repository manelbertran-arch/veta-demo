/* Veta demo · pantallas · antes-ahora.js · carril C (Veta y cuenta)
   A20 · #/antes-ahora · «Antes y ahora» (pantalla de resultado; PLAN_R8.md, 8.2): una cifra con su frase (las cosas por semana que ya
   hace Veta), dos barras (cuando empezamos y la semana pasada) y una lista. Cifras: VETA.datos.r6.veta.antesAhora. */
(function () {
  'use strict';
  const M = VETA.modelo, C = VETA.c;

  VETA.pantalla('A20', {
    titulo: 'Antes y ahora',
    sub: () => (M.lee('tiempos', null) ? 'Desde el 3 de septiembre. Las horas, con tus tiempos.' : 'Desde el 3 de septiembre. Las horas son un ejemplo.'),
    pinta: () => {
      const R = VETA.r7, a = C.r6().antesAhora;
      const t = M.lee('tiempos', null), min = M.minutosLaura(t || {mensajes: 4, actas: 12, avisos: 2});
      return R.cifra({valor: a.antes.valor - a.ahora.valor, frase: `cosas por semana ya las hago yo. Antes te tocaban ${a.antes.valor}; ahora, ${a.ahora.valor}.`, i: 0}) +
        R.barras([{valor: a.antes.valor, fecha: a.antes.rotulo}, {valor: a.ahora.valor, fecha: a.ahora.rotulo}], {etiqueta: 'Cosas tuyas por semana', i: 1}) +
        R.lista([
          {nombre: 'Qué ha cambiado', hoja: 'c-lee', datos: {que: 'cambio'}},
          {nombre: 'El tiempo que te ahorro', dato: VETA.horas(min), hoja: 'h24'},
          {nombre: 'Me corregiste 4 veces', ir: 'aprendido'}
        ], {i: 2});
    }
  });
})();
