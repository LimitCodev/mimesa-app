# MiMesa 📝

App web simple (HTML, CSS, JS puro) para un estudiante de Lima. Mesa de trabajo con promedio de notas (0-20), tareas, cuentas en soles y 2 juegos. Consume 2 APIs gratuitas sin clave y 1 API propia hosteada.

## Links

- App: `https://limitcodev.github.io/mimesa-app/`
- API propia: `https://mimesa-app.onrender.com/usuarios`

Si la API tarda la primera vez, es porque Render Free despierta tras ~50 segundos. Abre el link de la API, espera el "Congrats!", y luego usa la app.

## Funcionalidades

- Promedio de 3 notas (0-20): muestra Desaprobado, Regular o Aprobado.
- Tareas: se guardan en el navegador con localStorage.
- Login con registro: entra con `juan / 1234` (también `maria` o `luis`), tienes 3 intentos.
- Juegos: piedra papel o tijera con animación y adivinanza del 1 al 50.
- Cuentas en S/: préstamo, presupuesto, interés simple y compuesto, impuestos y descuento.
- Conversor USD a PEN con tasa en vivo y clima de Lima.
- Usuarios del Perú traídos de la API propia.
- Hoja central donde se anota todo lo que haces.

## APIs usadas

1. Tasas de cambio (sin key): `https://open.er-api.com/v6/latest/USD` (se usa `rates.PEN`).
2. Clima de Lima (sin key): `https://api.open-meteo.com/v1/forecast?latitude=-12.04&longitude=-77.03&current=temperature_2m`.
3. API propia con json-server: `https://mimesa-app.onrender.com/usuarios`.

Prueba tu API:

```bash
curl https://mimesa-app.onrender.com/usuarios
curl https://mimesa-app.onrender.com/usuarios/1
curl -X POST https://mimesa-app.onrender.com/usuarios -H "Content-Type: application/json" -d '{"user":"rflores","nombre":"Rosa Flores Paredes"}'
```

## Cómo correr el proyecto

```bash
# la página
python3 -m http.server 5500
# visita http://localhost:5500/
```

```bash
# la API en local (opcional)
npm install
npm run api
# visita http://localhost:3000/usuarios
```

## Estructura

```
mimesa-app/
├── index.html   # mesa, botones y tarjetas
├── style.css    # madera, papeles y hoja cuadriculada
├── app.js       # promedio, login, juegos y cuentas
├── api.js       # conversor, clima y usuarios (fetch + XMLHttpRequest)
├── db.json      # datos de la API propia
├── package.json # json-server para la API propia
├── render.yaml  # config para hostear la API en Render
└── README.md
```

## Para la presentación

- Consumo de API REST con `fetch()` y `XMLHttpRequest` (AJAX clásico).
- Estados de carga y error en conversor, clima y usuarios.
- `localStorage`: tareas, usuarios registrados y hoja.
- Validaciones: notas solo 0-20, sin letras.

## Nota

Moneda de exchangerate-api y clima de open-meteo. Proyecto de curso, sin afiliación con esos servicios. En Render Free los datos agregados con POST se reinician en cada deploy.
