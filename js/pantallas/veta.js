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
  C.lecturaTexto = () => `Leo ${VETA.num(C.leidos())} · ${C.fuera()} ${C.fuera() === 1 ? 'queda' : 'quedan'} fuera`;
  // reglas
  C.info = id => D().reglas[id] || {nombre: 'Una regla', frase: ''};
  C.fechaPrueba = 'hasta el 7 dic';
  C.estadoRegla = r => {
    if (!r) return {etq: 'neutro', texto: ''};
    if (r.estado === 'propuesta') return {etq: 'propuesta', texto: 'Propuesta · por decidir'};
    if (r.estado === 'a-prueba') return {etq: 'a-prueba', texto: `A prueba · día ${r.hora && !r.dia ? 1 : (r.dia || 1)} de ${r.pruebaDias || 14}`};
    if (r.estado === 'activa') return {etq: 'activa', texto: r.desde ? `Activa · desde el ${r.desde}` : 'Activa · desde hoy'};
    if (r.estado === 'descartada') return {etq: 'neutro', texto: 'Descartada'};
    return {etq: 'propuesta', texto: 'Regla nueva · Propuesta'};
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
    return UI.vacio({titulo: 'Nada por decidir', texto: 'Cuando vea algo que se repite en tus chats, te lo propongo aquí.', icono: 'check', i: 0}) + UI.lista([
      {titulo: 'Tu semana', sub: `te preparé ${C.semanaDe().preparados} mensajes`, icono: 'grafica', ir: 'semana'},
      {titulo: 'Cuenta y privacidad', sub: C.lecturaTexto(), icono: 'escudo', ir: 'cuenta'}
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
        `<div class="c-prop-cab">${UI.etiqueta('propuesta', 'Propuesta · por decidir')}</div>` +
        `<p class="c-frase" data-g="La propuesta|Lo que Veta quiere hacer, dicho en una frase.">${esc(info.frase)}</p>` +
        `<p class="c-apoyo">Lo he visto 14 veces en tus chats desde agosto. En 3 escribiste otra cosa.</p>` +
        UI.boton({texto: 'Ver los casos y decidir', ir: 'regla/r-valoraciones', g: 'Ver los casos y decidir|Abre los 14 casos y decides si la pruebas.'}),
        {clase: 'abierta c-propuesta', i: 0});
    } else {
      arriba = UI.vacio({titulo: 'Nada por decidir', texto: 'Cuando vea algo que se repite, te lo propongo aquí.', icono: 'check', i: 0});
    }
    const aPrueba = res.aPrueba, activas = res.activas;
    return arriba + UI.lista([
      {titulo: 'Lo que hago por ti', sub: `${activas} reglas activas · ${aPrueba} a prueba`, icono: 'probeta', ir: 'reglas'},
      {titulo: 'Lo que he aprendido', sub: C.aprendidoQueda() ? `${C.aprendidoQueda()} ${C.aprendidoQueda() === 1 ? 'cosa nueva' : 'cosas nuevas'} esta semana` : 'Nada nuevo esta semana', icono: 'aprende', ir: 'aprendido'},
      {titulo: 'Tu semana', sub: 'te preparé 31 mensajes', icono: 'grafica', ir: 'semana'},
      {titulo: 'Cuenta y privacidad', sub: C.lecturaTexto(), icono: 'escudo', ir: 'cuenta'}
    ], {i: 1});
  }

  function oficina() {
    const d = M.cosa('d-regla');
    const arriba = d && !M.RESUELTOS.includes(d.estado)
      ? UI.tarjeta(`<div class="c-prop-cab">${UI.etiqueta('por-decidir', 'Por decidir · regla para la oficina')}</div>` +
          `<p class="c-frase">Dossier al día siguiente</p><p class="c-apoyo">La propone Laura Martí. En la oficina ha pasado 23 veces desde agosto.</p>` +
          UI.boton({texto: 'Ver los casos y decidir', ir: 'regla-oficina/dossier'}), {clase: 'abierta c-propuesta', i: 0})
      : UI.vacio({titulo: 'Nada por decidir en la oficina', texto: 'Cuando alguien proponga una regla para todos, sale aquí.', icono: 'check', i: 0});
    const n = D().practicas.length + (lee('practicaClaudia', false) ? 1 : 0);
    return arriba + UI.lista([
      {titulo: 'Cómo trabajamos', sub: `${n} prácticas`, icono: 'libro', ir: 'oficina/practicas'},
      {titulo: 'Lo que aprende la oficina', sub: 'Dónde se paran las operaciones', icono: 'grafica', ir: 'oficina/aprende'},
      {titulo: 'Lo que Veta aún no hace', sub: '43 veces a mano', icono: 'mano', ir: 'oficina/falta'},
      {titulo: 'Lo que sabe tu oficina', sub: 'De 301 contactos, 212 visitas', icono: 'ojo', ir: 'oficina/sabe'}
    ], {i: 1});
  }

  VETA.pantalla('A8', {
    titulo: 'Veta',
    guia: ['Aquí Veta te cuenta lo que hace por ti y lo que te propone.', 'Tú decides si lo prueba, sin prisa: nada de esto es urgente.', 'Así le enseñas fuera del día, y nunca actúa sin tu permiso.'],
    pinta: () => {
      const dir = VETA.yo().papel === 'direccion';
      const sel = dir ? `<div class="c-sel" data-i="0">${UI.selector({etiqueta: 'Qué ver', opciones: [{id: 'mias', texto: 'Mías'}, {id: 'oficina', texto: 'De la oficina'}], valor: vista(), accion: 'vista'})}</div>` : '';
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
