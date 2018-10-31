// =====================
// PUERTO
// =====================

process.env.PORT = process.env.PORT || 3000;


// =====================
// ENTORNO
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =====================
// Vencimiento de token
// =====================
//60 segundos
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =====================
// Semilla de autenticación
// =====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;