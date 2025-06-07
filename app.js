import express from 'express';
import cors from 'cors';
import whitelist from './config/cors.js'
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';

import routerAuth from './src/routers/auth.js'
import routerEstados from './src/routers/estados.js'
import routerFederal from './src/routers/federal.js'
import routerUser from './src/routers/User.js'
import routerCuadernos from './src/routers/cuadernos.js'
import estados from './src/services/Estados.js'
import dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });

import connection from './config/db.conf.js';

const app = express();
app.use(cors({
    origin: whitelist,
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(session({secret: process.env.SESSION_SECRET,resave:true,saveUninitialized:true}));

app.use(function(req, res, next) {
  res.on('finish', function() {
    connection.end();
  });
  next();
});

const codigosEstados = estados.estados.map((estado) => {return "/"+estado.Codigo});
const loginRequired = ["/Cuadernos/User","/User"]
const loginOptional = ['/Cuadernos/:cuadernoId([0-9]+)']

app.use(loginRequired,function auth(req, res, next) {
    // Check if user is logged in and has valid access token
    if (req.headers['authorization']) {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        // Verify JWT token
        jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
            if (!err) {
                req.user = decoded.user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
})

app.use(loginOptional,function auth(req, res, next) {
    // Check if user is logged in and has valid access token
    if (req.headers['authorization']) {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        // Verify JWT token
        jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
            if (!err) {
                req.user = decoded.user;
            }
        });
    }
    next(); // Proceed to the next middleware
})

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

app.use('/Federal', routerFederal);
app.use(codigosEstados, routerEstados);
app.use('/auth', routerAuth);
app.use('/User', routerUser);
app.use('/Cuadernos', routerCuadernos);

const PORT=process.env.APP_PORT;
app.listen(PORT,()=>console.log("Server is running"));
