# Práctica SOAP y WSDL con Express

Dos servicios web SOAP hechos con Node.js y Express, cada uno con su propio contrato WSDL:

- **ConversionesService** → `/soap/conversiones` (Celsius a Fahrenheit y kilómetros a millas)
- **GeometriaService** → `/soap/geometria` (área y perímetro de un rectángulo)

Para la parte SOAP usé la librería [node-soap](https://github.com/vpulim/node-soap) y el `raw` de body-parser que ya trae Express.

## Requisitos

- Node.js 18 o más reciente (lo probé con la v22)
- npm
- curl para las pruebas (o Postman / SoapUI si lo prefieres)

## Instalación

```bash
git clone <url-de-este-repo>
cd soap-express-practica
npm install
```

## Ejecución

```bash
npm start
```

Por defecto corre en el puerto 3000. Si quieres otro: `PORT=4000 npm start` (ojo, los WSDL tienen la dirección con el puerto 3000, así que lo mejor es dejarlo así).

En la consola debe salir algo como:

```
Servidor escuchando en http://localhost:3000
  WSDL conversiones -> http://localhost:3000/soap/conversiones?wsdl
  WSDL geometria    -> http://localhost:3000/soap/geometria?wsdl
```

## Estructura del proyecto

```
soap-express-practica/
├── src/
│   ├── server.js                      # arranque (solo hace el listen)
│   ├── app.js                         # config de express: middleware + router
│   ├── routes/
│   │   └── soap.routes.js             # aquí se registran los dos servicios SOAP
│   ├── middleware/
│   │   └── logger.js                  # registro de peticiones
│   └── services/
│       ├── conversiones.service.js    # lógica de CelsiusAFahrenheit y KilometrosAMillas
│       └── geometria.service.js       # lógica de AreaRectangulo y PerimetroRectangulo
├── wsdl/
│   ├── conversiones.wsdl
│   └── geometria.wsdl
├── pruebas/                           # peticiones SOAP (XML) para cada operación
├── evidencias/                        # capturas, respuestas y log del middleware
├── CONCLUSIONES.md
└── README.md
```

## Endpoints y contratos

| Servicio | Endpoint | WSDL | Operaciones |
|---|---|---|---|
| ConversionesService | `http://localhost:3000/soap/conversiones` | `http://localhost:3000/soap/conversiones?wsdl` | CelsiusAFahrenheit, KilometrosAMillas |
| GeometriaService | `http://localhost:3000/soap/geometria` | `http://localhost:3000/soap/geometria?wsdl` | AreaRectangulo, PerimetroRectangulo |

Los WSDL se pueden abrir directo en el navegador con el servidor corriendo.

## Cómo reproducir las pruebas

Con el servidor arriba, abre otra terminal en la carpeta del proyecto y corre cada uno de estos. Todas las peticiones están en la carpeta `pruebas/`.

**1. CelsiusAFahrenheit (25 °C → 77 °F)**

```bash
curl -X POST http://localhost:3000/soap/conversiones \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://localhost:3000/soap/conversiones/CelsiusAFahrenheit"' \
  --data-binary @pruebas/celsius-a-fahrenheit.xml
```

**2. KilometrosAMillas (10 km → 6.21371 mi)**

```bash
curl -X POST http://localhost:3000/soap/conversiones \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://localhost:3000/soap/conversiones/KilometrosAMillas"' \
  --data-binary @pruebas/kilometros-a-millas.xml
```

**3. AreaRectangulo (base 8, altura 5 → 40)**

```bash
curl -X POST http://localhost:3000/soap/geometria \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://localhost:3000/soap/geometria/AreaRectangulo"' \
  --data-binary @pruebas/area-rectangulo.xml
```

**4. PerimetroRectangulo (base 8, altura 5 → 26)**

```bash
curl -X POST http://localhost:3000/soap/geometria \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://localhost:3000/soap/geometria/PerimetroRectangulo"' \
  --data-binary @pruebas/perimetro-rectangulo.xml
```

Tip: si tienes `xmllint` puedes agregar `| xmllint --format -` al final para ver la respuesta bonita.

En Windows (PowerShell) usa `curl.exe` en lugar de `curl` para que no se confunda con `Invoke-WebRequest`.

### Usando Postman

1. Método `POST` a la URL del endpoint.
2. En Headers: `Content-Type: text/xml; charset=utf-8` y `SOAPAction` con el valor de la tabla de abajo.
3. En Body → raw → XML, pega el contenido del archivo de `pruebas/`.

| Operación | SOAPAction |
|---|---|
| CelsiusAFahrenheit | `http://localhost:3000/soap/conversiones/CelsiusAFahrenheit` |
| KilometrosAMillas | `http://localhost:3000/soap/conversiones/KilometrosAMillas` |
| AreaRectangulo | `http://localhost:3000/soap/geometria/AreaRectangulo` |
| PerimetroRectangulo | `http://localhost:3000/soap/geometria/PerimetroRectangulo` |

## Resultados

| Operación | Entrada | Esperado | Obtenido |
|---|---|---|---|
| CelsiusAFahrenheit | 25 | 77 | 77 ✔ |
| KilometrosAMillas | 10 | 6.21371 | 6.21371 ✔ |
| AreaRectangulo | 8, 5 | 40 | 40 ✔ |
| PerimetroRectangulo | 8, 5 | 26 | 26 ✔ |

Las respuestas completas (en XML, con su sobre SOAP) están en `evidencias/respuestas/` y las capturas en `evidencias/`.

## Middleware de registro

`src/middleware/logger.js` imprime por cada petición el método, la URL, el código de estado y cuánto tardó. Se monta antes del Router, así que registra tanto las consultas al `?wsdl` como las llamadas a las operaciones. Ejemplo de lo que sale en consola durante las pruebas:

```
[20:21:08] GET /soap/conversiones?wsdl -> 200 (3.11 ms)
[20:21:08] GET /soap/geometria?wsdl -> 200 (0.63 ms)
[20:21:08] POST /soap/conversiones -> 200 (5.27 ms)
[20:21:08] POST /soap/conversiones -> 200 (1.91 ms)
[20:21:08] POST /soap/geometria -> 200 (1.44 ms)
[20:21:08] POST /soap/geometria -> 200 (1.21 ms)
```

El log completo está en `evidencias/log-middleware.txt` y la captura en `evidencias/log-middleware.png`.

## Evidencias

- `evidencias/wsdl-conversiones.png` y `evidencias/wsdl-geometria.png`: los dos contratos abiertos en el navegador
- `evidencias/respuesta-*.png`: las cuatro respuestas SOAP
- `evidencias/log-middleware.png`: el registro del middleware durante las pruebas

## Conclusiones

Están en [CONCLUSIONES.md](CONCLUSIONES.md).
