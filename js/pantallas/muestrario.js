/* Veta demo · pantallas · muestrario.js (núcleo)
   #/muestrario: fuera del mapa. Todos los componentes de la sección 5.3, la tarjeta de la cola con sus seis tipos,
   las cinco plantillas, las hojas y los 16 efectos de movimiento para tocar. Lo que se toca aquí no cambia la demo:
   las tarjetas de muestra llevan su propio estado. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  const local = {};                                  // estado de las tarjetas de muestra
  let ventana = '7d', cifra = 156, carga = false, ondaPausa = false;

  const muestra = id => {
    const c = VETA.modelo.cosa(id); if (!c) return null;
    const e = local[id] || {estado: 'por-hacer'};
    return Object.assign({}, c, {id: 'mu-' + id, base: id, estado: e.estado, hora: e.hora, extra: e.extra || {}});
  };
  const sec = (titulo, html, cod) => `<section class="mu-sec bloque"><h2 class="bloque-t">${esc(titulo)}${cod ? ` <span class="mu-cod">${esc(cod)}</span>` : ''}</h2>${html}</section>`;
  const baseDe = el => String(el.dataset.de || '').replace(/^mu-/, '');
  const pon = (el, estado, extra) => { const id = baseDe(el); local[id] = {estado, hora: VETA.ahora(), extra: Object.assign({}, (local[id] || {}).extra, extra || {})}; VETA.repinta({hecho: 'mu-' + id}); };

  // ---- ronda 6 · piezas vivas (VETA.vivo): todas a la vista y con su botón para probarlas ----
  let vNivel = 2, vLleva = false;
  const pieza = (rotulo, html) => `<p class="v-mu-r">${esc(rotulo)}</p>${html}`;
  const vivas = () => {
    const Vv = VETA.vivo, m = VETA.modelo.cosa('c-marta');
    const fila = (id, t, sub) => UI.fila({titulo: t, sub, av: id, vt: 'mu-v-' + id, datos: {muda: '1'}});
    const mias = [vLleva ? null : fila('elena', 'Elena Vives', 'Confirmar la visita de mañana'), fila('marta', 'Marta Puig', 'Contestar: pide ver el piso'), fila('pere', 'Pere Soler', 'Enviar el informe de la semana')].filter(Boolean);
    return `<div class="v-mu">` +
      pieza('1 · Oro: el trazo se dibuja una vez bajo la frase que prueba algo', `<p class="hoja-x">Marta escribió: «${Vv.marca(m.cita.texto + ', por la mañana mejor', 'Podríamos verlo este sábado')}».</p>`) +
      pieza('2 · Anillo: casos contados o veces vistas, en tres tamaños', `<div class="v-mu-fila">${Vv.anillo({van: 11, de: 14, tam: 's', texto: '11 de 14 casos'})}${Vv.anillo({van: 11, de: 14})}${Vv.anillo({veces: 9})}${Vv.anillo({van: 11, de: 14, tam: 'l'})}</div>`) +
      pieza('3 · Escalera: mini (en línea) y completa, con los casos delante para subir', `<p class="hoja-x">Confirmar visitas: ${Vv.escalera({nivel: vNivel, desde: 'el 12 nov', mini: true})}</p>` +
        UI.tarjeta(Vv.escalera({nivel: vNivel, desde: vNivel === 2 ? 'el 12 nov' : 'hoy', sube: {hechas: 14, corregidas: 1, pregunta: vNivel === 2 ? '¿Apunto yo la visita sin preguntarte?' : '¿Te lo dejo listo para enviar con un toque?', boton: 'Sí, sube un peldaño', accion: 'v-sube'}})) +
        (vNivel > 2 ? UI.boton({tipo: 'texto', texto: 'Volver al peldaño 2', accion: 'v-baja'}) : '')) +
      pieza('4 · Hilo: dijo → preparé → decidiste → aprendí', UI.tarjeta(Vv.hilo([
        {paso: 'Dijo', texto: '«' + m.cita.texto + '»', cuando: m.cita.origen},
        {paso: 'Preparé', texto: 'La respuesta, con día y hora: sábado a las 11:00.'},
        {paso: 'Decidiste', texto: 'Cambiaste «¿cuándo te va bien?» por dos horas concretas.'},
        {paso: 'Aprendí', texto: 'Cuando propongas una visita, doy dos horas.', cuando: 'Ejemplo'}]))) +
      pieza('5 · Cuenta: la cifra rueda de un valor a otro', `<p class="hoja-x">Hoy te tocan <b>${Vv.cuenta({de: 9, a: 6})}</b> · hace un mes, 9.</p>`) +
      pieza('6 · Antes y ahora: dos columnas y la línea de seis semanas', UI.tarjeta(Vv.antesAhora({
        antes: {rotulo: 'El primer día', valor: 46, unidad: 'cosas tuyas por semana'}, ahora: {rotulo: 'Hoy', valor: 21, unidad: 'cosas tuyas por semana'}, semanas: [46, 41, 37, 30, 25, 21]}))) +
      pieza('7 · Escena «Veta lee»: caen los mensajes, el oro subraya y la frase se vuelve la tarjeta', Vv.escena({ir: 'muestrario/abierta', boton: 'Ver la tarjeta'})) +
      pieza('8 · Pulso (Veta trabajando) y halo mientras escucha', `<div class="v-mu-fila">${Vv.pulso({ahora: 'Leyendo 3 chats nuevos…', texto: 'Al día · leído hasta las ' + VETA.ahora(-3)})}</div>` +
        UI.boton({tipo: 'secundario', texto: 'Escuchar 3 segundos', accion: 'v-halo', icono: 'mic'})) +
      pieza('9 · Paso: la fila se muda de bloque, la lista se recoloca y la tarjeta se abre desde su sitio',
        `<div class="tarjeta"><h3 class="bloque-t">Para ti hoy · ${Vv.cuenta({de: vLleva ? 3 : 2, a: vLleva ? 2 : 3, clave: 'mu-v-n' + vLleva})}</h3>${UI.lista(mias)}` +
        `<h3 class="bloque-t">Lo llevo yo</h3>${vLleva ? UI.lista([fila('elena', 'Elena Vives', 'Visita confirmada · lo hice yo')]) : '<p class="bloque-sub">Nada todavía.</p>'}</div>` +
        UI.boton({tipo: 'secundario', texto: vLleva ? 'Devolvérmelo' : 'Que confirme Veta las visitas', accion: 'v-lleva'}) +
        `<div class="tarjeta" data-foco="tarjeta"><div class="v-es-quien">${VETA.av('marta', 40)}<span><b>${esc(m.titulo)}</b><span>${esc(m.quienEs)}</span></span></div>` +
        UI.boton({tipo: 'secundario', texto: 'Abrir desde su sitio', ir: 'muestrario/abierta'}) + `</div>`) +
      pieza('10 · Aviso con deshacer: anillo de cuenta atrás; al deshacer, enseña', UI.boton({tipo: 'secundario', texto: 'Cerrar algo y deshacer', accion: 'v-aviso'})) +
      pieza('11 · «De dónde sale» (H01): la frase literal subrayada y la fecha en una pastilla', UI.tarjeta(UI.cita({texto: m.cita.texto, origen: m.cita.origen, de: 'c-marta'}))) +
      UI.boton({tipo: 'texto', texto: 'Dibujarlo todo otra vez', accion: 'v-otra'}) + `</div>`;
  };
  VETA.pantalla('muestrario-abierta', {
    ruta: 'muestrario/abierta', titulo: 'Marta Puig', destino: null, grupo: 'Núcleo',
    guia: ['Aquí ves una tarjeta que se ha abierto desde su sitio.', 'Tú vuelves atrás.', 'Así se usa data-foco="tarjeta".'],
    pinta: () => { const m = VETA.modelo.cosa('c-marta'); return `<div class="tarjeta" data-foco="tarjeta" data-i="0"><div class="v-es-quien">${VETA.av('marta', 40)}<span><b>${esc(m.titulo)}</b><span>${esc(m.quienEs)}</span></span></div>` +
      UI.cita({texto: m.cita.texto, origen: m.cita.origen, de: 'c-marta'}) + UI.borrador({texto: m.borrador}) + `</div><p class="intro" data-i="1">La tarjeta de la pantalla anterior y esta llevan data-foco="tarjeta": viaja y crece hasta su sitio.</p>`; }
  });

  VETA.pantalla('muestrario', {
    ruta: 'muestrario', titulo: 'Muestrario', destino: null, ancha: true, grupo: 'Núcleo',
    guia: ['Aquí están todos los componentes del núcleo.', 'Tú los tocas para ver cómo responden.', 'Así los paquetes saben qué usar.'],
    pinta: () => {
      const yo = VETA.yo();
      const tipos = ['c-marta', 'c-elena', 'c-pere', 'c-nuria', 'c-jordi', 'c-sergi'].map(muestra);
      const hojas = Object.values(VETA.HOJAS);
      return [
        `<p class="intro" data-i="0">Todo lo que el núcleo da a los paquetes. Lo que toques aquí no cambia la demo.</p>`,
        sec('Piezas vivas', vivas(), 'ronda 6 · VETA.vivo'),
        sec('Banda de destino', `<div class="mu-banda"><div class="cab cab-banda"><span class="cab-t">Hoy</span><span class="cab-yo">${VETA.av(yo.id, 36, {aro: true})}</span></div></div>`),
        sec('Cabecera de detalle', `<div class="mu-banda"><div class="cab cab-detalle"><button type="button" class="cab-atras" data-accion="toca">${VETA.ic('atras', 20)}</button><span class="cab-t">Pere Soler</span><span class="cab-der"></span></div></div>`),
        sec('Barra y micro «Dictar»', `<div class="mu-barra"><div class="barra"><div class="tabs">` +
          [['hoy', 'Hoy', 'hoy', 3], ['clientes', 'Clientes', 'clientes'], ['aprende', 'Veta', 'veta']].map(([ic, t, k, n], i) =>
            `<button type="button" class="tab${i === 0 ? ' on' : ''}" data-accion="toca"><span class="tab-ic">${VETA.ic(ic, 24)}${n ? `<span class="contador"><span class="contador-n">${n}</span></span>` : ''}</span><span class="tab-p">${t}</span></button>`).join('') +
          `</div><button type="button" class="mic" data-accion="toca" aria-label="Dictar"><span class="mic-c">${VETA.ic('mic', 26)}</span><span class="mic-p">Dictar</span></button></div></div>`),
        sec('Botones', UI.boton({texto: 'Botón principal', accion: 'toca'}) + UI.botones([{texto: 'Secundario', accion: 'toca'}, {texto: 'Otro', accion: 'toca'}]) +
          `<div class="mu-fila">${UI.boton({tipo: 'texto', texto: 'Deshacer', accion: 'toca'})}${UI.boton({tipo: 'texto', texto: 'No lo envié', accion: 'toca'})}${UI.boton({tipo: 'redondo', texto: 'Llamar', icono: 'telefono', accion: 'toca'})}${UI.boton({tipo: 'redondo', texto: 'WhatsApp', icono: 'chat', accion: 'toca'})}</div>`),
        sec('Etiquetas', `<div class="mu-fila">${Object.keys(UI.ETIQUETAS).map(k => UI.etiqueta(k)).join('')}</div>`),
        sec('Filas y lista', UI.lista([
          {titulo: 'Pere Soler', sub: 'Propietario del piso de Verdi 42', av: 'pere', ir: 'muestrario/lista', focoFoto: true},
          {titulo: 'Carmen López', sub: 'Iniciales cuando no hay foto', av: 'carmen', etiqueta: 'te-toca', ir: 'muestrario/lista'},
          {titulo: 'Verdi 42, 3.º 2.ª', sub: 'Con miniatura de piso', foto: 'verdi', derecha: '395.000 €', ir: 'muestrario/lista'},
          {titulo: 'Con icono', sub: 'Y sin «›» porque no se toca', icono: 'reloj'}])),
        sec('Tarjeta', UI.tarjeta(`<p class="hoja-x">Radio 20, borde fino y sombra. Una abierta por pantalla.</p>`)),
        sec('Cita y borrador', UI.cita({texto: '¿Sigue disponible el piso de Gràcia? Podríamos verlo este sábado', origen: 'Marta · ayer, 18:42', de: 'c-marta'}) +
          UI.borrador({texto: 'Hola, Marta, soy Laura. ¿Os va bien este sábado a las 11:00 para ver el piso de Gràcia?'}) +
          UI.borrador({html: 'Hola, Jordi, soy Laura. Te paso el informe del piso: planos, nota simple <mark>y gastos de comunidad</mark>.'}) +
          UI.nota({texto: 'No sale hasta que tú lo envíes', icono: 'candado'}) + UI.nota({texto: 'Aviso con candado, en caja.', icono: 'candado', caja: true})),
        sec('Línea de hecho', UI.lineaHecho({texto: 'Enviado a Marta', hora: VETA.ahora(), hoja: 'h03', de: 'c-marta', boton: {texto: 'No lo envié', accion: 'toca'}})),
        sec('La tarjeta de la cola · seis tipos', tipos.map((c, k) => UI.tarjetaCosa(c, {n: k + 1, total: 6})).join('')),
        sec('Cifra grande y ocho números', UI.cifra({valor: cifra, unidad: 'casos preparados', periodo: 'últimos 7 días', id: 'mu-cifra'}) +
          UI.boton({tipo: 'secundario', texto: 'Hacer rodar la cifra', accion: 'rueda'}) +
          UI.selector({etiqueta: 'Periodo', opciones: [{id: '7d', texto: 'Últimos 7 días'}, {id: 'desde', texto: 'Desde el 3 oct'}], valor: ventana, accion: 'ventana'}) +
          UI.ochoNumeros(ventana)),
        sec('Barra de pasos', UI.pasos({hecho: 3, total: 5, texto: 'La venta · Visitas · paso 3 de 5'})),
        sec('Campo, interruptor y selector de dos', UI.campo({etiqueta: 'Nombre', placeholder: 'Escribe aquí'}) + UI.campo({buscar: true, placeholder: 'Pregunta a Veta por un cliente'}) +
          UI.campo({etiqueta: 'Mensaje', area: true, valor: 'Hola, Marta, soy Laura.'}) +
          UI.interruptor({texto: 'Guía', sub: 'Explica lo que tocas', on: VETA.guia.on(), accion: 'guia'}) +
          UI.selector({etiqueta: 'Qué clientes', opciones: [{id: 'mios', texto: 'Míos'}, {id: 'todos', texto: 'Todos'}], valor: 'mios', accion: 'toca'})),
        sec('Fotos y avatares', `<div class="mu-fila">${UI.foto('verdi', {tam: 'mini', ampliar: true})}${UI.foto('atico', {tam: 'mini', ampliar: true})}<span class="foto foto-mini" aria-label="Sin foto"><i class="foto-res">${VETA.ic('casa', 24)}</i></span></div>` +
          UI.foto('verdi', {tam: 'ancha'}) +
          `<div class="mu-fila">${VETA.av('laura', 32)}${VETA.av('laura', 36, {aro: true})}${VETA.av('marta', 40)}${VETA.av('pere', 64)}${VETA.av('montse', 40)}${VETA.av('toni', 64)}</div>`),
        sec('Estados de pantalla', (carga ? UI.silueta(3) : UI.tarjeta('<p class="hoja-x">El contenido ya ha llegado.</p>')) +
          UI.boton({tipo: 'secundario', texto: 'Cargar otra vez', accion: 'carga'}) +
          UI.vacio({titulo: 'Eso es todo por hoy', texto: 'Una frase que dice qué pasa y cuál es el paso siguiente.', icono: 'check'}) +
          UI.error({texto: 'No he podido cargar esto.'}) + `<div class="lista">${UI.sinRed()}</div>`),
        sec('Onda de dictar', `<div class="mu-fila">${UI.onda({pausada: ondaPausa})}${UI.boton({tipo: 'secundario', texto: ondaPausa ? 'Seguir' : 'Pausa', accion: 'onda', ancho: false})}</div>`),
        sec('Los 16 efectos', `<div class="mu-efectos">` + [
          ['1 · Apretar', 'toca'], ['2 · Ir adelante', 'ir-lista'], ['3 · Cambiar de pestaña', 'pestana'], ['4 · Foto que viaja', 'foco'],
          ['5 · Cascada', 'cascada'], ['6 · Hoja', 'hoja'], ['7 · Hecho en el sitio', 'hecho'], ['8 · Aviso negro', 'aviso'],
          ['9 · Cifra que rueda', 'rueda'], ['10 · Sombra al bajar', 'baja'], ['11 · Foto que se encoge', 'encoge'], ['12 · Silueta', 'carga'],
          ['13 · Onda', 'onda'], ['14 · Portada', 'portada'], ['15 · Interruptor', 'guia-demo'], ['16 · Tema', 'tema']
        ].map(([t, a]) => UI.boton({tipo: 'secundario', texto: t, accion: a})).join('') + '</div>' +
          `<div class="mu-informe" id="mu-informe"><p>Baja dentro de este recuadro: la foto se encoge al salir (efecto 11).</p>${UI.foto('verdi', {tam: 'ancha'}).replace('class="foto foto-ancha', 'class="foto foto-ancha foto-encoge')}<p>Texto del informe que sigue debajo de la foto.</p><p>Más texto.</p><p>Y más texto para poder bajar.</p><p>Fin.</p></div>`),
        sec('Plantillas', UI.lista([
          {titulo: 'Pantalla de lista', sub: 'VETA.lista', ir: 'muestrario/lista', icono: 'hoy'},
          {titulo: 'Pantalla de confirmación', sub: 'VETA.confirma', ir: 'muestrario/confirma', icono: 'check'},
          {titulo: 'Hoja de acciones', sub: 'VETA.hojaAcciones', hoja: 'mu-acciones', icono: 'puntos'},
          {titulo: 'Hoja de texto', sub: 'VETA.hojaTexto', hoja: 'mu-texto', icono: 'doc'},
          {titulo: 'Hoja de elegir', sub: 'VETA.hojaElegir', hoja: 'mu-elegir', icono: 'usuario'}])),
        sec('Las 42 hojas', UI.lista(hojas.map(h => ({titulo: h.titulo, sub: h.cod + ' · ' + (VETA.hojaDefs[h.id] ? 'hecha' : 'pendiente del paquete ' + h.paq), hoja: h.id,
          datos: h.id === 'h01' || h.id === 'h02' ? {de: 'c-marta'} : h.id === 'h17' ? {piso: 'verdi'} : h.id === 'h29' ? {texto: 'acuerdo'} : h.id === 'h41' ? {parte: 'socios'} : null}))))
      ].join('');
    },
    acciones: {
      toca() {},
      // tarjetas de muestra: su propio estado
      principal(ev, el) { const c = VETA.modelo.cosa(baseDe(el)); pon(el, c && c.sale ? 'pregunta-envio' : 'hecha'); },
      'si-enviado'(ev, el) { pon(el, 'enviada'); }, 'ya-lo-envie'(ev, el) { pon(el, 'enviada'); },
      'todavia-no'(ev, el) { pon(el, 'por-hacer'); }, 'no-lo-envie'(ev, el) { delete local[baseDe(el)]; VETA.repinta({hecho: el.dataset.de}); },
      deshacer(ev, el) { delete local[baseDe(el)]; VETA.repinta({hecho: el.dataset.de}); },
      quitar(ev, el) { pon(el, 'quitada'); },
      copiar(ev, el) { VETA.aviso('Texto copiado. Envíalo desde tu WhatsApp.'); pon(el, 'por-hacer', {boton: {texto: 'Ya lo envié', accion: 'ya-lo-envie'}, secundarios: [{texto: 'Copiar otra vez', accion: 'copiar'}]}); },
      // piezas vivas
      'v-sube'() { vNivel = Math.min(vNivel + 1, 4); VETA.repinta({paso: true}); },
      'v-baja'() { vNivel = 2; VETA.repinta({paso: true}); },
      'v-lleva'() { vLleva = !vLleva; VETA.repinta({paso: true}); },
      'v-halo'() { VETA.vivo.halo(true); setTimeout(() => VETA.vivo.halo(false), 3000); },
      'v-aviso'() { VETA.aviso('Cerrado: Marta ya contestó.', {deshacer: () => {}, ensena: 'Entendido: no lo cierro sin preguntarte.'}); },
      'v-otra'() { VETA.vivo.olvida(); VETA.repinta(); },
      // efectos
      'ir-lista'() { VETA.ir('muestrario/lista'); },
      pestana() { VETA.ir('clientes', {pestana: true}); },
      foco() { const f = VETA.$('.col.activa .fila[data-ir="muestrario/lista"]'); if (f) f.click(); },
      cascada() { VETA.mov.cascada(VETA.$('.col.activa .pant')); },
      hoja() { VETA.hoja('h26'); },
      hecho() { const b = VETA.$('.col.activa .tc [data-accion="principal"]'); if (b) { b.scrollIntoView({block: 'center'}); b.click(); } },
      aviso() { VETA.aviso('Texto copiado.', {deshacer: () => VETA.aviso('Deshecho.')}); },
      rueda() { cifra = cifra === 156 ? 1012 : 156; VETA.rueda(document.getElementById('mu-cifra'), cifra); },
      ventana(ev, el) { ventana = el.dataset.valor; VETA.modelo.numeros(ventana).forEach((n, k) => VETA.rueda(VETA.$('.col.activa [data-n8="' + k + '"]'), n.valor)); },
      baja() { const d = VETA.$('.col.activa .desplaza'); if (d) d.scrollBy({top: 240, behavior: VETA.reducido() ? 'auto' : 'smooth'}); },
      encoge() { const m = document.getElementById('mu-informe'); if (m) { m.scrollIntoView({block: 'center'}); m.scrollBy({top: 200, behavior: VETA.reducido() ? 'auto' : 'smooth'}); } },
      carga() { carga = true; VETA.repinta(); setTimeout(() => { carga = false; VETA.repinta(); }, 1200); },
      onda() { ondaPausa = !ondaPausa; const o = VETA.$('.col.activa .onda'); if (o) o.classList.toggle('pausada', ondaPausa); const b = VETA.$('.col.activa [data-accion="onda"].btn-suelto span'); if (b) b.textContent = ondaPausa ? 'Seguir' : 'Pausa'; },
      portada() { VETA.est.pon('portadaVista', false); VETA.ir('portada'); },
      guia(ev, el) { VETA.guia.pon(el.getAttribute('aria-checked') === 'true'); },
      'guia-demo'() { const i = VETA.$('.col.activa .interr'); if (i) { i.scrollIntoView({block: 'center'}); i.click(); } },
      tema() { VETA.tema.pon({modo: document.documentElement.dataset.modo === 'oscuro' ? 'claro' : 'oscuro'}); }
    }
  });

  // las plantillas, con datos de ejemplo
  VETA.lista('muestrario-lista', {
    ruta: 'muestrario/lista', titulo: 'Pere Soler', destino: null, grupo: 'Núcleo',
    cabDerecha: () => VETA.av('pere', 32, {foco: 'foto'}),
    guia: ['Aquí ves una pantalla hecha solo con datos.', 'Tú tocas una fila.', 'Así se hacen las de prioridad 2.'],
    intro: 'Una pantalla de lista: bloques con título y filas. La foto de la cabecera es la que ha viajado desde la fila.',
    bloques: [{titulo: 'Lo último', filas: [{titulo: 'Informe enviado', sub: 'Lun 16', icono: 'papel', hoja: 'h41', datos: {parte: 'socios'}}, {titulo: 'Mensaje', sub: 'Sáb 21, 21:10', icono: 'chat'}]},
      {titulo: 'Más', filas: [{titulo: 'Ir a la confirmación', ir: 'muestrario/confirma', icono: 'check'}]}],
    pie: 'Ejemplo con datos inventados.'
  });
  VETA.confirma('muestrario-confirma', {
    ruta: 'muestrario/confirma', titulo: 'Pasar sus clientes', destino: null, grupo: 'Núcleo',
    texto: 'Una pantalla de confirmación: qué va a pasar, los detalles y un botón.',
    filas: [{titulo: '34 conversaciones', sub: 'De Teresa Gil a Laura Martí', av: 'teresa'}, {titulo: '3 visitas esta semana', icono: 'cal'}],
    nota: 'Nadie recibe nada hasta que lo apruebes.',
    boton: {texto: 'Pasar los clientes a Laura'},
    alConfirmar: () => ({aviso: 'Clientes pasados a Laura.'})
  });
  VETA.hojaAcciones('mu-acciones', {
    titulo: 'Marta Puig', texto: 'Una hoja de acciones: opciones como filas de 56.',
    opciones: [{texto: 'Ya lo llevé por teléfono', hace: () => VETA.aviso('Resuelto · lo llevaste por teléfono.')}, {texto: 'Ver la ficha', sub: 'Abre otra pantalla', ir: 'muestrario/lista'}, {texto: 'Descartarlo', peligro: true, hace: () => VETA.aviso('Descartado.')}]
  });
  VETA.hojaTexto('mu-texto', {titulo: 'Una hoja de texto', bloques: [{texto: 'Bloques de texto con título opcional.'}, {titulo: 'Con lista', lista: ['Uno', 'Dos', 'Tres']}]});
  VETA.hojaElegir('mu-elegir', {
    titulo: '¿A quién se lo asignas?', texto: 'Una hoja de elegir.',
    opciones: [{id: 'laura', texto: 'Laura Martí', sub: 'Gràcia', av: 'laura'}, {id: 'anna', texto: 'Anna Costa', sub: 'Gràcia', av: 'anna'}, {id: 'marc', texto: 'Marc Roca', sub: 'Sant Gervasi', av: 'marc'}],
    valor: () => 'laura', alElegir: op => VETA.aviso('Asignado a ' + op.texto + '.')
  });
})();
