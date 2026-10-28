// Lógica del servicio de conversiones.
// Los nombres (servicio, puerto y operaciones) tienen que ser iguales a los del WSDL,
// si no, node-soap no encuentra la operación y regresa un Fault.

const KM_A_MILLAS = 0.621371;

// node-soap a veces manda los valores como string, por eso convierto antes de operar
function aNumero(valor, campo) {
  const n = parseFloat(valor);
  if (Number.isNaN(n)) {
    throw {
      Fault: {
        faultcode: 'soap:Client',
        faultstring: `El valor de "${campo}" no es un número válido`,
      },
    };
  }
  return n;
}

// redondeo para evitar cosas como 6.213710000000001
const redondear = (n, decimales = 5) => Number(n.toFixed(decimales));

const conversionesService = {
  ConversionesService: {
    ConversionesPort: {
      CelsiusAFahrenheit(args) {
        const celsius = aNumero(args.celsius, 'celsius');
        const fahrenheit = celsius * 9 / 5 + 32;
        return { fahrenheit: redondear(fahrenheit) };
      },

      KilometrosAMillas(args) {
        const km = aNumero(args.kilometros, 'kilometros');
        return { millas: redondear(km * KM_A_MILLAS) };
      },
    },
  },
};

module.exports = conversionesService;
