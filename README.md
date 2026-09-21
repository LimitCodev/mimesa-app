# MiMesa 📝

App web simple (HTML, CSS, JS puro) para un estudiante de Lima. Mesa de trabajo con promedio de notas (0-20), tareas, cuentas en soles y 2 juegos. Consume 2 APIs gratuitas sin clave y trae 1 API propia de ejemplo.

## Funcionalidades

- Promedio de 3 notas (0-20): muestra Desaprobado, Regular o Aprobado.
- Tareas: se guardan en el navegador con localStorage.
- Login con registro: crea tu usuario y entra (3 intentos).
- Juegos: piedra papel o tijera con animación y adivinanza del 1 al 50.
- Cuentas en S/: préstamo, presupuesto, interés simple y compuesto, impuestos y descuento.
- Conversor USD a PEN con tasa en vivo y clima de Lima.
- Usuarios de ejemplo del Perú.
- Hoja central donde se anota todo lo que haces.

## APIs usadas (gratis, sin key)

No hay que registrarse en ningún lado:

1. Tasas de cambio: `https://open.er-api.com/v6/latest/USD` (se usa `rates.PEN`).
2. Clima: `https://api.open-meteo.com/v1/forecast?latitude=-12.04&longitude=-77.03&current=temperature_2m` (Lima, sin clave).
3. API propia: `db.json` con `json-server` (usuarios, notas y gastos de ejemplo).

## Cómo correr el proyecto

No necesita build. Solo un servidor local:

```bash
# terminal 1: la página
python3 -m http.server 5500
# visita http://localhost:5500/
```

```bash
# terminal 2 (opcional): la API propia
npm install
npm run api
# visita http://localhost:3000/usuarios
```

Sin la terminal 2 igual funciona todo, salvo que Usuarios muestra la lista de ejemplo local.

## Estructura

```
mimesa-app/
├── index.html   # mesa, botones y tarjetas
├── style.css    # madera, papeles y hoja cuadriculada
├── app.js       # promedio, login, juegos y cuentas
├── api.js       # conversor, clima y usuarios (fetch + XMLHttpRequest)
├── db.json      # datos de la API propia
├── package.json # solo json-server para la API propia
└── README.md
```

## Para la presentación

- Consumo de API REST con `fetch()` y `XMLHttpRequest` (AJAX clásico).
- Estados de carga y error en conversor, clima y usuarios.
- `localStorage`: tareas, usuarios registrados y hoja.
- Validaciones: notas solo 0-20, sin letras.

## Nota

Los datos de moneda son de exchangerate-api y el clima de open-meteo. Proyecto de curso, sin afiliación con esos servicios.
