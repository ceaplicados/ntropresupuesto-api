const express = require('express');
const router = express.Router();
const estados= require('../services/Estados.js');
let estado=null;
let url=null;

router.use("/*",(req,res,next)=>{
    url=req.baseUrl.split("/");
    if(url[0]===""){
        url.shift();
    }
    if(url.length>0){
        estado=estados.filter((estado) => {return estado.Codigo===url[0]});
        if(estado.length>0){
            estado=estado[0];
            next();
        }else{
            res.status(500).json({message: "Código de estado erróneo"});
            res.end;
        }
    }else{
        res.status(500).json({message: "wrong URL"});
        res.end;
    }
});

router.get("/",(req,res)=>{
    res.status(200).json({estado: estado});
});

router.get("/URs",(req,res)=>{
    res.status(200).json({estado: estado});
});

module.exports=router;