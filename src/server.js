// Punto de arranque, nada más levanta el servidor.
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`  WSDL conversiones -> http://localhost:${PORT}/soap/conversiones?wsdl`);
  console.log(`  WSDL geometria    -> http://localhost:${PORT}/soap/geometria?wsdl`);
});
