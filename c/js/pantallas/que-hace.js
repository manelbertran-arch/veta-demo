/* Veta demo · pantallas · que-hace.js · ronda 6 · paquete C (P2)
   A19 · #/que-hace · «Qué hace Veta»: el sitio que lo explica todo (lo pidió Manel), sin manual.
   Empieza con la escena en que Veta lee un chat y lo convierte en tarjeta. Después, tres grupos:
   «Esto ya lo hago yo» · «Esto lo hacemos entre los dos» · «Esto todavía no lo sé hacer».
   Cada fila, con un ejemplo sacado de los datos de la demo y «Verlo», que lleva a su sitio en la app.
   Se llega desde Veta (A8), desde Hoy (P1) y desde el primer día (A18, paso 4). */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const oro = (t, k) => VETA.vivo.oro(t, {clave: 'qh-' + k});

  // [qué hago, ejemplo (html), adónde lleva «Verlo», rótulo opcional]
  const grupos = () => {
    const vis = C.visitas(), fuera = VETA.modelo.lectura().fuera;
    return [
      {id: 'yo', titulo: 'Esto ya lo hago yo', icono: 'check', filas: [
        ['Leo tus chats de trabajo', `Leo ${esc(VETA.num(C.leidos()))} chats. Los de ${esc(fuera[0] || 'tu familia')} y ${fuera.length - 1} más, no.`, 'cuenta/chats'],
        ['Apunto lo que te prometen', `Elena te dijo: «${oro('El miércoles te paso la nómina', 'elena')}». Si no llega, te aviso.`, 'espera'],
        ['Marco quién te ha contestado', 'Jordi te contestó el viernes. Así no le escribes dos veces lo mismo.', 'regla/r-contestado'],
        ['Te aviso antes de una firma', 'El lunes 30 te recuerdo la firma de Laia Casas y lo que hay que llevar.', 'regla/r-firmas'],
        ['Me acuerdo de cada cliente', 'Marta solo puede ver pisos los sábados. No le propongo otro día.', 'cliente/marta'],
        ['Quito lo que ya no hace falta', 'Si el cliente ya te ha contestado, lo quito de tu lista y te digo por qué.', 'hoy']
      ]},
      {id: 'dos', titulo: 'Esto lo hacemos entre los dos', icono: 'equipo', sub: 'Yo lo preparo. Tú decides.', filas: [
        ['Te dejo escritas las respuestas', `Marta preguntó: «${oro('¿Sigue disponible el piso de Gràcia?', 'gracia')}». La respuesta ya está escrita. Tú la envías.`, 'hoy'],
        ['Escribo el acta de la visita', 'Sales de Verdi con Elena, me cuentas cómo ha ido y el acta queda escrita.', 'visita/elena'],
        ['Preparo informes de propietario', 'El de Pere Soler, cada lunes desde el 7 oct. Tú lo envías.', 'regla/r-informes'],
        ['Te propongo otra fecha si cancelan', 'Jordi canceló el viernes. Le propondría el jueves 26 a las 18:00.', 'regla/r-cancelaciones', 'Lo estoy probando'],
        ['Aprendo cuando me corriges', 'Si cambias un mensaje, te pregunto una vez: «¿Lo hago siempre así?».', 'aprendido'],
        ['Te digo lo que repites', vis.estado === 'propuesta' ? 'Confirmar las visitas el día antes: lo has hecho 9 veces. ¿Lo hago yo?' : 'Confirmar las visitas el día antes: ' + esc(vis.texto.toLowerCase()) + '.', 'regla/r-visitas'],
        ['Aprendo lo que me pides hablando', '«Si alguien no contesta en tres días, prepárame un recordatorio.» Yo te lo propongo y tú decides.', 'dictar/orden']
      ]},
      {id: 'no', titulo: 'Esto todavía no lo sé hacer', icono: 'candado', filas: [
        ['Enviar mensajes sin ti', 'Durante el piloto no envío nada sin que tú digas que sí.', 'regla/r-visitas'],
        ['Apuntar en tu calendario', 'Te digo la hora de cada visita. Pasarla a tu calendario lo haces tú.', 'visitas'],
        ['Hacer todo lo que me pidas', 'Solo aprendo trabajos que ya he visto en tus chats. Mira cuáles son.', 'mapa']
      ]}
    ];
  };

  // ronda 7: la escena arriba y los tres grupos en filas con su número; cada grupo se abre en el sitio con sus trabajos (cada uno lleva a su sitio)
  const linea = ([t, ej, ir]) => `<button type="button" class="r7c-prop" data-ir="${esc(ir)}"><span><b>${esc(t)}</b></span>${VETA.ic('chev', 16)}</button>`;
  // cuántas cosas ya hago yo: el mismo número aquí y en «Antes y ahora»
  C.yaHago = () => grupos()[0].filas.length;

  VETA.pantalla('A19', {
    titulo: 'Veta en un minuto',
    frase: 'Leo tus chats de trabajo, te dejo listo lo que toca y aprendo de ti.',
    pinta: () => {
      const g = grupos(), NOMBRE = {yo: 'Lo hago yo', dos: 'Lo hacemos los dos', no: 'Aún no lo sé hacer'}, PASA = {yo: 'Sin que me lo pidas', dos: 'Yo lo preparo. Tú decides', no: 'Todavía no'};
      return `<div class="c-qh-escena" data-i="0">${VETA.vivo.escena({clave: 'que-hace', ir: 'hoy', boton: 'Verlo en Te toca a ti'})}</div>` +
        VETA.r7.lista(g.map(x => ({icono: x.icono, oro: x.id !== 'no', nombre: NOMBRE[x.id], pasa: PASA[x.id], numero: x.filas.length,
          abre: `<div class="r7c-props">${x.filas.map(linea).join('')}</div>`})), {i: 1, clase: 'r7c-tras'});
    }
  });
  void M;
})();
