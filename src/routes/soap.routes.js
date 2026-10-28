// Aquí se registran los dos servicios SOAP sobre un Router.
// La idea es que app.js no sepa nada de WSDLs ni de operaciones, solo monte esto.

const fs = require('fs');
const path = require('path');
const express = require('express');
const soap = require('soap');

const conversionesService = require('../services/conversiones.service');
const geometriaService = require('../services/geometria.service');

const router = express.Router();

const leerWsdl = (archivo) =>
  fs.readFileSync(path.join(__dirname, '..', '..', 'wsdl', archivo), 'utf8');

// node-soap detecta que es un router (tiene .route y .use) y se cuelga de la ruta
soap.listen(router, '/soap/conversiones', conversionesService, leerWsdl('conversiones.wsdl'));
soap.listen(router, '/soap/geometria', geometriaService, leerWsdl('geometria.wsdl'));

module.exports = router;
