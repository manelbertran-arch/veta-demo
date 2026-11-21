/* Veta demo · pantallas · veta.js · paquete C (Veta, cuenta y entrada)
   - A8 · Veta · #/veta
   Y las piezas que comparten las pantallas del paquete C (VETA.c): cuentas de chats, estado de reglas,
   la «línea en el sitio» con su Deshacer y el pintado del mapa. Se carga antes que el resto de pantallas de C. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo;
  const lee = (k, d) => VETA.est.lee('c.' + k, d), pon = (k, v) => VETA.est.pon('c.' + k, v);

  // ---- piezas comunes del paquete C ----
  const C = VETA.c = {lee, pon};
  const D = () => VETA.datos.c;
  // chats: los personales que vuelven a entrar (A15b, A18 paso 1) y los clientes que se dejan fuera (modelo)
  C.dentro = () => lee('dentro', []);
  C.leidos = () => M.chatsLeidos() + C.dentro().length;
  C.fuera = () => M.chatsFuera() - C.dentro().length;
  C.lecturaTexto = () => `I read ${VETA.num(C.leidos())} · ${C.fuera()} left out`;
  // reglas
  C.info = id => D().reglas[id] || {nombre: 'A rule', frase: ''};
  C.fechaPrueba = 'until 7 Dec';
  C.estadoRegla = r => {
    if (!r) return {etq: 'neutro', texto: ''};
    if (r.estado === 'propuesta') return {etq: 'propuesta', texto: 'Proposal · to decide'};
    if (r.estado === 'a-prueba') return {etq: 'a-prueba', texto: `On trial · day ${r.hora && !r.dia ? 1 : (r.dia || 1)} of ${r.pruebaDias || 14}`};
    if (r.estado === 'activa') return {etq: 'activa', texto: r.desde ? `Active · since ${r.desde}` : 'Active · since today'};
    if (r.estado === 'descartada') return {etq: 'neutro', texto: 'Dismissed'};
    return {etq: 'propuesta', texto: 'New rule · Proposal'};
  };
  // la cuenta de lo aprendido que queda
  C.aprendidoQueda = () => D().aprendido.filter(a => !lee('olvidados', []).includes(a.id)).length;
  // la marca dorada con «Ejemplo» al lado
  C.ejemplo = () => UI.etiqueta('ejemplo');
  // calendario conectado (H33)
  C.calendario = () => lee('calendario', null);
  // la pila contiene Cuenta: el primer día va en repaso
  C.repaso = () => VETA.pila().some(x => x.ruta === 'cuenta');

  // ---- A8 · Veta ----
  // dirección abre en «De la oficina»; su «Mías» es suya (sus mensajes y sus chats), nunca la de Laura
  const vista = () => (VETA.yo().papel === 'direccion' ? lee('vetaVista', 'oficina') : 'mias');

  function miasDir() {
    return UI.vacio({titulo: 'Nothing to decide', texto: 'When I see something that repeats in your chats, I\'ll propose it here.', icono: 'check', i: 0}) + UI.lista([
      {titulo: 'Your week', sub: `I prepared ${C.semanaDe().preparados} messages`, icono: 'grafica', ir: 'semana'},
      {titulo: 'Account and privacy', sub: C.lecturaTexto(), icono: 'escudo', ir: 'cuenta'}
    ], {i: 1});
  }
  // la semana de quien mira (Laura: 31 mensajes; Montse: los suyos)
  C.semanaDe = () => VETA.yo().id === 'montse' ? {preparados: 9, enviados: 8, retocados: 2, actas: 1, promesas: 2} : {preparados: 31, enviados: 27, retocados: 6, actas: 3, promesas: 4};

  function mias() {
    if (VETA.yo().papel === 'direccion') return miasDir();
    const r = M.regla('r-valoraciones'), res = M.resumenReglas(), info = C.info('r-valoraciones');
    let arriba;
    if (r && r.estado === 'propuesta') {
      arriba = UI.tarjeta(
        `<div class="c-prop-cab">${UI.etiqueta('propuesta', 'Proposal · to decide')}</div>` +
        `<p class="c-frase" data-g="The proposal|What Veta wants to do, in one sentence.">${esc(info.frase)}</p>` +
        `<p class="c-apoyo">I've seen it 14 times in your chats since August. In 3 of them you wrote something else.</p>` +
        UI.boton({texto: 'See the cases and decide', ir: 'regla/r-valoraciones', g: 'See the cases and decide|Opens the 14 cases and you decide whether to try it.'}),
        {clase: 'abierta c-propuesta', i: 0});
    } else {
      arriba = UI.vacio({titulo: 'Nothing to decide', texto: 'When I see something that repeats, I\'ll propose it here.', icono: 'check', i: 0});
    }
    const aPrueba = res.aPrueba, activas = res.activas;
    return arriba + UI.lista([
      {titulo: 'What I do for you', sub: `${activas} active rules · ${aPrueba} on trial`, icono: 'probeta', ir: 'reglas'},
      {titulo: 'What I\'ve learned', sub: C.aprendidoQueda() ? `${C.aprendidoQueda()} ${C.aprendidoQueda() === 1 ? 'new thing' : 'new things'} this week` : 'Nothing new this week', icono: 'aprende', ir: 'aprendido'},
      {titulo: 'Your week', sub: 'I prepared 31 messages', icono: 'grafica', ir: 'semana'},
      {titulo: 'Account and privacy', sub: C.lecturaTexto(), icono: 'escudo', ir: 'cuenta'}
    ], {i: 1});
  }

  function oficina() {
    const d = M.cosa('d-regla');
    const arriba = d && !M.RESUELTOS.includes(d.estado)
      ? UI.tarjeta(`<div class="c-prop-cab">${UI.etiqueta('por-decidir', 'To decide · office rule')}</div>` +
          `<p class="c-frase">Dossier the next day</p><p class="c-apoyo">Proposed by Laura Martí. In the office it has happened 23 times since August.</p>` +
          UI.boton({texto: 'See the cases and decide', ir: 'regla-oficina/dossier'}), {clase: 'abierta c-propuesta', i: 0})
      : UI.vacio({titulo: 'Nothing to decide in the office', texto: 'When someone proposes a rule for everyone, it shows here.', icono: 'check', i: 0});
    const n = D().practicas.length + (lee('practicaClaudia', false) ? 1 : 0);
    return arriba + UI.lista([
      {titulo: 'How we work', sub: `${n} practices`, icono: 'libro', ir: 'oficina/practicas'},
      {titulo: 'What the office learns', sub: 'Where deals stall', icono: 'grafica', ir: 'oficina/aprende'},
      {titulo: 'What Veta doesn\'t do yet', sub: '43 times by hand', icono: 'mano', ir: 'oficina/falta'},
      {titulo: 'What your office knows', sub: 'Of 301 contacts, 212 viewings', icono: 'ojo', ir: 'oficina/sabe'}
    ], {i: 1});
  }

  VETA.pantalla('A8', {
    titulo: 'Veta',
    guia: ['Here Veta tells you what it does for you and what it proposes.', 'You decide whether it tries it, no rush: none of this is urgent.', 'That way you teach it outside the working day, and it never acts without your permission.'],
    pinta: () => {
      const dir = VETA.yo().papel === 'direccion';
      const sel = dir ? `<div class="c-sel" data-i="0">${UI.selector({etiqueta: 'What to see', opciones: [{id: 'mias', texto: 'Mine'}, {id: 'oficina', texto: 'From the office'}], valor: vista(), accion: 'vista'})}</div>` : '';
      return sel + `<div class="c-vista" id="c-vista">${vista() === 'oficina' ? oficina() : mias()}</div>`;
    },
    acciones: {
      vista(ev, el) {
        pon('vetaVista', el.dataset.valor);
        const caja = document.getElementById('c-vista'); if (!caja) return;
        const pinta = () => { caja.innerHTML = el.dataset.valor === 'oficina' ? oficina() : mias(); VETA.mov.cascada(caja); };
        if (VETA.mov.hayVT() && !VETA.reducido()) { caja.style.viewTransitionName = 'c-vista'; document.startViewTransition(pinta).finished.finally(() => { caja.style.viewTransitionName = ''; }); }
        else pinta();
      }
    }
  });
})();
