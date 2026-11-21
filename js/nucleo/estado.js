/* Veta demo · núcleo · estado.js
   Estado de la demo en memoria y en sessionStorage (clave veta_demo_v1): sobrevive a recargar,
   se borra con ?nuevo y al cerrar la pestaña. Preferencias (tema, guía) en localStorage.
   Todo acceso al almacenamiento va en try/catch: si falla, la app sigue en memoria. */
(function () {
  'use strict';
  const CLAVE = 'veta_demo_v1', CLAVE_PREF = 'veta_pref_v1';
  const copia = v => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

  let datos = {};
  try { if (VETA.tieneParam('nuevo')) sessionStorage.removeItem(CLAVE); } catch (e) {}
  try { datos = JSON.parse(sessionStorage.getItem(CLAVE) || '{}') || {}; } catch (e) { datos = {}; }
  const guarda = () => { try { sessionStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e) {} };

  VETA.est = {
    lee(k, porDefecto) { return Object.prototype.hasOwnProperty.call(datos, k) ? copia(datos[k]) : porDefecto; },
    pon(k, v) { datos[k] = copia(v); guarda(); },
    quita(k) { delete datos[k]; guarda(); },
    borraTodo() { datos = {}; guarda(); }
  };

  let pref = {};
  try { pref = JSON.parse(localStorage.getItem(CLAVE_PREF) || '{}') || {}; } catch (e) { pref = {}; }
  VETA.pref = {
    lee(k, porDefecto) { return Object.prototype.hasOwnProperty.call(pref, k) ? pref[k] : porDefecto; },
    pon(k, v) { pref[k] = v; try { localStorage.setItem(CLAVE_PREF, JSON.stringify(pref)); } catch (e) {} }
  };
})();
