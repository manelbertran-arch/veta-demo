/* Veta demo · tanda V · pantallas · pisos.js
   S1 · Pisos · #/pisos — sitio de la AGENTE (dirección no lo abre: ver `soloPapel` en el mapa de rutas.js).
   Maqueta C3: mosaico de FOTOS de piso (un protagonista grande y el resto en mosaico). Todo sale de D.pisos y de los clientes de quien mira:
   - de quién es el piso: D.pisos no lo dice del todo (`de` solo en algunos), así que se pintan los pisos LIGADOS a sus clientes: el propietario es suyo
     (`de`), o un cliente suyo lo mira (`piso` del cliente), le encaja (`encajan.pisos`), Sin ese lazo, no se pinta.
   - «Le encaja a …»: esos clientes (y, si el piso es de un propietario suyo, los compradores de `encajan.clientes` de él).
   - precio: solo si está en D.pisos.precio; chapa: solo con motivo real en el dato (visita de hoy pendiente · «Entró ayer» de la nota del piso).
   - tocar un piso lleva a un destino que ya existe: la visita de hoy, o la ficha del primero a quien le encaja.
   Contrato con el esqueleto: VETA.pisosContenido / VETA.pisosAlMontar. Estilos en css/p-pisos.css. */
(function () {
  'use strict';
  const sinAcentos = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const euros = n => new Intl.NumberFormat('es-ES').format(n) + ' €';
  const lista = n => n.length < 2 ? n.join('') : `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}`;

  function pisosDe(q) {
    const D = VETA.datos, M = VETA.modelo;
    const cl = Object.values(D.clientes).filter(c => c.lleva === q && c.cartera !== false);
    const ids = new Set(cl.map(c => c.id));
    const visitas = (M && M.pendientes ? M.pendientes(q) : []).filter(c => c.tipo === 'visita' && c.piso);
    const out = [];
    Object.values(D.pisos).forEach(p => {
      const enc = [];   // a quién le encaja, en el orden de las fichas
      const suma = id => { if (id && ids.has(id) && !enc.includes(id)) enc.push(id); };
      cl.forEach(c => {
        if (c.piso === p.id && c.id !== p.de) suma(c.id);
        else if (c.encajan && (c.encajan.pisos || []).includes(p.id)) suma(c.id);
      });
      const dueno = p.de && ids.has(p.de) ? p.de : null;
      if (dueno) { const e = D.clientes[dueno].encajan; ((e && e.clientes) || []).forEach(suma); }
      // sin lazo estructurado (`de`, `piso` o `encajan`) el piso no se liga a nadie y no se pinta: antes el local del Eixample se ligaba a Albert por un texto libre de su ficha (25-nov)
      if (!dueno && !enc.length) return;
      const vis = visitas.find(v => v.piso === p.id);
      out.push({p, enc, vis, dueno});
    });
    // primero el piso con visita hoy, luego el que encaja a más gente
    out.sort((a, b) => (!!b.vis - !!a.vis) || (b.enc.length - a.enc.length));
    return out;
  }

  function opciones(x) {
    const p = x.p, D = VETA.datos, titulo = p.nombre.split(',')[0];
    const rasgos = String(p.datos || '').split(' · ').filter(Boolean);
    let chapa = null;
    // la hora y «entró ayer» salen de campos del dato (`horaVisita`, `entro`), no de su texto: así el inglés y el castellano pintan lo mismo
    if (x.vis) chapa = {tono: 'urg', texto: x.vis.horaVisita ? `Visita hoy, ${x.vis.horaVisita}` : 'Visita hoy'};
    else if (p.entro === 'ayer') chapa = {tono: 'veta', texto: 'Entró ayer'};
    const nombres = x.enc.map(id => D.clientes[id].corto || D.clientes[id].nombre.split(' ')[0]);
    const ir = x.vis && x.vis.boton && x.vis.boton.ir ? x.vis.boton.ir : x.enc.length ? 'cliente/' + x.enc[0] : (x.dueno ? 'cliente/' + x.dueno : null);
    const o = {foto: (p.fotos || [])[0], zona: sinAcentos(titulo).includes(sinAcentos(p.zona)) ? '' : p.zona, titulo, chapa,
      datos: rasgos.slice(0, 2).join(' · '), texto: p.precio ? euros(p.precio) : '',
      encajan: x.enc.slice(0, 3), enc: !nombres.length ? '' : nombres.length === 1 ? `Le encaja a ${nombres[0]}` : `Les encaja a ${lista(nombres.slice(0, 3))}`, ir};
    if (p.fotos && p.fotos[1]) o.foto2 = p.fotos[1];
    return o;
  }

  VETA.pisosContenido = () => {
    const l = pisosDe(VETA.yo().id).filter(x => (x.p.fotos || []).length);
    if (!l.length) return '<p class="v-vacio">Ahora no llevas ningún piso.</p>';
    return VETA.v.mosaicoPisos(l.slice(0, 4).map(opciones));
  };

  VETA.pantalla('S1', {
    titulo: 'Pisos',
    sub: 'Los pisos que llevas y a quién le encajan.',
    pinta: () => {
      let html = '';
      if (typeof VETA.pisosContenido === 'function') { try { html = VETA.pisosContenido() || ''; } catch (e) { setTimeout(() => { throw e; }); } }
      return `<div class="pisos-sitio">${html}</div>`;
    },
    alMontar: el => {
      const c = el.querySelector('.pisos-sitio');
      if (c && typeof VETA.pisosAlMontar === 'function') { try { VETA.pisosAlMontar(c); } catch (e) { setTimeout(() => { throw e; }); } }
    }
  });
})();
