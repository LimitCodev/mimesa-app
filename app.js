// mesa

// datos
var intentosLogin = 3;

// users
var USERS = [
  { user: "juan", pass: "1234" },
  { user: "maria", pass: "1234" },
  { user: "luis", pass: "1234" }
];

// juego
var secreto = Math.floor(Math.random() * 50) + 1;
var intentosAd = 5;

// abrir
function abrir(id) {
  cerrar();
  document.getElementById(id).classList.add("activa");
  var msg = document.getElementById("tablet-msg");
  if (msg) msg.style.display = "none";
}

// cerrar
function cerrar() {
  var lista = document.querySelectorAll("#tablet .card");
  for (var i = 0; i < lista.length; i++) lista[i].classList.remove("activa");
  var msg = document.getElementById("tablet-msg");
  if (msg) msg.style.display = "block";
}

// volver
function volver() {
  var act = document.querySelector("#tablet .card.activa");
  var nombre = act ? act.querySelector("h2").textContent : "mesa";
  anotar("Guardado: " + nombre);
  cerrar();
}

// hoja grande
function agrandarHoja() {
  document.getElementById("hoja-wrap").classList.toggle("grande");
}

// leer
function leer(id) {
  return parseFloat(document.getElementById(id).value);
}

// mostrar
function escribir(id, txt, ok) {
  var el = document.getElementById(id);
  el.textContent = txt;
  el.className = "res " + (ok === true ? "res-ok" : ok === false ? "res-error" : "");
}

// seguro
function seguro(t) {
  return String(t).replace(/[<>&"]/g, function (c) {
    return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c];
  });
}

// anotar
function anotar(txt) {
  var ul = document.getElementById("hoja");
  var li = document.createElement("li");
  li.textContent = txt;
  ul.prepend(li);
  while (ul.children.length > 50) ul.removeChild(ul.lastChild);
  try { localStorage.setItem("mimesa-hoja", ul.innerHTML); } catch (e) {}
  var num = document.getElementById("hoja-num");
  if (num) num.textContent = "(" + ul.children.length + ")";
  ul.scrollTop = 0;
}

// inicio
(function () {
  try {
    var g = localStorage.getItem("mimesa-hoja");
    if (g) {
      document.getElementById("hoja").innerHTML = g;
      document.getElementById("hoja-num").textContent = "(" + document.getElementById("hoja").children.length + ")";
    }
  } catch (e) {}
  pintarTareas();
  enterPorTarjeta();
})();

// nota 0-20
function notaValida(n) {
  return !isNaN(n) && n >= 0 && n <= 20;
}

// promedio
function promedio() {
  var a = leer("n1"), b = leer("n2"), c = leer("n3");
  if (!notaValida(a) || !notaValida(b) || !notaValida(c)) {
    escribir("r-promedio", "Solo números del 0 al 20.", false);
    return;
  }
  var p = (a + b + c) / 3;
  var r = p >= 14 ? "Aprobado" : (p >= 11 ? "Regular" : "Desaprobado");
  escribir("r-promedio", "Promedio " + p.toFixed(1) + " - " + r, p >= 11);
  anotar("Promedio: " + p.toFixed(1) + " " + r);
}

// login
function login() {
  if (intentosLogin <= 0) {
    escribir("r-login", "Acceso denegado", false);
    return;
  }
  var u = document.getElementById("l-user").value.trim();
  var p = document.getElementById("l-pass").value;
  var ok = false;
  var todos = USERS.concat(verExtras());
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].user === u && todos[i].pass === p) ok = true;
  }
  if (ok) {
    escribir("r-login", "Bienvenido, " + u, true);
    anotar("Login ok: " + u);
    intentosLogin = 3;
  } else {
    intentosLogin--;
    document.getElementById("l-pass").value = "";
    if (intentosLogin <= 0) escribir("r-login", "Acceso denegado", false);
    else escribir("r-login", "Error. Te quedan " + intentosLogin, false);
  }
}

// registrar
function registrar() {
  var u = document.getElementById("r-user").value.trim();
  var p = document.getElementById("r-pass").value;
  if (u.length < 3 || p.length < 4) {
    escribir("r-reg", "Usuario mín. 3 y clave mín. 4.", false);
    return;
  }
  var lista = verExtras();
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].user === u) {
      escribir("r-reg", "Ya existe. Entra arriba.", false);
      return;
    }
  }
  lista.push({ user: u, pass: p });
  try { localStorage.setItem("mimesa-users", JSON.stringify(lista)); } catch (e) {}
  escribir("r-reg", "Listo. Entra arriba.", true);
  anotar("Nuevo usuario: " + u);
}

// ver extras
function verExtras() {
  try { return JSON.parse(localStorage.getItem("mimesa-users") || "[]"); }
  catch (e) { return []; }
}

// ppt
function ppt() {
  var caras = { 1: "✊", 2: "✋", 3: "✌️" };
  var nombres = ["", "piedra", "papel", "tijera"];
  var yo = parseInt(document.getElementById("ppt-you").value);
  var pc = Math.floor(Math.random() * 3) + 1;
  var txt = "Tu: " + nombres[yo] + " | CPU: " + nombres[pc] + " - ";
  var res = "empate";
  if (yo === pc) txt += "Empate";
  else if ((yo === 1 && pc === 3) || (yo === 2 && pc === 1) || (yo === 3 && pc === 2)) {
    txt += "Ganas tu";
    res = "victoria";
  } else {
    txt += "Gana la CPU";
    res = "derrota";
  }
  escribir("r-ppt", txt, res === "victoria");
  anotar(txt);
// arena
  document.getElementById("arena-yo").textContent = caras[yo];
  document.getElementById("arena-pc").textContent = caras[pc];
  var t = document.getElementById("arena-txt");
  t.textContent = res === "victoria" ? "VICTORIA" : res === "derrota" ? "DERROTA" : "EMPATE";
  t.className = res;
  document.getElementById("arena").classList.add("ver");
  setTimeout(function () {
    document.getElementById("arena").classList.remove("ver");
  }, 1400);
}

// adivinar
function adivinar() {
  if (intentosAd <= 0) {
    escribir("r-adivina", "Reinicia para jugar de nuevo.", false);
    return;
  }
  var n = parseInt(document.getElementById("ad-num").value);
  if (isNaN(n) || n < 1 || n > 50) {
    escribir("r-adivina", "Solo números del 1 al 50.", false);
    return;
  }
  if (n === secreto) {
    escribir("r-adivina", "Acertaste: era " + secreto, true);
    anotar("Adivinaste el " + secreto);
    intentosAd = 0;
  } else {
    intentosAd--;
    var pista = n < secreto ? "Más alto" : "Más bajo";
    if (intentosAd <= 0) escribir("r-adivina", "Perdiste. Era " + secreto, false);
    else escribir("r-adivina", pista + ". Quedan " + intentosAd, true);
  }
}

// reiniciar
function reiniciarAdivina() {
  secreto = Math.floor(Math.random() * 50) + 1;
  intentosAd = 5;
  escribir("r-adivina", "Nuevo número listo.", true);
}

// tarea nueva
function agregarTarea() {
  var inp = document.getElementById("tarea-txt");
  var t = inp.value.trim();
  if (!t) return;
  var lista = tareas();
  lista.push(t);
  try { localStorage.setItem("mimesa-tareas", JSON.stringify(lista)); } catch (e) {}
  inp.value = "";
  pintarTareas();
  anotar("Tarea: " + t);
}

// leer tareas
function tareas() {
  try { return JSON.parse(localStorage.getItem("mimesa-tareas") || "[]"); }
  catch (e) { return []; }
}

// ver tareas
function pintarTareas() {
  var ul = document.getElementById("tarea-lista");
  if (!ul) return;
  var lista = tareas();
  ul.innerHTML = "";
  for (var i = 0; i < lista.length; i++) {
    var li = document.createElement("li");
    li.textContent = lista[i];
    ul.appendChild(li);
  }
  if (!lista.length) ul.innerHTML = "<li>Sin tareas todavía...</li>";
}

// interes
function interes() {
  var c = leer("i-cap"), tasa = leer("i-tasa"), t = leer("i-anos");
  if (isNaN(c) || isNaN(tasa) || isNaN(t) || c < 0 || tasa < 0 || t < 0) {
    escribir("r-interes", "Solo números positivos.", false);
    return;
  }
  var i = tasa / 100;
  var simple = c * (1 + i * t);
  var comp = c * Math.pow(1 + i, t);
  escribir("r-interes", "Simple: S/ " + simple.toFixed(2) + " | Compuesto: S/ " + comp.toFixed(2), true);
  anotar("Interés S:" + simple.toFixed(2) + " C:" + comp.toFixed(2));
}

// presupuesto
function presupuesto() {
  var ing = leer("g-ing");
  if (isNaN(ing) || ing < 0) {
    escribir("r-presupuesto", "Pon tus ingresos en S/.", false);
    return;
  }
  var total = (leer("g-ali") || 0) + (leer("g-tra") || 0) + (leer("g-viv") || 0) + (leer("g-oci") || 0);
  if (total < 0) {
    escribir("r-presupuesto", "Los gastos no pueden ser negativos.", false);
    return;
  }
  var ahorro = ing - total;
  var msg = "Gastos S/ " + total.toFixed(2) + " | Ahorro S/ " + ahorro.toFixed(2);
  if (ahorro < 0) msg += " ¡Gastas más de lo que ganas!";
  escribir("r-presupuesto", msg, ahorro >= 0);
  anotar(msg);
}

// prestamo
function prestamo() {
  var m = leer("p-monto"), tasa = leer("p-tasa"), n = leer("p-n");
  if (isNaN(m) || isNaN(tasa) || isNaN(n) || m <= 0 || tasa < 0 || n < 1) {
    escribir("r-prestamo", "Revisa monto, tasa y cuotas.", false);
    return;
  }
  var i = tasa / 100;
  var cuota = i === 0 ? m / n : (m * i) / (1 - Math.pow(1 + i, -n));
  escribir("r-prestamo", "Cuota S/ " + cuota.toFixed(2) + " | Total S/ " + (cuota * n).toFixed(2), true);
  anotar("Préstamo cuota S/ " + cuota.toFixed(2));
}

// impuestos
function impuestos() {
  var ing = leer("t-ing");
  if (isNaN(ing) || ing < 0) {
    escribir("r-impuestos", "Pon tu ingreso en S/.", false);
    return;
  }
  var t = ing < 1000 ? 0 : ing <= 3000 ? 0.10 : ing <= 5000 ? 0.20 : 0.35;
  var imp = ing * t;
  escribir("r-impuestos", "Impuesto S/ " + imp.toFixed(2) + " | Neto S/ " + (ing - imp).toFixed(2), true);
  anotar("Impuesto S/ " + imp.toFixed(2));
}

// descuento
function descuento() {
  var p = leer("d-precio"), d = leer("d-desc");
  if (isNaN(p) || isNaN(d) || p < 0 || d < 0 || d > 100) {
    escribir("r-descuento", "Precio y % de 0 a 100.", false);
    return;
  }
  var final = p * (1 - d / 100);
  if (d > 30) final = final * 0.95;
  escribir("r-descuento", "Final S/ " + final.toFixed(2), true);
  anotar("Descuento final S/ " + final.toFixed(2));
}

// borrar tareas
function borrarTareas() {
  try { localStorage.removeItem("mimesa-tareas"); } catch (e) {}
  pintarTareas();
  anotar("Tareas borradas");
}

// limpiar
function limpiarHoja() {
  document.getElementById("hoja").innerHTML = "";
  document.getElementById("hoja-num").textContent = "";
  try { localStorage.removeItem("mimesa-hoja"); } catch (e) {}
}

// enter
function enterPorTarjeta() {
  var mapa = {
    "n1": promedio, "n2": promedio, "n3": promedio,
    "l-user": login, "l-pass": login,
    "r-user": registrar, "r-pass": registrar,
    "ad-num": adivinar, "tarea-txt": agregarTarea,
    "c-usd": convertir, "p-monto": prestamo,
    "p-tasa": prestamo, "p-n": prestamo,
    "g-ing": presupuesto, "i-cap": interes,
    "i-tasa": interes, "i-anos": interes,
    "t-ing": impuestos, "d-precio": descuento, "d-desc": descuento
  };
  for (var id in mapa) {
    (function (id, fn) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") fn();
      });
    })(id, mapa[id]);
  }
}
