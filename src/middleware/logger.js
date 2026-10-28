// Middleware para ver en consola todo lo que le llega a la app.
// Lo pongo antes de las rutas SOAP para que también salgan las consultas al ?wsdl.
// Ojo: aquí no se toca el body ni la respuesta, solo se mide y se imprime.

function logger(req, res, next) {
  const inicio = process.hrtime.bigint();

  // 'finish' se dispara cuando ya se mandó la respuesta, así ya tenemos el status real
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - inicio) / 1e6;
    const hora = new Date().toLocaleTimeString('es-MX', { hour12: false });

    console.log(`[${hora}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms.toFixed(2)} ms)`);
  });

  next();
}

module.exports = logger;
