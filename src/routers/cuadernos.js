import express from 'express';
import Cuadernos from '../controllers/Cuadernos.js';

const router = express.Router();
const cuadernos=new Cuadernos();

router.get("/",(req,res) => {
    cuadernos.listPublic()
    .then(
        (value) => {
            res.status(200).json(value)
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
})

router.get("/User",(req,res) => {
    cuadernos.getByUser(req.user)
    .then(
        (value) => {
            res.status(200).json(value)
        },
        (error) => res.status(500).json({message: 'Error al consultar la BDD'})
    );
})

router.get('/:cuadernoId([0-9]+)',(req,res) => {
    cuadernos.show(req.params.cuadernoId)
    .then(
        (value) => {
            if(value.Id){
                if(value.Publico){
                    res.status(200).json(value)
                }else{
                    let usuarios=value.Usuarios.map((usuario) => {
                        return usuario.UUID
                    })
                    if(value.Owner.UUID===req.user || usuarios.includes(req.user)){
                        res.status(200).json(value)
                    }else{
                        res.status(403).json({message: 'Cuaderno privado'})
                    }
                }
            }else{
                res.status(404).json({message: 'Cuaderno no encontrado'})
            }
        },
        (error) =>{
            console.log(error)
            res.status(500).json({message: 'Error al consultar la BDD'})
        }
    );
})

export default router;