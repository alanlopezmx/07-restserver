const jwt = require('jsonwebtoken');


//=========================
// Verificar Token
//========================


let verificaToken = (req, res, next) => {
    let token = req.get('token'); // Header token

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err,
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

let verificaAdminRole = (req, res, next) => {
    let role = req.usuario.role;
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Solo un usuario con el rol ADMIN_ROLE puede realizar esta acción',
            },
        });
    }

    next();
};

module.exports = {
    verificaToken,
    verificaAdminRole,
}