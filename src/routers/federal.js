import express from 'express';
import fs from 'fs/promises';

const router = express.Router();

router.get("/Presupuesto",(req,res)=>{
    fs.readFile("./api/Federal/Presupuesto.json","utf8")
    .then((data) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(data);
    })
    .catch((error) => {
        return res.status(500).json({message: "No se pudo recuperar el listado de datasets"});
        console.log(error);
    })
});

router.get("/GastoFederalizado",(req,res)=>{
    fs.readFile("./api/Federal/GastoFederalizado.json","utf8")
    .then((data) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(data);
    })
    .catch((error) => {
        return res.status(500).json({message: "No se pudo recuperar el listado de datasets"});
        console.log(error);
    })
});


export default router;