// apis

// tasa
var tasaCache = null;
var tasaHora = 0;

// convertir
function convertir() {
  var usd = parseFloat(document.getElementById("c-usd").value);
  if (isNaN(usd) || usd < 0) {
    escribir("r-conversor", "Pon un monto válido.", false);
    return;
  }
// cache
  if (tasaCache && Date.now() - tasaHora < 600000) {
    pintaConversion(usd, tasaCache);
    return;
  }
  escribir("r-conversor", "Buscando tasa...");
// fetch
  fetch("https://open.er-api.com/v6/latest/USD")
    .then(function (r) {
      if (!r.ok) throw new Error("http");
      return r.json();
    })
    .then(function (d) {
      tasaCache = d.rates.PEN;
      tasaHora = Date.now();
      pintaConversion(usd, tasaCache);
    })
    .catch(function () {
// plan b
      convertirClasico(usd);
    });
}

// ver cambio
function pintaConversion(usd, tasa) {
  var txt = usd + " USD = S/ " + (usd * tasa).toFixed(2);
  escribir("r-conversor", txt, true);
  anotar(txt);
}

// ajax
function convertirClasico(usd) {
  var x = new XMLHttpRequest();
  x.open("GET", "https://open.er-api.com/v6/latest/USD", true);
  x.onload = function () {
    try {
      var d = JSON.parse(x.responseText);
      tasaCache = d.rates.PEN;
      tasaHora = Date.now();
      pintaConversion(usd, tasaCache);
    } catch (e) {
      escribir("r-conversor", "Sin internet, prueba luego.", false);
    }
  };
  x.onerror = function () {
    escribir("r-conversor", "Sin internet, prueba luego.", false);
  };
  x.send();
}

// clima
function verClima() {
  escribir("r-clima", "Buscando...");
  fetch("https://api.open-meteo.com/v1/forecast?latitude=-12.04&longitude=-77.03&current=temperature_2m&timezone=auto")
    .then(function (r) {
      if (!r.ok) throw new Error("http");
      return r.json();
    })
    .then(function (d) {
      var txt = "Lima ahora: " + d.current.temperature_2m + "°C";
      escribir("r-clima", txt, true);
      anotar(txt);
    })
    .catch(function () {
      escribir("r-clima", "No se pudo traer el clima.", false);
    });
}

// usuarios
function verUsuarios() {
  escribir("r-users", "Cargando...");
  fetch("https://mimesa-app.onrender.com/usuarios")
    .then(function (r) {
      if (!r.ok) throw new Error("http");
      return r.json();
    })
    .then(function (lista) {
      verListaPeru(lista);
    })
    .catch(function () {
      // local
      fetch("http://localhost:3000/usuarios")
        .then(function (r) {
          if (!r.ok) throw new Error("http");
          return r.json();
        })
        .then(function (lista) {
          verListaPeru(lista);
        })
        .catch(function () {
          // host: mismo db.json servido por pages
      fetch("db.json")
        .then(function (r) {
          if (!r.ok) throw new Error("http");
          return r.json();
        })
        .then(function (d) {
          verListaPeru(d.usuarios);
        })
        .catch(function () {
          verListaPeru([
            { nombre: "Juan Quispe Huamán" },
            { nombre: "María Torres Salas" },
            { nombre: "Luis Paredes Ríos" }
          ]);
        });
      });
    });
}

// ver lista
function verListaPeru(lista) {
  var nombres = [];
  for (var i = 0; i < lista.length; i++) nombres.push(lista[i].nombre);
  var txt = "Perú (" + lista.length + "): " + nombres.join(", ");
  escribir("r-users", txt, true);
  anotar(txt);
}
