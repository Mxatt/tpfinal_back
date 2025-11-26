const nodemailer = require('nodemailer');
require('dotenv').config();

let transportador;

const configurarTransportador = async () => {
  if (transportador) {
    return transportador;
  }

  let cuentaPrueba;
  const useTestEmail =
    String(process.env.USE_TEST_EMAIL || "")
      .trim()
      .toLowerCase() === "true";

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || useTestEmail) {
    console.log("!!! ACTIVANDO MODO PRUEBA (ETHEREAL) !!!");
    cuentaPrueba = await nodemailer.createTestAccount();
  }

  const host = cuentaPrueba ? "smtp.ethereal.email" : process.env.EMAIL_HOST;
  const puerto = cuentaPrueba ? 587 : parseInt(process.env.EMAIL_PORT || "587");
  const usuario = cuentaPrueba ? cuentaPrueba.user : process.env.EMAIL_USER;
  const contrasena = cuentaPrueba ? cuentaPrueba.pass : process.env.EMAIL_PASS;

  console.log("--- Configuración de Email ---");
  console.log("USE_TEST_EMAIL:", process.env.USE_TEST_EMAIL);
  console.log(
    "Modo:",
    cuentaPrueba ? "Prueba (Ethereal)" : "Producción (SMTP)"
  );
  console.log("Host:", host);
  console.log("Puerto:", puerto);
  console.log("Usuario:", usuario);
  console.log("From:", process.env.EMAIL_FROM);
  console.log("------------------------------");

  const crearTransporter = (p) => {
    return nodemailer.createTransport({
      host: host,
      port: p,
      secure: p === 465, // true for 465, false for other ports
      auth: {
        user: usuario,
        pass: contrasena,
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });
  };

  // Intentar primero con el puerto configurado
  transportador = crearTransporter(puerto);

  try {
    console.log(`Verificando conexión SMTP en puerto ${puerto}...`);
    await transportador.verify();
    console.log("✅ Servidor SMTP listo para enviar mensajes");
    return transportador;
  } catch (error) {
    console.error(
      `❌ Error de conexión SMTP en puerto ${puerto}:`,
      error.message
    );

    // Si falló y era el puerto 587, intentar con 465 (o viceversa)
    const puertoAlternativo = puerto === 587 ? 465 : 587;
    console.log(
      `🔄 Intentando conectar con puerto alternativo ${puertoAlternativo}...`
    );

    transportador = crearTransporter(puertoAlternativo);

    try {
      await transportador.verify();
      console.log(
        `✅ Conexión exitosa en puerto alternativo ${puertoAlternativo}`
      );
      return transportador;
    } catch (errorAlternativo) {
      console.error(
        `❌ Error también en puerto alternativo ${puertoAlternativo}:`,
        errorAlternativo.message
      );
      console.error(
        "Sugerencia CRÍTICA: Render bloquea puertos SMTP. Considera usar un servicio como Resend (API) o contactar soporte."
      );
      throw error; // Lanzar el error original o el último
    }
  }
};

const enviarEmail = async (destinatario, asunto, html) => {
  const useTestEmail =
    String(process.env.USE_TEST_EMAIL || "")
      .trim()
      .toLowerCase() === "true";

  if (useTestEmail) {
    console.log("!!! MODO PRUEBA ACTIVADO: SIMULANDO ENVÍO DE EMAIL !!!");
    console.log("----------------------------------------------------");
    console.log(`Para: ${destinatario}`);
    console.log(`Asunto: ${asunto}`);
    console.log("Contenido HTML (Busca el link aquí):");
    console.log(html);
    console.log("----------------------------------------------------");
    return;
  }

  try {
    const mailer = await configurarTransportador();
    console.log("Intentando enviar email a:", destinatario);
    const info = await mailer.sendMail({
      from: `"TPFinal App" <${process.env.EMAIL_FROM}>`,
      to: destinatario,
      subject: asunto,
      html: html,
    });

    console.log("Mensaje enviado: %s", info.messageId);
    console.log("Respuesta del servidor:", info.response);

    if (nodemailer.getTestMessageUrl(info)) {
      console.log(
        "URL de previsualización: %s",
        nodemailer.getTestMessageUrl(info)
      );
    }
  } catch (error) {
    console.error("Error enviando email:", error);
    throw error;
  }
};

const enviarEmailVerificacion = async (usuario, token) => {
    const urlVerificacion = `${process.env.API_URL}/api/auth/verify/${token}`;
    const asunto = 'Verifica tu cuenta';
    const html = `
      <h1>¡Bienvenido a la aplicación!</h1>
      <p>Por favor, haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${urlVerificacion}">${urlVerificacion}</a>
    `;
    await enviarEmail(usuario.email, asunto, html);
};


module.exports = { enviarEmailVerificacion, configurarTransportador };
