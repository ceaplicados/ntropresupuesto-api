import express from 'express';
import Usuarios from '../controllers/Usuarios.js';

const router = express.Router();
const usuarios=new Usuarios();

router.get("/",(req,res) => {
    usuarios.getByUUID(req.user)
    .then(
        (usuario) => {
            delete usuario.Password;
            delete usuario.Id;
            res.status(200).json(usuario)
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
})

export default router;