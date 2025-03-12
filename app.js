import express from 'express';
import fs from 'fs/promises';
import routerEstados from './src/routers/estados.js'
import estados from './src/services/Estados.js'

const app = express();
app.use(express.json());

const codigosEstados = estados.estados.map((estado) => {return "/"+estado.Codigo});

app.get("/Datos",(req,res)=>{
    fs.readFile("./api/Datos.json","utf8")
    .then((data) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(data);
    })
    .catch((error) => {
        return res.status(500).json({message: "No se pudo recuperar el listado de datasets"});
        console.log(error);
    })
});

app.get("/Estados",(req,res)=>{
    fs.readFile("./api/Estados.json","utf8")
    .then((data) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(data);
    })
    .catch((error) => {
        return res.status(500).json({message: "No se pudo recuperar el listado de estados"});
        console.log(error);
    })
});

app.get("/INPC",(req,res)=>{
    fs.readFile("./api/INPC.json","utf8")
    .then((data) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(data);
    })
    .catch((error) => {
        return res.status(500).json({message: "No se pudo recuperar el INPC"});
        console.log(error);
    })
    res.end;
});

app.use(codigosEstados, routerEstados);

const PORT=5001;
app.listen(PORT,()=>console.log("Server is running"));
