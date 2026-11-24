/* Veta demo · pantallas · semana-equipo.js · paquete D (Dirección) · ronda 7 · D2
   G3 · La semana pasada · #/semana-equipo — el 156 grande, una frase, el gráfico de cuatro semanas (venía de Equipo) y «Enviar el resumen».
   G3b · Enviar el resumen · #/semana-equipo/resumen — la vista previa de lo que recibirán las 4 personas (Teresa, de baja, no).
   G3c · Para la reunión del lunes · #/reunion · G3d · Por oficina · #/oficinas · G3e · El tiempo que gana el equipo · #/tiempo-equipo */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;
  let editando = false;

  const N = () => D.numeros;
  const RESUMEN = 'Semana del 16 al 22 de noviembre. Veta dejó listos 156 mensajes y tareas y completamos 132 (la de antes, 141 y 118). Hay 4 operaciones que llevan más de 7 días sin moverse: el lunes las repasamos. Esa semana Veta aprendió que en Gràcia casi todos piden ver el piso en sábado.';
  const resumenTexto = () => X.lee('resumenTexto', RESUMEN);
  const enviado = () => X.lee('resumen', null);

  // ---------------- G3 · La semana pasada (ronda 7 · D2) ----------------
  // Una cosa: el 156 grande, una frase y un gráfico (las cuatro últimas semanas, que antes estaba en Equipo). Abajo, el botón negro
  // «Enviar el resumen al equipo». Lo demás, en filas con su nombre. Lo que espera decisión vive en Decidir y lo parado en Operaciones (R9).
  const R6 = () => VETA.datos.r6.direccion;
  function cuatro() {
    const s = R6().semanas, n = s.listos.length, max = Math.max.apply(null, s.listos);
    return `<div class="d2-4s" role="img" aria-label="Cosas que os dejé listas cada semana, las cuatro últimas: de ${s.listos[0]} a ${s.listos[n - 1]}" data-i="1">` +
      s.etiquetas.map((e, k) => `<span class="d2-4s-c${k === n - 1 ? ' d2-4s-hoy' : ''}"><b class="d2-4s-n">${s.listos[k]}</b>` +
        `<span class="d2-4s-a" style="--v:${(s.listos[k] / max).toFixed(3)}"></span><span class="d2-4s-e">${esc(e)}</span></span>`).join('') + `</div>`;
  }
  VETA.pantalla('G3', {
    titulo: 'La semana pasada',
    frase: 'Del 16 al 22 de noviembre. Míralo y envía el resumen al equipo.',
    pinta: () => {
      const n = N(), env = enviado(), s = R6().semanas, k = s.corregidos.length, sig = R6().pide[0];
      let h = '';
      if (env) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: 'Resumen enviado a 4 personas', hora: 'hoy, ' + env.hora, vt: 'd-resumen'})}</div>`;
      // el número que nadie tenía, de la misma función que la caja (R9)
      h += `<div class="d2-cifra" data-i="0"><b class="d2-cifra-n" id="d-cifra-156">${VETA.r7.cuentas().oficina}</b>` +
        `<p class="d2-cifra-t">cosas que os dejé listas. Me corregisteis <b>${s.corregidos[k - 1]}</b> veces; hace un mes, ${s.corregidos[0]}.</p></div>`;
      h += cuatro();
      h += VETA.r7.lista([
        {icono: 'check', oro: true, nombre: 'Lo que hice yo sola', pasa: `Sigo ${n['7d'][6]} tareas por vosotros`,
          abre: `<p>Terminasteis <b>${n['7d'][2]}</b> cosas; la de antes, ${n.semanaAnterior.completados}.</p><p>Sigo yo sola <b>${n['7d'][6]}</b> tareas: miro si llega un papel o si alguien contesta.</p><p>Mensajes que envío yo sola: <b>ninguno</b>. Durante el piloto no envío nada sin vuestra aprobación.</p>`},
        {icono: 'aprende', oro: true, nombre: 'Lo que aprendí', pasa: '7 cosas esta semana',
          abre: `<p>Por ejemplo: en Gràcia casi todos piden ver el piso en sábado.</p><p>Lo siguiente: <b>${esc(sig.tema.toLowerCase())}</b>. Lo habéis hecho a mano ${sig.veces} veces.</p>` + VETA.r7.ensena({guion: 'orden', texto: 'Enséñamelo'})},
        {icono: 'tarea', nombre: 'Para la reunión del lunes', pasa: 'Los 3 temas y el orden del día', ir: 'reunion'},
        {icono: 'casa', nombre: 'Por oficina', pasa: 'Gràcia y Sant Gervasi', ir: 'oficinas'},
        {icono: 'reloj', nombre: 'El tiempo que gana el equipo', pasa: 'Con los tiempos que pone cada uno', ir: 'tiempo-equipo'},
        {icono: 'libro', nombre: 'Informe completo', pasa: 'Todas las cifras', ir: 'informe-completo'}], {i: 2});
      return h;
    },
    botonFijo: () => enviado() ? '' : VETA.r7.botones({texto: 'Enviar el resumen al equipo', icono: 'enviar', ir: 'semana-equipo/resumen'}),
    alMontar: el => {
      // la cifra rueda desde la de la semana anterior
      const c = el.querySelector('#d-cifra-156');
      if (c && !VETA.reducido()) { c.dataset.rueda = String(N().semanaAnterior.preparados); VETA.rueda(c, VETA.r7.cuentas().oficina); }
    }
  });

  // ---------------- G3b · Enviar el resumen ----------------
  VETA.pantalla('G3b', {
    titulo: 'Enviar el resumen',
    frase: 'Te lo dejo escrito. Lo recibirán Laura, Anna, Marc y David; Teresa, de baja, no.',
    fraseCuerpo: true,   // a quién le llega, a la vista antes de enviar
    pinta: () => {
      const env = enviado();
      let h = '';
      if (env) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: 'Resumen enviado a 4 personas', hora: 'hoy, ' + env.hora})}</div>`;
      h += `<div class="r7-ficha r7-oro d2-resumen" data-i="0"><span class="r7-ficha-de">${resumenTexto() === RESUMEN ? 'Te lo dejo escrito' : 'Te lo dejo escrito · lo cambiaste tú'}</span>` +
        (editando
          ? `<div class="campo"><label class="campo-e" for="d-resumen-t">Lo estás cambiando</label><div class="campo-caja"><textarea id="d-resumen-t" class="campo-i" rows="8">${esc(resumenTexto())}</textarea></div></div>`
          : `<p>${esc(resumenTexto())}</p>`) +
        VETA.r7.ensena({texto: 'Enséñale cómo lo quieres'}) + `</div>`;
      h += VETA.r7.lista([{icono: 'equipo', nombre: 'Para 4 personas', pasa: 'No lleva cifras por persona',
        abre: `<p>${['laura', 'anna', 'marc', 'david'].map(id => esc(X.persona(id).nombre)).join(', ')}.</p><p>Teresa está de baja: no lo recibe.</p>`}], {i: 1});
      return h;
    },
    botonFijo: () => {
      if (enviado()) return '';
      return VETA.r7.botones({texto: 'Enviar a las 4 personas', accion: 'enviar', icono: 'enviar'},
        [{texto: editando ? 'Listo' : 'Cambiar', accion: 'editar'}]);
    },
    alMontar: el => { if (editando) { const t = el.querySelector('#d-resumen-t'); if (t) try { t.focus({preventScroll: true}); } catch (e) {} } },
    acciones: {
      editar() {
        if (editando) { const t = VETA.$('#d-resumen-t'); if (t) X.guarda('resumenTexto', t.value.trim() || RESUMEN); }
        editando = !editando; VETA.repinta();
      },
      enviar() {
        if (editando) { const t = VETA.$('#d-resumen-t'); if (t) X.guarda('resumenTexto', t.value.trim() || RESUMEN); editando = false; }
        X.guarda('resumen', {hora: VETA.ahora()});
        X.vuelve();
      }
    }
  });

  // ---------------- G3c · Para la reunión del lunes ----------------
  VETA.pantalla('G3c', {
    titulo: 'Para la reunión del lunes',
    frase: 'Los tres temas que elegiste. Toca uno para ver sus casos y envía el orden del día.',
    pinta: () => {
      const env = X.lee('reunion', null);
      let h = '';
      if (env) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: 'Enviado a 4 personas', hora: 'hoy, ' + env.hora})}</div>`;
      h += VETA.r7.lista(X.temas().map((t, k) => ({icono: 'tarea', nombre: t.texto, pasa: 'Tema ' + (k + 1) + ' del orden del día', numero: t.cifra, hoja: 'd-tema', datos: {tema: t.id}})).concat([
        {icono: 'cambiar', nombre: 'Cambiar los temas', pasa: 'Elige los tres que quieres ver', hoja: 'h34'},
        {icono: 'papel', nombre: 'El parte de las 19:30', pasa: 'Lo de ayer, en una página', hoja: 'h41', datos: {parte: '1930'}},
        {icono: 'libro', nombre: 'Informe a socios · noviembre', pasa: 'Para leer antes', hoja: 'h41', datos: {parte: 'socios'}}]), {i: 0});
      return h;
    },
    botonFijo: () => X.lee('reunion', null) ? '' : VETA.r7.botones({texto: 'Enviar el orden del día al equipo', accion: 'enviar', icono: 'enviar'}),
    acciones: { enviar() { X.guarda('reunion', {hora: VETA.ahora()}); VETA.repinta(); } }
  });

  // ---------------- G3d · Por oficina ----------------
  VETA.pantalla('G3d', {
    titulo: 'Por oficina',
    frase: 'Cada oficina se compara solo consigo misma, semana contra semana. No hay ganadora.',
    pinta: () => {
      const ofs = [
        {nombre: 'Gràcia', quien: 'Anna, Laura y Teresa', p: [92, 84], c: [78, 70], par: 3},
        {nombre: 'Sant Gervasi', quien: 'David, Marc y tú', p: [64, 57], c: [54, 48], par: 1}];
      return VETA.r7.lista(ofs.map(o => ({icono: 'casa', nombre: o.nombre, pasa: `${o.p[0]} listas · ${o.c[0]} terminadas · ${o.par} ${o.par === 1 ? 'parada' : 'paradas'}`,
        abre: `<p>${esc(o.quien)}.</p><p>Cosas listas: <b>${o.p[0]}</b> (la semana de antes, ${o.p[1]}).</p><p>Terminadas: <b>${o.c[0]}</b> (antes, ${o.c[1]}).</p><p>Paradas más de 7 días: <b>${o.par}</b>.</p>`})), {i: 0});
    }
  });

  // ---------------- G3e · El tiempo que gana el equipo ----------------
  VETA.pantalla('G3e', {
    titulo: 'El tiempo que gana el equipo',
    frase: 'No me invento horas: salen de los tiempos que pone cada persona.',
    pinta: () => {
      const t = D.tiempos.equipo, coste = M.lee('coste', null), pedido = X.lee('pedidoTiempos', null);
      const sem = D.semanas, max = Math.max.apply(null, sem.map(s => s.n));
      let h = '';
      if (pedido) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: 'Pedido a 2 personas', hora: pedido.hora, vt: 'd-pedido', boton: {texto: 'Deshacer', accion: 'deshacer-pedido'}})}</div>`;
      h += `<div class="tarjeta d-horas" data-i="0">${UI.etiqueta('ejemplo')}${UI.cifra({valor: VETA.horas(t.minutos), unidad: 'semana del 16 al 22, con esos tiempos'})}` +
        (coste ? `<p class="d-euros"><span>unos</span> <b id="d-euros">${VETA.num(M.eurosEquipo(coste))}</b> <span>€ · a ${coste} € la hora · Ejemplo</span></p>` : '') + '</div>';
      h += `<div class="d-semanas d2-semanas" data-i="1" aria-label="Mensajes y tareas listos, semana a semana">${sem.map((s, k) => `<button type="button" class="d-sem" data-hoja="h25" data-semana="${esc(s.id)}" style="--v:${(s.n / max).toFixed(3)};--k:${k}" aria-label="Semana del ${esc(s.texto)}: ${s.n} casos preparados"><b>${s.n}</b><i></i><span>${esc(s.texto)}</span></button>`).join('')}</div>`;
      h += VETA.r7.lista([
        {icono: 'usuario', nombre: 'Quién ha puesto sus tiempos', pasa: `${t.conTiempos} de ${t.personas} personas`},
        {icono: 'sello', nombre: 'Coste por hora', pasa: coste ? coste + ' € la hora' : 'Sin poner', hoja: 'h38'},
        {icono: 'grafica', nombre: 'Antes y ahora', pasa: 'Dos ejemplos', abre: `<p>Actas de visita el mismo día: de ninguna a 4 de 4.</p><p>Lista de cada día: de 46 tarjetas por semana a 21.</p><p>Son ejemplos.</p>`}], {i: 2});
      return h;
    },
    botonFijo: () => X.lee('pedidoTiempos', null) ? '' : VETA.r7.botones({texto: 'Pedir sus tiempos a las 2 que faltan', accion: 'pedir'}),
    alMontar: el => {
      const e = el.querySelector('#d-euros');
      if (e && X.lee('rodarEuros', false)) { X.guarda('rodarEuros', false); if (!VETA.reducido()) { e.dataset.rueda = '0'; VETA.rueda(e, Number(e.textContent.replace(/\./g, ''))); } }
    },
    acciones: {
      pedir() { X.guarda('pedidoTiempos', {hora: VETA.ahora()}); VETA.repinta({hecho: 'd-pedido'}); },
      'deshacer-pedido'() { X.guarda('pedidoTiempos', null); VETA.repinta({hecho: 'd-pedido'}); }
    }
  });
})();
