# Conclusiones

SOAP sirve para que dos aplicaciones intercambien información con reglas muy claras. Todo viaja dentro de un sobre XML con su Body (y Header si hace falta), entonces el mensaje siempre tiene la misma forma sin importar en qué lenguaje esté hecho el cliente o el servidor. En la práctica lo noté porque, aunque mi servicio solo regresaba un número, la respuesta siempre venía envuelta en su `soap:Envelope`, y cuando algo fallaba regresaba un Fault en lugar de un error cualquiera.

El WSDL es el contrato. Ahí quedan escritas las operaciones, qué datos reciben, de qué tipo son, qué devuelven y en qué dirección está el servicio. Con eso otra persona (o una herramienta como SoapUI) puede consumir el servicio sin ver mi código. Me di cuenta de lo estricto que es cuando un nombre de operación no coincidía con la implementación y node-soap simplemente no la encontraba.

Consultar el WSDL y llamar a una operación son cosas distintas: con `?wsdl` hago un GET y solo leo la descripción del servicio, no se ejecuta nada. Invocar una operación es un POST con un sobre SOAP y el SOAPAction, y ahí sí se procesa la petición y se calcula el resultado. En el log se ve clarito: unos aparecen como GET y otros como POST.

Separar las rutas en un Router ayuda a que el proyecto no se vuelva un desastre cuando crece. Mi `app.js` quedó con pocas líneas y si mañana agrego un tercer servicio solo toco el archivo de rutas.

El middleware de registro tiene sentido porque es algo que aplica a todas las peticiones por igual. Si lo metiera dentro de cada operación tendría que repetir el mismo código cuatro veces y además no se registrarían las consultas al WSDL, que node-soap atiende por su cuenta.

SOAP con WSDL me parece conveniente en algo como la integración entre un banco y una aseguradora, donde importa tener un contrato formal, tipos validados y manejo de errores estándar. En cambio, para el backend de una app móvil o una página web, una API REST con JSON es más sencilla: los mensajes pesan menos, se prueban más fácil y casi cualquier frontend los entiende sin librerías extra.
