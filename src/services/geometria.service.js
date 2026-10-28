// Servicio de geometría, va aparte del de conversiones (cada uno con su WSDL).
// Las dos operaciones reciben lo mismo: base y altura de un rectángulo.

function leerMedidas(args) {
  const base = parseFloat(args.base);
  const altura = parseFloat(args.altura);

  if (Number.isNaN(base) || Number.isNaN(altura)) {
    throw {
      Fault: {
        faultcode: 'soap:Client',
        faultstring: 'La base y la altura deben ser números',
      },
    };
  }

  // un rectángulo con medidas negativas no tiene sentido
  if (base < 0 || altura < 0) {
    throw {
      Fault: {
        faultcode: 'soap:Client',
        faultstring: 'La base y la altura no pueden ser negativas',
      },
    };
  }

  return { base, altura };
}

const geometriaService = {
  GeometriaService: {
    GeometriaPort: {
      AreaRectangulo(args) {
        const { base, altura } = leerMedidas(args);
        return { area: base * altura };
      },

      PerimetroRectangulo(args) {
        const { base, altura } = leerMedidas(args);
        return { perimetro: 2 * (base + altura) };
      },
    },
  },
};

module.exports = geometriaService;
