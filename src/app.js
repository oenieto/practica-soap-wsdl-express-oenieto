// Configuración general de la app: middleware + rutas.
// No hay lógica de las operaciones aquí, eso está en /services y /routes.

const express = require('express');
const logger = require('./middleware/logger');
const soapRoutes = require('./routes/soap.routes');

const app = express();

// primero el logger, para que registre todo (incluido el ?wsdl)
app.use(logger);

// body-parser en modo raw: node-soap necesita el XML tal cual llega, sin parsear.
// Solo aplica a contenido xml, lo demás se deja pasar.
app.use(express.raw({ type: ['text/xml', 'application/xml', 'application/soap+xml'], limit: '1mb' }));

app.use(soapRoutes);

// una ruta sencilla para saber que el server está arriba
app.get('/', (req, res) => {
  res.send('Servicios SOAP arriba. Prueba /soap/conversiones?wsdl o /soap/geometria?wsdl');
});

module.exports = app;
