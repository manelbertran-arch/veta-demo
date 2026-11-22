/* Veta demo · datos · base.js
   Todo es inventado (PLAN_DEMO.md, sección 6). Fecha fija, equipo, oficinas y pisos.
   Los paquetes no tocan este archivo: lo que les falte va en su datos/extra-<letra>.js y en su ESTADO. */
(function () {
  'use strict';
  const D = VETA.datos;

  // 6.1 · hoy es el día de la demo
  D.fecha = {
    hoyISO: '2026-11-23', hoyTexto: 'lunes 23 de noviembre', hoyCorto: 'lun 23', ayerTexto: 'domingo 22',
    semanaCerrada: 'del 16 al 22 de noviembre', semanaAnterior: 'del 9 al 15 de noviembre', inicioPiloto: '3 de octubre'
  };

  // 6.2 · el equipo: 6 personas, 2 oficinas
  D.oficinas = {gracia: {id: 'gracia', nombre: 'Gràcia'}, santgervasi: {id: 'santgervasi', nombre: 'Sant Gervasi'}};
  D.personas = {
    laura: {id: 'laura', nombre: 'Laura Martí', corto: 'Laura', papel: 'agente', papelTexto: 'agente', oficina: 'gracia', foto: 'laura'},
    montse: {id: 'montse', nombre: 'Montse Ribas', corto: 'Montse', papel: 'direccion', papelTexto: 'dirección', oficina: 'santgervasi', foto: null, nota: 'Dirección; también vende'},
    anna: {id: 'anna', nombre: 'Anna Costa', corto: 'Anna', papel: 'agente', papelTexto: 'agente', oficina: 'gracia', foto: null},
    teresa: {id: 'teresa', nombre: 'Teresa Gil', corto: 'Teresa', papel: 'agente', papelTexto: 'agente', oficina: 'gracia', foto: null, baja: 'De baja desde el lunes 16'},
    marc: {id: 'marc', nombre: 'Marc Vidal', corto: 'Marc', papel: 'agente', papelTexto: 'agente', oficina: 'santgervasi', foto: null},
    david: {id: 'david', nombre: 'David Mas', corto: 'David', papel: 'agente', papelTexto: 'agente', oficina: 'santgervasi', foto: null}
  };
  // primer destino de cada papel
  D.papeles = {agente: {destinos: ['hoy', 'clientes', 'veta'], entrada: 'hoy'}, direccion: {destinos: ['hoy', 'clientes', 'equipo', 'veta'], entrada: 'equipo'}};

  // 6.3 · pasos de una operación
  D.pasos = {venta: ['Encargo', 'Anuncio', 'Visitas', 'Arras', 'Notaría'], compra: ['Contacto', 'Visitas', 'Oferta', 'Arras', 'Notaría']};

  // 6.7 · pisos y fotos (assets/pisos/<foto>.webp)
  D.pisos = {
    verdi: {id: 'verdi', nombre: 'Verdi 42, 3.º 2.ª', zona: 'Gràcia', corto: 'Piso de Gràcia · c/ Verdi 42, 3.º 2.ª', datos: '3 habitaciones · terraza · cocina reformada · sin ascensor', precio: 395000, de: 'pere', fotos: ['gracia', 'gracia_balcon']},
    santantoni: {id: 'santantoni', nombre: 'Sant Antoni', zona: 'Sant Antoni', corto: 'Sant Antoni · 2 habitaciones · balcón · 289.000 €', datos: '2 habitaciones · balcón', precio: 289000, nota: 'Entró ayer en la cartera de la oficina; lo captó Anna', fotos: ['poblenou']},
    olzinelles: {id: 'olzinelles', nombre: 'Olzinelles, Sants', zona: 'Sants', corto: 'Piso de Sants · c/ Olzinelles', datos: '', fotos: ['sants']},
    atico: {id: 'atico', nombre: 'Ático de Sant Gervasi', zona: 'Sant Gervasi', corto: 'Ático de Sant Gervasi', datos: '', precio: 545000, de: 'ruben', fotos: ['santgervasi']},
    local: {id: 'local', nombre: 'Local del Eixample', zona: 'Eixample', corto: 'Local del Eixample · en alquiler', datos: 'En alquiler', fotos: ['local']},
    santcugat: {id: 'santcugat', nombre: 'Casa de Sant Cugat', zona: 'Sant Cugat', corto: 'Casa de Sant Cugat', datos: '', de: 'joan-serra', fotos: ['santcugat']}
  };
})();
