const fs = require('fs').promises;
const express = require ('express');
const estados = require('./src/routers/estados.js')

const app = express();
app.use(express.json());

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

app.use(/^\/[A-Z]{3}[A-Z]?(\/[a-zA-Z]{3})?$/, estados);

const PORT=5001;
app.listen(PORT,()=>console.log("Server is running"));