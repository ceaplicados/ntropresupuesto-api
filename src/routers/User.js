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

router.put("/",(req,res) => {
    usuarios.getByUUID(req.user)
    .then(
        (usuario) => {
            if(req.body.Nombre){
                usuario.Nombre=req.body.Nombre;
            }
            if(req.body.Apellidos){
                usuario.Apellidos=req.body.Apellidos;
            }
            if(req.body.Sobrenombre){
                usuario.Sobrenombre=req.body.Sobrenombre;
            }
            if(req.body.Email){
                usuario.Email=req.body.Email;
            }
            if(req.body.Telefono){
                usuario.Telefono=req.body.Telefono;
            }
            if(req.body.Estado){
                usuario.Estado=req.body.Estado;
            }
            usuarios.update(usuario)
            .then(
                (usuario) => {
                    delete usuario.Password;
                    delete usuario.Id;
                    res.status(200).json(usuario)
                },
                (error) => res.status(500).json({message: 'Error al consultar la BDD'})
            );
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
})

export default router;