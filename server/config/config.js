// =====================
// PUERTO
// =====================

process.env.PORT = process.env.PORT || 3000;


// =====================
// ENTORNO
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost/cafe';
} else {
    urlDB = 'mongodb://cafe-user:Soyelnumero1@ds147073.mlab.com:47073/cafe';
}

process.env.URLDB = urlDB;